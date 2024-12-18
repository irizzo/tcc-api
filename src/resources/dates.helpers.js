function convertStampToDate (timestamp) {
	return new Date(timestamp._seconds * 1000);
}

function formatDatesInArray (arr) {
	const formatted = arr.map((element) => {
		const aux = element;

		if (element.schedueledDate) { aux.schedueledDate = convertStampToDate(element.schedueledDate); }

		if (element.dueDate) { aux.dueDate = convertStampToDate(element.dueDate); }

		return aux
	})

	return formatted;
}

function formatEventDates(events) {
	const formatted = events.map((event) => {
		const aux = event;

		if (event.startDate) { aux.startDate = convertStampToDate(event.startDate); }

		if (event.endDate) { aux.endDate = convertStampToDate(event.endDate); }

		return aux
	})

	return formatted;
}


module.exports = {
	convertStampToDate,
	formatDatesInArray,
	formatEventDates
}