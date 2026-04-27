import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMAD(amount: number): string {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', minimumFractionDigits: 0 }).format(amount);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    brouillon: '#9CA3AF', confirmee: '#60A5FA', en_preparation: '#FBBF24',
    expediee: '#F97316', livree: '#34D399', annulee: '#EF4444',
  };
  return map[status] || '#9CA3AF';
}

export function getSeasonLabel(season: string): string {
  const map: Record<string, string> = {
    printemps: '🌱 Printemps', ete: '☀️ Été', automne: '🍂 Automne',
    hiver: '❄️ Hiver', toute_saison: '🔄 Toute saison',
  };
  return map[season] || season;
}
