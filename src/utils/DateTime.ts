export function get24Hours(dateTime: Date): string {
  const dateString = dateTime.toISOString();
  const timeString = dateString.split('T')[1];
  const hours = timeString.split(':')[0];
  const minutes = timeString.split(':')[1];
  return hours + ':' + minutes;
}

export function get12Hours(dateTime: Date): string {
  const dateString = dateTime.toISOString();
  const timeString = dateString.split('T')[1];
  const hours24 = Number(timeString.split(':')[0]);
  const hours = hours24 > 12 ? hours24 - 12 : hours24;
  const minutes = timeString.split(':')[1];
  const meridian = hours24 > 12 ? 'PM' : 'AM';
  return hours + ':' + minutes + ' ' + meridian;
}

export function getDate(dateTime: Date): string {
  const dateISOString = dateTime.toISOString();
  const dateString = dateISOString.split('T')[0];
  const [year, month, date] = dateString.split('-');
  return `${month}/${date}/${year}`;
}
