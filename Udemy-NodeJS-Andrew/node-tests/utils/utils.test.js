const utils = require('./utils');
const assert = require('assert');

it('Should add two numbers', () => {
  const res = utils.add(3, 2);
});

it('Should square a number', () => {
  assert.equal(utils.square(2), 4);
});
