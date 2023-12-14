class InfoSource {
	constructor(data = {}) {
		this.Id = data.Id || '';
		this.YACSINumber = data.YACSINumber || '';
		this.Source = data.Source || '';
		this.Type = data.Type || 'Reference';
		this.status = data.status || 'New';
	}
	// Add any additional methods or properties here
}

export { InfoSource };
