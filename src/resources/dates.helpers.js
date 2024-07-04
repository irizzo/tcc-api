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

module.exports = {
	convertStampToDate,
	formatDatesInArray
}