export default {

  error(obj) {
    try {
      console.log("监听到异常");
      obj.err = obj.err.toString();
      console.error(JSON.stringify(obj));
    } catch (err) {
      console.log("logger.js.error error");
      console.log(JSON.stringify(err));
    }

  }
}
