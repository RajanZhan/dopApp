const baseModel = require("../lib/baseModel");
const balanceModel = require("./BalanceChangeLog.model")();
const orderModel = require("./Order.model")();
const userModel = require("./User.model")();

// 商品model
class c extends baseModel {

    constructor(option) {
        super();
        this.option = option;

    }


    /**
     * 获取收益情况
     * @param {number} userid
     * @returns {object}. goods
     */
    async getIncomeList(id) {
        try {
            if (!id) {
                return null;
            }

            let list = await this.dataModels.incomeLog.findAll({
                where: {
                    userid: id
                },
                order: [
                    ["id", "desc"]
                ],
            });
            let today = $common.dateFormate(null, "MM-dd");
            for (let i in list) {
                let _date = $common.dateFormate(list[i].time, "MM-dd");
                if (_date == today) {
                    _date = "今日"
                }
                list[i].setDataValue("_date", _date)

            }
            return list;
        } catch (err) {
            throw err;
        }
    }

    /**
     * 根据 incomeNum 获取收益详情，用户防止重复收益
     * @param {number} incomeNum
     * @returns {object}. incomeinfo
     */
    async getIncomeLogByIncomeNum(incomeNum) {
        try {
            if (!incomeNum) {
                throw new Error("incomeNum 不能为空");
            }

            let res = await this.dataModels.incomeLog.findOne({
                where: {
                    incomeNum: incomeNum
                },
            });

            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * 添加用户收益
     * @param {number} incomeNum
     * @returns {object}. incomeinfo
     */
    async addIncome(data) {
        try {
            if((!data.incomeNum) || (!data.userId) || (!data.orderId) || (!data.detailId) || (!data.income))
            {
                //console.log(data)
                throw new Error("addIncome 数据不完整");
            }

            if (Number(data.income) <= 0) {
                throw new Error("收益不能为负数或0");
            }
            var _this = this;

            return await this.db.transaction(function (t) {
                // 添加资金变动记录
                let balanceChanedLog = {
                    userId:data.userId,
                    type:"income",
                    money:data.income,
                    direction:"add",
                    remark:"程序自动添加用户订单收益"
                } 
                return balanceModel.addLog(balanceChanedLog, t).then((log) => {
                    let money = Number(data.user.money) +  Number(data.income);
                    //console.log(data, "data info");
                    return _this.dataModels.user.update({
                        money: money
                    }, {
                        where: {
                            id: data.user.id,
                        },
                        transaction: t
                    });
                })
                .then(()=>{
                    // 添加用户收益记录
                    return _this.dataModels.incomeLog.create({
                        userId:data.userId,
                        income:data.income,
                        orderDetailId:data.detailId,
                        time:new Date(),
                        incomeNum:data.incomeNum
                    },{transaction:t})
                })
            })

        } catch (err) {
            throw err;
        }

    }



    /**
     * 事务添加用户收益
     * @param {number} incomeNum
     * @returns {object}. incomeinfo
     */
    async addIncomeTransactiondata(data) {
        try {
            if((!data.incomeNum) || (!data.userId) || (!data.orderId) || (!data.detailId) || (!data.income))
            {
                //console.log(data)
                throw new Error("addIncome 数据不完整");
            }

            if (Number(data.income) <= 0) {
                throw new Error("收益不能为负数或0");
            }
            var _this = this;

            return await this.db.transaction(async function (t) {
                // 添加资金变动记录
                let balanceChanedLog = {
                    userId:data.userId,
                    type:"income",
                    money:data.income,
                    direction:"add",
                    remark:"程序自动添加用户订单收益"
                }
                // 资金变动
                let tlist = await userModel.addMoneyTransaction({addNum:data.income,userId:data.userId,log:balanceChanedLog},t)
                // 添加收益变动记录
                tlist.push(_this.dataModels.incomeLog.create({
                    userId:data.userId,
                    income:data.income,
                    orderDetailId:data.detailId,
                    time:new Date(),
                    incomeNum:data.incomeNum
                },{transaction:t}))
                return Promise.all(tlist);
            })

        } catch (err) {
            throw err;
        }

    }
}
module.exports = (option) => {
    return new c(option)
};