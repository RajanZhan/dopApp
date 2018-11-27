const express = require('express'), router = express.Router();

function middle(req, res, next) {
    next();
}

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
        if(req.query.appId == 1 && req.query.pwd == 1 && req.query.name ==1)
        {
            let {token} = req.createDopAuthInfo({
                ip:req.ip,
                appId:req.query.appId,
                right:new Set(['a','b'])
            });
            return res.success({
                token:token
            })
        }
        
        res.success({name:"public"});
    }
    catch (err) {
        console.log(err);
        $logger.error({ err: err, msg: "服务器错误" });
        res.error("服务器错误");
    }
});

//  微服务调用测试
router.get("/test", async (req, res) => {
    try {

        let result = await $msClient({
            interfaceName:"Test.Logic",
            actionName:"test",
            params:[{name:'test'}]
        });
        
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