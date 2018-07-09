/* jshint node:true */
/* jshint -W097 */
let hex2a = function (hex) {
  if (!hex) {
    return null;
  }

  // force conversion
  hex = hex.toString();

  let str = '';
  let i = 0;
  while (i < hex.length) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    i += 2;
  }
  return str;
};

export default hex2a;
