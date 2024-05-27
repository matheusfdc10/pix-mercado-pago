import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  
  const months = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${day} de ${month} às ${hours}:${minutes} h`;
}


export function formatNumber(value: number) {
  // Formatar o número com duas casas decimais
  const formattedValue = value.toFixed(2);
  
  // Substituir o ponto por uma vírgula
  const formattedWithComma = formattedValue.replace('.', ',');
  
  return formattedWithComma;
}