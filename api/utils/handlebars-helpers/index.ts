function joinArray(iterable: any): string {
	if (iterable && Array.isArray(iterable)) {
		return iterable.join(', ');
	}

	return '';
}

function joinArrayPick(iterable: any, fieldName: string): string {
	if (iterable && Array.isArray(iterable)) {
		return iterable.map((i) => i[fieldName]).join(', ');
	}

	return '';
}

export default { joinArray, joinArrayPick };
