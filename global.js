const state = { };

exports.get = () => state;
exports.set = (key, value) => { state[key] = value; return value; };
