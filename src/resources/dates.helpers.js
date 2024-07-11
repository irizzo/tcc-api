function convertStampToDate (timestamp) {
	return new Date(timestamp._seconds * 1000).toLocaleString();
}

function formatDatesInArray (arr) {
	const formatted = arr.map((element) => {
		const aux = element;

		if (element.toDoDate) {
			aux.toDoDate = convertStampToDate(element.toDoDate);
		}

		if (element.dueDate) {
			aux.dueDate = convertStampToDate(element.dueDate);
		}
		console.log('aux: ', aux);
		return aux
	})

	return formatted;
}

function formatEventDates(events) {
	const formatted = events.map((event) => {
		const aux = event;

		if (event.startDate) {
			aux.startDate = convertStampToDate(event.startDate);
		}

		if (event.endDate) {
			aux.endDate = convertStampToDate(event.endDate);
		}
		console.log('aux: ', aux);
		return aux
	})

	return formatted;
}


module.exports = {
	convertStampToDate,
	formatDatesInArray,
	formatEventDates
}