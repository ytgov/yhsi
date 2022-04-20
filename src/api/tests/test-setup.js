const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const td = require('testdouble');
const testdoubleChai = require('testdouble-chai');

chai.use(chaiAsPromised);
chai.use(testdoubleChai(td));

global.expect = chai.expect;
global.td = td;
