//svg-captcha
var express = require('express'),
    router = express.Router();
const tokenModel = require("../model/Token.model")();
const tokenAuthMiddle = require("../middleware/tokenAuth.middle");
const planModel = require("../model/Plan.model")()
const noteModel = require("../model/Note.model")();
const userModel = require("../model/User.model")();

function middle(req, res, next) {
    //console.log("home 拦截1111");
    //tokenAuthMiddle(req, res, next);
    next();
}

// 读取随笔详情
router.get("/getNoteDetail", async (req, res) => {
    try {

        await $validate([{
                data: "userId",
                require: true,
                handler: "User@checkUserId",
                msg: "用户id不能为空"
            },
            {
                data: "noteId",
                require: true,
                exParams:req.userId,
                handler: "Note@checkNoteForUser",
                msg: "noteId不能为空"
            }
        ])(req.query)
        let result = await noteModel.getNoteDetail(req.query.noteId);
        res.success(result);
    } catch (err) {
        console.log(" getTodayPlan error", err);
        res.error("getTodayPlan 服务器错误 " + err, err);
    }
});


/**
 * 新建随笔
 * @returns {array}. 返回登录的结果 {status :}
 */
router.post("/postAddNote", async (req, res) => {
    try {
        let data = req.body;
        await $validate([{
                data: "content",
                require: true,
                msg: "计划内容不能为空"
            },
            {
                data: "userId",
                require: true,
                handler: "User@checkUserId",
                msg: "用户id不能为空"
            }
        ])(data)
        let result = await noteModel.addNote(data);
        res.success(result);
    } catch (err) {
        res.error("服务器错误");
    }
})



/**
 * 编辑随笔
 * @returns {array}. 返回登录的结果 {status :}
 */
router.post("/postSetNote", async (req, res) => {
    try {
        let data = req.body;
        await $validate([{
                data: "content",
                require: true,
                msg: "随笔内容不能为空"
            },
            {
                data: "id",
                require: true,
                exParams:req.userId,
                handler: "Note@checkNoteForUser",
                msg: "随笔id不能为空"
            },
            {
                data: "userId",
                require: true,
                handler: "User@checkUserId",
                msg: "用户id不能为空"
            }
        ])(data)
        let result = await noteModel.setNote(data);
        res.success(result);
    } catch (err) {
        res.error("服务器错误");
    }
})

/**
 * 删除随笔
 * @returns {array}. 返回登录的结果 {status :}
 */
router.post("/postDelNote", async (req, res) => {
    try {
        let data = req.body;
        await $validate([{
                data: "id",
                require: true,
                handler: "Note@checkNoteForUser",
                msg: "随笔id不能为空"
            },
            {
                data: "userId",
                require: true,
                exParams:req.userId,
                handler: "User@checkUserId",
                msg: "用户id不能为空"
            }
        ])(data)
        let result = await noteModel.delNote(data.id);
        res.success(result);
    } catch (err) {
        res.error("服务器错误");
    }
})

/**
 * 检索随笔
 * @returns {array}. 返回登录的结果 {status :}
 */
router.get("/getSearch", async (req, res) => {
    try {

        await $validate([{
            data: "userId",
            require: true,
            handler: "User@checkUserId",
            msg: "用户id不能为空"
        }, 
    ])(req.query)

        let result = await noteModel.getNoteByKeyWords(req.query.userId,req.query.key);

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