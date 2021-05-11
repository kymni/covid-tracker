const fs = require('fs');

function loadSeedScript(seeds) {
  return seeds
    .map(x => fs.readFileSync(`${__dirname}/${x}.sql`).toString())
    .join('\n');
}

exports.seed = function(knex) {
  var sql = loadSeedScript([
    'covid',
  ]);
  return knex.raw(sql);
};
