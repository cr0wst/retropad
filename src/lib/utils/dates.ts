export function formatDate(date: string | Date | number): string {
	try {
		// Handle SQLite timestamp (seconds)
		if (typeof date === 'number') {
			date = new Date(date * 1000);
		} else if (typeof date === 'string') {
			date = new Date(date);
		}

		// Check if date is valid
		if (isNaN(date.getTime())) {
			return 'Invalid date';
		}

		return date.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	} catch (error) {
		console.error('Error formatting date:', error);
		return 'Invalid date';
	}
}
