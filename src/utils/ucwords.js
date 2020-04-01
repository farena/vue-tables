// eslint-disable-next-line no-extend-native
String.prototype.ucwords = function () {
  const str = this.toLowerCase();
  return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
    (s) => s.toUpperCase());
};
