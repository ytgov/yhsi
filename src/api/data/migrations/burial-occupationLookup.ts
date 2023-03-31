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
			OccupationLupID: 1,
			Occupation: 'Accountant',
		},
		{
			OccupationLupID: 2,
			Occupation: 'Actor',
		},
		{
			OccupationLupID: 3,
			Occupation: 'Agent',
		},
		{
			OccupationLupID: 4,
			Occupation: 'Architect',
		},
		{
			OccupationLupID: 5,
			Occupation: 'Artist',
		},
		{
			OccupationLupID: 6,
			Occupation: 'Assayer',
		},
		{
			OccupationLupID: 7,
			Occupation: 'Assistant Territorial Treasurer',
		},
		{
			OccupationLupID: 8,
			Occupation: 'Attorney',
		},
		{
			OccupationLupID: 9,
			Occupation: 'Auditor',
		},
		{
			OccupationLupID: 10,
			Occupation: 'Author',
		},
		{
			OccupationLupID: 11,
			Occupation: 'Aviator',
		},
		{
			OccupationLupID: 12,
			Occupation: 'Baker',
		},
		{
			OccupationLupID: 13,
			Occupation: 'Bank clerk',
		},
		{
			OccupationLupID: 14,
			Occupation: 'Bank Manager',
		},
		{
			OccupationLupID: 15,
			Occupation: 'Banker',
		},
		{
			OccupationLupID: 16,
			Occupation: 'Barber',
		},
		{
			OccupationLupID: 17,
			Occupation: 'Bartender',
		},
		{
			OccupationLupID: 18,
			Occupation: 'Billiard marker',
		},
		{
			OccupationLupID: 19,
			Occupation: 'Blacksmith',
		},
		{
			OccupationLupID: 20,
			Occupation: 'Boat Builder',
		},
		{
			OccupationLupID: 21,
			Occupation: 'Boilermaker',
		},
		{
			OccupationLupID: 22,
			Occupation: 'Bookkeeper',
		},
		{
			OccupationLupID: 23,
			Occupation: 'Brass Fitter',
		},
		{
			OccupationLupID: 24,
			Occupation: 'Brewer',
		},
		{
			OccupationLupID: 25,
			Occupation: 'Brewery worker',
		},
		{
			OccupationLupID: 26,
			Occupation: 'Brewmaster',
		},
		{
			OccupationLupID: 27,
			Occupation: 'Bridge builder',
		},
		{
			OccupationLupID: 28,
			Occupation: 'Broker',
		},
		{
			OccupationLupID: 29,
			Occupation: 'Builder',
		},
		{
			OccupationLupID: 30,
			Occupation: 'Businesswoman',
		},
		{
			OccupationLupID: 31,
			Occupation: 'Butcher',
		},
		{
			OccupationLupID: 32,
			Occupation: 'Card Dealer',
		},
		{
			OccupationLupID: 33,
			Occupation: 'Caretaker',
		},
		{
			OccupationLupID: 34,
			Occupation: 'Carpenter',
		},
		{
			OccupationLupID: 35,
			Occupation: 'Casino employee',
		},
		{
			OccupationLupID: 36,
			Occupation: 'Cattleman',
		},
		{
			OccupationLupID: 37,
			Occupation: 'Census Enumerator',
		},
		{
			OccupationLupID: 38,
			Occupation: 'Chauffeur',
		},
		{
			OccupationLupID: 39,
			Occupation: 'Cheesemaker',
		},
		{
			OccupationLupID: 40,
			Occupation: 'Chef',
		},
		{
			OccupationLupID: 41,
			Occupation: 'Chief',
		},
		{
			OccupationLupID: 42,
			Occupation: 'City Clerk',
		},
		{
			OccupationLupID: 43,
			Occupation: 'Civil Engineer',
		},
		{
			OccupationLupID: 44,
			Occupation: 'Clergy',
		},
		{
			OccupationLupID: 45,
			Occupation: 'Clerk',
		},
		{
			OccupationLupID: 46,
			Occupation: 'Commissioner',
		},
		{
			OccupationLupID: 47,
			Occupation: 'Contractor',
		},
		{
			OccupationLupID: 48,
			Occupation: 'Cook',
		},
		{
			OccupationLupID: 49,
			Occupation: 'Customs Officer',
		},
		{
			OccupationLupID: 50,
			Occupation: 'Dance Hall Manager',
		},
		{
			OccupationLupID: 51,
			Occupation: 'Dance Instructor',
		},
		{
			OccupationLupID: 52,
			Occupation: 'Dancer',
		},
		{
			OccupationLupID: 53,
			Occupation: 'Deckhand',
		},
		{
			OccupationLupID: 54,
			Occupation: 'Decorator',
		},
		{
			OccupationLupID: 55,
			Occupation: 'Dentist',
		},
		{
			OccupationLupID: 56,
			Occupation: 'Detective',
		},
		{
			OccupationLupID: 57,
			Occupation: "Director St. Paul's Hostel",
		},
		{
			OccupationLupID: 58,
			Occupation: 'Dishwasher',
		},
		{
			OccupationLupID: 59,
			Occupation: 'Ditch tender',
		},
		{
			OccupationLupID: 60,
			Occupation: 'Dock Hand',
		},
		{
			OccupationLupID: 61,
			Occupation: 'Dog Musher',
		},
		{
			OccupationLupID: 62,
			Occupation: 'Dog Pound keeper',
		},
		{
			OccupationLupID: 63,
			Occupation: 'Domestic',
		},
		{
			OccupationLupID: 64,
			Occupation: 'Dredge Master',
		},
		{
			OccupationLupID: 65,
			Occupation: 'Dredge oiler',
		},
		{
			OccupationLupID: 66,
			Occupation: 'Dredge operator',
		},
		{
			OccupationLupID: 67,
			Occupation: 'Dredge Worker',
		},
		{
			OccupationLupID: 68,
			Occupation: 'Dredgeman',
		},
		{
			OccupationLupID: 69,
			Occupation: 'Dressmaker',
		},
		{
			OccupationLupID: 70,
			Occupation: 'Driver',
		},
		{
			OccupationLupID: 71,
			Occupation: 'Druggist',
		},
		{
			OccupationLupID: 72,
			Occupation: 'Drum Major',
		},
		{
			OccupationLupID: 73,
			Occupation: 'Electrical engineer',
		},
		{
			OccupationLupID: 74,
			Occupation: 'Electrician',
		},
		{
			OccupationLupID: 75,
			Occupation: 'Engineer',
		},
		{
			OccupationLupID: 76,
			Occupation: 'Engraver',
		},
		{
			OccupationLupID: 77,
			Occupation: 'Entertainer',
		},
		{
			OccupationLupID: 78,
			Occupation: 'Executive',
		},
		{
			OccupationLupID: 79,
			Occupation: 'Explorer',
		},
		{
			OccupationLupID: 80,
			Occupation: 'Expressman',
		},
		{
			OccupationLupID: 81,
			Occupation: 'Farmer',
		},
		{
			OccupationLupID: 82,
			Occupation: 'Ferry boat pilot',
		},
		{
			OccupationLupID: 83,
			Occupation: 'Ferry Captain',
		},
		{
			OccupationLupID: 84,
			Occupation: 'Ferry Operator',
		},
		{
			OccupationLupID: 85,
			Occupation: 'Fire Chief',
		},
		{
			OccupationLupID: 86,
			Occupation: 'Fireman',
		},
		{
			OccupationLupID: 87,
			Occupation: 'Fisherman',
		},
		{
			OccupationLupID: 88,
			Occupation: 'Fishing',
		},
		{
			OccupationLupID: 89,
			Occupation: 'Foreman',
		},
		{
			OccupationLupID: 90,
			Occupation: 'Freighter',
		},
		{
			OccupationLupID: 91,
			Occupation: 'Frontiersman',
		},
		{
			OccupationLupID: 92,
			Occupation: 'Fuel Agent',
		},
		{
			OccupationLupID: 93,
			Occupation: 'Gambler',
		},
		{
			OccupationLupID: 94,
			Occupation: 'Gardener',
		},
		{
			OccupationLupID: 95,
			Occupation: 'Gold weigher',
		},
		{
			OccupationLupID: 96,
			Occupation: 'Government employee',
		},
		{
			OccupationLupID: 97,
			Occupation: 'Grocer',
		},
		{
			OccupationLupID: 98,
			Occupation: 'Guide',
		},
		{
			OccupationLupID: 99,
			Occupation: 'Gunsmith',
		},
		{
			OccupationLupID: 100,
			Occupation: 'Haberdasher',
		},
		{
			OccupationLupID: 101,
			Occupation: 'Handyman',
		},
		{
			OccupationLupID: 102,
			Occupation: 'Harnessmaker',
		},
		{
			OccupationLupID: 103,
			Occupation: 'Heavy equipment operator',
		},
		{
			OccupationLupID: 104,
			Occupation: 'Highway Construction Worker',
		},
		{
			OccupationLupID: 105,
			Occupation: 'Highway Crew Foreman',
		},
		{
			OccupationLupID: 106,
			Occupation: 'Highway Supervisor',
		},
		{
			OccupationLupID: 107,
			Occupation: 'Hotel worker',
		},
		{
			OccupationLupID: 108,
			Occupation: 'Hotelier',
		},
		{
			OccupationLupID: 109,
			Occupation: 'House Mover',
		},
		{
			OccupationLupID: 110,
			Occupation: 'House painter',
		},
		{
			OccupationLupID: 111,
			Occupation: 'Housekeeper',
		},
		{
			OccupationLupID: 112,
			Occupation: 'Hunter',
		},
		{
			OccupationLupID: 113,
			Occupation: 'Indian Agent (Superintendent)',
		},
		{
			OccupationLupID: 114,
			Occupation: 'Innkeeper',
		},
		{
			OccupationLupID: 115,
			Occupation: 'Insurance Agent',
		},
		{
			OccupationLupID: 116,
			Occupation: 'Interior Decorator',
		},
		{
			OccupationLupID: 117,
			Occupation: 'Inventor',
		},
		{
			OccupationLupID: 118,
			Occupation: 'Janitor',
		},
		{
			OccupationLupID: 119,
			Occupation: 'Jeweler',
		},
		{
			OccupationLupID: 120,
			Occupation: 'Judge',
		},
		{
			OccupationLupID: 121,
			Occupation: 'Labourer',
		},
		{
			OccupationLupID: 122,
			Occupation: 'Laundress',
		},
		{
			OccupationLupID: 123,
			Occupation: 'Laundry Operator',
		},
		{
			OccupationLupID: 124,
			Occupation: 'Lawyer',
		},
		{
			OccupationLupID: 125,
			Occupation: 'Legislative clerk',
		},
		{
			OccupationLupID: 126,
			Occupation: 'Legislator',
		},
		{
			OccupationLupID: 127,
			Occupation: 'Librarian',
		},
		{
			OccupationLupID: 128,
			Occupation: 'Library worker',
		},
		{
			OccupationLupID: 129,
			Occupation: 'Lighthouse keeper',
		},
		{
			OccupationLupID: 130,
			Occupation: 'Lineman',
		},
		{
			OccupationLupID: 131,
			Occupation: 'Liveryman',
		},
		{
			OccupationLupID: 132,
			Occupation: 'Locomotive Engineer',
		},
		{
			OccupationLupID: 133,
			Occupation: 'Lodging House Keeper',
		},
		{
			OccupationLupID: 134,
			Occupation: 'Logger',
		},
		{
			OccupationLupID: 135,
			Occupation: 'Machinist',
		},
		{
			OccupationLupID: 136,
			Occupation: 'Magistrate',
		},
		{
			OccupationLupID: 137,
			Occupation: 'Mail carrier',
		},
		{
			OccupationLupID: 138,
			Occupation: 'Mail contractor',
		},
		{
			OccupationLupID: 139,
			Occupation: 'Manager',
		},
		{
			OccupationLupID: 140,
			Occupation: 'Marine Architect',
		},
		{
			OccupationLupID: 141,
			Occupation: 'Mariner',
		},
		{
			OccupationLupID: 142,
			Occupation: 'Mayor',
		},
		{
			OccupationLupID: 143,
			Occupation: 'Mechanic',
		},
		{
			OccupationLupID: 144,
			Occupation: 'Mechanical engineer',
		},
		{
			OccupationLupID: 145,
			Occupation: 'Member Of Parliament',
		},
		{
			OccupationLupID: 146,
			Occupation: 'Member Yukon Council',
		},
		{
			OccupationLupID: 147,
			Occupation: 'Merchant',
		},
		{
			OccupationLupID: 148,
			Occupation: 'Meteorological Observer',
		},
		{
			OccupationLupID: 149,
			Occupation: 'Military',
		},
		{
			OccupationLupID: 150,
			Occupation: 'Milliner',
		},
		{
			OccupationLupID: 151,
			Occupation: 'Millwright',
		},
		{
			OccupationLupID: 152,
			Occupation: 'Miner',
		},
		{
			OccupationLupID: 153,
			Occupation: 'Mining And Financial Agent',
		},
		{
			OccupationLupID: 154,
			Occupation: 'Mining broker',
		},
		{
			OccupationLupID: 155,
			Occupation: 'Mining Engineer',
		},
		{
			OccupationLupID: 156,
			Occupation: 'Mining Recorder',
		},
		{
			OccupationLupID: 157,
			Occupation: 'Musician',
		},
		{
			OccupationLupID: 158,
			Occupation: 'Negotiator',
		},
		{
			OccupationLupID: 159,
			Occupation: 'News Compositor',
		},
		{
			OccupationLupID: 160,
			Occupation: 'Newsman',
		},
		{
			OccupationLupID: 161,
			Occupation: 'Newspaper agent',
		},
		{
			OccupationLupID: 162,
			Occupation: 'Newspaper Correspondent',
		},
		{
			OccupationLupID: 163,
			Occupation: 'Newspaper Owner',
		},
		{
			OccupationLupID: 164,
			Occupation: 'Newspaperman',
		},
		{
			OccupationLupID: 165,
			Occupation: 'Notary Public',
		},
		{
			OccupationLupID: 166,
			Occupation: 'Nun',
		},
		{
			OccupationLupID: 167,
			Occupation: 'Nurse',
		},
		{
			OccupationLupID: 168,
			Occupation: 'Optometrist',
		},
		{
			OccupationLupID: 169,
			Occupation: 'Packer',
		},
		{
			OccupationLupID: 170,
			Occupation: 'Painter',
		},
		{
			OccupationLupID: 171,
			Occupation: 'Paperhanger',
		},
		{
			OccupationLupID: 172,
			Occupation: 'Pharmacist',
		},
		{
			OccupationLupID: 173,
			Occupation: 'Photographer',
		},
		{
			OccupationLupID: 174,
			Occupation: 'Physician',
		},
		{
			OccupationLupID: 175,
			Occupation: 'Pilot',
		},
		{
			OccupationLupID: 176,
			Occupation: 'Plainsman',
		},
		{
			OccupationLupID: 177,
			Occupation: 'Plumber',
		},
		{
			OccupationLupID: 178,
			Occupation: 'Police',
		},
		{
			OccupationLupID: 179,
			Occupation: 'Politician',
		},
		{
			OccupationLupID: 180,
			Occupation: 'Porter',
		},
		{
			OccupationLupID: 181,
			Occupation: 'Post Office Clerk',
		},
		{
			OccupationLupID: 182,
			Occupation: 'Postmaster',
		},
		{
			OccupationLupID: 183,
			Occupation: 'Power Plant Operator',
		},
		{
			OccupationLupID: 184,
			Occupation: 'Priest',
		},
		{
			OccupationLupID: 185,
			Occupation: 'Printer',
		},
		{
			OccupationLupID: 186,
			Occupation: 'Project Manager',
		},
		{
			OccupationLupID: 187,
			Occupation: 'Proprietor',
		},
		{
			OccupationLupID: 188,
			Occupation: 'Prospector',
		},
		{
			OccupationLupID: 189,
			Occupation: 'Purser',
		},
		{
			OccupationLupID: 190,
			Occupation: 'Radio Technician',
		},
		{
			OccupationLupID: 191,
			Occupation: 'Railroad conductor',
		},
		{
			OccupationLupID: 192,
			Occupation: 'Railroad worker',
		},
		{
			OccupationLupID: 193,
			Occupation: 'Railroader',
		},
		{
			OccupationLupID: 194,
			Occupation: 'Rancher',
		},
		{
			OccupationLupID: 195,
			Occupation: 'Real Estate',
		},
		{
			OccupationLupID: 196,
			Occupation: 'Realtor',
		},
		{
			OccupationLupID: 197,
			Occupation: 'Refuse Collector',
		},
		{
			OccupationLupID: 198,
			Occupation: 'Representative',
		},
		{
			OccupationLupID: 199,
			Occupation: 'Restauranteur',
		},
		{
			OccupationLupID: 200,
			Occupation: 'River Pilot',
		},
		{
			OccupationLupID: 201,
			Occupation: 'Riverboat Captain',
		},
		{
			OccupationLupID: 202,
			Occupation: 'Riverboat cook',
		},
		{
			OccupationLupID: 203,
			Occupation: 'Riverboat crewman',
		},
		{
			OccupationLupID: 204,
			Occupation: 'Riverboat Engineer',
		},
		{
			OccupationLupID: 205,
			Occupation: 'Riverboat fireman',
		},
		{
			OccupationLupID: 206,
			Occupation: 'Riverboat Mate',
		},
		{
			OccupationLupID: 207,
			Occupation: 'Riverboat Steward',
		},
		{
			OccupationLupID: 208,
			Occupation: 'Riverboat waiter',
		},
		{
			OccupationLupID: 209,
			Occupation: 'Roadhouse Operator',
		},
		{
			OccupationLupID: 210,
			Occupation: 'Roadhouse Proprietor',
		},
		{
			OccupationLupID: 211,
			Occupation: 'Sailor',
		},
		{
			OccupationLupID: 212,
			Occupation: 'Salesman',
		},
		{
			OccupationLupID: 213,
			Occupation: 'Saloonkeeper',
		},
		{
			OccupationLupID: 214,
			Occupation: 'Sawmill operator',
		},
		{
			OccupationLupID: 215,
			Occupation: 'Sawmill Owner',
		},
		{
			OccupationLupID: 216,
			Occupation: 'Sawyer',
		},
		{
			OccupationLupID: 217,
			Occupation: 'Scout',
		},
		{
			OccupationLupID: 218,
			Occupation: 'Sea Captain',
		},
		{
			OccupationLupID: 219,
			Occupation: 'Seamstress',
		},
		{
			OccupationLupID: 220,
			Occupation: 'Servant',
		},
		{
			OccupationLupID: 221,
			Occupation: 'Sheep Farmer',
		},
		{
			OccupationLupID: 222,
			Occupation: 'Sheet metal worker',
		},
		{
			OccupationLupID: 223,
			Occupation: 'Sheriff of Yukon',
		},
		{
			OccupationLupID: 224,
			Occupation: 'Shipbuilder',
		},
		{
			OccupationLupID: 225,
			Occupation: 'Shoemaker',
		},
		{
			OccupationLupID: 226,
			Occupation: 'Sign painter',
		},
		{
			OccupationLupID: 227,
			Occupation: 'Sister Superior',
		},
		{
			OccupationLupID: 228,
			Occupation: 'Skating Rink Manager',
		},
		{
			OccupationLupID: 229,
			Occupation: 'Special Constable RCMP',
		},
		{
			OccupationLupID: 230,
			Occupation: 'Stable owner',
		},
		{
			OccupationLupID: 231,
			Occupation: 'Stableman',
		},
		{
			OccupationLupID: 232,
			Occupation: 'Stage driver',
		},
		{
			OccupationLupID: 233,
			Occupation: 'Stagecoach Driver',
		},
		{
			OccupationLupID: 234,
			Occupation: 'Steam engineer',
		},
		{
			OccupationLupID: 235,
			Occupation: 'Steamfitter',
		},
		{
			OccupationLupID: 236,
			Occupation: 'Stevedore',
		},
		{
			OccupationLupID: 237,
			Occupation: 'Steward',
		},
		{
			OccupationLupID: 238,
			Occupation: 'Stockbroker',
		},
		{
			OccupationLupID: 239,
			Occupation: 'Stone cutter',
		},
		{
			OccupationLupID: 240,
			Occupation: 'Store clerk',
		},
		{
			OccupationLupID: 241,
			Occupation: 'Store manager',
		},
		{
			OccupationLupID: 242,
			Occupation: 'Superintendent',
		},
		{
			OccupationLupID: 243,
			Occupation: 'Superintendent (Highway)',
		},
		{
			OccupationLupID: 244,
			Occupation: 'Superintendent (Mine)',
		},
		{
			OccupationLupID: 245,
			Occupation: 'Surgeon',
		},
		{
			OccupationLupID: 246,
			Occupation: 'Surveyor',
		},
		{
			OccupationLupID: 247,
			Occupation: 'Tailor',
		},
		{
			OccupationLupID: 248,
			Occupation: 'Taxi Driver',
		},
		{
			OccupationLupID: 249,
			Occupation: 'Taxi Owner/Operator',
		},
		{
			OccupationLupID: 250,
			Occupation: 'Teacher',
		},
		{
			OccupationLupID: 251,
			Occupation: 'Teamster',
		},
		{
			OccupationLupID: 252,
			Occupation: 'Telegraph lineman',
		},
		{
			OccupationLupID: 253,
			Occupation: 'Telegraph operator',
		},
		{
			OccupationLupID: 254,
			Occupation: 'Telegrapher',
		},
		{
			OccupationLupID: 255,
			Occupation: 'Telephone operator',
		},
		{
			OccupationLupID: 256,
			Occupation: 'Tinsmith',
		},
		{
			OccupationLupID: 257,
			Occupation: 'Trader',
		},
		{
			OccupationLupID: 258,
			Occupation: 'Trading post operator',
		},
		{
			OccupationLupID: 259,
			Occupation: 'Transportation entrepreneur',
		},
		{
			OccupationLupID: 260,
			Occupation: 'Trapper',
		},
		{
			OccupationLupID: 261,
			Occupation: 'Truck driver',
		},
		{
			OccupationLupID: 262,
			Occupation: 'Undertaker',
		},
		{
			OccupationLupID: 263,
			Occupation: 'Upholsterer',
		},
		{
			OccupationLupID: 264,
			Occupation: 'Waiter',
		},
		{
			OccupationLupID: 265,
			Occupation: 'Waitress',
		},
		{
			OccupationLupID: 266,
			Occupation: 'Warehouseman',
		},
		{
			OccupationLupID: 267,
			Occupation: 'Watchman',
		},
		{
			OccupationLupID: 268,
			Occupation: 'Welder',
		},
		{
			OccupationLupID: 269,
			Occupation: 'Wood contractor',
		},
		{
			OccupationLupID: 270,
			Occupation: 'Wood dealer',
		},
		{
			OccupationLupID: 271,
			Occupation: 'Woodcutter',
		},
		{
			OccupationLupID: 272,
			Occupation: 'Wooddealer',
		},
		{
			OccupationLupID: 273,
			Occupation: 'Woodhauler',
		},
		{
			OccupationLupID: 274,
			Occupation: 'Woodsman',
		},
		{
			OccupationLupID: 275,
			Occupation: 'Writer',
		},
		{
			OccupationLupID: 276,
			Occupation: 'X-ray technician',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.OccupationLookup');
};
