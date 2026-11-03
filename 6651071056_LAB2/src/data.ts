import rawEvents from './data/events.json';
import type { EventItem } from './types';

export const events: EventItem[] = (rawEvents as EventItem[]).slice().sort((a, b) =>
  a.date.localeCompare(b.date),
);

export const categories = ['Tất cả', 'Âm nhạc', 'Nghệ thuật', 'Workshop', 'Ẩm thực', 'Thể thao', 'Cộng đồng'] as const;

export function getEvent(id: string | undefined): EventItem | undefined {
  return events.find((event) => event.id === id);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })
    .format(new Date(`${date}T00:00:00`));
}

export function dateParts(date: string): { day: string; month: string } {
  const parsed = new Date(`${date}T00:00:00`);
  return {
    day: new Intl.DateTimeFormat('vi-VN', { day: '2-digit' }).format(parsed),
    month: new Intl.DateTimeFormat('vi-VN', { month: 'short' }).format(parsed),
  };
}

export function stripAccents(text: string): string {
  return text.toLocaleLowerCase('vi-VN').normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
}
