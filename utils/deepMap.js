const deepMap = async (obj, cb) => {
    let out = {};
    for (const k in obj) {
        let val;
        if (obj[k] !== null && typeof obj[k] === 'object') {
          val = await deepMap(obj[k], cb);
        } else {
          val = await cb(obj[k], k);
        }
        out[k] = val;
    }
  return out;
}

module.exports = {
    deepMap
}