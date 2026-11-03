import { ArrowUpRight, Heart, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { dateParts } from '../data';
import type { EventItem } from '../types';
import { formatCurrency } from '../utils';
import EventArtwork from './EventArtwork';

export default function EventCard({ event, index = 0 }: { event: EventItem; index?: number }) {
  const { isFavorite, toggleFavorite } = useAppContext();
  const liked = isFavorite(event.id);
  const { day, month } = dateParts(event.date);
  return (
    <article className="event-card animate-appear" style={{ animationDelay: `${Math.min(index, 7) * 35}ms` }}>
      <div className="relative overflow-hidden bg-[#346353]" style={{ backgroundColor: event.color }}>
        <Link to={`/item/${event.id}`} className="block aspect-[1.17] overflow-hidden" tabIndex={-1} aria-hidden="true">
          <EventArtwork event={event} alt="" className="event-card-image h-full w-full object-cover transition-transform duration-700" />
        </Link>
        <div className="absolute left-4 top-4 flex w-[55px] flex-col items-center bg-[#fdfdf8] px-1 py-2 text-[#113526]" aria-label={`${day} ${month}`}>
          <span className="font-editorial text-[25px] font-semibold leading-none">{day}</span>
          <span className="mt-1 text-[10px] font-bold uppercase tracking-[.09em]">{month}</span>
        </div>
        <button type="button" className={`favorite-button absolute right-4 top-4 ${liked ? 'is-favorite' : ''}`} aria-label={liked ? `Bỏ yêu thích ${event.title}` : `Yêu thích ${event.title}`} aria-pressed={liked} onClick={() => toggleFavorite(event.id)}>
          <Heart size={19} fill={liked ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="flex min-h-[203px] flex-col bg-white px-5 pb-5 pt-4 dark:bg-[#1a2a20]">
        <span className="text-[11px] font-bold uppercase tracking-[.12em] text-emerald-600 dark:text-[#8bdbab]">{event.category}</span>
        <Link to={`/item/${event.id}`} className="mt-2 inline-flex gap-1 font-editorial text-[24px] font-semibold leading-[1.15] tracking-[-.025em] hover:text-emerald-600 dark:hover:text-[#8bdbab]">
          <span className="line-clamp-2">{event.title}</span><ArrowUpRight size={18} className="mt-1 shrink-0" />
        </Link>
        <div className="mt-auto pt-4">
          <span className="flex items-center gap-1 text-[12px] text-[#647468] dark:text-[#b1c6b8]"><MapPin size={14} aria-hidden="true" />{event.city}</span>
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#e5e9e3] pt-3 dark:border-[#3a4b3d]">
            <span className="text-[12px] text-[#667468] dark:text-[#b1c6b8]">Giá vé từ</span>
            <span className="text-[15px] font-extrabold tabular-nums text-[#144a31] dark:text-[#9bdfb4]">{event.price === 0 ? 'Miễn phí' : formatCurrency(event.price)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
