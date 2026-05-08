/** Formatting utilities */

export function fmtCurrency(value, compact = false) {
  if (value === null || value === undefined) return '—';
  if (compact) {
    if (Math.abs(value) >= 1e7) return `₹${(value / 1e7).toFixed(1)}Cr`;
    if (Math.abs(value) >= 1e5) return `₹${(value / 1e5).toFixed(1)}L`;
    if (Math.abs(value) >= 1e3) return `₹${(value / 1e3).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(value);
}

export function fmtNumber(value, compact = false) {
  if (value === null || value === undefined) return '—';
  if (compact) {
    if (Math.abs(value) >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (Math.abs(value) >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return String(Math.round(value));
  }
  return new Intl.NumberFormat('en-IN').format(Math.round(value));
}

export function fmtPercent(value, decimals = 1) {
  if (value === null || value === undefined) return '—';
  return `${value.toFixed(decimals)}%`;
}

export function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function monthLabel(yyyymm) {
  if (!yyyymm) return '';
  const [y, m] = yyyymm.split('-');
  const d = new Date(+y, +m - 1, 1);
  return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
}

export function percentChange(current, prev) {
  if (!prev || prev === 0) return null;
  return ((current - prev) / prev) * 100;
}

/** Chart color palette — no blue */
export const COLORS = [
  '#e11d48', // Rose
  '#f59e0b', // Amber
  '#059669', // Emerald
  '#8b5cf6', // Violet
  '#f97316', // Orange
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#84cc16', // Lime
];

export const CHART_COMMON = {
  cartesianGrid: { stroke: 'rgba(225,29,72,0.06)', strokeDasharray: '3 3' },
  axis: { tick: { fill: '#886d73', fontSize: 11 }, axisLine: false, tickLine: false },
};
