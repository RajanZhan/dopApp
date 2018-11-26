const baseModel = require("../lib/baseModel");
const balanceModel = require("./BalanceChangeLog.model")();
const orderModel = require("./Order.model")();

// 商品model
class c extends baseModel{

    constructor(option){
        super();
        this.option = option;
        
    }



    /**
     * 获取收益情况
     * @param {number} userid
     * @returns {object}. goods
     */
    async getIncomeList(id){
        try{
            if(!id)
            {
                return null;
            }
           
            let list =   await this.dataModels.incomeLog.findAll({
                where:{
                    userid:id
                },
                order:[["id","desc"]],
            });
            let today  = $common.dateFormate(null,"MM-dd");
            for(let i in list)
            {
                let _date = $common.dateFormate(list[i].time,"MM-dd");
                if(_date == today){
                    _date = "今日"
                }
                list[i].setDataValue("_date",_date)

            }
            return list;
        }
        catch(err){
            throw err;
        }  
    }




    /**
     * 获取用户银行卡卡信情况
     * @param {number} userid
     * @returns {object}. goods
     */
    async getUserBankInfo(id){
        try{
            if(!id)
            {
                return null;
            }
           
            let res =   await this.dataModels.userBankInfo.findOne({
                where:{
                    userid:id
                },
               
            });
            
            return res;
        }
        catch(err){
            throw err;
        }  
    }


    /**
     * 获取用户银行卡卡信情况
     * @param {number} userid
     * @returns {object}. goods
     */
    async setUserBankInfo(data){
        try{
            if(!data)
            {
                throw new Error("银行卡信息不完整");;
            }

            let res =   await this.dataModels.userBankInfo.upsert(data)
            
            return res;
        }
        catch(err){
            throw err;
        }  
    }


    

/**
     * 获取用户总资产
     * @param {number} id 
     * @returns {object}. goods
     */
    async getUserAllAsset(id){
        try{
            if(!id)
            {
                return null;
            }
           
            let user =   await this.dataModels.user.findOne({
                where:{
                    id:id
                }
            });
            let balance = Number(user.money);
            
            // 获取用户收益中的订单单
            let orderlist = await orderModel.getActiveOrders(id);
            
            // 获取订单的详情
            var orderTotal = 0;
            for(let order of orderlist)
            {
                let detail  = await orderModel.getOrderById(order.id);
                if(!detail){
                    continue
                }
                //console.log(detail,"detail");
                orderTotal += Number(detail.dataValues.total)
                
            }
            
            return {total:(orderTotal + balance)};
        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 
     * @param {number} id 
     * @returns {object}. goods
     */
    async getUserById(id){
        try{
            if(!id)
            {
                return null;
            }
            
            return  await this.dataModels.user.findOne({
                where:{
                    id:id
                }
            });
        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 
     * @param {number} id 
     * @returns {object}. goods
     */
    async subMoney(data){
        try{
            if(!data)
            {
                throw new Error("User model subMoney error,data is empty");
            }
            
            var userModel = this.dataModels.user
            return await this.db.transaction(function (t) {
                // 添加资金变动记录
                return balanceModel.addLog(data.log,t).then((log)=>{
                    let money = Number( data.user.money) - Number(data.subNum);
                    console.log(data,"data info");
                    return  userModel.update({money:money},{where:{id:data.user.id,},transaction:t});
                })
            })
        }
        catch(err){
            throw err;
        }  
    }

   
   
}
module.exports = (option)=>{
    return new c(option)
};