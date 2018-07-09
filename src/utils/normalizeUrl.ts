import urlUtil = require('url');

// Returns a valid url for use with RETS server. If target url just contains a path, fullURL's protocol and host will be utilized.

let normalizeUrl = function (targetUrl, fullUrl) {
  let loginUrlObj = urlUtil.parse(fullUrl, true, true);
  let targetUrlObj = urlUtil.parse(targetUrl, true, true);
  if (targetUrlObj.host !== null) {
    return targetUrl;
  }
  let fixedUrlObj = {
    protocol: loginUrlObj.protocol,
    slashes: true,
    host: loginUrlObj.host,
    pathname: targetUrlObj.pathname,
    query: targetUrlObj.query
  };
  return urlUtil.format(fixedUrlObj);
};

export default normalizeUrl;
