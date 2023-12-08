applyCoordinateProjection() {
			//let { lat, long } = this.modifiableFields;
			let { id } = this.selectedProjection;
			//let transformed_coordinates;
			switch (id) {
				case 1:
					this.dd = {
						lat: this.modifiableFields.lat,
						lng: this.modifiableFields.long,
					};
					break;
				case 2: //NAD83
					this.nad83 = {
						lat: this.modifiableFields.lat,
						lng: this.modifiableFields.long,
					};
					break;
				case 3: //NAD83 CRS
					//transformed_coordinates = proj4(proj4('EPSG:3979'), [long,lat]);
					this.nad83 = {
						lat: this.modifiableFields.lat,
						lng: this.modifiableFields.long,
					};
					break;
			}
    }

    transformProjectedCoordinates() {
			let { lat, lng } = this.nad83;
			//let transformed_coordinates;
			switch (this.selectedProjection.id) {
				case 1:
					this.dd = {
						lat: this.modifiableFields.lat,
						lng: this.modifiableFields.long,
					};
					this.modifiableFields.lat = this.dd.lat;
					this.modifiableFields.long = this.dd.lng;
					break;
				case 2: //NAD83
					//transformed_coordinates = proj4(proj4('EPSG:3978'),proj4('EPSG:4326'), [parseFloat(x),parseFloat(y)]);
					this.modifiableFields.lat = lat; //transformed_coordinates[1];
					this.modifiableFields.long = lng; //transformed_coordinates[0];
					break;
				case 3: //NAD83 CRS
					//transformed_coordinates = proj4(proj4('EPSG:3978'),proj4('EPSG:4326'), [parseFloat(x),parseFloat(y)]);
					this.modifiableFields.lat = lat; //transformed_coordinates[1];
					this.modifiableFields.long = lng; //transformed_coordinates[0];
					break;
			}
		},

    updateStateCoordinates() {
			let system = this.selectedSystem.id;
			if (!system) return;

			let data;
			switch (system) {
				case 1: //DD
					this.modifiableFields.lat = parseFloat(this.dd.lat);
					this.modifiableFields.long = parseFloat(this.dd.lng);
					break;
				case 2: //UTM
					data = utmVar.convertUtmToLatLng(
						this.utm.Easting,
						this.utm.Northing,
						this.utm.ZoneNumber,
						this.utm.ZoneLetter
					);
					this.modifiableFields.lat = parseFloat(data.lat);
					this.modifiableFields.long = parseFloat(data.lng);
					break;
				case 3: //DMS
					this.modifiableFields.lat = parseFloat(
						this.convertDMSToDD(this.dms.lat)
					);
					this.modifiableFields.long = parseFloat(
						this.convertDMSToDD(this.dms.lng)
					);
					break;
			}

		convertDDToDMS(D, lng) {
			const M = 0 | ((D % 1) * 60e7);
			return {
				dir: D < 0 ? (lng ? 'W' : 'S') : lng ? 'E' : 'N',
				deg: 0 | (D < 0 ? (D = -D) : D),
				min: 0 | (M / 1e7),
				sec: (0 | (((M / 1e6) % 1) * 6e4)) / 100,
			};


      // PROJ 4 Stuff
      import proj4 from 'proj4';
      proj4.defs([
			[
				'EPSG:4326',
				'+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees +no_defs',
			],
			[
				'EPSG:3978',
				'+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=degrees +no_defs',
			],
			[
				'EPSG:3979',
				'+proj=lcc +lat_1=49 +lat_2=77 +lat_0=49 +lon_0=-95 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=degrees +no_defs',
			],
		]);
	},