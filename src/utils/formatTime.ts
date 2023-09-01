import { format, getTime, formatDistanceToNow, parse } from "date-fns";

// ----------------------------------------------------------------------

export function fDate(date: string | number | Date) {
  return format(new Date(date), "dd MMMM yyyy");
}

export function fDateTime(date: string | number | Date) {
  return format(new Date(date), "dd MMM yyyy HH:mm");
}

export function fTimestamp(date: string | number | Date) {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date: string | number | Date) {
  return format(new Date(date), "dd/MM/yyyy hh:mm p");
}

export function fToNow(date: string | number | Date) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true
  });
}

export function fStringToDate(date: string, format = "dd/MM/yyyy") {
  return parse(date, format, new Date());
}

export function fSecondToHHMMSS(seconds: number) {
  return new Date(seconds * 1000).toISOString().substring(11, 19)
}
