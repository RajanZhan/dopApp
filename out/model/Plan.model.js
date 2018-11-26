const baseModel = require("../lib/baseModel");

// 商品model
class c extends baseModel {

    constructor(option) {
        super();
        this.option = option;

    }

    /**
     *  读取 指定用户今日的计划.
     * @param {object} {fromUser,toUser,depId} .
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async getTodayPlanByUserId(userId) {

        try {
            if (!userId) {
                throw new Error("user id is empty in Plan.model.getTodayByUserId");
            }
            let time = $common.getTodayTime();
            return await this.dataModels.plan.findAll({
                where: {
                    userId: userId,
                    status: {
                        $ne: -1
                    },
                    time: {
                        $between: [
                            time.start,
                            time.end
                        ]
                    }
                }
            })
        } catch (err) {
            throw err;
        }
    }



    /**
     *  读取计划详情
     * @param {object} {fromUser,toUser,depId} .
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async getPlanDetail(pid) {

        try {
            return await this.dataModels.planTmp.findOne({
                where: {
                    id: pid
                }
            })
        } catch (err) {
            throw err;
        }
    }

    // 检测 计划日期的合法性
    _checkPlanDate(data) {
        try {
            if (data.endTime) {
                if (!data.startTime) data.startTime = new Date();
            }
            if (data.startTime && data.endTime) {

                if (new Date().getTime() - new Date(data.startTime).getTime() > 0) {
                    return false
                }

                if (new Date().getTime() - new Date(data.endTime).getTime() > 0) {
                    return false
                }
                if (new Date(data.startTime).getTime() > new Date(data.endTime).getTime()) {
                    return false
                }
            }
            return data;
        } catch (err) {
            throw err
        }

    }



    /**
     *  添加计划模板
     * @param {object} {fromUser,toUser,depId} .
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async addPlanTmp(data) {
        try {
            data.status = 0;
            data = this._checkPlanDate(data);
            if(!data)
            {
                throw new Error("计划时间验证失败");
            }

            if (data.startTime && data.endTime) {

                if (new Date().getTime() - new Date(data.startTime).getTime() > 0) {
                    throw new Error("开始时间设置不合理");
                }

                if (new Date().getTime() - new Date(data.endTime).getTime() > 0) {
                    throw new Error("计划的时间可能不合理");
                }
                if (new Date(data.startTime).getTime() > new Date(data.endTime).getTime()) {
                    throw new Error("开始时间不能大于结束时间");
                }
            }
            return await this.dataModels.planTmp.create(data)

        } catch (err) {
            throw err;
        }
    }


    /**
     *  编辑计划模板
     * @param {object} {fromUser,toUser,depId} .
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async setPlanTmp(data) {
        try {
            //data.status = 0;
            
            let newData = {};
            for(let i in data)
            {
                if(data[i])
                {
                    newData[i] = data[i]
                }
            }
            console.log(newData);
            newData = this._checkPlanDate(newData);
            if(!newData)
            {
                throw new Error("计划时间验证失败");
            }
            return await this.dataModels.planTmp.update(newData, {
                where: {
                    id: newData.id
                }
            })

        } catch (err) {
            throw err;
        }
    }



    /**
     *  删除计划
     * @param {object} {fromUser,toUser,depId} .
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async delPlan(pid) {

        try {
            return await this.dataModels.planTmp.update({
                status: -1,
            }, {
                where: {
                    id: pid
                }
            })
        } catch (err) {
            throw err;
        }
    }


    /**
     *  读取指定用户的计划模板
     * @param {object} {fromUser,toUser,depId} .
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async getPlanTmpByUserId(userId) {
        try {

            return await this.dataModels.planTmp.findAll({
                where: {
                    userId: userId,
                    status: {
                        $ne: -1
                    },
                },
                order: [
                    ["status", "desc"],
                    ["id", "desc"]
                ]
            })

        } catch (err) {
            throw err;
        }
    }


}
module.exports = (option) => {
    return new c(option)
};