// -- BEGIN TABLE Burial.CauseLookup
// IF OBJECT_ID('Burial.CauseLookup', 'U') IS NOT NULL
// DROP TABLE Burial.CauseLookup;
// GO

// CREATE TABLE Burial.CauseLookup (
// 	CauseLUpID smallint NOT NULL IDENTITY(1,1),
// 	Cause varchar(30) NOT NULL
// );
// GO

// ALTER TABLE Burial.CauseLookup ADD CONSTRAINT PK__CauseLoo__871D0D286D921B4B PRIMARY KEY (CauseLUpID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('Burial.CauseLookup', (table) => {
		table.increments('CauseLUpID').primary();
		table.string('Cause', 30).notNullable();
	});

	await knex('Burial.CauseLookup').delete().whereRaw('1=1');
	await knex('Burial.CauseLookup').insert([
		{
			CauseLUpID: 1,
			Cause: 'Abcess',
		},
		{
			CauseLUpID: 2,
			Cause: 'Airplane crash',
		},
		{
			CauseLUpID: 3,
			Cause: 'Alcohol poisoning',
		},
		{
			CauseLUpID: 4,
			Cause: 'Alcoholism',
		},
		{
			CauseLUpID: 5,
			Cause: "Alzheimer's",
		},
		{
			CauseLUpID: 6,
			Cause: 'Anemia',
		},
		{
			CauseLUpID: 7,
			Cause: 'Aneurism',
		},
		{
			CauseLUpID: 8,
			Cause: 'Appendicitis',
		},
		{
			CauseLUpID: 9,
			Cause: 'Arterial Sclerosis',
		},
		{
			CauseLUpID: 10,
			Cause: 'Asphyxiation',
		},
		{
			CauseLUpID: 11,
			Cause: 'Asthenia',
		},
		{
			CauseLUpID: 12,
			Cause: 'Asthma',
		},
		{
			CauseLUpID: 13,
			Cause: 'Ataxia',
		},
		{
			CauseLUpID: 14,
			Cause: 'Auto accident',
		},
		{
			CauseLUpID: 15,
			Cause: 'Bear attack',
		},
		{
			CauseLUpID: 16,
			Cause: 'Bladder infection',
		},
		{
			CauseLUpID: 17,
			Cause: 'Blood poisoning',
		},
		{
			CauseLUpID: 18,
			Cause: 'Blow to head',
		},
		{
			CauseLUpID: 19,
			Cause: 'Bludgeoned',
		},
		{
			CauseLUpID: 20,
			Cause: 'Broken neck',
		},
		{
			CauseLUpID: 21,
			Cause: 'Bronchial infection',
		},
		{
			CauseLUpID: 22,
			Cause: 'Bronchitis',
		},
		{
			CauseLUpID: 23,
			Cause: 'Burns',
		},
		{
			CauseLUpID: 24,
			Cause: 'Cancer',
		},
		{
			CauseLUpID: 25,
			Cause: 'Cave-in',
		},
		{
			CauseLUpID: 26,
			Cause: 'Childbirth',
		},
		{
			CauseLUpID: 27,
			Cause: 'Cholera',
		},
		{
			CauseLUpID: 28,
			Cause: 'Cirrhosis',
		},
		{
			CauseLUpID: 29,
			Cause: 'Colitis',
		},
		{
			CauseLUpID: 30,
			Cause: 'Constipation',
		},
		{
			CauseLUpID: 31,
			Cause: 'Convulsions',
		},
		{
			CauseLUpID: 32,
			Cause: 'Croup',
		},
		{
			CauseLUpID: 33,
			Cause: 'Crushed',
		},
		{
			CauseLUpID: 34,
			Cause: 'Cut throat',
		},
		{
			CauseLUpID: 35,
			Cause: 'Cystitis',
		},
		{
			CauseLUpID: 36,
			Cause: 'Debility',
		},
		{
			CauseLUpID: 37,
			Cause: 'Diabetes',
		},
		{
			CauseLUpID: 38,
			Cause: 'Diphtheria',
		},
		{
			CauseLUpID: 39,
			Cause: 'Dropsy',
		},
		{
			CauseLUpID: 40,
			Cause: 'Drowning',
		},
		{
			CauseLUpID: 41,
			Cause: 'Drug overdose',
		},
		{
			CauseLUpID: 42,
			Cause: 'Dysentery',
		},
		{
			CauseLUpID: 43,
			Cause: 'Edema',
		},
		{
			CauseLUpID: 44,
			Cause: 'Electrocuted',
		},
		{
			CauseLUpID: 45,
			Cause: 'Embolism',
		},
		{
			CauseLUpID: 46,
			Cause: 'Encephalitis',
		},
		{
			CauseLUpID: 47,
			Cause: 'Enteritis',
		},
		{
			CauseLUpID: 48,
			Cause: 'Epilepsy',
		},
		{
			CauseLUpID: 49,
			Cause: 'Erysipelas',
		},
		{
			CauseLUpID: 50,
			Cause: 'Exhaustion',
		},
		{
			CauseLUpID: 51,
			Cause: 'Explosion',
		},
		{
			CauseLUpID: 52,
			Cause: 'Exposure',
		},
		{
			CauseLUpID: 53,
			Cause: 'Fall',
		},
		{
			CauseLUpID: 54,
			Cause: 'Falling bucket',
		},
		{
			CauseLUpID: 55,
			Cause: 'Falling tree',
		},
		{
			CauseLUpID: 56,
			Cause: 'Falling wood',
		},
		{
			CauseLUpID: 57,
			Cause: 'Gall bladder',
		},
		{
			CauseLUpID: 58,
			Cause: 'Gastritis',
		},
		{
			CauseLUpID: 59,
			Cause: 'Grippe',
		},
		{
			CauseLUpID: 60,
			Cause: 'Gunshot',
		},
		{
			CauseLUpID: 61,
			Cause: 'Hanging',
		},
		{
			CauseLUpID: 62,
			Cause: 'Heart',
		},
		{
			CauseLUpID: 63,
			Cause: 'Heart and Kidney',
		},
		{
			CauseLUpID: 64,
			Cause: 'Hemorrhage',
		},
		{
			CauseLUpID: 65,
			Cause: 'Hernia',
		},
		{
			CauseLUpID: 66,
			Cause: 'Hydrophobia',
		},
		{
			CauseLUpID: 67,
			Cause: 'Infection',
		},
		{
			CauseLUpID: 68,
			Cause: 'Inflammation of bowels',
		},
		{
			CauseLUpID: 69,
			Cause: 'Influenza',
		},
		{
			CauseLUpID: 70,
			Cause: 'Intestinal disease',
		},
		{
			CauseLUpID: 71,
			Cause: 'Intestinal obstruction',
		},
		{
			CauseLUpID: 72,
			Cause: 'Jaundice',
		},
		{
			CauseLUpID: 73,
			Cause: 'Kidney',
		},
		{
			CauseLUpID: 74,
			Cause: 'Landslide',
		},
		{
			CauseLUpID: 75,
			Cause: 'Lead poisoning',
		},
		{
			CauseLUpID: 76,
			Cause: 'Leukemia',
		},
		{
			CauseLUpID: 77,
			Cause: 'Liver',
		},
		{
			CauseLUpID: 78,
			Cause: 'Lockjaw',
		},
		{
			CauseLUpID: 79,
			Cause: 'Lost',
		},
		{
			CauseLUpID: 80,
			Cause: 'Lung trouble',
		},
		{
			CauseLUpID: 81,
			Cause: 'Malnutrition',
		},
		{
			CauseLUpID: 82,
			Cause: 'Meningitis',
		},
		{
			CauseLUpID: 83,
			Cause: 'Morphine poisoning',
		},
		{
			CauseLUpID: 84,
			Cause: 'Murdered',
		},
		{
			CauseLUpID: 85,
			Cause: 'Neuritis',
		},
		{
			CauseLUpID: 86,
			Cause: 'Nutrition',
		},
		{
			CauseLUpID: 87,
			Cause: 'Opium poisoning',
		},
		{
			CauseLUpID: 88,
			Cause: 'Other',
		},
		{
			CauseLUpID: 89,
			Cause: 'Paralysis',
		},
		{
			CauseLUpID: 90,
			Cause: 'Pericarditis',
		},
		{
			CauseLUpID: 91,
			Cause: 'Peritonitis',
		},
		{
			CauseLUpID: 92,
			Cause: 'Phthisis',
		},
		{
			CauseLUpID: 93,
			Cause: 'Pleurisy',
		},
		{
			CauseLUpID: 94,
			Cause: 'Pneumonia',
		},
		{
			CauseLUpID: 95,
			Cause: 'Poisoning',
		},
		{
			CauseLUpID: 96,
			Cause: 'Premature birth',
		},
		{
			CauseLUpID: 97,
			Cause: 'Ptomaine poisoning',
		},
		{
			CauseLUpID: 98,
			Cause: 'Rheumatic fever',
		},
		{
			CauseLUpID: 99,
			Cause: 'Rheumatism',
		},
		{
			CauseLUpID: 100,
			Cause: 'Rheumatism and Scurvy',
		},
		{
			CauseLUpID: 101,
			Cause: 'Rheumotoid Arthritis',
		},
		{
			CauseLUpID: 102,
			Cause: 'Scalding',
		},
		{
			CauseLUpID: 103,
			Cause: 'Scarlet fever',
		},
		{
			CauseLUpID: 104,
			Cause: 'Sciatica',
		},
		{
			CauseLUpID: 105,
			Cause: 'Scurvy',
		},
		{
			CauseLUpID: 106,
			Cause: 'Senility',
		},
		{
			CauseLUpID: 107,
			Cause: 'Septicimia',
		},
		{
			CauseLUpID: 108,
			Cause: 'Shock',
		},
		{
			CauseLUpID: 109,
			Cause: 'Skin disease',
		},
		{
			CauseLUpID: 110,
			Cause: 'Snow avalanche',
		},
		{
			CauseLUpID: 111,
			Cause: 'Spinal injury',
		},
		{
			CauseLUpID: 112,
			Cause: 'Starvation',
		},
		{
			CauseLUpID: 113,
			Cause: 'Stillborn',
		},
		{
			CauseLUpID: 114,
			Cause: 'Strangulation',
		},
		{
			CauseLUpID: 115,
			Cause: 'Streptococcus infection',
		},
		{
			CauseLUpID: 116,
			Cause: 'Stroke',
		},
		{
			CauseLUpID: 117,
			Cause: 'Suffocation',
		},
		{
			CauseLUpID: 118,
			Cause: 'Syphillis',
		},
		{
			CauseLUpID: 119,
			Cause: 'Tuberculosis',
		},
		{
			CauseLUpID: 120,
			Cause: 'Tumor',
		},
		{
			CauseLUpID: 121,
			Cause: 'Typhoid',
		},
		{
			CauseLUpID: 122,
			Cause: 'Ulcer',
		},
		{
			CauseLUpID: 123,
			Cause: 'Uremia',
		},
		{
			CauseLUpID: 124,
			Cause: 'Whooping cough',
		},
		{
			CauseLUpID: 125,
			Cause: 'Worms',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.CauseLookup');
};
