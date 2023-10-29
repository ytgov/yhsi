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
			Cause: 'Abcess',
		},
		{
			Cause: 'Airplane crash',
		},
		{
			Cause: 'Alcohol poisoning',
		},
		{
			Cause: 'Alcoholism',
		},
		{
			Cause: "Alzheimer's",
		},
		{
			Cause: 'Anemia',
		},
		{
			Cause: 'Aneurism',
		},
		{
			Cause: 'Appendicitis',
		},
		{
			Cause: 'Arterial Sclerosis',
		},
		{
			Cause: 'Asphyxiation',
		},
		{
			Cause: 'Asthenia',
		},
		{
			Cause: 'Asthma',
		},
		{
			Cause: 'Ataxia',
		},
		{
			Cause: 'Auto accident',
		},
		{
			Cause: 'Bear attack',
		},
		{
			Cause: 'Bladder infection',
		},
		{
			Cause: 'Blood poisoning',
		},
		{
			Cause: 'Blow to head',
		},
		{
			Cause: 'Bludgeoned',
		},
		{
			Cause: 'Broken neck',
		},
		{
			Cause: 'Bronchial infection',
		},
		{
			Cause: 'Bronchitis',
		},
		{
			Cause: 'Burns',
		},
		{
			Cause: 'Cancer',
		},
		{
			Cause: 'Cave-in',
		},
		{
			Cause: 'Childbirth',
		},
		{
			Cause: 'Cholera',
		},
		{
			Cause: 'Cirrhosis',
		},
		{
			Cause: 'Colitis',
		},
		{
			Cause: 'Constipation',
		},
		{
			Cause: 'Convulsions',
		},
		{
			Cause: 'Croup',
		},
		{
			Cause: 'Crushed',
		},
		{
			Cause: 'Cut throat',
		},
		{
			Cause: 'Cystitis',
		},
		{
			Cause: 'Debility',
		},
		{
			Cause: 'Diabetes',
		},
		{
			Cause: 'Diphtheria',
		},
		{
			Cause: 'Dropsy',
		},
		{
			Cause: 'Drowning',
		},
		{
			Cause: 'Drug overdose',
		},
		{
			Cause: 'Dysentery',
		},
		{
			Cause: 'Edema',
		},
		{
			Cause: 'Electrocuted',
		},
		{
			Cause: 'Embolism',
		},
		{
			Cause: 'Encephalitis',
		},
		{
			Cause: 'Enteritis',
		},
		{
			Cause: 'Epilepsy',
		},
		{
			Cause: 'Erysipelas',
		},
		{
			Cause: 'Exhaustion',
		},
		{
			Cause: 'Explosion',
		},
		{
			Cause: 'Exposure',
		},
		{
			Cause: 'Fall',
		},
		{
			Cause: 'Falling bucket',
		},
		{
			Cause: 'Falling tree',
		},
		{
			Cause: 'Falling wood',
		},
		{
			Cause: 'Gall bladder',
		},
		{
			Cause: 'Gastritis',
		},
		{
			Cause: 'Grippe',
		},
		{
			Cause: 'Gunshot',
		},
		{
			Cause: 'Hanging',
		},
		{
			Cause: 'Heart',
		},
		{
			Cause: 'Heart and Kidney',
		},
		{
			Cause: 'Hemorrhage',
		},
		{
			Cause: 'Hernia',
		},
		{
			Cause: 'Hydrophobia',
		},
		{
			Cause: 'Infection',
		},
		{
			Cause: 'Inflammation of bowels',
		},
		{
			Cause: 'Influenza',
		},
		{
			Cause: 'Intestinal disease',
		},
		{
			Cause: 'Intestinal obstruction',
		},
		{
			Cause: 'Jaundice',
		},
		{
			Cause: 'Kidney',
		},
		{
			Cause: 'Landslide',
		},
		{
			Cause: 'Lead poisoning',
		},
		{
			Cause: 'Leukemia',
		},
		{
			Cause: 'Liver',
		},
		{
			Cause: 'Lockjaw',
		},
		{
			Cause: 'Lost',
		},
		{
			Cause: 'Lung trouble',
		},
		{
			Cause: 'Malnutrition',
		},
		{
			Cause: 'Meningitis',
		},
		{
			Cause: 'Morphine poisoning',
		},
		{
			Cause: 'Murdered',
		},
		{
			Cause: 'Neuritis',
		},
		{
			Cause: 'Nutrition',
		},
		{
			Cause: 'Opium poisoning',
		},
		{
			Cause: 'Other',
		},
		{
			Cause: 'Paralysis',
		},
		{
			Cause: 'Pericarditis',
		},
		{
			Cause: 'Peritonitis',
		},
		{
			Cause: 'Phthisis',
		},
		{
			Cause: 'Pleurisy',
		},
		{
			Cause: 'Pneumonia',
		},
		{
			Cause: 'Poisoning',
		},
		{
			Cause: 'Premature birth',
		},
		{
			Cause: 'Ptomaine poisoning',
		},
		{
			Cause: 'Rheumatic fever',
		},
		{
			Cause: 'Rheumatism',
		},
		{
			Cause: 'Rheumatism and Scurvy',
		},
		{
			Cause: 'Rheumotoid Arthritis',
		},
		{
			Cause: 'Scalding',
		},
		{
			Cause: 'Scarlet fever',
		},
		{
			Cause: 'Sciatica',
		},
		{
			Cause: 'Scurvy',
		},
		{
			Cause: 'Senility',
		},
		{
			Cause: 'Septicimia',
		},
		{
			Cause: 'Shock',
		},
		{
			Cause: 'Skin disease',
		},
		{
			Cause: 'Snow avalanche',
		},
		{
			Cause: 'Spinal injury',
		},
		{
			Cause: 'Starvation',
		},
		{
			Cause: 'Stillborn',
		},
		{
			Cause: 'Strangulation',
		},
		{
			Cause: 'Streptococcus infection',
		},
		{
			Cause: 'Stroke',
		},
		{
			Cause: 'Suffocation',
		},
		{
			Cause: 'Syphillis',
		},
		{
			Cause: 'Tuberculosis',
		},
		{
			Cause: 'Tumor',
		},
		{
			Cause: 'Typhoid',
		},
		{
			Cause: 'Ulcer',
		},
		{
			Cause: 'Uremia',
		},
		{
			Cause: 'Whooping cough',
		},
		{
			Cause: 'Worms',
		},
	]);
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('Burial.CauseLookup');
};
