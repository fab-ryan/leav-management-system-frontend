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
export const leaveTypeDisplay = (type: string, isHalfDay?: boolean) => {
  if (isHalfDay) {
    return "Half Day";
  }
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

export const exportToCSV = (data: any[], filename: string) => {
  if (!data || data.length === 0) return;

  // Get headers from the first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle nested objects (like department.name)
        if (typeof value === 'object' && value !== null) {
          return `"${value.name || value}"`;
        }
        // Handle strings that might contain commas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
export const downloadExportLeaveApplications = async (params: {
  status: string,
  type?: string,
  startDate?: string
  endDate?: string,
  search?: string,
  page?: number,
  size?: number,
  sort?: string
}) => {
  const url = `${baseUrl}/${buildQueryString(params)}`
  const token = localStorage.getItem('token')
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,

    },
  })
  if (!response.ok) {
    throw new Error('Failed to download CSV');
  }
  const blob = await response.blob();
  const urls = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = urls;
  a.download = `${params.status}-leaves.csv`;
  a.click();
}
export const buildQueryString = (params: any) => {
  let queryString = `leave-applications/export/${params.status}?`;
  if (params.type) {
    queryString += `leaveType=${params.type}&`;
  }
  if (params.startDate) {
    queryString += `startDate=${params.startDate}&`;
  }
  if (params.endDate) {
    queryString += `endDate=${params.endDate}&`;
  }
  if (params.search) {
    queryString += `search=${params.search}&`;
  }
  if (params.page) {
    queryString += `page=${params.page}&`;
  }
  if (params.size) {
    queryString += `size=${params.size}&`;
  }
  if (params.sort) {
    queryString += `sort=${params.sort}&`;
  }
  // Remove the trailing '&' or '?' if present
  if (queryString.endsWith('&')) {
    queryString = queryString.slice(0, -1);
  } else if (queryString.endsWith('?')) {
    queryString = queryString.slice(0, -1);
  }
  return queryString;
}
const buildEmployeeQueryString = (params: { page?: number, size?: number, sort?: string, department?: string, role?: string, policy?: string, search?: string }) => {
  let queryString = `employees/export?`;
  if (params.department) {
    queryString += `department=${params.department}&`;
  }
  if (params.role) {
    queryString += `role=${params.role}&`;
  }
  if (params.policy) {
    queryString += `policy=${params.policy}&`;
  }
  if (params.search) {
    queryString += `search=${params.search}&`;
  }
  if (params.page) {
    queryString += `page=${params.page}&`;
  }
  if (params.size) {
    queryString += `size=${params.size}&`;
  }
  if (params.sort) {
    queryString += `sortDirection=${params.sort}&`;
  }
  if (queryString.endsWith('&')) {
    queryString = queryString.slice(0, -1);
  } else if (queryString.endsWith('?')) {
    queryString = queryString.slice(0, -1);
  }
  return queryString;
}
export const exportEmployeeToCSV = async ({ page, size, sort, department, role, policy, search }: { page?: number, size?: number, sort?: string, department?: string, role?: string, policy?: string, search?: string }) => {
  const url = `${baseUrl}/${buildEmployeeQueryString({ page, size, sort, department, role, policy, search })}`
  const token = localStorage.getItem('token')
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Failed to download CSV');
  }
  const blob = await response.blob();
  const urls = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = urls;
  a.download = `employees.csv`;
  a.click();
}

export const getProfilePictureUrl = (url: string) => {
  if (!url) return "";
  return `${baseUrl}/${url}`;
}