'use strict';

const readPkgUp = require('read-pkg-up');
const semver = require('semver');

module.exports = function (desired, pkg) {
  const actual = semver.clean(process.version);
  pkg = pkg || readPkgUp.sync();
  const engine = pkg.engines && pkg.engines.node;
  desired = desired || engine || actual;
  // Run time validation of engine version
  if (!semver.satisfies(actual, desired)) {
    const msg = `${pkg.name} requires node version ${desired}, but running ${actual}. Aborting.`;
    throw new Error(msg);
  }
  return actual;
};
