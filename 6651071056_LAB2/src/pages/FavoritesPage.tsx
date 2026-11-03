import { ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { useAppContext } from '../context/AppContext';
import { events } from '../data';

export default function FavoritesPage() {
  const { favoriteIds } = useAppContext();
  const favorites = events.filter((event) => favoriteIds.includes(event.id));
  return <section className="container-wide min-h-[60vh] pt-14 md:pt-20"><span className="section-kicker">DANH SÁCH CỦA BẠN</span><h1 className="section-heading mt-3">Những cuộc hẹn <em className="font-normal text-emerald-600">đã lưu.</em></h1><p className="mt-5 text-[14px] text-[#64766a] dark:text-[#b8cbbb]">{favorites.length} sự kiện yêu thích · Được lưu trên trình duyệt của bạn.</p>{favorites.length ? <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">{favorites.map((event, index) => <EventCard key={event.id} event={event} index={index} />)}</div> : <div className="empty-panel"><Heart size={42} className="mx-auto text-emerald-600" /><h2 className="mt-5 font-editorial text-[30px] font-semibold">Chưa lưu cuộc hẹn nào.</h2><p className="mt-2 text-[14px] text-[#66786a] dark:text-[#bacdbd]">Nhấn biểu tượng trái tim trên sự kiện bạn yêu thích để lưu vào đây.</p><Link to="/" className="primary-button mt-7">Khám phá sự kiện <ArrowRight size={18} /></Link></div>}</section>;
}
