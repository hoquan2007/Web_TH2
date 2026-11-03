import { useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Heart, MapPin, Ticket, Users } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import BookingModal from '../components/BookingModal';
import EventCard from '../components/EventCard';
import EventArtwork from '../components/EventArtwork';
import { useAppContext } from '../context/AppContext';
import { events, formatDate, getEvent } from '../data';
import { formatCurrency } from '../utils';
import NotFoundPage from './NotFoundPage';

export default function DetailPage() {
  const { id } = useParams();
  const [showBooking, setShowBooking] = useState(false);
  const { isFavorite, toggleFavorite } = useAppContext();
  const event = getEvent(id);
  if (!event) return <NotFoundPage />;
  const liked = isFavorite(event.id);
  const related = events.filter((item) => item.category === event.category && item.id !== event.id).slice(0, 4);

  return (
    <>
      <div className="container-wide pt-8"><Link to="/" className="inline-flex items-center gap-2 text-[13px] font-semibold text-emerald-600 hover:underline dark:text-[#a2dcb3]"><ArrowLeft size={17} /> Quay lại khám phá</Link></div>
      <section className="container-wide mt-7 grid gap-8 lg:grid-cols-[1.4fr_.6fr] lg:gap-12">
        <div>
          <div className="relative aspect-[1.45] overflow-hidden bg-[#25523b]" style={{ backgroundColor: event.color }}><EventArtwork event={event} alt={`Hình minh họa cho sự kiện ${event.title}`} className="h-full w-full object-cover" priority /></div>
          <span className="section-kicker mt-8 inline-block">{event.category.toUpperCase()} / {event.city.toUpperCase()}</span>
          <h1 className="mt-4 max-w-[840px] font-editorial text-[clamp(2.7rem,5.2vw,5.4rem)] font-semibold leading-[1.02] tracking-[-.055em]">{event.title}</h1>
          <p className="mt-7 max-w-[720px] text-[15px] leading-[1.95] text-[#52675a] dark:text-[#bed0c1]">{event.description}</p>
          <div className="mt-11 border-t border-[#cbd7cd] pt-8 dark:border-[#3d5543]"><h2 className="font-editorial text-[30px] font-semibold">Chương trình dự kiến</h2><ol className="mt-6 space-y-3">{event.agenda.map((entry, index) => <li key={entry} className="flex gap-4 border-b border-[#dfe6dc] py-3 text-[14px] dark:border-[#3d5543]"><span className="font-bold text-emerald-600">{String(index + 1).padStart(2, '0')}</span><span>{entry}</span></li>)}</ol></div>
        </div>
        <aside className="booking-aside h-fit bg-white p-6 dark:bg-[#192a20] lg:sticky lg:top-[105px] lg:p-8" aria-label="Thông tin đặt vé">
          <span className="section-kicker">THÔNG TIN CUỘC HẸN</span>
          <p className="mt-5 font-editorial text-[40px] font-semibold leading-none">{event.price === 0 ? 'Miễn phí' : formatCurrency(event.price)}</p>
          <p className="mt-2 text-[12px] text-[#66776b] dark:text-[#b1c5b9]">Giá vé cho 01 người</p>
          <div className="mt-8 space-y-6 border-y border-[#d6e0d5] py-7 dark:border-[#435747]">
            <div className="flex gap-4"><CalendarDays size={20} className="shrink-0 text-emerald-600" /><div><b className="text-[13px]">Ngày diễn ra</b><p className="mt-1 text-[13px] text-[#66776b] dark:text-[#b9cbbd]">{formatDate(event.date)}</p></div></div>
            <div className="flex gap-4"><Clock3 size={20} className="shrink-0 text-emerald-600" /><div><b className="text-[13px]">Thời gian bắt đầu</b><p className="mt-1 text-[13px] text-[#66776b] dark:text-[#b9cbbd]">{event.startTime}</p></div></div>
            <div className="flex gap-4"><MapPin size={20} className="shrink-0 text-emerald-600" /><div><b className="text-[13px]">Địa điểm</b><p className="mt-1 text-[13px] leading-5 text-[#66776b] dark:text-[#b9cbbd]">{event.venue}, {event.city}</p></div></div>
            <div className="flex gap-4"><Users size={20} className="shrink-0 text-emerald-600" /><div><b className="text-[13px]">Số chỗ còn lại (dữ liệu mẫu)</b><p className="mt-1 text-[13px] text-[#66776b] dark:text-[#b9cbbd]">{event.available} chỗ</p></div></div>
          </div>
          <button type="button" className="primary-button mt-7 w-full justify-center" onClick={() => setShowBooking(true)}><Ticket size={18} /> Đặt vé ngay <ArrowRight size={17} /></button>
          <button type="button" aria-pressed={liked} className="secondary-button mt-3 w-full justify-center" onClick={() => toggleFavorite(event.id)}><Heart size={17} fill={liked ? 'currentColor' : 'none'} /> {liked ? 'Đã lưu yêu thích' : 'Lưu vào yêu thích'}</button>
          <p className="mt-5 text-center text-[11px] leading-5 text-[#6a7b6f] dark:text-[#b2c9b8]">Đây là bản demo học tập; không hỗ trợ thanh toán thật.</p>
        </aside>
      </section>
      {related.length > 0 && <section className="container-wide mt-24"><div className="flex items-end justify-between gap-4"><div><span className="section-kicker">ĐỪNG BỎ LỠ</span><h2 className="section-heading mt-3">Có thể bạn cũng thích.</h2></div><Link to="/" className="hidden items-center gap-2 text-[13px] font-semibold text-emerald-600 sm:flex">Tất cả sự kiện <ArrowRight size={17} /></Link></div><div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{related.map((item, index) => <EventCard event={item} index={index} key={item.id} />)}</div></section>}
      {showBooking && <BookingModal event={event} onClose={() => setShowBooking(false)} />}
    </>
  );
}
