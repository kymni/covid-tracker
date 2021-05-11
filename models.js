const { connector } = require('./db/connector');

module.exports = {
  getData: (filter) => {
    console.log(filter);
    return connector('covid')
      .modify((queryBuilder) => {
        if (filter && filter.date && filter.date.start) {
          queryBuilder.where('parameter', '>=', filter.date.start);
        }
        if (filter && filter.date && filter.date.end) {
          queryBuilder.where('parameter', '<=', filter.date.end)
        }
      })
      .select(['parameter as date', 'indicator', 'series', 'sub_series', 'value'])
      .returning('*');
    }
};