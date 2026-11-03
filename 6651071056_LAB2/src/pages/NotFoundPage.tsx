import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return <section className="container-wide flex min-h-[65vh] flex-col items-center justify-center py-20 text-center"><span className="font-editorial text-[clamp(6rem,14vw,11rem)] font-semibold leading-none text-emerald-600">404</span><h1 className="mt-5 font-editorial text-[38px] font-semibold">Cuộc hẹn này chưa tồn tại.</h1><p className="mt-3 max-w-md text-[14px] leading-7 text-[#66786a] dark:text-[#b9cdbd]">Đường dẫn có thể đã thay đổi. Bạn có thể tìm một sự kiện khác đang chờ phía trước.</p><Link to="/" className="primary-button mt-8"><ArrowLeft size={18} /> Về trang chủ</Link></section>;
}
