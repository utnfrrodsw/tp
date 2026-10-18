
export const formatRelativeTime = (value: Date | string): string => {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(date.getTime())) return typeof value === 'string' ? value : '';

  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return 'justo ahora';

  const rtf = new Intl.RelativeTimeFormat('es-AR', { numeric: 'auto' });

  if (diffMin < 60) return rtf.format(-diffMin, 'minute');
  
  const diffHrs = Math.round(diffMin / 60);
  if (diffHrs < 24) return rtf.format(-diffHrs, 'hour');

  const diffDays = Math.round(diffHrs / 24);
  if (diffDays < 7) return rtf.format(-diffDays, 'day');

  return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export function formatDate(
  value?: string | Date | null,
  options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }
): string | null {
  if (!value) return null;
 
  const date = value instanceof Date ? value : new Date(value);
 
  if (isNaN(date.getTime())) return null;
 
  return new Intl.DateTimeFormat('es-AR', options).format(date);
}

export function formatDocumentNumber(
  prefix: string,
  nro: number,
  options: { includeYear?: boolean; date?: Date | string | null; padLength?: number } = {}
): string {
  const { includeYear = false, date, padLength } = options;
  const numberPart = padLength ? String(nro).padStart(padLength, '0') : String(nro);
 
  if (includeYear) {
    const parsedDate = date ? new Date(date) : new Date();
    const year = isNaN(parsedDate.getTime()) ? new Date().getFullYear() : parsedDate.getFullYear();
    return `${prefix}-${year}-${numberPart}`;
  }
 
  return `${prefix}-${numberPart}`;
}

export function formatMoney(value: number, symbol = '$') {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${value < 0 ? '-' : ''}${symbol}${formatted}`;
}