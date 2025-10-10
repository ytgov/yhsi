// -- BEGIN TABLE Burial.OccupationLookup
// IF OBJECT_ID('Burial.OccupationLookup', 'U') IS NOT NULL
// DROP TABLE Burial.OccupationLookup;
// GO

// CREATE TABLE Burial.OccupationLookup (
// 	OccupationLupID smallint NOT NULL IDENTITY(1,1),
// 	Occupation varchar(40) NOT NULL
// );
// GO

// ALTER TABLE Burial.OccupationLookup ADD CONSTRAINT PK__Occupati__B3EF5113113C600C PRIMARY KEY (OccupationLupID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Burial.OccupationLookup', (table) => {
		table.increments('OccupationLupID').primary();
		table.string('Occupation', 40).notNullable();
	});

	await knex('Burial.OccupationLookup').delete().whereRaw('1=1');
	await knex('Burial.OccupationLookup').insert([
		{
			Occupation: 'Accountant',
		},
		{
			Occupation: 'Actor',
		},
		{
			Occupation: 'Agent',
		},
		{
			Occupation: 'Architect',
		},
		{
			Occupation: 'Artist',
		},
		{
			Occupation: 'Assayer',
		},
		{
			Occupation: 'Assistant Territorial Treasurer',
		},
		{
			Occupation: 'Attorney',
		},
		{
			Occupation: 'Auditor',
		},
		{
			Occupation: 'Author',
		},
		{
			Occupation: 'Aviator',
		},
		{
			Occupation: 'Baker',
		},
		{
			Occupation: 'Bank clerk',
		},
		{
			Occupation: 'Bank Manager',
		},
		{
			Occupation: 'Banker',
		},
		{
			Occupation: 'Barber',
		},
		{
			Occupation: 'Bartender',
		},
		{
			Occupation: 'Billiard marker',
		},
		{
			Occupation: 'Blacksmith',
		},
		{
			Occupation: 'Boat Builder',
		},
		{
			Occupation: 'Boilermaker',
		},
		{
			Occupation: 'Bookkeeper',
		},
		{
			Occupation: 'Brass Fitter',
		},
		{
			Occupation: 'Brewer',
		},
		{
			Occupation: 'Brewery worker',
		},
		{
			Occupation: 'Brewmaster',
		},
		{
			Occupation: 'Bridge builder',
		},
		{
			Occupation: 'Broker',
		},
		{
			Occupation: 'Builder',
		},
		{
			Occupation: 'Businesswoman',
		},
		{
			Occupation: 'Butcher',
		},
		{
			Occupation: 'Card Dealer',
		},
		{
			Occupation: 'Caretaker',
		},
		{
			Occupation: 'Carpenter',
		},
		{
			Occupation: 'Casino employee',
		},
		{
			Occupation: 'Cattleman',
		},
		{
			Occupation: 'Census Enumerator',
		},
		{
			Occupation: 'Chauffeur',
		},
		{
			Occupation: 'Cheesemaker',
		},
		{
			Occupation: 'Chef',
		},
		{
			Occupation: 'Chief',
		},
		{
			Occupation: 'City Clerk',
		},
		{
			Occupation: 'Civil Engineer',
		},
		{
			Occupation: 'Clergy',
		},
		{
			Occupation: 'Clerk',
		},
		{
			Occupation: 'Commissioner',
		},
		{
			Occupation: 'Contractor',
		},
		{
			Occupation: 'Cook',
		},
		{
			Occupation: 'Customs Officer',
		},
		{
			Occupation: 'Dance Hall Manager',
		},
		{
			Occupation: 'Dance Instructor',
		},
		{
			Occupation: 'Dancer',
		},
		{
			Occupation: 'Deckhand',
		},
		{
			Occupation: 'Decorator',
		},
		{
			Occupation: 'Dentist',
		},
		{
			Occupation: 'Detective',
		},
		{
			Occupation: "Director St. Paul's Hostel",
		},
		{
			Occupation: 'Dishwasher',
		},
		{
			Occupation: 'Ditch tender',
		},
		{
			Occupation: 'Dock Hand',
		},
		{
			Occupation: 'Dog Musher',
		},
		{
			Occupation: 'Dog Pound keeper',
		},
		{
			Occupation: 'Domestic',
		},
		{
			Occupation: 'Dredge Master',
		},
		{
			Occupation: 'Dredge oiler',
		},
		{
			Occupation: 'Dredge operator',
		},
		{
			Occupation: 'Dredge Worker',
		},
		{
			Occupation: 'Dredgeman',
		},
		{
			Occupation: 'Dressmaker',
		},
		{
			Occupation: 'Driver',
		},
		{
			Occupation: 'Druggist',
		},
		{
			Occupation: 'Drum Major',
		},
		{
			Occupation: 'Electrical engineer',
		},
		{
			Occupation: 'Electrician',
		},
		{
			Occupation: 'Engineer',
		},
		{
			Occupation: 'Engraver',
		},
		{
			Occupation: 'Entertainer',
		},
		{
			Occupation: 'Executive',
		},
		{
			Occupation: 'Explorer',
		},
		{
			Occupation: 'Expressman',
		},
		{
			Occupation: 'Farmer',
		},
		{
			Occupation: 'Ferry boat pilot',
		},
		{
			Occupation: 'Ferry Captain',
		},
		{
			Occupation: 'Ferry Operator',
		},
		{
			Occupation: 'Fire Chief',
		},
		{
			Occupation: 'Fireman',
		},
		{
			Occupation: 'Fisherman',
		},
		{
			Occupation: 'Fishing',
		},
		{
			Occupation: 'Foreman',
		},
		{
			Occupation: 'Freighter',
		},
		{
			Occupation: 'Frontiersman',
		},
		{
			Occupation: 'Fuel Agent',
		},
		{
			Occupation: 'Gambler',
		},
		{
			Occupation: 'Gardener',
		},
		{
			Occupation: 'Gold weigher',
		},
		{
			Occupation: 'Government employee',
		},
		{
			Occupation: 'Grocer',
		},
		{
			Occupation: 'Guide',
		},
		{
			Occupation: 'Gunsmith',
		},
		{
			Occupation: 'Haberdasher',
		},
		{
			Occupation: 'Handyman',
		},
		{
			Occupation: 'Harnessmaker',
		},
		{
			Occupation: 'Heavy equipment operator',
		},
		{
			Occupation: 'Highway Construction Worker',
		},
		{
			Occupation: 'Highway Crew Foreman',
		},
		{
			Occupation: 'Highway Supervisor',
		},
		{
			Occupation: 'Hotel worker',
		},
		{
			Occupation: 'Hotelier',
		},
		{
			Occupation: 'House Mover',
		},
		{
			Occupation: 'House painter',
		},
		{
			Occupation: 'Housekeeper',
		},
		{
			Occupation: 'Hunter',
		},
		{
			Occupation: 'Indian Agent (Superintendent)',
		},
		{
			Occupation: 'Innkeeper',
		},
		{
			Occupation: 'Insurance Agent',
		},
		{
			Occupation: 'Interior Decorator',
		},
		{
			Occupation: 'Inventor',
		},
		{
			Occupation: 'Janitor',
		},
		{
			Occupation: 'Jeweler',
		},
		{
			Occupation: 'Judge',
		},
		{
			Occupation: 'Labourer',
		},
		{
			Occupation: 'Laundress',
		},
		{
			Occupation: 'Laundry Operator',
		},
		{
			Occupation: 'Lawyer',
		},
		{
			Occupation: 'Legislative clerk',
		},
		{
			Occupation: 'Legislator',
		},
		{
			Occupation: 'Librarian',
		},
		{
			Occupation: 'Library worker',
		},
		{
			Occupation: 'Lighthouse keeper',
		},
		{
			Occupation: 'Lineman',
		},
		{
			Occupation: 'Liveryman',
		},
		{
			Occupation: 'Locomotive Engineer',
		},
		{
			Occupation: 'Lodging House Keeper',
		},
		{
			Occupation: 'Logger',
		},
		{
			Occupation: 'Machinist',
		},
		{
			Occupation: 'Magistrate',
		},
		{
			Occupation: 'Mail carrier',
		},
		{
			Occupation: 'Mail contractor',
		},
		{
			Occupation: 'Manager',
		},
		{
			Occupation: 'Marine Architect',
		},
		{
			Occupation: 'Mariner',
		},
		{
			Occupation: 'Mayor',
		},
		{
			Occupation: 'Mechanic',
		},
		{
			Occupation: 'Mechanical engineer',
		},
		{
			Occupation: 'Member Of Parliament',
		},
		{
			Occupation: 'Member Yukon Council',
		},
		{
			Occupation: 'Merchant',
		},
		{
			Occupation: 'Meteorological Observer',
		},
		{
			Occupation: 'Military',
		},
		{
			Occupation: 'Milliner',
		},
		{
			Occupation: 'Millwright',
		},
		{
			Occupation: 'Miner',
		},
		{
			Occupation: 'Mining And Financial Agent',
		},
		{
			Occupation: 'Mining broker',
		},
		{
			Occupation: 'Mining Engineer',
		},
		{
			Occupation: 'Mining Recorder',
		},
		{
			Occupation: 'Musician',
		},
		{
			Occupation: 'Negotiator',
		},
		{
			Occupation: 'News Compositor',
		},
		{
			Occupation: 'Newsman',
		},
		{
			Occupation: 'Newspaper agent',
		},
		{
			Occupation: 'Newspaper Correspondent',
		},
		{
			Occupation: 'Newspaper Owner',
		},
		{
			Occupation: 'Newspaperman',
		},
		{
			Occupation: 'Notary Public',
		},
		{
			Occupation: 'Nun',
		},
		{
			Occupation: 'Nurse',
		},
		{
			Occupation: 'Optometrist',
		},
		{
			Occupation: 'Packer',
		},
		{
			Occupation: 'Painter',
		},
		{
			Occupation: 'Paperhanger',
		},
		{
			Occupation: 'Pharmacist',
		},
		{
			Occupation: 'Photographer',
		},
		{
			Occupation: 'Physician',
		},
		{
			Occupation: 'Pilot',
		},
		{
			Occupation: 'Plainsman',
		},
		{
			Occupation: 'Plumber',
		},
		{
			Occupation: 'Police',
		},
		{
			Occupation: 'Politician',
		},
		{
			Occupation: 'Porter',
		},
		{
			Occupation: 'Post Office Clerk',
		},
		{
			Occupation: 'Postmaster',
		},
		{
			Occupation: 'Power Plant Operator',
		},
		{
			Occupation: 'Priest',
		},
		{
			Occupation: 'Printer',
		},
		{
			Occupation: 'Project Manager',
		},
		{
			Occupation: 'Proprietor',
		},
		{
			Occupation: 'Prospector',
		},
		{
			Occupation: 'Purser',
		},
		{
			Occupation: 'Radio Technician',
		},
		{
			Occupation: 'Railroad conductor',
		},
		{
			Occupation: 'Railroad worker',
		},
		{
			Occupation: 'Railroader',
		},
		{
			Occupation: 'Rancher',
		},
		{
			Occupation: 'Real Estate',
		},
		{
			Occupation: 'Realtor',
		},
		{
			Occupation: 'Refuse Collector',
		},
		{
			Occupation: 'Representative',
		},
		{
			Occupation: 'Restauranteur',
		},
		{
			Occupation: 'River Pilot',
		},
		{
			Occupation: 'Riverboat Captain',
		},
		{
			Occupation: 'Riverboat cook',
		},
		{
			Occupation: 'Riverboat crewman',
		},
		{
			Occupation: 'Riverboat Engineer',
		},
		{
			Occupation: 'Riverboat fireman',
		},
		{
			Occupation: 'Riverboat Mate',
		},
		{
			Occupation: 'Riverboat Steward',
		},
		{
			Occupation: 'Riverboat waiter',
		},
		{
			Occupation: 'Roadhouse Operator',
		},
		{
			Occupation: 'Roadhouse Proprietor',
		},
		{
			Occupation: 'Sailor',
		},
		{
			Occupation: 'Salesman',
		},
		{
			Occupation: 'Saloonkeeper',
		},
		{
			Occupation: 'Sawmill operator',
		},
		{
			Occupation: 'Sawmill Owner',
		},
		{
			Occupation: 'Sawyer',
		},
		{
			Occupation: 'Scout',
		},
		{
			Occupation: 'Sea Captain',
		},
		{
			Occupation: 'Seamstress',
		},
		{
			Occupation: 'Servant',
		},
		{
			Occupation: 'Sheep Farmer',
		},
		{
			Occupation: 'Sheet metal worker',
		},
		{
			Occupation: 'Sheriff of Yukon',
		},
		{
			Occupation: 'Shipbuilder',
		},
		{
			Occupation: 'Shoemaker',
		},
		{
			Occupation: 'Sign painter',
		},
		{
			Occupation: 'Sister Superior',
		},
		{
			Occupation: 'Skating Rink Manager',
		},
		{
			Occupation: 'Special Constable RCMP',
		},
		{
			Occupation: 'Stable owner',
		},
		{
			Occupation: 'Stableman',
		},
		{
			Occupation: 'Stage driver',
		},
		{
			Occupation: 'Stagecoach Driver',
		},
		{
			Occupation: 'Steam engineer',
		},
		{
			Occupation: 'Steamfitter',
		},
		{
			Occupation: 'Stevedore',
		},
		{
			Occupation: 'Steward',
		},
		{
			Occupation: 'Stockbroker',
		},
		{
			Occupation: 'Stone cutter',
		},
		{
			Occupation: 'Store clerk',
		},
		{
			Occupation: 'Store manager',
		},
		{
			Occupation: 'Superintendent',
		},
		{
			Occupation: 'Superintendent (Highway)',
		},
		{
			Occupation: 'Superintendent (Mine)',
		},
		{
			Occupation: 'Surgeon',
		},
		{
			Occupation: 'Surveyor',
		},
		{
			Occupation: 'Tailor',
		},
		{
			Occupation: 'Taxi Driver',
		},
		{
			Occupation: 'Taxi Owner/Operator',
		},
		{
			Occupation: 'Teacher',
		},
		{
			Occupation: 'Teamster',
		},
		{
			Occupation: 'Telegraph lineman',
		},
		{
			Occupation: 'Telegraph operator',
		},
		{
			Occupation: 'Telegrapher',
		},
		{
			Occupation: 'Telephone operator',
		},
		{
			Occupation: 'Tinsmith',
		},
		{
			Occupation: 'Trader',
		},
		{
			Occupation: 'Trading post operator',
		},
		{
			Occupation: 'Transportation entrepreneur',
		},
		{
			Occupation: 'Trapper',
		},
		{
			Occupation: 'Truck driver',
		},
		{
			Occupation: 'Undertaker',
		},
		{
			Occupation: 'Upholsterer',
		},
		{
			Occupation: 'Waiter',
		},
		{
			Occupation: 'Waitress',
		},
		{
			Occupation: 'Warehouseman',
		},
		{
			Occupation: 'Watchman',
		},
		{
			Occupation: 'Welder',
		},
		{
			Occupation: 'Wood contractor',
		},
		{
			Occupation: 'Wood dealer',
		},
		{
			Occupation: 'Woodcutter',
		},
		{
			Occupation: 'Wooddealer',
		},
		{
			Occupation: 'Woodhauler',
		},
		{
			Occupation: 'Woodsman',
		},
		{
			Occupation: 'Writer',
		},
		{
			Occupation: 'X-ray technician',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.OccupationLookup');
};
