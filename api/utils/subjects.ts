/**
 * The subjects UI is a multi-select, so clients split the comma-delimited
 * varchar(500) column into an array on load and send it back that way on save.
 * Collapse it to a string before it reaches tedious, which rejects arrays.
 */
export function normalizeSubjects<T>(item: T): T {
	const subjects = (item as any)?.subjects;

	if (!Array.isArray(subjects)) return item;

	return { ...item, subjects: subjects.length > 0 ? subjects.join(',') : null };
}
