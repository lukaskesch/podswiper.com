export function addSecondsToDate(date: Date, seconds: number): Date {
  return new Date(date.getTime() + seconds * 1000);
}

export function convertDateToMySqlDate(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export function getPassedTime(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes === 1) {
    return `${minutes} minute ago`;
  }
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours === 1) {
    return `${hours} hour ago`;
  }
  if (hours < 24) {
    return `${hours} hours ago`;
  }
  const days = Math.floor(hours / 24);
  if (days === 1) {
    return `${days} day ago`;
  }
  if (days < 7) {
    return `${days} days ago`;
  }
  const weeks = Math.floor(days / 7);
  if (weeks === 1) {
    return `${weeks} week ago`;
  }
  if (weeks < 4) {
    return `${weeks} weeks ago`;
  }
  const months = Math.floor(weeks / 4);
  if (months === 1) {
    return `${months} month ago`;
  }
  if (months < 12) {
    return `${months} months ago`;
  }
  const years = Math.floor(months / 12);
  if (years === 1) {
    return `${years} year ago`;
  }
  return `${years} years ago`;
}
