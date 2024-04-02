function generateIdentifierCode(title) {
	const identifierCode = title.trim().replace(' ', '_').toUpperCase();

	return identifierCode;
}

module.exports = generateIdentifierCode;