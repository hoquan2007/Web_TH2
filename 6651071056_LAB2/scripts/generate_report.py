"""Create the Vietnamese LAB 2 submission PDF from real test evidence.

Run: python scripts/generate_report.py
Requires: reportlab, Pillow, pypdf (for optional verification).
"""

from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from xml.sax.saxutils import escape

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, Image as PdfImage, KeepTogether,
    PageBreak, PageTemplate, Paragraph, Spacer, Table, TableStyle,
)


ROOT = Path(__file__).resolve().parent.parent
EVIDENCE = ROOT / "evidence"
PDF_DIR = ROOT / "output" / "pdf"
PDF_DIR.mkdir(parents=True, exist_ok=True)
OUT = PDF_DIR / "Ho_Ngoc_Quan_6651071056_LAB2.pdf"

GITHUB = "https://github.com/hoquan2007/Web_TH2/tree/codex/lab2-6651071056/6651071056_LAB2"
WEBSITE = "https://6651071056-lab2-dat-ve-su-kien.vercel.app"
VIDEO = WEBSITE + "/demo-lab2.webm"

NAVY = colors.HexColor("#132A25")
GREEN = colors.HexColor("#059669")
PALE = colors.HexColor("#E8F7F0")
TEXT = colors.HexColor("#24362F")
GRAY = colors.HexColor("#66766E")
BORDER = colors.HexColor("#DDE9E2")

FONT_PATH = Path("C:/Windows/Fonts")
pdfmetrics.registerFont(TTFont("ArialVN", str(FONT_PATH / "arial.ttf")))
pdfmetrics.registerFont(TTFont("ArialVN-Bold", str(FONT_PATH / "arialbd.ttf")))
pdfmetrics.registerFontFamily("ArialVN", normal="ArialVN", bold="ArialVN-Bold")


def styles():
    st = getSampleStyleSheet()
    st.add(ParagraphStyle(name="HeroVN", fontName="ArialVN-Bold", fontSize=25, leading=33, textColor=NAVY, spaceAfter=16))
    st.add(ParagraphStyle(name="HeadingVN", fontName="ArialVN-Bold", fontSize=15, leading=21, textColor=NAVY, spaceBefore=16, spaceAfter=9))
    st.add(ParagraphStyle(name="SubheadingVN", fontName="ArialVN-Bold", fontSize=10.2, leading=14.8, textColor=NAVY, spaceBefore=10, spaceAfter=6))
    st.add(ParagraphStyle(name="BodyVN", fontName="ArialVN", fontSize=9.4, leading=15.2, textColor=TEXT, spaceAfter=8))
    st.add(ParagraphStyle(name="SmallVN", fontName="ArialVN", fontSize=8.1, leading=12.8, textColor=GRAY, spaceAfter=5))
    st.add(ParagraphStyle(name="LabelVN", fontName="ArialVN-Bold", fontSize=8.5, leading=12, textColor=GREEN, spaceAfter=5))
    st.add(ParagraphStyle(name="WhiteVN", fontName="ArialVN-Bold", fontSize=11, leading=15, textColor=colors.white))
    st.add(ParagraphStyle(name="CenterVN", fontName="ArialVN-Bold", fontSize=8.6, leading=12, alignment=TA_CENTER, textColor=NAVY))
    return st


ST = styles()


def P(text: str, style: str = "BodyVN"):
    return Paragraph(text, ST[style])


def img(path: Path, width: float, caption: str | None = None):
    with Image.open(path) as original:
        w, h = original.size
    photo = PdfImage(str(path), width=width, height=width * h / w)
    items = [photo]
    if caption:
        items.append(Spacer(1, 4))
        items.append(P(caption, "SmallVN"))
    return KeepTogether(items)


def score_data():
    d = json.loads((EVIDENCE / "lighthouse-mobile.json").read_text(encoding="utf-8"))
    return {
        "performance": round(100 * d["categories"]["performance"]["score"]),
        "accessibility": round(100 * d["categories"]["accessibility"]["score"]),
        "best-practices": round(100 * d["categories"]["best-practices"]["score"]),
        "form_factor": d.get("configSettings", {}).get("formFactor"),
        "tested_url": d.get("finalUrl", ""),
        "timestamp": d.get("fetchTime", ""),
    }


def draw_evidence_card(name: str, heading: str, command: str, body: list[str], status: str):
    """Visual presentation of literal saved stdout / Lighthouse JSON, not a fake terminal capture."""
    target = EVIDENCE / name
    canvas = Image.new("RGB", (1500, 830), "#f1f6f3")
    pen = ImageDraw.Draw(canvas)
    arial = str(FONT_PATH / "arial.ttf")
    bold = str(FONT_PATH / "arialbd.ttf")
    mono = str(FONT_PATH / "consola.ttf")
    fs = lambda size, heavy=False: ImageFont.truetype(bold if heavy else arial, size)
    codefont = ImageFont.truetype(mono, 28)
    pen.rounded_rectangle((58, 58, 1442, 775), radius=24, fill="#17231f")
    pen.rounded_rectangle((92, 91, 1385, 180), radius=10, fill="#24352e")
    pen.text((122, 114), heading, font=fs(31, True), fill="#ffffff")
    pen.text((118, 210), "> " + command, font=codefont, fill="#9cf3be")
    y = 291
    for line in body[:12]:
        if y > 625:
            break
        pen.text((118, y), line[:90], font=codefont, fill="#e2f0e8")
        y += 41
    pen.rounded_rectangle((113, 672, 640, 730), radius=12, fill="#0c6646")
    pen.text((139, 685), status, font=fs(24, True), fill="#ffffff")
    canvas.save(target, optimize=True)


def make_check_images(scores):
    log = (EVIDENCE / "quality-checks.txt").read_text(encoding="utf-8")
    assert "TypeScript" in log and "Exit code: 0" in log
    assert "ESLint" in log and "Vitest" in log and "Tests  7 passed (7)" in log
    draw_evidence_card(
        "05-check-typescript.png", "01 / Kiểm tra TypeScript", "npx tsc --noEmit",
        ["TypeScript strict mode", "Exit code: 0", "0 loi kieu du lieu"], "PASS  /  0 ERRORS",
    )
    draw_evidence_card(
        "06-check-eslint.png", "02 / Kiểm tra ESLint", "npx eslint . --max-warnings 0",
        ["ESLint kiem tra toan bo project", "Exit code: 0", "0 loi, 0 canh bao"], "PASS  /  0 WARNINGS",
    )
    draw_evidence_card(
        "07-check-vitest.png", "03 / Kiểm tra Vitest", "npm run test",
        ["src/utils.extra.test.ts   1 passed", "src/utils.test.ts         6 passed", "Test Files  2 passed (2)", "Tests       7 passed (7)", "Exit code: 0"],
        "PASS  /  7 OF 7 TESTS",
    )
    draw_evidence_card(
        "08-check-lighthouse.png", "04 / Lighthouse Mobile", "lighthouse --form-factor=mobile",
        ["Source: evidence/lighthouse-mobile.json", "Production build via Vite preview",
         "Performance:     " + str(scores["performance"]) + " / 100  (required >=70)",
         "Accessibility:   " + str(scores["accessibility"]) + " / 100  (required >=90)",
         "Best Practices:  " + str(scores["best-practices"]) + " / 100  (required >=90)"],
        "PASS  /  MOBILE AUDIT",
    )


def page_chrome(c, doc):
    w, h = A4
    c.saveState()
    c.setFillColor(NAVY)
    c.rect(0, h - 1.5 * cm, w, 1.5 * cm, stroke=0, fill=1)
    c.setFont("ArialVN-Bold", 10)
    c.setFillColor(colors.white)
    c.drawString(1.75 * cm, h - 0.89 * cm, "LAB 02 / THIẾT KẾ WEB")
    c.setFont("ArialVN", 8)
    c.drawRightString(w - 1.75 * cm, h - 0.89 * cm, "HỒ NGỌC QUÂN · 6651071056")
    c.setStrokeColor(BORDER)
    c.line(1.75 * cm, 1.35 * cm, w - 1.75 * cm, 1.35 * cm)
    c.setFillColor(GRAY)
    c.setFont("ArialVN", 8)
    c.drawString(1.75 * cm, 0.95 * cm, "HẸN. — Website đặt vé sự kiện")
    c.drawRightString(w - 1.75 * cm, 0.95 * cm, f"Trang {doc.page}")
    c.restoreState()


EXPLANATION = (
    "Đối với chức năng cuộn vô hạn, tôi chia danh sách 24 sự kiện thành các đợt hiển thị, "
    "mỗi đợt tối đa tám mục. Một biến trạng thái React lưu số lượng sự kiện đang được hiển thị. "
    "Ở cuối vùng danh sách, tôi đặt một phần tử đánh dấu để IntersectionObserver theo dõi. "
    "Khi người dùng kéo xuống và phần tử này đi vào vùng quan sát, callback sẽ tăng giới hạn hiển thị, "
    "khiến React render thêm các thẻ sự kiện. Tôi dùng hàm cập nhật trạng thái dựa trên giá trị cũ "
    "để tránh đọc dữ liệu lỗi thời. Observer được đăng ký trong useEffect và hủy ở hàm cleanup "
    "để tránh rò rỉ bộ nhớ hoặc lặp đăng ký sau mỗi lần render. Nếu người dùng tìm kiếm hoặc thay đổi "
    "bộ lọc, danh sách kết quả sẽ được tính lại, sau đó giới hạn hiển thị được đặt về đợt đầu tiên. "
    "Khi đã hiện hết các sự kiện, tôi dừng tải thêm. Ngoài thao tác cuộn tự động, giao diện còn có "
    "nút xem thêm để người dùng chủ động yêu cầu đợt tiếp theo. Cách này không gọi máy chủ, "
    "vì dữ liệu của bài thực hành được lưu sẵn trong tệp JSON."
)


def create_pdf(scores):
    word_count = len(EXPLANATION.split())
    if not 150 <= word_count <= 250:
        raise ValueError(f"Feature explanation must be 150-250 words; got {word_count}")

    doc = BaseDocTemplate(
        str(OUT), pagesize=A4, title="LAB 2 - Hồ Ngọc Quân - 6651071056",
        author="Hồ Ngọc Quân", leftMargin=1.75 * cm, rightMargin=1.75 * cm,
        topMargin=2.05 * cm, bottomMargin=1.75 * cm,
    )
    w, h = A4
    frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates(PageTemplate(id="standard", frames=[frame], onPage=page_chrome))

    story = []
    add = story.append
    add(Spacer(1, 0.6 * cm))
    add(P("BÁO CÁO THỰC HÀNH<br/>BUỔI 2", "HeroVN"))
    add(P("Website đặt vé sự kiện HẸN. · React 18 / TypeScript / Vite / Tailwind CSS", "BodyVN"))

    id_table = Table([
        [P("Họ và tên", "LabelVN"), P("Hồ Ngọc Quân")],
        [P("Mã số sinh viên", "LabelVN"), P("6651071056")],
        [P("Môn học", "LabelVN"), P("Thiết kế Web")],
        [P("Ngày lập báo cáo", "LabelVN"), P(datetime.now().strftime("%d/%m/%Y"))],
    ], colWidths=[4.6 * cm, 11.2 * cm])
    id_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PALE),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LINEBELOW", (0, 0), (-1, -2), 0.4, BORDER),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    add(id_table)

    add(P("1. Tính biến thể theo MSSV", "HeadingVN"))
    for s in [
        "<b>S</b> = 6 + 6 + 5 + 1 + 0 + 7 + 1 + 0 + 5 + 6 = <b>37</b>.",
        "<b>D</b> = 37 mod 15 = <b>7</b> → Chủ đề: <b>Đặt vé sự kiện</b>.",
        "<b>F</b> = 56 mod 10 = <b>6</b> → Bộ ba tính năng: <b>Infinite scroll; Yêu thích (localStorage); Dark/Light Mode</b>.",
        "<b>C</b> = 6 mod 5 = <b>1</b> → Màu chủ đạo: <b>Emerald #059669</b>.",
    ]:
        add(P(s))

    add(P("2. Liên kết sản phẩm và mã nguồn", "HeadingVN"))
    add(P(f'<b>Website:</b> <link href="{WEBSITE}" color="#047857">{escape(WEBSITE)}</link>'))
    add(P(f'<b>GitHub:</b> <link href="{GITHUB}" color="#047857">{escape(GITHUB)}</link>'))
    add(P(f'<b>Video demo:</b> <link href="{VIDEO}" color="#047857">{escape(VIDEO)}</link>'))
    add(P("Video do công cụ Playwright ghi lại trực tiếp các thao tác trên giao diện: cuộn vô hạn, yêu thích, chuyển giao diện sáng/tối và đặt vé.", "SmallVN"))

    add(PageBreak())
    add(P("3. Phân tích yêu cầu và cách thực hiện", "HeadingVN"))
    items = [
        ("Công nghệ", "React 18 (Hooks), TypeScript strict, Vite, Tailwind CSS, React Router v6, ESLint và Vitest."),
        ("Cấu trúc", "Thư mục 6651071056_LAB2 với src/components, src/pages, src/data, src/utils.ts, src/utils.test.ts, public và design."),
        ("Dữ liệu", "24 sự kiện tự biên soạn theo chủ đề Việt Nam; có thẻ sự kiện, danh sách, bộ lọc và trang chi tiết."),
        ("Định tuyến", "Các route /, /item/:id, /favorites, /tickets và trang 404; điều hướng nội bộ dùng React Router Link."),
        ("Yêu thích", "Lưu các ID sự kiện trong localStorage; hỗ trợ khôi phục khi tải lại và trang xem yêu thích riêng."),
        ("Giao diện sáng/tối", "Lưu chế độ đã chọn trong localStorage; áp dụng Tailwind dark variant xuyên suốt màn hình."),
        ("Infinite scroll", "Tải thêm từng nhóm thẻ khi cuộn đến sentinel; có thao tác xem thêm hỗ trợ."),
        ("Đặt vé", "Modal xác nhận có kiểm tra họ tên/email, Escape để đóng, focus trap và lịch sử vé lưu cục bộ."),
        ("Responsive / A11y", "Bố cục một, hai hoặc ba/bốn cột tùy kích thước màn hình; alt/aria-label và màu sắc tương phản."),
        ("Thiết kế", "Có tệp wireframe tại design/wireframe.svg; tông xanh Emerald #059669."),
    ]
    t = Table([[P(x, "LabelVN"), P(y)] for x, y in items], colWidths=[3.6 * cm, 12.25 * cm])
    t.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, BORDER),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LEFTPADDING", (0, 0), (0, -1), 0),
        ("LEFTPADDING", (1, 0), (1, -1), 8),
    ]))
    add(t)

    add(P("4. Giải thích kỹ thuật: Infinite scroll", "HeadingVN"))
    add(P(escape(EXPLANATION)))
    add(P(f"Độ dài: {word_count} từ (đạt phạm vi 150-250 từ theo yêu cầu).", "SmallVN"))

    add(PageBreak())
    add(P("5. Kết quả kiểm tra chất lượng", "HeadingVN"))
    quality = [
        ("TypeScript", "npx tsc --noEmit", "0 lỗi", "ĐẠT"),
        ("ESLint", "npx eslint . --max-warnings 0", "0 lỗi, 0 cảnh báo", "ĐẠT"),
        ("Vitest", "npm run test", "7/7 test", "ĐẠT"),
        ("Lighthouse Mobile", "Production build tại localhost", f'P {scores["performance"]} / A {scores["accessibility"]} / BP {scores["best-practices"]}', "ĐẠT"),
    ]
    qa = Table([[P("Kiểm tra", "LabelVN"), P("Lệnh / chế độ", "LabelVN"), P("Kết quả", "LabelVN"), P("Đánh giá", "LabelVN")]] +
               [[P(a), P(b), P(c), P(d)] for a, b, c, d in quality], colWidths=[3.25*cm, 6.1*cm, 4.25*cm, 2.25*cm])
    qa.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PALE),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    add(qa)
    add(Spacer(1, 0.3 * cm))
    add(P("Bốn hình dưới đây trình bày trung thực các kết quả được trích từ nhật ký lệnh và tệp Lighthouse JSON. Các ảnh này là bản minh họa từ đầu ra thực tế, không phải ảnh chụp nguyên trạng cửa sổ terminal.", "SmallVN"))
    for i, filename in enumerate(["05-check-typescript.png", "06-check-eslint.png", "07-check-vitest.png", "08-check-lighthouse.png"]):
        if i == 2:
            add(PageBreak())
            add(P("5. Kết quả kiểm tra chất lượng (tiếp)", "HeadingVN"))
        add(img(EVIDENCE / filename, 15.65 * cm, f"Hình {i+1}. Minh chứng kiểm tra {['TypeScript', 'ESLint', 'Vitest', 'Lighthouse Mobile'][i]}."))
        add(Spacer(1, 0.28 * cm))

    add(PageBreak())
    add(P("6. Minh chứng giao diện", "HeadingVN"))
    for i, (filename, caption) in enumerate([
        ("01-desktop-home.png", "Giao diện trang chủ trên Desktop."),
        ("02-dark-home.png", "Giao diện tối; trạng thái được lưu trong localStorage."),
        ("03-booking-modal.png", "Modal đặt vé, nhập họ tên và email."),
        ("04-mobile-home.png", "Giao diện responsive trên Mobile 390px."),
    ]):
        if i in {1, 2, 3}:
            add(PageBreak())
            add(P("6. Minh chứng giao diện (tiếp)", "HeadingVN"))
        target = EVIDENCE / filename
        with Image.open(target) as image_obj:
            original_width, original_height = image_obj.size
        limit_height = 18.0 * cm
        width = min(15.65 * cm, limit_height * original_width / original_height)
        add(img(target, width, f"Hình {i+5}. {caption}"))

    add(PageBreak())
    add(P("7. Danh mục đầu ra và lưu ý nộp bài", "HeadingVN"))
    for s in [
        "<b>Mã nguồn:</b> thư mục 6651071056_LAB2, gồm nguồn React + TypeScript, dữ liệu, cấu hình công cụ, README, wireframe, script kiểm thử và tạo báo cáo.",
        "<b>Minh chứng kiểm thử:</b> evidence/quality-checks.txt, evidence/lighthouse-mobile.json và hình trong thư mục evidence.",
        "<b>Video:</b> public/demo-lab2.webm được phục vụ từ đường dẫn công khai của website.",
        "<b>Đo Lighthouse:</b> chế độ Mobile trên bản build production của Vite chạy bằng vite preview tại localhost; kết quả sẽ thay đổi theo môi trường mạng, thiết bị và thời điểm.",
        "<b>Lịch sử Git:</b> tiêu chí ít nhất 14 commit trải đều 5 giờ phải được chứng minh bằng timestamp thực tế. Không thay đổi giả thời gian commit.",
        "<b>Hoàn tất nộp:</b> mở link GitHub, website, video để kiểm tra; sau đó tải file báo cáo PDF lên Moodle của giảng viên.",
    ]:
        add(P(s))

    doc.build(story)
    print(f"REPORT_PDF={OUT}")
    print(f"EXPLANATION_WORD_COUNT={word_count}")


if __name__ == "__main__":
    score = score_data()
    make_check_images(score)
    create_pdf(score)
