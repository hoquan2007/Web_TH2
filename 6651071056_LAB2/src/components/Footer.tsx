import { ArrowUpRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#112d22] py-12 text-[#eaf4ec] md:mt-28 md:py-16">
      <div className="container-wide">
        <div className="grid gap-10 md:grid-cols-[1.45fr_1fr] md:gap-20">
          <div>
            <p className="text-[13px] font-bold uppercase tracking-[.16em] text-[#a5ddba]">Lưu lại những cuộc hẹn hay</p>
            <p className="mt-4 max-w-[720px] font-editorial text-[clamp(2.7rem,5vw,5.6rem)] leading-[.99] tracking-[-.045em]">Cuộc sống đẹp hơn khi chúng ta <em className="font-normal text-[#92dbb0]">có mặt.</em></p>
          </div>
          <div className="flex flex-col justify-between gap-10 md:items-end">
            <div className="flex gap-7 text-[14px] font-medium">
              <Link to="/" className="footer-link">Khám phá <ArrowUpRight className="inline" size={14} /></Link>
              <Link to="/favorites" className="footer-link">Đã lưu <Heart className="inline" size={14} /></Link>
              <Link to="/tickets" className="footer-link">Vé của tôi <ArrowUpRight className="inline" size={14} /></Link>
            </div>
            <span className="font-editorial text-[clamp(5.5rem,12vw,11rem)] font-semibold leading-none tracking-[-.09em]">HẸN.</span>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-[#456759] pt-5 text-[12px] leading-relaxed text-[#b8d0bf]">
          <span>© 2026 HẸN. — Thiết kế & thực hiện: Hồ Ngọc Quân · MSSV 6651071056</span>
          <span>Đồ án thực hành thiết kế web · Dữ liệu và việc đặt vé là mô phỏng, không thu tiền thật.</span>
        </div>
      </div>
    </footer>
  );
}
