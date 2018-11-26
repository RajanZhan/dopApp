const baseModel = require("../lib/baseModel");

// 商品model
class c extends baseModel {

    constructor(option) {
        super();
        this.option = option;

    }


    /**
    * 读取指定科室下的表单模板列表
    * @param {int} id - 
    * @returns {unknown}. 返回添加的结果 
    */
    async getFormListByDeptId(id) {
        try {
            if (!id) {
                throw new Error("getFormListByDeptId id is empty");
            }
            let key = `form-list-dept-${id}`;
            let cache = await $cache.get(key);
            if (cache) {
                return cache;
            }

            let res = await this.dataModels.formTable.findAll({
                include: { model: this.dataModels.dept, as: "deptInfo", },
                where: {
                    departmentid: id
                }
            })

            await $cache.set(key, res, 60);
            return res;
        }
        catch (err) {
            throw err;
        }
    }


    /**
   * 创建表单
   * 
   * @returns {unknown}. 返回添加的结果 
   */
    async createCollectionTable(data) {
        try {
            if ((!data) || (!data.userId) || (!data.docId) || (!data.tableId)) {
                throw new Error("Form.modelcreateCollectionTable 数据不完整 ");
            }
            let res = await this.dataModels.formCollection.create({
                userId: data.userId,
                tableId: data.tableId,
                docId: data.docId,
                createTime: new Date(),
                status: 0,
            });

            // 清除缓存
            let key = `doc-diagnosis-cache-${data.docId}`;
            $cache.delete(key);

            return res;
        }
        catch (err) {
            throw err;
        }
    }




    /**
   * 根据医生id 读取 未完成诊断的表单
   * @param {int} docId 
    * @returns {unknown}. 返回添加的结果 
   */
    async getNoFinishCollectionTablesByDocId(docId) {
        try {
            if ((!docId)) {
                throw new Error("Form.getCollectionTablesByDocId docId empty ");
            }
            // let key = `doc-diagnosis-nofinish-cache-${docId}`;
            // let cache = await $cache.get(key);
            // if (cache) {
            //     return cache;
            // }
            let res = await this.dataModels.formCollection.findAll({
                include: [{ model: this.dataModels.user, as: "userInfo", include: { model: this.dataModels.userInfoAdd, as: "userInfo" } },
                { model: this.dataModels.formTable, as: "formInfo" }

                ],
                where: {
                    docId: docId,
                    status: {
                        $lt: 3,// 等于 3 说明是诊断完成，
                    }
                },
                order:[['status','desc'],["id",'desc']],
            });
            for (let i in res) {
                res[i].setDataValue("createTime", $common.dateFormate(res.createTime, "yyyy-MM-dd hh:mm"));
            }

            //$cache.set(key, res, 30);

            return res;
        }
        catch (err) {
            throw err;
        }
    }

    /**
   * 根据医生id 读取 已完成诊断的表单
   * @param {int} docId 
    * @returns {unknown}. 返回添加的结果 
   */
    async getFinishCollectionTablesByDocId(docId) {
        try {
            if ((!docId)) {
                throw new Error("Form.getCollectionTablesByDocId docId empty ");
            }
            // let key = `doc-diagnosis-finish-cache-${docId}`;
            // let cache = await $cache.get(key);
            // if (cache) {
            //     return cache;
            // }
            let res = await this.dataModels.formCollection.findAll({
                include: [{ model: this.dataModels.user, as: "userInfo", include: { model: this.dataModels.userInfoAdd, as: "userInfo" } },
                { model: this.dataModels.formTable, as: "formInfo" }

                ],
                where: {
                    docId: docId,
                    status: {
                        $gte: 3,//
                    }
                },
                order:[["id","desc"]]
            });
            for (let i in res) {
                res[i].setDataValue("createTime", $common.dateFormate(res.createTime, "yyyy-MM-dd hh:mm"));
            }

            //$cache.set(key, res, 30);

            return res;
        }
        catch (err) {
            throw err;
        }
    }



    /**
  * 根据医生id 读取 未完成诊断的表单
  * @param {int} docId 
   * @returns {unknown}. 返回添加的结果 
  */
    async setDiagnosis(data) {
        try {
            if ((!data) || (!data.formId) || (!data.diagnosis)) {
                throw new Error("Form.setDiagnosis  数据不完整 ");
            }

            let res = await this.dataModels.formCollection.findOne({
                where: {
                    id: data.formId
                }
            });
            if (!res) {
                throw new Error("表单不存在，无法写入诊断数据");
            }
            if (res.status >= 3) {
                throw new Error("表单无需重复就诊");
            }
            // let key1 = `doc-diagnosis-nofinish-cache-${data.formId}`;
            // let key2 = `doc-diagnosis-finish-cache-${data.formId}`;
            // await $cache.delete(key1);
            // await $cache.delete(key2);
            // console.log("晴空缓存");

            let result = await this.dataModels.formCollection.update({
                diagnosis: data.diagnosis,
                status: 3,
            },
                {
                    where: {
                        id: data.formId
                    }
                }
            )
           

            return result;
        }
        catch (err) {
            throw err;
        }
    }

    /**
  * 根据 id 读取 表单的信息
  * @param {int} cid
   * @returns {object}.  
  */
 async getCollectionById(cid) {
    try {
        if ((!cid)) {
            throw new Error("Form.getCollectionById cid empty ");
        }
        
        let res = await this.dataModels.formCollection.findOne({
            where: {
                id: cid
            }
        });
        return res;
    }
    catch (err) {
        throw err;
    }
}


    /**
  * 根据formId 读取 表单的控件以及对应的值
  * @param {int} formId 
   * @returns {array}.  
  */
    async getFormDataByFormId(formId) {
        try {
            if ((!formId)) {
                throw new Error("Form.getFormDataByFormId formId empty ");
            }
            let key = `form-value-cache-${formId}`;
            let cache = await $cache.get(key);
            if (cache) {
                return cache;
            }
            let res = await this.dataModels.formCollection.findOne({
                //include: { model: this.dataModels.formControll, as: "formControll" ,include:{model:this.dataModels.formContent,as:"formContent"}},
                where: {
                    id: formId
                }
            });
            res.setDataValue("createTime", $common.dateFormate(res.createTime, "yyyy-MM-dd hh:mm"));
            let controll = await this.dataModels.formContent.findAll({
                include:{
                    model:this.dataModels.formControll,
                    as:"formControll",
                    order:[["sort","desc"]]
                },
                where:{
                    collectiontableId:formId
                }
            })
            res.setDataValue("formContent", controll);
            $cache.set(key, res, 30);

            return res;
        }
        catch (err) {
            throw err;
        }
    }




}
module.exports = (option) => {
    return new c(option)
};