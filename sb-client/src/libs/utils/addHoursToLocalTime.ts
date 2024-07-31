export const addHoursToLocalTime = (
	dateStr: string,
	addHours: number
): Date => {
	const date = new Date(dateStr);
	date.setHours(date.getHours() + addHours);

	return date;
};
