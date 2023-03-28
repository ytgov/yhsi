// -- BEGIN TABLE Burial.Membership
// IF OBJECT_ID('Burial.Membership', 'U') IS NOT NULL
// DROP TABLE Burial.Membership;
// GO

// CREATE TABLE Burial.Membership (
// 	ID smallint NOT NULL IDENTITY(1,1),
// 	BurialID smallint NOT NULL,
// 	MembershipID smallint NOT NULL,
// 	Chapter varchar(100) NULL,
// 	Notes varchar(255) NULL
// );
// GO

// ALTER TABLE Burial.Membership ADD CONSTRAINT PK__Membersh__3214EC27FA61DFAB PRIMARY KEY (ID);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	knex.raw(`CREATE TABLE Burial.Membership (
    	ID smallint NOT NULL IDENTITY(1,1),
      BurialID smallint NOT NULL,
      MembershipID smallint NOT NULL,
      Chapter varchar(100) NULL,
      Notes varchar(255) NULL
    );
    ALTER TABLE Burial.Membership ADD CONSTRAINT PK__Membersh__3214EC27FA61DFAB PRIMARY KEY (ID);
    `);
};
exports.down = async function (knex: Knex, Promise: any) {
	knex.raw(`DROP TABLE Burial.Membership;`);
};
