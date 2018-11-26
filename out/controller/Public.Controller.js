"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express'), router = express.Router();
exports.router = router;
function middle(req, res, next) {
    next();
}
exports.middle = middle;
// 用户登录 授权
router.get("/userLogin", async (req, res) => {
    try {
        //let result = await testModel.test({ name: "", age: 12 });
        await $logic([{
                data: "appId",
                require: true,
                handler: "",
                msg: "appId不能为空"
            },
            {
                data: "name",
                require: true,
                msg: "用户名不能为空"
            },
            {
                data: "pwd",
                require: true,
                msg: "用户密码不能为空"
            }
        ], req.query);
        if (req.query.appId == 1 && req.query.pwd == 1 && req.query.name == 1) {
            let { token } = req.createDopAuthInfo({
                ip: req.ip,
                appId: req.query.appId,
                right: new Set(['a', 'b'])
            });
            return res.success({
                token: token
            });
        }
        res.success({ name: "public" });
    }
    catch (err) {
        console.log(err);
        $logger.error({ err: err, msg: "服务器错误" });
        res.error("服务器错误");
    }
});
