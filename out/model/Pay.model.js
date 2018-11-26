const baseModel = require("../lib/baseModel");

const balanceModel = require("./BalanceChangeLog.model")();
const userModel = require("./User.model")();
const orderModel = require("./Order.model")();
// 商品model
class c extends baseModel {

    constructor(option) {
        super();
        this.option = option;

    }


    /**
     * 获取专栏的列表.
     * @param {number} page - 页数.
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async getArticles(page, psize) {
        try {
            page = page ? page : $config.pagination.page;
            psize = psize ? psize : $config.pagination.psize;
            var pagination = $common.getPageForSql(page, psize);
            console.log(pagination, "pagess");
            return await this.dataModels.article.findAndCountAll({
                limit: pagination.limit,
                offset: pagination.offset,
                order: [
                    ['sort', 'desc']
                ]
            });
        } catch (err) {
            throw err;
        }
    }

    /**
     *  余额支付，修改
     * @param {object} data - 专栏数据 {userId,name,colDesc,tags,status:"默认状态为1，表示启用"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async balancePay(order,user) {
        try {
            if ((!order) || (!user)) {
                throw new Error("订单id不能为空");
            }
            let total = order.dataValues.total;
            if (Number(total) > Number(user.money)) {
                throw new Error("余额不足，无法完成支付");
            }
            
            //console.log("order total ",total);
            await userModel.subMoney({user:user,subNum:total,log:{
                userId: user.id,
                type: "pay",
                direction: "sub",
                money: total,
                remark: "余额支付订单"
            }})
            
            // 修改订单状态
            let res = await orderModel.setOrder({id:order.id,status:1,payTime:new Date().getTime()});
            
            // 修改订单详情的 到期时间
            await orderModel.setOrderDetailEndTime({orderId: order.id})

            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     *  余额支付，修改 事务
     * @param {object} data - 专栏数据 {userId,name,colDesc,tags,status:"默认状态为1，表示启用"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async balancePayTransaction(order,user) {
        try {
            if ((!order) || (!user)) {
                throw new Error("订单id不能为空");
            }
            let total = order.dataValues.total;
            if (Number(total) > Number(user.money)) {
                throw new Error("余额不足，无法完成支付");
            }
            var _this = this;
           
            return await this.db.transaction(async (t)=>{

                let subMoneyTlist = await userModel.subMoneyTransaction({userId:userId,subNum:total,log:{
                    userId: user.id,
                    type: "pay",
                    direction: "sub",
                    money: total,
                    remark: "余额支付订单"
                }},t);

                let setOrderPayedTlist = await orderModel.setOrderPayOkTransaction({payType:"balance",orderId:order.id},t);
                let allTlist = $common.arrMerge([subMoneyTlist,setOrderPayedTlist]);
                return Promise.all(allTlist);
            })
        } catch (err) {
            throw err;
        }
    }
    
}
module.exports = (option) => {
    return new c(option)
};