
export default {
    
    //验证验证码
    async vcode(value) {
        let vcode:string = <string> await $req.session("vcode");
        if (!vcode) {
            return [false, "验证码已过期"];
        }
        if (value != vcode.toLowerCase()) {
            return [false, "验证码不正确"];
        }
        await $req.dsession("vcode");
        return [true];
    },

    // 验证email 
    async email(value) {
        if (value != "email") {
            return [false, "email 不合法"]
        }
        return [true]
    },
}