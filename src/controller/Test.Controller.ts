const express = require('express'), router = express.Router();
import { Test } from "../model/Test.Model"
const testModel = new Test({})

function middle(req, res, next) {
    next();
}

router.get("/index", async (req, res) => {
    try {

        let result = await testModel.test({ name: "", age: 12 });
        // await $logic([{
        //     data: "userId",
        //     require: true,
        //     handler: "",
        //     msg: "用户id不能为空"
        // },
        // {
        //     data: "email",
        //     require: true,
        //     handler: "Sys@email",
        //     msg: "用户id不能为空"
        // }
        // ], req.query)
        res.success(result);
    }
    catch (err) {
        console.log(err);
        $logger.error({ err: err, msg: "服务器错误" });
        res.error("服务器错误");
    }
});

router.post("/index", async (req, res) => {
    try {

        let result = await testModel.test({ name: "", age: 12 });
        // await $logic([{
        //     data: "appId",
        //     require: true,
        //     handler: "",
        //     msg: "appId不能为空"
        // },
        // {
        //     data: "email",
        //     require: true,
        //     handler: "Sys@email",
        //     msg: "用户id不能为空"
        // }
        // ], req.query)
        //console.log("授权信息",req.$dopAuth);
        res.success(result);
    }
    catch (err) {
        console.log(err);
        $logger.error({ err: err, msg: "服务器错误" });
        res.error("服务器错误");
    }
});


export {
    router,
    middle
};