const baseModel = require("../lib/baseModel");

function userInfoCacheKey(userId) {
    return `user-info-cache-userid-${userId}`;
}


// 商品model
class c extends baseModel {

    constructor(option) {
        super();
        this.option = option;

    }


    /**
     * 
     * @param {object} data - 专栏数据 {userId,name,colDesc,tags,status:"默认状态为1，表示启用"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async getFamily(id) {
        try {
            if (!id) {
                throw new Error("getFamily id is empty");
            }

            let res = await this.dataModels.userRelationship.findAll({
                include: [{
                        model: this.dataModels.relation,
                        as: "relation"
                    },
                    {
                        model: this.dataModels.userInfoAdd,
                        as: "familyUserInfo"
                    },
                ],
                where: {
                    userId: id
                }
            })
            res.push({
                id: -1,
                relation: {
                    name: "本人"
                },
                familyUserInfo: {
                    name: "",
                    id: id
                }
            })

            return res;
        } catch (err) {
            throw err;
        }
    }


    /**
     * 获取用户信息
     * @param {int} id  -
     * @returns {unknown}. 返回添加的结果 
     */
    async getUserInfoById(id) {
        try {

            if (!id) {
                throw new Error("getUserInfo id is empty");
            }
            let key = userInfoCacheKey(id);
            let cache = await $cache.get(key);
            if (cache) return cache;

            let res = await this.dataModels.user.findOne({
                where: {
                    wuid: id
                }
            })
            $cache.set(key, res, 60);
            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * 获取用户
     * @param {int} opid  -
     * @returns {unknown}. 返回添加的结果 
     */
    async getUserInfoByOpenid(opid) {
        try {

            if (!opid) {
                throw new Error("getUserInfoByOpenid opid is empty");
            }

            let key = `user-openid-${opid}`;
            let cache = await $cache.get(key);
            if (cache) return cache;
            let res = await this.dataModels.user.findOne({
                where: {
                    openid: opid
                }
            })
            //console.log("data values ",res.getValues());
            await $cache.set(key, res, 60);
            return res;
        } catch (err) {
            throw err;
        }


    }

    /**
     * 获取用户
     * @param {int} uid  -
     * @returns {unknown}. 返回添加的结果 
     */
    async getUserInfoByUnionId(uid) {
        try {

            if (!uid) {
                throw new Error("getUserInfoByUnionId opid is empty");
            }

            let res = this.dataModels.user.findOne({
                where: {
                    unionid: uid
                }
            })
            return res;
        } catch (err) {
            throw err;
        }
    }


    /**
     * 新增用户
     * @param {object}   -
     * @returns {unknown}. 返回添加的结果 
     */
    async addUser(data) {
        try {
            let user = await this.getUserInfoByOpenid(data.openid);
            if(user){
                return user;
            }
            return await this.dataModels.user.create(data);
        } catch (err) {
            throw err;
        }
    }

    /**
     * 编辑用户
     * @param {object}   -
     * @returns {unknown}. 返回添加的结果 
     */
    async setUser(data) {
        try {
            if(!data.wuid) throw new Error("wuid 不能为空");
            return await this.dataModels.user.update(data,{where:{wuid:data.wuid}});
        } catch (err) {
            throw err;
        }
    }





}
module.exports = (option) => {
    return new c(option)
};