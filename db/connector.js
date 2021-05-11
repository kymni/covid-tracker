const knex = require('knex');
const knexfile = require('./knexfile');

const knexConfigured = knex(knexfile);

const migrate = () => knexConfigured.migrate.latest(knexfile.migrations);

const seed = () => knexConfigured.seed.run(knexfile.seeds);

const migrateAndSeed = () => migrate().then(seed);

module.exports = {
  connector: knexConfigured,
  migrate,
  seed,
  migrateAndSeed,
};
