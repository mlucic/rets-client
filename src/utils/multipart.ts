/* jshint node:true */
/* jshint -W097 */
import { MultipartParser } from 'formidable/lib/multipart_parser';
import Promise = require('bluebird');
import through2 = require('through2');

let debug = require('debug')('rets-client:multipart');
let debugVerbose = require('debug')('rets-client:multipart:verbose');

import retsParsing = require('./parseRetsResponse');
import errors = require('./errors');
import headersHelper = require('./processHeaders');

// Multipart parser derived from formidable library. See https://github.com/felixge/node-formidable

let getObjectStream = (retsContext, handler) => new Promise(function (resolve, reject) {
  let multipartBoundary = __guard__(retsContext.headerInfo.contentType.match(/boundary="[^"]+"/ig), x => x[0].slice('boundary="'.length, -1));
  if (!multipartBoundary) {
    multipartBoundary = __guard__(retsContext.headerInfo.contentType.match(/boundary=[^;]+/ig), x1 => x1[0].slice('boundary='.length));
  }
  if (!multipartBoundary) {
    throw new errors.RetsProcessingError(retsContext, 'Could not find multipart boundary');
  }

  let parser = new MultipartParser();
  let objectStream = through2.obj();
  objectStream.write({ type: 'headerInfo', headerInfo: retsContext.headerInfo });
  let headerField = '';
  let headerValue = '';
  let headers = [];
  let bodyStream = null;
  let streamError = null;
  let done = false;
  let partDone = false;
  let flushed = false;

  let handleError = function (err) {
    debug(`handleError: ${ err.error || err }`);
    if (bodyStream != null) {
      bodyStream.end();
    }
    bodyStream = null;
    if (!objectStream) {
      return;
    }
    if (!err.error) {
      err = { type: 'error', error: err, headerInfo: err.headerInfo != null ? err.headerInfo : retsContext.headerInfo };
    }
    return objectStream.write(err);
  };

  let handleEnd = function () {
    if (done && partDone && flushed && objectStream) {
      debug("handleEnd");
      objectStream.end();
      return objectStream = null;
    } else {
      return debug(`handleEnd not ready: ${ JSON.stringify({ done, partDone, flushed, objectStream: !!objectStream }) }`);
    }
  };

  parser.onPartBegin = function () {
    debug("onPartBegin");
    let object = {
      buffer: null,
      error: null
    };
    headerField = '';
    headerValue = '';
    headers = [];
    return partDone = false;
  };

  parser.onHeaderField = function (b, start, end) {
    debugVerbose(`onHeaderField: ${ headerField }`);
    return headerField += b.toString('utf8', start, end);
  };

  parser.onHeaderValue = function (b, start, end) {
    debugVerbose(`onHeaderValue: ${ headerValue }`);
    return headerValue += b.toString('utf8', start, end);
  };

  parser.onHeaderEnd = function () {
    debug(`onHeaderEnd: {${ headerField }: ${ headerValue }}`);
    headers.push(headerField);
    headers.push(headerValue);
    headerField = '';
    return headerValue = '';
  };

  parser.onHeadersEnd = function () {
    debug(`onHeadersEnd: [${ headers.length / 2 } headers parsed]`);
    bodyStream = through2();
    let newRetsContext = {
      retsMethod: retsContext.retsMethod,
      queryOptions: retsContext.queryOptions,
      headerInfo: headersHelper.processHeaders(headers),
      parser: bodyStream
    };
    return handler(newRetsContext, false).then(object => objectStream != null ? objectStream.write(object) : undefined).catch(err => handleError(errors.ensureRetsError(newRetsContext, err))).then(function () {
      partDone = true;
      return handleEnd();
    });
  };

  parser.onPartData = function (b, start, end) {
    debugVerbose("onPartData");
    return bodyStream != null ? bodyStream.write(b.slice(start, end)) : undefined;
  };

  parser.onPartEnd = function () {
    debug("onPartEnd");
    if (bodyStream != null) {
      bodyStream.end();
    }
    return bodyStream = null;
  };

  parser.onEnd = function () {
    debug("onEnd");
    done = true;
    return handleEnd();
  };

  parser.initWithBoundary(multipartBoundary);

  retsContext.parser.on('error', function (err) {
    debug("stream error");
    return handleError(err);
  });

  let interceptor = function (chunk, encoding, callback) {
    parser.write(chunk);
    return callback();
  };

  let flush = function (callback) {
    debug("stream flush");
    let err = parser.end();
    if (err) {
      done = true;
      partDone = true;
      handleError(new errors.RetsProcessingError(retsContext, `Unexpected end of data: ${ errors.getErrorMessage(err) }`));
    }
    flushed = true;
    handleEnd();
    return callback();
  };

  retsContext.parser.pipe(through2(interceptor, flush));
  return resolve(objectStream);
});

export { getObjectStream };

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
