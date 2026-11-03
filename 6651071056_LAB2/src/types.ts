export type EventCategory = 'Âm nhạc' | 'Nghệ thuật' | 'Workshop' | 'Ẩm thực' | 'Thể thao' | 'Cộng đồng';

export type EventItem = {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  startTime: string;
  city: string;
  venue: string;
  price: number;
  image: string;
  color: string;
  description: string;
  agenda: string[];
  available: number;
  featured?: boolean;
};

export type Booking = {
  id: string;
  eventId: string;
  quantity: number;
  fullName: string;
  email: string;
  purchasedAt: string;
};
