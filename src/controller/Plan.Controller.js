//svg-captcha
var express = require('express'),
    router = express.Router();
const tokenModel = require("../model/Token.model")();
const tokenAuthMiddle = require("../middleware/tokenAuth.middle");
const planModel = require("../model/Plan.model")()

function middle(req, res, next) {
    //console.log("home 拦截1111");
    //tokenAuthMiddle(req, res, next);
    next();
}

// 读取今日佳计划
router.get("/getTodayPlan", async (req, res) => {
    try {
        //console.log(req.query, "get test");
        console.log($common.getTodayTime());

        await $validate([{
            data: "userId",
            require: true,
            handler:"User@checkUserId",
            msg: "用户id不能为空"
        }, ])(req.query)

        let result = await planModel.getTodayPlanByUserId(req.query.userId);
        res.success(result);
    } catch (err) {
        console.log(" getTodayPlan error", err);
        res.error("getTodayPlan 服务器错误 " + err, err);
    }
});


/**
 * 新增计划  addPlanTmp
 * @returns {array}. 返回登录的结果 {status :}
 */
router.post("/postAddPlan", async (req, res) => {
    try {
        let data = req.body;
        console.log(data);
        await $validate([{
                data: "title",
                require: true,
                msg: "标题不能为空"
            },
            {
                data: "content",
                require: true,
                msg: "计划内容不能为空"
            },
            {
                data:"userId",
                require:true,
                handler:"User@checkUserId",
                msg:"用户id不能为空"
            }
        ])(data)
        let result = await planModel.addPlanTmp(data);
        res.success(result);
    } catch (err) {
        
        $logger.error({
            err:err,
            remark:"Plan.Controller.postAddPlan"
        });
        res.error("服务器错误");
    }
})

/**
 * 修改计划  
 * @returns {array}. 返回登录的结果 {status :}
 */
router.post("/postEditPlan", async (req, res) => {
    try {
        //res.success("heart");
        let data = req.body;
        await $validate([{
                data: "title",
                require: true,
                msg: "标题不能为空"
            },
            {
                data:"id",
                require:true,
                handler:"Plan@checkPlanForUser",
                exParams:req.body.userId,
                msg:"planid 不能为空"
            },
            {
                data: "content",
                require: true,
                msg: "计划内容不能为空"
            },
            {
                data:"userId",
                require:true,
                handler:"User@checkUserId",
                msg:"用户id不能为空"
            }
        ])(data)
        let result = await planModel.setPlanTmp(data);
        res.success(result);
    } catch (err) {
        $logger.error({
            err:err,
            remark:"Plan.Controller.postEditPlan"
        });
        res.error("服务器错误");
    }
})



/**
 * 删除计划  
 * @returns {array}. 返回登录的结果 {status :}
 */
router.post("/postDelPlan", async (req, res) => {
    try {
        //res.success("heart");
        let data = req.body;
        await $validate([
            {
                data:"id",
                require:true,
                handler:"Plan@checkPlanForUser",
                exParams:req.body.userId,
                msg:"planid 不能为空"
            },
            {
                data:"userId",
                require:true,
                handler:"User@checkUserId",
                msg:"用户id不能为空"
            }
        ])(data)
        let result = await planModel.delPlan(data.id);
        res.success(result);
    } catch (err) {
        $logger.error({
            err:err,
            remark:"Plan.Controller.postDelPlan"
        });
        res.error("服务器错误");
    }
})



/**
 * 读取个人计划模板列表
 * @returns {array}. 返回登录的结果 {status :}
 */
router.get("/getPlanTmpByUserId", async (req, res) => {
    try {
        
        await $validate([{
            data: "userId",
            require: true,
            handler:"User@checkUserId",
            msg: "用户id不能为空"
        }, ])(req.query)

        let result = await planModel.getPlanTmpByUserId(req.query.userId);

        res.success(result);
    } catch (err) {
        console.log(" getTodayPlan error", err);
        res.error("getTodayPlan 服务器错误 " + err, err);
    }
});





module.exports = {
    router,
    middle
};