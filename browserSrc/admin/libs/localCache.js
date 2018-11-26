var dtime = '_deadtime';
function set(k, v, t) {
  localStorage.setItem(k, JSON.stringify(v))
  var seconds = parseInt(t);
  if (seconds > 0) {
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000 + seconds;
    localStorage.setItem(k + dtime, timestamp + "")
  } else {
   localStorage.removeItem(k + dtime)
  }
}

function get(k, def) {
  var deadtime = parseInt(localStorage.getItem(k + dtime))
  if (deadtime) {
    if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
      if (def) { return def; } else { return null; }
    }
  }
  var res = localStorage.getItem(k);
  if (res) {
    return JSON.parse(res);
    //return (res);
  } else {
    return def;
  }
}

function remove(k) {
  localStorage.removeItem(k);
 localStorage.removeItem(k + dtime);
}

function clear() {
  localStorage.clear();
}
export default  {
  set: set,
  get: get,
  remove: remove,
  clear: clear,
}