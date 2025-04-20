import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const baseUrl: NonNullable<string> =
  import.meta.env.VITE_API_URL + '/api' || "http://localhost:5500/api"
  ;

export const redirectToFile = (file: string) => {
  const fileUrl = `${baseUrl}/leave-applications/documents/${file}`;
  window.open(fileUrl, '_blank');
}
export const leaveTypeDisplay = (type: string) => {
  switch (type) {
    case "annual":
      return "Annual Leave";
    case "sick":
      return "Sick Leave";
    case "personal":
      return "Personal Leave";
    case "maternity":
      return "Maternity Leave";
    case "paternity":
      return "Paternity Leave";
    case "unpaid":
      return "Unpaid Leave";
    case "other":
      return "Other";
    default:
      return type;
  }
}
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
export const formatDateToApi = (date: string) => {
  if (!date) return "";
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date) || new Date());
}