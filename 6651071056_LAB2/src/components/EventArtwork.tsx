import { useEffect, useMemo, useState } from 'react';
import type { EventItem } from '../types';

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char] ?? char);
}

function posterArtwork(event: EventItem): string {
  const number = Number(event.id.replace(/\D/g, '').slice(-2)) || 1;
  const background = event.color || '#27654c';
  const circleX = 100 + (number * 53) % 320;
  const circleY = 180 + (number * 37) % 210;
  const light = number % 3 === 0 ? '#fff9d6' : number % 3 === 1 ? '#bee8c4' : '#fce1b8';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="610" viewBox="0 0 720 610">
    <defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${background}"/><stop offset="1" stop-color="#102b25"/></linearGradient>
    <pattern id="p" width="46" height="46" patternUnits="userSpaceOnUse"><path d="M46 0H0V46" fill="none" stroke="#fff" opacity=".075" stroke-width="1"/></pattern></defs>
    <rect width="720" height="610" fill="url(#g)"/><rect width="720" height="610" fill="url(#p)"/>
    <circle cx="${circleX + 190}" cy="${circleY + 40}" r="235" fill="${light}" opacity=".95"/>
    <circle cx="${circleX + 160}" cy="${circleY + 20}" r="185" fill="none" stroke="#133e2b" stroke-width="2" opacity=".4"/>
    <circle cx="${circleX + 130}" cy="${circleY + 10}" r="115" fill="${background}" opacity=".82"/>
    <path d="M-80 570Q220 300 800 230" stroke="${light}" opacity=".55" stroke-width="46" fill="none"/>
    <path d="M-80 600Q220 330 800 260" stroke="#102b25" opacity=".4" stroke-width="2" fill="none"/>
    <g fill="#fff" font-family="Arial, sans-serif" font-weight="700" letter-spacing="4">
      <text x="45" y="62" font-size="19">HẸN. / EXPERIENCES</text>
      <text x="675" y="62" font-size="19" text-anchor="end">NO. ${String(number).padStart(3, '0')}</text>
      <text x="45" y="560" font-size="22">${escapeXml(event.category.toUpperCase())}</text>
      <text x="675" y="560" font-size="21" text-anchor="end">${escapeXml(event.city.toUpperCase())}</text>
    </g>
    <path d="M44 85H676M44 584H676" stroke="#fff" opacity=".65" stroke-width="1"/>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export default function EventArtwork({ event, alt, className, priority = false }: { event: EventItem; alt: string; className?: string; priority?: boolean }) {
  const fallback = useMemo(() => posterArtwork(event), [event]);
  const [source, setSource] = useState(fallback);
  useEffect(() => {
    let active = true;
    setSource(fallback);
    const remote = new Image();
    remote.onload = () => { if (active) setSource(event.image); };
    remote.src = event.image;
    return () => { active = false; };
  }, [event, fallback]);
  return <img src={source} alt={alt} className={className} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} />;
}
