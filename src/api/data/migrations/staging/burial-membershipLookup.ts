import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Security.SiteAccessType', (table) => {
		table.integer('MembershipLUpID').notNullable();
		table.string('Membership', 100).notNullable();
	});

	await knex('Burial.MembershipLookup').delete().whereRaw('1=1');
	await knex('Burial.MembershipLookup').insert([
		{
			MembershipLUpID: 1,
			Membership: '8th Avenue Trappers Association',
		},
		{
			MembershipLUpID: 2,
			Membership: 'Ancient Free and Accepted Masons (A.F. & A.M.)',
		},
		{
			MembershipLUpID: 3,
			Membership: 'Ancient Order of United  Workman (A.O.U.W.)',
		},
		{
			MembershipLUpID: 4,
			Membership: 'American Legion',
		},
		{
			MembershipLUpID: 5,
			Membership: "American Women's Club, Dawson",
		},
		{
			MembershipLUpID: 6,
			Membership: 'Ancient Order of Foresters',
		},
		{
			MembershipLUpID: 7,
			Membership: 'Arctic Brotherhood',
		},
		{
			MembershipLUpID: 8,
			Membership: 'Atlin Liberal Club',
		},
		{
			MembershipLUpID: 9,
			Membership: 'Benevolent Paternal Order of Elks',
		},
		{
			MembershipLUpID: 10,
			Membership: 'Blue Nose Club',
		},
		{
			MembershipLUpID: 11,
			Membership: 'Board of McDonald Lodge',
		},
		{
			MembershipLUpID: 12,
			Membership: 'Board of Whitehorse General Hospital',
		},
		{
			MembershipLUpID: 13,
			Membership: 'Boy Scout Council',
		},
		{
			MembershipLUpID: 14,
			Membership: 'Bridge Club',
		},
		{
			MembershipLUpID: 15,
			Membership: 'British Empire Club',
		},
		{
			MembershipLUpID: 16,
			Membership: 'British Empire Service League',
		},
		{
			MembershipLUpID: 17,
			Membership: "Butcher's Union",
		},
		{
			MembershipLUpID: 18,
			Membership: 'Canadian Legion',
		},
		{
			MembershipLUpID: 19,
			Membership: 'Canadian Rangers',
		},
		{
			MembershipLUpID: 20,
			Membership: 'Canadian Red Cross',
		},
		{
			MembershipLUpID: 21,
			Membership: 'Canadian Woodmen of the World',
		},
		{
			MembershipLUpID: 22,
			Membership: "Carpenters' Union",
		},
		{
			MembershipLUpID: 23,
			Membership: 'Catholic Society',
		},
		{
			MembershipLUpID: 24,
			Membership: "Catholic Women's Club",
		},
		{
			MembershipLUpID: 25,
			Membership: 'Chamber of Mines',
		},
		{
			MembershipLUpID: 26,
			Membership: "Choir, St. Paul's Anglican Church",
		},
		{
			MembershipLUpID: 27,
			Membership: 'City Council',
		},
		{
			MembershipLUpID: 28,
			Membership: 'Company "K" 8th Massachusetts Regiment',
		},
		{
			MembershipLUpID: 29,
			Membership: 'Dawson Amateur Athletic Association',
		},
		{
			MembershipLUpID: 30,
			Membership: 'Dawson City Council',
		},
		{
			MembershipLUpID: 31,
			Membership: 'Dawson City Library Board',
		},
		{
			MembershipLUpID: 32,
			Membership: 'Dawson City Volunteer Fire Department',
		},
		{
			MembershipLUpID: 33,
			Membership: 'Dawson Community Christmas Tree Association',
		},
		{
			MembershipLUpID: 34,
			Membership: 'Dawson Conservative Association',
		},
		{
			MembershipLUpID: 35,
			Membership: 'Dawson Curling Club',
		},
		{
			MembershipLUpID: 36,
			Membership: 'Dawson Fire Brigade',
		},
		{
			MembershipLUpID: 37,
			Membership: 'Dawson Fire Department',
		},
		{
			MembershipLUpID: 38,
			Membership: 'Dawson Miners Union',
		},
		{
			MembershipLUpID: 39,
			Membership: 'Anglican Church',
		},
		{
			MembershipLUpID: 40,
			Membership: 'Degree of Honor',
		},
		{
			MembershipLUpID: 41,
			Membership: 'Eastern Star',
		},
		{
			MembershipLUpID: 42,
			Membership: 'Engineers Union',
		},
		{
			MembershipLUpID: 43,
			Membership: 'Fellow Royal Geographical Society',
		},
		{
			MembershipLUpID: 44,
			Membership: 'Fraternal Order of Eagles',
		},
		{
			MembershipLUpID: 45,
			Membership: "Great War Veterans' Association (G.W.V.A.)",
		},
		{
			MembershipLUpID: 46,
			Membership: 'Grand Army of the Republic',
		},
		{
			MembershipLUpID: 47,
			Membership: 'Hibernians',
		},
		{
			MembershipLUpID: 48,
			Membership: 'Imperial Order Daughters of the Empire',
		},
		{
			MembershipLUpID: 49,
			Membership: 'Independent Order of Odd Fellows',
		},
		{
			MembershipLUpID: 50,
			Membership: "International Printing Pressman's Union",
		},
		{
			MembershipLUpID: 51,
			Membership: 'Kiwanis Club',
		},
		{
			MembershipLUpID: 52,
			Membership: 'Klondike Lodge',
		},
		{
			MembershipLUpID: 53,
			Membership: 'Klondike Visitors Association',
		},
		{
			MembershipLUpID: 54,
			Membership: 'Knights of Columbus',
		},
		{
			MembershipLUpID: 55,
			Membership: 'Knights of Pythias',
		},
		{
			MembershipLUpID: 56,
			Membership: 'Knights Templar',
		},
		{
			MembershipLUpID: 57,
			Membership: 'Ladies Aid, Dawson Methodist Church',
		},
		{
			MembershipLUpID: 58,
			Membership: 'Loyal Order of Moose',
		},
		{
			MembershipLUpID: 59,
			Membership: 'Mason',
		},
		{
			MembershipLUpID: 60,
			Membership: 'McBride Museum, Whitehorse',
		},
		{
			MembershipLUpID: 61,
			Membership: "Miners' Union",
		},
		{
			MembershipLUpID: 62,
			Membership: 'Modern Woodmen of America',
		},
		{
			MembershipLUpID: 63,
			Membership: 'Northern Tutchone',
		},
		{
			MembershipLUpID: 64,
			Membership: 'Nutty Club',
		},
		{
			MembershipLUpID: 65,
			Membership: 'Order of Redmen',
		},
		{
			MembershipLUpID: 66,
			Membership: 'Pioneer Women of Yukon',
		},
		{
			MembershipLUpID: 67,
			Membership: 'Printing fraternity in Dawson',
		},
		{
			MembershipLUpID: 68,
			Membership: 'Ranier Council No. 6, Royal Arcomm (?)',
		},
		{
			MembershipLUpID: 69,
			Membership: 'Rebekah',
		},
		{
			MembershipLUpID: 70,
			Membership: 'Royal Arch Masons of Canada',
		},
		{
			MembershipLUpID: 71,
			Membership: 'Royal College of Surgery',
		},
		{
			MembershipLUpID: 72,
			Membership: 'Sheet Metal Workers Union',
		},
		{
			MembershipLUpID: 73,
			Membership: 'Shriner',
		},
		{
			MembershipLUpID: 74,
			Membership: 'St. Andrews Presbyterian Church',
		},
		{
			MembershipLUpID: 75,
			Membership: "St. Paul's Auxiliary",
		},
		{
			MembershipLUpID: 76,
			Membership: "St. Paul's Women's Auxiliary",
		},
		{
			MembershipLUpID: 77,
			Membership: "Tr'ondek Hwech'in",
		},
		{
			MembershipLUpID: 78,
			Membership: 'U.S. Civil War veteran',
		},
		{
			MembershipLUpID: 79,
			Membership: 'Vancouver Yukon Association',
		},
		{
			MembershipLUpID: 80,
			Membership: "Vancouver Yukon Sourdoughs' Association",
		},
		{
			MembershipLUpID: 81,
			Membership: 'War Finance Committee',
		},
		{
			MembershipLUpID: 82,
			Membership: "Women's Auxiliary Yukon Order of Pioneers",
		},
		{
			MembershipLUpID: 83,
			Membership: "Women's Auxiliary, St. Paul's Anglican Church",
		},
		{
			MembershipLUpID: 84,
			Membership: "Women's Christian Temperance Union",
		},
		{
			MembershipLUpID: 85,
			Membership: 'Woodmen of the World',
		},
		{
			MembershipLUpID: 86,
			Membership: 'Yukon Council',
		},
		{
			MembershipLUpID: 87,
			Membership: 'Yukon Development League',
		},
		{
			MembershipLUpID: 88,
			Membership: 'Yukon Liberal Association',
		},
		{
			MembershipLUpID: 89,
			Membership: 'Yukon Order of Pioneers',
		},
		{
			MembershipLUpID: 90,
			Membership: 'Yukon Rifle Association',
		},
		{
			MembershipLUpID: 91,
			Membership: 'Yukon Territorial Liberal Association',
		},
		{
			MembershipLUpID: 92,
			Membership: 'Zero Club',
		},
	]);
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.MembershipLookup');
};
