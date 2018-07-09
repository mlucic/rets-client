/* jshint node:true */
/* jshint -W097 */
import { WritableStreamBuffer } from 'stream-buffers';
import Promise = require('bluebird');
import through2 = require('through2');
import multipart = require('../utils/multipart');
import retsHttp = require('../utils/retsHttp');
import queryOptionHelpers = require('../utils/queryOptions');
import errors = require('../utils/errors');

var _loadStreams = result => new Promise(function (resolve, reject) {
  let done = false;
  if (result.dataStream != null) {
    let dataLoader = new WritableStreamBuffer({
      initialSize: 100 * 1024,
      incrementAmount: 10 * 1024
    });
    result.dataStream.on('end', function () {
      if (done) {
        return;
      }
      done = true;
      return resolve({
        headerInfo: result.headerInfo,
        data: dataLoader.getContents()
      });
    });
    result.dataStream.on('error', function (err) {
      if (done) {
        return;
      }
      done = true;
      return reject({
        headerInfo: result.headerInfo,
        error: err
      });
    });
    return result.dataStream.pipe(dataLoader);
  } else if (result.objectStream != null) {
    let list = [];
    let started = 0;
    let finished = 0;
    let maybeResolve = function () {
      if (done && started === finished) {
        return resolve({
          headerInfo: result.headerInfo,
          objects: list
        });
      }
    };
    let objectLoader = through2.obj(function (object, encoding, callback) {
      let index = started;
      started++;
      _loadStreams(object).then(result => list[index] = result).catch(err => list[index] = err).then(function () {
        finished++;
        return maybeResolve();
      });
      return callback();
    });
    result.objectStream.on('end', function () {
      done = true;
      return maybeResolve();
    });
    return result.objectStream.pipe(objectLoader);
  } else {
    return resolve(result);
  }
});

/*
* All methods below take the following parameters:
*    resourceType: resource type (RETS Resource argument, ex: Property)
*    objectType: object type (RETS Type argument, ex: Photo)
*    ids: the ids of the objects to query, corresponding to the RETS ID argument; you really should know the RETS
*       standard to fully understand every possibility here.  (See the individual method descriptions below.)  Can be
*       one of 3 data types:
*       1. string: will use this literal value as the ID argument
*       2. array: will be joined with commas, then used as the ID argument
*       3. object: (valid for getObjects only) keys will be joined to values with a colon, and if a value is an array
*           it will be joined with colons
*    options: object of additional options.
*       Location: can be 0 (default) or 1; a 1 value requests URLs be returned instead of actual image data, but the
*           RETS server may ignore this
*       ObjectData: can be null (default), a string to be used directly as the ObjectData argument, or an array of
*           values to be joined with commas.  Requests that the server sets headers containing additional metadata
*           about the object(s) in the response.  The special value '*' requests all available metadata.  Any headers
*           set based on this argument will be parsed into a special object and set as the field 'objectData' in the
*           headerInfo object.
*       alwaysGroupObjects: can be false (default) or true.  If true, all of the methods below will return a result
*           formatted as if a multipart response was received, even if a request only returns a single result.  If you
*           will sometimes get multiple results back from a single query, this will simplify your code by making the
*           results more consistent.  However, if you know you are only making requests that return a single result,
*           it is probably more intuitive to leave this false/unset.
*
* Depending on the form of the response from the RETS server, all methods below will resolve or reject as follows:
* 1. If the HTTP response is not a 200/OK message, all methods will reject with a RetsServerError.
* 2. If the HTTP response is a 200/OK message, but the contentType is text/xml, all methods will reject with a
*    RetsReplyError.
* 3. If the HTTP response is a 200/OK message with a non-multipart contentType, and if the alwaysGroupObjects option is
*    not set, then the response is treated as a single-object response, and all methods will resolve to an object with
*    the following fields:
*       headerInfo: an object of metadata from the headers of the response
*       data: a buffer containing the object's data
* 4. If the HTTP response is a 200/OK message with a multipart contentType, or if the alwaysGroupObjects option is set,
*    then all methods will resolve to an object with the following fields:
*       headerInfo: an object of metadata from the headers of the main response
*       objects: an array of objects corresponding to the parts of the response; each object will have its own
            headerInfo field for the headers on its part, and either an error field or a data field.
*/

/*
 * getObjects: Use this if you need to specify exactly what images/objects to retrieve.  `ids` can be a single string,
 *     an array, or an object.  This is the only method that lets you specify object UIDs instead of resourceIds.
 */

let getObjects = function (resourceType, objectType, ids, options) {
  return this.stream.getObjects(resourceType, objectType, ids, options).then(_loadStreams);
};

/*
 * getAllObjects: Use this if you want to get all associated images/objects for all resources (i.e. listingIds or
 *     agentIds) specified.  `ids` can be a single string or an array; a ':*' suffix is appended to each id.
 */

let getAllObjects = function (resourceType, objectType, ids, options) {
  return this.stream.getAllObjects(resourceType, objectType, ids, options).then(_loadStreams);
};

/*
 * getPreferredObjects: Use this if you want to get a single 'preferred' image/object for each resource (i.e. listingId
 *     or agentIds) specified.  `ids` can be a single string or an array; a ':0' suffix is appended to each id.  
 */

let getPreferredObjects = function (resourceType, objectType, ids, options) {
  return this.stream.getPreferredObjects(resourceType, objectType, ids, options).then(_loadStreams);
};

export default function (_retsSession, _client) {
  if (!_retsSession) {
    throw new errors.RetsParamError('System data not set; invoke login().');
  }
  return {
    getObjects,
    getAllObjects,
    getPreferredObjects,
    stream: require('./object.stream')(_retsSession, _client)
  };
};
