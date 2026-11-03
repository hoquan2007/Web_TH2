/** Amounts are displayed in Vietnamese dong unless another currency is requested. */
export function formatCurrency(amount: number, currency?: string): string {
  const code = currency ?? 'VND';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: code,
    maximumFractionDigits: code === 'VND' ? 0 : 2,
  }).format(amount);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, Math.trunc(maxLength)))}...`;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function debounce<T extends (...args: never[]) => void>(fn: T, delay: number): T {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return ((...args: Parameters<T>) => {
    if (timeout !== undefined) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  }) as T;
}
