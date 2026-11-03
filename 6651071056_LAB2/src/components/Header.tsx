import { Heart, Moon, Sun, Ticket, ArrowUpRight } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function Header() {
  const { theme, toggleTheme, favoriteIds, bookings } = useAppContext();

  return (
    <header className="site-header sticky top-0 z-30 border-b border-[#dce4da] bg-[#f4f5f0]/95 backdrop-blur-lg dark:border-[#293d31] dark:bg-[#0d1712]/95">
      <div className="container-wide flex h-[76px] items-center justify-between gap-4">
        <Link to="/" className="brand inline-flex items-center gap-2" aria-label="HẸN. – về trang chủ">
          <span className="brand-logo" aria-hidden="true">H<span className="brand-dot">Ẹ</span>N.</span>
          <span className="hidden border-l border-current pl-3 text-[11px] font-semibold leading-[1.4] tracking-[.08em] text-[#586a5b] dark:text-[#adbdb0] sm:block">NƠI BẠN<br />MUỐN CÓ MẶT</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Điều hướng chính">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>Khám phá</NavLink>
          <NavLink to="/favorites" className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>Yêu thích</NavLink>
          <NavLink to="/tickets" className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>Vé của tôi</NavLink>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <button type="button" onClick={toggleTheme} className="icon-button" aria-label={theme === 'light' ? 'Bật chế độ tối' : 'Bật chế độ sáng'} title={theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}>
            {theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
          </button>
          <Link to="/favorites" className="icon-button relative md:hidden" aria-label={`Sự kiện yêu thích (${favoriteIds.length})`}>
            <Heart size={19} />{favoriteIds.length > 0 && <span className="count-dot" />}
          </Link>
          <Link to="/tickets" className="icon-button relative md:hidden" aria-label={`Vé của tôi (${bookings.length})`}>
            <Ticket size={19} />{bookings.length > 0 && <span className="count-dot" />}
          </Link>
          <Link to="/tickets" className="header-cta hidden items-center gap-2 md:inline-flex">Vé của tôi <ArrowUpRight size={16} /></Link>
        </div>
      </div>
    </header>
  );
}
