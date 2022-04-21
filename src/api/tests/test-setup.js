const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const td = require('testdouble');
const testdoubleChai = require('testdouble-chai');
const { faker } = require('@faker-js/faker');

chai.use(chaiAsPromised);
chai.use(testdoubleChai(td));

global.expect = chai.expect;
global.td = td;
global.faker = faker;
