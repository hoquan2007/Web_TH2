import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Minus, Plus, Ticket, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import type { Booking, EventItem } from '../types';
import { formatCurrency, validateEmail } from '../utils';

export default function BookingModal({ event, onClose }: { event: EventItem; onClose: () => void }) {
  const { createBooking } = useAppContext();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      previousFocus?.focus();
    };
  }, [onClose]);

  const nameError = submitted && fullName.trim().length < 2;
  const emailError = submitted && !validateEmail(email.trim());
  const reserve = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    if (fullName.trim().length < 2 || !validateEmail(email.trim())) return;
    const result = createBooking({ eventId: event.id, quantity, fullName: fullName.trim(), email: email.trim() });
    setBooking(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#06180f]/75 p-3 backdrop-blur-sm sm:p-5" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="booking-dialog-title" className="max-h-[94vh] w-full max-w-[520px] overflow-y-auto bg-paper p-6 shadow-2xl dark:bg-[#19291f] sm:p-9">
        <div className="flex items-start justify-between gap-4">
          <div><span className="section-kicker">ĐẶT CHỖ / HẸN.</span><h2 id="booking-dialog-title" className="mt-2 font-editorial text-[36px] font-semibold tracking-[-.04em]">{booking ? 'Đã giữ chỗ!' : 'Giữ lấy một chỗ.'}</h2></div>
          <button ref={closeRef} type="button" aria-label="Đóng cửa sổ đặt vé" onClick={onClose} className="icon-button shrink-0"><X size={21} /></button>
        </div>
        {booking ? (
          <div className="mt-9 text-center" role="status">
            <CheckCircle2 size={60} className="mx-auto text-emerald-600" />
            <h3 className="mt-5 font-editorial text-[29px] font-semibold">Bạn có một cuộc hẹn mới!</h3>
            <p className="mt-3 text-[14px] leading-7 text-[#647268] dark:text-[#bfd2c4]">Mã vé demo <strong className="text-ink dark:text-white">{booking.id}</strong> đã được lưu trên trình duyệt này. Không có khoản thanh toán nào được thực hiện.</p>
            <Link to="/tickets" onClick={onClose} className="primary-button mt-7 w-full justify-center"><Ticket size={18} /> Xem vé của tôi</Link>
          </div>
        ) : (
          <form onSubmit={reserve} noValidate className="mt-7">
            <div className="border-y border-[#cbd8cc] py-5 dark:border-[#405949]">
              <p className="font-editorial text-[23px] font-semibold">{event.title}</p>
              <p className="mt-2 text-[13px] text-[#627466] dark:text-[#bcd0c0]">{event.venue} · {event.city}</p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
              <div><label className="form-label" htmlFor="ticket-quantity">Số lượng vé</label><p className="mt-1 text-[12px] text-[#748175] dark:text-[#bacdbf]">Tối đa {Math.min(event.available, 6)} vé / lượt</p></div>
              <div className="flex items-center border border-[#c5d5c8] dark:border-[#4a6151]">
                <button className="quantity-button" type="button" aria-label="Giảm số lượng vé" disabled={quantity === 1} onClick={() => setQuantity((n) => n - 1)}><Minus size={17} /></button>
                <output id="ticket-quantity" className="min-w-11 text-center font-bold" aria-live="polite">{quantity}</output>
                <button className="quantity-button" type="button" aria-label="Tăng số lượng vé" disabled={quantity >= Math.min(event.available, 6)} onClick={() => setQuantity((n) => n + 1)}><Plus size={17} /></button>
              </div>
            </div>
            <div className="mt-6"><label className="form-label" htmlFor="booking-name">Họ và tên <span aria-hidden="true">*</span></label><input id="booking-name" className="form-input" type="text" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} aria-invalid={nameError} aria-describedby={nameError ? 'name-error' : undefined} placeholder="Họ tên người đặt vé" />{nameError && <p id="name-error" className="form-error">Vui lòng nhập họ tên từ 2 ký tự.</p>}</div>
            <div className="mt-5"><label className="form-label" htmlFor="booking-email">Email <span aria-hidden="true">*</span></label><input id="booking-email" className="form-input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={emailError} aria-describedby={emailError ? 'email-error' : undefined} placeholder="ban@example.com" />{emailError && <p id="email-error" className="form-error">Vui lòng nhập địa chỉ email hợp lệ.</p>}</div>
            <div className="mt-7 flex items-center justify-between border-t border-[#cbd8cc] pt-5 dark:border-[#405949]"><span className="text-[13px] font-semibold">Tạm tính</span><strong className="font-editorial text-[29px]">{event.price === 0 ? 'Miễn phí' : formatCurrency(event.price * quantity)}</strong></div>
            <button type="submit" className="primary-button mt-6 w-full justify-center">Xác nhận đặt vé <Ticket size={18} /></button>
            <p className="mt-3 text-center text-[11px] leading-5 text-[#738176] dark:text-[#c0d0c3]">Bản demo học tập: dữ liệu được lưu trong localStorage, không thu tiền.</p>
          </form>
        )}
      </div>
    </div>
  );
}
