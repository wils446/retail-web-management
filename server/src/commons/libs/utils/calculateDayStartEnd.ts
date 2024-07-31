export const calculateDayStartAndEnd = (date?: string) => {
  const day = new Date(date);
  const dateStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const dateEnd = new Date(dateStart.getTime() + 86400000);

  return { dateStart, dateEnd };
};
