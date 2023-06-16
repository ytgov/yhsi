import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Burial.MembershipLookup', (table) => {
		table.increments('MembershipLUpID').primary();
		table.string('Membership', 100).notNullable();
	});

	await knex('Burial.MembershipLookup').delete().whereRaw('1=1');
	await knex('Burial.MembershipLookup').insert([
		{
			Membership: '8th Avenue Trappers Association',
		},
		{
			Membership: 'Ancient Free and Accepted Masons (A.F. & A.M.)',
		},
		{
			Membership: 'Ancient Order of United  Workman (A.O.U.W.)',
		},
		{
			Membership: 'American Legion',
		},
		{
			Membership: "American Women's Club, Dawson",
		},
		{
			Membership: 'Ancient Order of Foresters',
		},
		{
			Membership: 'Arctic Brotherhood',
		},
		{
			Membership: 'Atlin Liberal Club',
		},
		{
			Membership: 'Benevolent Paternal Order of Elks',
		},
		{
			Membership: 'Blue Nose Club',
		},
		{
			Membership: 'Board of McDonald Lodge',
		},
		{
			Membership: 'Board of Whitehorse General Hospital',
		},
		{
			Membership: 'Boy Scout Council',
		},
		{
			Membership: 'Bridge Club',
		},
		{
			Membership: 'British Empire Club',
		},
		{
			Membership: 'British Empire Service League',
		},
		{
			Membership: "Butcher's Union",
		},
		{
			Membership: 'Canadian Legion',
		},
		{
			Membership: 'Canadian Rangers',
		},
		{
			Membership: 'Canadian Red Cross',
		},
		{
			Membership: 'Canadian Woodmen of the World',
		},
		{
			Membership: "Carpenters' Union",
		},
		{
			Membership: 'Catholic Society',
		},
		{
			Membership: "Catholic Women's Club",
		},
		{
			Membership: 'Chamber of Mines',
		},
		{
			Membership: "Choir, St. Paul's Anglican Church",
		},
		{
			Membership: 'City Council',
		},
		{
			Membership: 'Company "K" 8th Massachusetts Regiment',
		},
		{
			Membership: 'Dawson Amateur Athletic Association',
		},
		{
			Membership: 'Dawson City Council',
		},
		{
			Membership: 'Dawson City Library Board',
		},
		{
			Membership: 'Dawson City Volunteer Fire Department',
		},
		{
			Membership: 'Dawson Community Christmas Tree Association',
		},
		{
			Membership: 'Dawson Conservative Association',
		},
		{
			Membership: 'Dawson Curling Club',
		},
		{
			Membership: 'Dawson Fire Brigade',
		},
		{
			Membership: 'Dawson Fire Department',
		},
		{
			Membership: 'Dawson Miners Union',
		},
		{
			Membership: 'Anglican Church',
		},
		{
			Membership: 'Degree of Honor',
		},
		{
			Membership: 'Eastern Star',
		},
		{
			Membership: 'Engineers Union',
		},
		{
			Membership: 'Fellow Royal Geographical Society',
		},
		{
			Membership: 'Fraternal Order of Eagles',
		},
		{
			Membership: "Great War Veterans' Association (G.W.V.A.)",
		},
		{
			Membership: 'Grand Army of the Republic',
		},
		{
			Membership: 'Hibernians',
		},
		{
			Membership: 'Imperial Order Daughters of the Empire',
		},
		{
			Membership: 'Independent Order of Odd Fellows',
		},
		{
			Membership: "International Printing Pressman's Union",
		},
		{
			Membership: 'Kiwanis Club',
		},
		{
			Membership: 'Klondike Lodge',
		},
		{
			Membership: 'Klondike Visitors Association',
		},
		{
			Membership: 'Knights of Columbus',
		},
		{
			Membership: 'Knights of Pythias',
		},
		{
			Membership: 'Knights Templar',
		},
		{
			Membership: 'Ladies Aid, Dawson Methodist Church',
		},
		{
			Membership: 'Loyal Order of Moose',
		},
		{
			Membership: 'Mason',
		},
		{
			Membership: 'McBride Museum, Whitehorse',
		},
		{
			Membership: "Miners' Union",
		},
		{
			Membership: 'Modern Woodmen of America',
		},
		{
			Membership: 'Northern Tutchone',
		},
		{
			Membership: 'Nutty Club',
		},
		{
			Membership: 'Order of Redmen',
		},
		{
			Membership: 'Pioneer Women of Yukon',
		},
		{
			Membership: 'Printing fraternity in Dawson',
		},
		{
			Membership: 'Ranier Council No. 6, Royal Arcomm (?)',
		},
		{
			Membership: 'Rebekah',
		},
		{
			Membership: 'Royal Arch Masons of Canada',
		},
		{
			Membership: 'Royal College of Surgery',
		},
		{
			Membership: 'Sheet Metal Workers Union',
		},
		{
			Membership: 'Shriner',
		},
		{
			Membership: 'St. Andrews Presbyterian Church',
		},
		{
			Membership: "St. Paul's Auxiliary",
		},
		{
			Membership: "St. Paul's Women's Auxiliary",
		},
		{
			Membership: "Tr'ondek Hwech'in",
		},
		{
			Membership: 'U.S. Civil War veteran',
		},
		{
			Membership: 'Vancouver Yukon Association',
		},
		{
			Membership: "Vancouver Yukon Sourdoughs' Association",
		},
		{
			Membership: 'War Finance Committee',
		},
		{
			Membership: "Women's Auxiliary Yukon Order of Pioneers",
		},
		{
			Membership: "Women's Auxiliary, St. Paul's Anglican Church",
		},
		{
			Membership: "Women's Christian Temperance Union",
		},
		{
			Membership: 'Woodmen of the World',
		},
		{
			Membership: 'Yukon Council',
		},
		{
			Membership: 'Yukon Development League',
		},
		{
			Membership: 'Yukon Liberal Association',
		},
		{
			Membership: 'Yukon Order of Pioneers',
		},
		{
			Membership: 'Yukon Rifle Association',
		},
		{
			Membership: 'Yukon Territorial Liberal Association',
		},
		{
			Membership: 'Zero Club',
		},
	]);
};

exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.MembershipLookup');
};
