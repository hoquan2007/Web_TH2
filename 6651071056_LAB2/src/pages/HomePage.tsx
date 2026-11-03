import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, CalendarDays, Check, MapPin, Search, Ticket, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import EventArtwork from '../components/EventArtwork';
import { categories, dateParts, events, stripAccents } from '../data';
import type { EventCategory } from '../types';
import { formatCurrency } from '../utils';

const PAGE_SIZE = 8;
type CategoryFilter = 'Tất cả' | EventCategory;

function Hero() {
  const featured = events.find((item) => item.featured) ?? events[0];
  if (!featured) return null;
  const { day, month } = dateParts(featured.date);

  return (
    <section className="hero-field pt-10 pb-14 md:pt-16 md:pb-20" aria-labelledby="hero-title">
      <div className="container-wide">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 text-[12px] font-semibold tracking-[.14em] text-[#c4dfd0]">
          <span>SỰ KIỆN, NHỮNG CUỘC HẸN & BẠN.</span><span>VIỆT NAM — 2026 / 2027</span>
        </div>
        <div className="hero-ticket overflow-hidden bg-[#fcfcf7] text-[#132f23]">
          <div className="hero-ticket-copy flex flex-col justify-between p-7 sm:p-10 lg:p-14">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[12px] font-extrabold uppercase tracking-[.16em] text-emerald-600">Tấm vé tới trải nghiệm tiếp theo</span>
                <span className="hidden text-[12px] font-bold sm:block">№ 00001 / HẸN.</span>
              </div>
              <h1 id="hero-title" className="mt-9 max-w-[680px] font-editorial text-[clamp(2.6rem,5.05vw,5.6rem)] font-semibold leading-[.99] tracking-[-.065em]">
                Đừng chỉ nghe kể.<br /><em className="font-normal text-emerald-600">Hãy có mặt.</em>
              </h1>
              <p className="mt-6 max-w-[420px] text-[14px] leading-[1.85] text-[#4d6557] sm:text-[15px]">Những đêm nhạc khó quên, buổi hẹn cuối tuần và trải nghiệm bạn sẽ muốn kể lại. Khám phá nơi mình thuộc về.</p>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
              <a href="#events" className="primary-button group">Khám phá sự kiện <ArrowDown size={18} className="transition-transform group-hover:translate-y-1" /></a>
              <span className="text-[12px] font-semibold text-[#577563]">24 sự kiện đang đón bạn <ArrowUpRight size={15} className="inline" /></span>
            </div>
          </div>
          <div className="hero-ticket-photo relative min-h-[315px] bg-[#2f6458] sm:min-h-[420px]" style={{ backgroundColor: featured.color }}>
            <EventArtwork event={featured} alt={`Artwork cho sự kiện ${featured.title}`} className="absolute inset-0 h-full w-full object-cover" priority />
            <div className="absolute inset-x-0 top-0 z-[1] flex items-start justify-between p-5 sm:p-7">
              <span className="bg-[#fbfff8] px-3 py-2 text-[11px] font-extrabold uppercase tracking-[.12em] text-[#154a32]">Buổi hẹn nổi bật</span>
              <span className="flex h-[58px] w-[58px] flex-col items-center justify-center bg-[#fbfff8] text-[#154a32]"><b className="font-editorial text-[25px] leading-none">{day}</b><small className="text-[10px] font-bold uppercase">{month}</small></span>
            </div>
            <div className="absolute inset-x-0 bottom-0 z-[1] bg-[#112d22]/90 p-6 text-white sm:p-8">
              <span className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#a4e8bb]">SỰ KIỆN ĐẶC BIỆT · {featured.city}</span>
              <Link to={`/item/${featured.id}`} className="mt-2 flex items-end justify-between gap-4 font-editorial text-[clamp(1.7rem,2.8vw,2.75rem)] font-semibold leading-[1.05] hover:text-[#b5e3bf]">
                {featured.title}<ArrowUpRight size={26} className="shrink-0" />
              </Link>
              <div className="mt-4 flex items-center justify-between gap-3 text-[12px] font-medium text-[#e4f4e7]">
                <span>{featured.startTime} · {featured.venue}</span>
                <span className="whitespace-nowrap">{formatCurrency(featured.price)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-7 flex flex-wrap justify-between gap-3 text-[12px] font-medium text-[#d1e8d8]">
          <span>MỘT CUỘC HẸN ĐẸP CÓ THỂ BẮT ĐẦU TỪ ĐÂY.</span>
          <span aria-hidden="true">↓ CUỘN ĐỂ KHÁM PHÁ</span>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [category, setCategory] = useState<CategoryFilter>('Tất cả');
  const [keyword, setKeyword] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const normalized = stripAccents(keyword.trim());
    return events.filter((event) => {
      if (category !== 'Tất cả' && event.category !== category) return false;
      if (normalized.length === 0) return true;
      return stripAccents(`${event.title} ${event.category} ${event.city} ${event.venue}`).includes(normalized);
    });
  }, [category, keyword]);

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [category, keyword]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || visibleCount >= filtered.length) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisibleCount((count) => Math.min(count + PAGE_SIZE, filtered.length));
      }
    }, { rootMargin: '240px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  const displayed = filtered.slice(0, visibleCount);
  return (
    <>
      <Hero />
      <section id="events" className="container-wide scroll-mt-28 pt-16 md:pt-24" aria-labelledby="event-title">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="section-kicker">DANH SÁCH CUỘC HẸN</span>
            <h2 id="event-title" className="section-heading mt-3">Hẹn bạn <em className="font-normal text-emerald-600">ở đó.</em></h2>
          </div>
          <p className="max-w-[350px] text-[13px] leading-[1.8] text-[#526759] dark:text-[#b2c7b6]">Chọn một thứ bạn thích. Chúng mình sẽ chỉ bạn đến những nơi đáng nhớ.</p>
        </div>

        <div className="mt-9 border-y border-[#cbd8cc] py-5 dark:border-[#304a38]">
          <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Lọc sự kiện theo chủ đề">
            {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} className={`filter-chip ${category === item ? 'filter-chip-active' : ''}`} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
        </div>
        <div className="mt-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-[470px]">
            <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#64836c]" aria-hidden="true" />
            <label htmlFor="search-events" className="sr-only">Tìm kiếm sự kiện</label>
            <input id="search-events" className="search-field" type="search" placeholder="Tìm sự kiện, địa điểm, thành phố..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            {keyword && <button type="button" onClick={() => setKeyword('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-2" aria-label="Xóa từ khóa"><X size={16} /></button>}
          </div>
          <span className="text-[12px] font-semibold text-[#5d7363] dark:text-[#bad0bd]">{filtered.length} CUỘC HẸN PHÙ HỢP <span aria-hidden="true">↗</span></span>
        </div>

        {displayed.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite">
            {displayed.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}
          </div>
        ) : (
          <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center bg-white px-4 py-16 text-center dark:bg-[#1c2b21]">
            <Search size={38} className="text-emerald-600" />
            <h3 className="mt-4 font-editorial text-[30px] font-semibold">Chưa tìm được cuộc hẹn phù hợp.</h3>
            <p className="mt-2 text-[14px] text-[#607365] dark:text-[#b1c5b5]">Thử một từ khóa khác hoặc xem tất cả các chủ đề nhé.</p>
            <button className="mt-5 secondary-button" type="button" onClick={() => { setCategory('Tất cả'); setKeyword(''); }}>Xem tất cả</button>
          </div>
        )}

        {displayed.length < filtered.length && (
          <div ref={sentinelRef} className="mt-12 flex flex-col items-center gap-4" aria-label="Tải thêm sự kiện khi cuộn tới đây">
            <p className="text-[12px] text-[#6d8070] dark:text-[#b5c8b9]">Đang hiển thị {displayed.length}/{filtered.length} sự kiện</p>
            <button type="button" className="secondary-button" onClick={() => setVisibleCount((count) => Math.min(count + PAGE_SIZE, filtered.length))}>Xem thêm sự kiện <ArrowDown size={17} /></button>
          </div>
        )}
        {filtered.length > 0 && displayed.length === filtered.length && (
          <p className="mt-12 text-center font-editorial text-[17px] italic text-[#687f6d] dark:text-[#b5c8b9]">Bạn đã xem hết mọi cuộc hẹn ở đây. Hẹn gặp tại sự kiện nhé!</p>
        )}
      </section>

      <section className="container-wide mt-24 md:mt-32" aria-labelledby="steps-title">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div>
            <span className="section-kicker">TỪ MỘT CÚ NHẤP, TỚI MỘT KỶ NIỆM</span>
            <h2 id="steps-title" className="section-heading mt-4">Một chiếc vé.<br /><em className="font-normal text-emerald-600">Vạn câu chuyện.</em></h2>
            <p className="mt-6 max-w-[390px] text-[14px] leading-[1.9] text-[#566c5d] dark:text-[#b9cbbc]">Tìm một sự kiện đúng ý, giữ lấy một chỗ và tận hưởng khoảnh khắc. Chúng tôi đã làm mọi thứ trở nên đơn giản.</p>
            <Link to="/tickets" className="mt-7 inline-flex items-center gap-2 text-[14px] font-bold text-emerald-600 hover:underline dark:text-[#a3e1b8]">Xem vé của bạn <ArrowRight size={17} /></Link>
          </div>
          <div className="steps-slip bg-white p-7 text-[#132f23] dark:bg-[#1d3025] dark:text-[#eff4ea] sm:p-10">
            <p className="mb-6 border-b border-[#d7dfd5] pb-5 text-[12px] font-extrabold uppercase tracking-[.13em] text-emerald-600 dark:border-[#4b6350] dark:text-[#8ee3a9]">HƯỚNG DẪN / 03 BƯỚC</p>
            <div className="space-y-7">
              <div className="step-line"><Search size={24} /><div><h3>01. Tìm điều bạn thích</h3><p>Lướt danh sách, chọn chủ đề và tìm một sự kiện khiến bạn háo hức.</p></div><Check size={18} /></div>
              <div className="step-line"><CalendarDays size={24} /><div><h3>02. Chọn ngày và giữ chỗ</h3><p>Mở trang chi tiết, kiểm tra thời gian và điền thông tin đặt vé.</p></div><Check size={18} /></div>
              <div className="step-line"><Ticket size={24} /><div><h3>03. Lưu tấm vé của mình</h3><p>Vé demo sẽ nằm trong mục Vé của tôi, ngay trên trình duyệt của bạn.</p></div><Check size={18} /></div>
            </div>
            <div className="mt-9 flex items-center justify-between bg-[#133e2a] px-5 py-4 text-white"><span className="text-[13px] font-semibold">Hẹn gặp ở sự kiện!</span><ArrowUpRight size={21} /></div>
          </div>
        </div>
      </section>

      <section className="container-wide mt-20 md:mt-24" aria-label="Thông tin dự án">
        <div className="flex flex-col justify-between gap-3 border-t border-[#ccdbcb] pt-5 text-[12px] font-medium text-[#627364] dark:border-[#45614b] dark:text-[#b1c5b5] sm:flex-row">
          <span><MapPin size={14} className="mr-1 inline" />Sự kiện khắp Việt Nam</span>
          <span>Đặt vé là chức năng mô phỏng · Không phát sinh thanh toán</span>
        </div>
      </section>
    </>
  );
}
