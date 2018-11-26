const baseModel = require("../lib/baseModel");
const skuModel = require("./SKU.model")();
// 商品model
class c extends baseModel {

    constructor(option) {
        super();
        this.option = option;

    }

    /**
     * 获取订单的列表.
     * @param {number} page - 页数.
     * @param {number} psize - 分页的大小.
     * @returns {array}. 返回专栏数据列表
     */
    async getOrders(page, psize) {

        page = page ? page : $config.pagination.page;
        psize = psize ? psize : $config.pagination.psize;
        var pagination = $common.getPageForSql(page, psize);
        try {
            let res = await this.dataModels.order.findAndCountAll({
                include: [
                    {
                        model:this.dataModels.user,
                        as:"user",
                        include:{
                            model:this.dataModels.userBankInfo,
                            as:"bankInfo"
                        }
                    },
                    {
                    model: this.dataModels.orderDetail,
                    as: "orderDetail",
                    include: {
                        model: this.dataModels.sku,
                        as: "sku"
                    }
                }],
                where: {},
                limit: pagination.limit,
                offset: pagination.offset,
                order: [
                    ['id', 'desc']
                ]
            });
            for (let i in res.rows) {
                if (!res.rows[i].payTime) {
                    res.rows[i].setDataValue("_payTime", "未付款")
                    //continue;
                }
                else
                {
                    res.rows[i].setDataValue("_payTime", $common.dateFormate(res.rows[i].payTime, "yyyy-MM-dd hh:mm:ss"))
                }
                let total = 0;
                for (let d of res.rows[i].orderDetail) {
                    total += (Number(d.num) * Number(d.sku.price))
                }
                res.rows[i].setDataValue("total", total);
                
                for (let j in res.rows[i].orderDetail) {
                    res.rows[i].orderDetail[j].setDataValue("_endTime", $common.dateFormate(res.rows[i].orderDetail[j].endTime, "yyyy-MM-dd hh:mm:ss"))
                }
                //console.log()
            }
            return res;

        } catch (err) {
            throw err;
        }
    }


    /**
     * 
     * @param {object} data - 专栏数据 {userId,name,colDesc,tags,status:"默认状态为1，表示启用"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async setOrder(data, t) {
        try {

            if (data.id) {
                if (t) {
                    return await this.dataModels.order.update(data, {
                        where: {
                            id: data.id
                        },
                        transaction: t
                    });
                } else {
                    return await this.dataModels.order.update(data, {
                        where: {
                            id: data.id
                        }
                    });
                }

            }
            data.status = 0; // 默认为未付款
            let res = await this.dataModels.order.create(data);
            // 将订单详情存放到 orderDetail中
            for (let i in data.detail) {
                data.detail[i].orderId = res.id;
                //await skuModel.subSkuNum({})
            }
            await this.dataModels.orderDetail.bulkCreate(data.detail);



            //console.log("create article ",res);
            return res;
        } catch (err) {
            throw err;
        }
    }



    async setOrderDetailEndTime(data) {
        try {
            if (!data) {
                throw new Error("setOrderDetailEndTime 数据不能为空");
            }
            let order = await this.getOrderById(data.orderId);
            if (!order) {
                throw new Error("setOrderDetailEndTime 订单获取失败");
            }
            let payTime = order.payTime;
            if (!payTime) {
                throw new Error("setOrderDetailEndTime 支付时间获取失败");
            }

            for (let d of order.orderDetail) {
                console.log("endtime ", (payTime), d.sku.skuType);
                // 更新每个订单的到期时间
                let other = JSON.parse(d.sku.skuType.other);
                let endTime = payTime + other.time * 30 * 24 * 60 * 60 * 1000;
                await this.dataModels.orderDetail.update({
                    endTime: endTime
                }, {
                    where: {
                        id: d.id
                    }
                })
            }
            return "name"

        } catch (err) {

        }
    }

    // 获取事务设置订单的过期时间的 操作列表
    async setOrderDetailEndTimeTransaction(data,t) {
        try {
            if(!t)
            {
                throw new Error("transaction obj is empty");
            }
            if (!data) {
                throw new Error("setOrderDetailEndTime 数据不能为空");
            }
            let order = await this.getOrderById(data.orderId);
            if (!order) {
                throw new Error("setOrderDetailEndTime 订单获取失败");
            }
            let payTime = data.payTime;
            if (!payTime) {
                throw new Error("setOrderDetailEndTime 支付时间获取失败");
            }

            //var res = null; 
            var transactionsList = [];
            for (let d of order.orderDetail) {
                //console.log("修改订单详情状态 。。。 ",);
                // 更新每个订单的到期时间
                let other = JSON.parse(d.sku.skuType.other);
                let endTime = payTime + other.time * 30 * 24 * 60 * 60 * 1000;
                transactionsList.push(this.dataModels.orderDetail.update({
                    endTime: endTime
                }, {
                    where: {
                        id: d.id
                    }
                },{transaction:t})) 
            }
            return transactionsList;

        } catch (err) {
            throw err;
        }
    }


    // 事务设置 订单的状态为已支付
    /**
     *  设置订单为已支付状态 事务
     * @param {number} data -
     * @returns {unknown}. 
     */
    async setOrderPayOkTransaction(data,t) {
        try {
            var orderId = data.orderId;
            var payType = data.payType;
            var _this = this;
            if ((!orderId)  || (!payType)) {
                throw new Error("订单id或者支付类型 不能为空");
            }
            var  tlist = [];
            if(t)
            {
                var payTime = new Date().getTime();
                tlist.push(this.setOrder({payType:payType,id:orderId,status:1,payTime:payTime},t))
                let list = await this.setOrderDetailEndTimeTransaction({orderId:orderId,payTime:payTime},t)
                for(let i of list)
                {
                    tlist.push(i);
                }
                return tlist;
            }
            
            return await this.db.transaction(async (t)=>{
                
                var payTime = new Date().getTime();
                // 修改订单状态
                tlist.push(_this.setOrder({payType:payType,id:orderId,status:1,payTime:payTime},t))
                let list = await _this.setOrderDetailEndTimeTransaction({orderId:orderId,payTime:payTime},t)
                
                // 修改订单详情状态
                for(let i of list)
                {
                    tlist.push(i);
                }
                return Promise.all(tlist);
            })
            
        } catch (err) {
            throw err;
        }
    }


    /**
     * 根据用户id获取未取消的订单列表.
     * @param {int} userId - 用户id.
     * @returns {object}. 订单列表
     */
    async getOrderList(userId) {
        try {
            let res = await this.dataModels.order.findAndCountAll({
                include: {
                    model: this.dataModels.orderDetail,
                    as: "orderDetail",
                    include: {
                        model: this.dataModels.sku,
                        as: "sku"
                    }
                },
                where: {
                    userId: userId,
                    status: {
                        $ne: -1
                    }
                },
                order:[["id","desc"]],
            });
            for (let i in res.rows) {
                if (!res.rows[i].payTime) {
                    res.rows[i].setDataValue("_payTime", "未付款")
                    continue;
                }
                res.rows[i].setDataValue("_payTime", $common.dateFormate(res.rows[i].payTime, "yyyy-MM-dd hh:mm:ss"))
                for (let j in res.rows[i].orderDetail) {
                    res.rows[i].orderDetail[j].setDataValue("_endTime", $common.dateFormate(res.rows[i].orderDetail[j].endTime, "yyyy-MM-dd hh:mm:ss"))
                }
                //console.log()
            }
            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * 获取已经付款的订单列表.
     * @param {string} name - 专栏名.
     * @returns {object}. 专栏详情
     */
    async getPayedOrderList() {
        try {
            let res = await this.dataModels.order.findAndCountAll({
                include: {
                    model: this.dataModels.orderDetail,
                    as: "orderDetail",
                    include: {
                        model: this.dataModels.sku,
                        as: "sku",
                        include: {
                            model: this.dataModels.skuType,
                            as: "skuType"
                        }
                    }
                },
                where: {
                    status: 1,
                }
            });
            for (let i in res.rows) {
                if (!res.rows[i].payTime) {
                    res.rows[i].setDataValue("_payTime", "未付款")
                    continue;
                }
                res.rows[i].setDataValue("_payTime", $common.dateFormate(res.rows[i].payTime, "yyyy-MM-dd hh:mm:ss"))
                for (let j in res.rows[i].orderDetail) {
                    res.rows[i].orderDetail[j].setDataValue("_endTime", $common.dateFormate(res.rows[i].orderDetail[j].endTime, "yyyy-MM-dd hh:mm:ss"))
                }
                //console.log()
            }
            return res;
        } catch (err) {
            throw err;
        }
    }


    /**
     * 
     * @param {number} id 
     * @returns {object}. goods
     */
    async getOrderById(id) {
        try {
            if (!id) {
                return null;
            }

            let res = await this.dataModels.order.findOne({
                include: {
                    model: this.dataModels.orderDetail,
                    as: "orderDetail",
                    include: {
                        model: this.dataModels.sku,
                        as: "sku",
                        include: {
                            model: this.dataModels.skuType,
                            as: "skuType"
                        }
                    }
                },
                where: {
                    id: id
                }
            })
            if(!res)
            {
                return null;
            }
            // 计算订单的总额
            let total = 0;
            for (let d of res.orderDetail) {
                total += (Number(d.num) * Number(d.sku.price))
            }
            res.setDataValue("total", total);
            return res;
        } catch (err) {
            throw err;
        }
    }


     /**
     *  获取用户 收益中的订单
     * @param {number} id 
     * @returns {object}. goods
     */
    async getActiveOrders(id) {
        try {
            if (!id) {
                throw new Error("userid empty") ;
            }
            let orderlist =  await this.dataModels.order.findAll({where:{
                userid:id,
                status:1,
            }})
            return orderlist;
        }catch(err)
        {
            throw err
        }
    }
    

    
     /**
     *  删除过期订单
     * @param {number} 删除超过多久的订单，单位 分钟 
     * @returns {object}. goods
     */
    async delTimeOutOrder(time) {
        try {
            time=time?time:10;
            let orderlist =  await this.dataModels.order.findAll({where:{
                status:0,// 获取所有未支付的订单
            }})
            var now = (new Date()).getTime();
            var timeSize = time * 60 * 1000; //换算成毫秒
            if(orderlist)
            {
                for(let order of orderlist)
                {
                    let orderCreateTime = (new Date(order.createdAt)).getTime();
                    if((now - orderCreateTime) > timeSize)
                    {
                        // 该订单失效 删除该订单
                        console.log("该订单失效了",(now - orderCreateTime),' - ',order.id);
                        await this.delOrderTransaction(order.id);
                    }
                    //console.log(orderCreateTime);
                }
            }
            return true;
        }catch(err)
        {
            throw err
        }
    }



     /**
     *  删除订单
     * @param {number}订单id
     * @returns {Promise}. 
     */
    async delOrderTransaction(orderId,t) {
        try {
            if(!orderId)
            {
                throw new Error("orderId can not null in Order.model.delOrderTransaction");
            }
            var _this = this;
            if(t)
            {
                var tlist = [];
                let orderInfo  = await _this.dataModels.order.findOne({
                    where:{
                        id:orderId,
                    },
                    include:{
                        model:_this.dataModels.orderDetail,
                        as:"orderDetail",
                        include:{
                            model:_this.dataModels.sku,
                            as:"sku"
                        }
                    }
                },{transaction:t});

                
                // 把订单对应的库存加上
                for(let d of  orderInfo.orderDetail)
                {
                    if(d.sku.num != -1) 
                    {
                        // 添加库存
                        tlist.push(
                           await skuModel.addSkuNum({
                            id:d.sku.id,
                            num:d.num
                        },t)
                      )
                  }
                }

                tlist.push(
                    _this.dataModels.order.destroy({
                        where:{
                            id:orderId
                        }
                    },{transaction:t})
                ).push(

                    _this.dataModels.orderDetail.destroy({
                        where:{
                            orderId:orderId
                        }
                    },{transaction:t})
                )

                return Promise.all(tlist);

            }
            else
            {
                return await this.db.transaction(async (t)=>{
                    
                    let orderInfo  = await _this.dataModels.order.findOne({
                        where:{
                            id:orderId,
                        },
                        include:{
                            model:_this.dataModels.orderDetail,
                            as:"orderDetail",
                            include:{
                                model:_this.dataModels.sku,
                                as:"sku"
                            }
                        }
                    },{transaction:t});

                    if(!orderInfo || (orderInfo.orderDetail.length == 0))
                    {
                        throw new Error("无法删除订单，订单详情读取失败");
                    }

                     // 把订单对应的库存加上
                     for(let d of  orderInfo.orderDetail)
                     {
                         if(d.sku.num != -1) 
                         {
                             // 添加库存
                             await skuModel.addSkuNum({
                                 id:d.sku.id,
                                 num:d.num
                             },t);
                         }
                     }

                    // 删除主订单
                    await _this.dataModels.order.destroy({
                        where:{
                            id:orderId
                        }
                    },{transaction:t})

                   

                    // 删除订单详情
                    return await _this.dataModels.orderDetail.destroy({
                        where:{
                            orderId:orderId
                        }
                    },{transaction:t})
                     

                })
            }
        }catch(err)
        {
            throw err
        }
    }


}
module.exports = (option) => {
    return new c(option)
};