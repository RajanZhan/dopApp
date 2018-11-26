import axios from "axios";
const RE_LOGIN_CODE = '3'

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

const getHeaders = (methods) => {
  if (methods == 'get')
    return {
      'token': "de7355fe-0504-4594-a7b3-d0d560e28587",
      'appId': "1"
    }
  else
    return {
      'Content-type': 'application/x-www-form-urlencoded',
      'token': "de7355fe-0504-4594-a7b3-d0d560e28587",
      'appId': "1"
    }

}

export default {

  async post(url, data) {
    try {
      axios.defaults.headers = getHeaders('post');
      // data.token = tokenModel.getLoiginToken();
      let res = await axios.post(url, json2Form(data));
      // if (res && res.data && res.data.token) {
      //   tokenModel.setLoginToken(res.data.token);
      // }
      // if (res.data.code == RE_LOGIN_CODE) {
      //   return $mq.publish({
      //     relogin: "", // 发布重新登陆的通知
      //   })
      // }
      return res;
    } catch (err) {
      throw err;
    }

  },

  async get(url, data) {
    try {
      data.token = tokenModel.getLoiginToken();
      let res = await axios.get(url, {
        params: data
      })
      if (res && res.data && res.data.token) {
        tokenModel.setLoginToken(res.data.token);
      }

      if (res.data.code == RE_LOGIN_CODE) {
        return $mq.publish({
          relogin: "", // 发布重新登陆的通知
        })
      }
      return res;
    } catch (err) {
      throw err;
    }

  }


}