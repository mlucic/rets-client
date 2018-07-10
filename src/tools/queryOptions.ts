import errors = require('../models/Errors');

// need to make a new object as we merge, as we don't want to modify the user's object

let mergeOptions = function (...args) {
  if (args.length === 0) {
    return {};
  }

  let result = {};
  // start at the end, so that values from earlier options objects overwrite and have priority
  for (let start = args.length - 1, index = start, asc = start <= 0; asc ? index <= 0 : index >= 0; asc ? index++ : index--) {
    let options = args[index];
    for (let key of Object.keys(options || {})) {
      result[key] = options[key];
    }
  }

  return result;
};

// default query parameters
let _queryOptionsDefaults = {
  queryType: 'DMQL2',
  format: 'COMPACT-DECODED',
  count: 1,
  standardNames: 0,
  restrictedIndicator: '***',
  limit: 'NONE'
};

let capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);

let remapKeys = function (obj) {
  let result = {};
  for (let key in obj) {
    let value = obj[key];
    result[capitalizeFirstLetter(key)] = value;
  }
  return result;
};

let normalizeOptions = function (queryOptions) {
  if (!queryOptions) {
    throw errors.RetsParamError('search', 'queryOptions is required.');
  }
  if (!queryOptions.searchType) {
    throw errors.RetsProcessingError('search', 'searchType is required (ex: Property');
  }
  if (!queryOptions.class) {
    throw errors.RetsProcessingError('search', 'class is required (ex: RESI)');
  }
  if (!queryOptions.query) {
    throw errors.RetsProcessingError('search', 'query is required (ex: (MatrixModifiedDT=2014-01-01T00:00:00.000+) )');
  }
  return remapKeys(mergeOptions(queryOptions, _queryOptionsDefaults));
};

export { mergeOptions, normalizeOptions };
