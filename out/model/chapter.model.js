const baseModel = require("../lib/baseModel");
const db = require("../common/db")();
// 专栏的model
class c extends baseModel{

    constructor(){
        super();
    }

    /**
     * 获取章节结构.
     * @param {number} colId -专栏id.
     * @returns {tree}. 章节的树形结构
     */
    async getChapter(colId){
        try{
            if(!colId){
                throw "chapter.model.getChapter,colId can not be empty";
            }
            var result = [];
            // 获取顶级章节
            var topChapter =  await this.dataModels.chapter.findAll({
                where:{
                    parentId:{
                        $in:[0,null,"NULL"]
                    },
                    colId:colId
                }
            });
            
            // 递归获取章节
            var getc = async (parent)=>{
                var chidren = await this.dataModels.chapter.findAll({
                    where:{
                        parentId:parent.id,
                        colId:colId
                    },
                    order:[['sort']]
                })
                for(let i in chidren)
                {
                    chidren[i] = await getc(chidren[i]);
                }
                if(!chidren)
                {
                    chidren = [];
                }
                parent.setDataValue("children",chidren)
                parent.setDataValue("title",parent.name + ` [${parent.sort}]`)
                parent.setDataValue("expand",true);
                //parent.chidren = chidren;
                return parent;
                
            }

            for(let i in topChapter)
            {
                topChapter[i] = await getc(topChapter[i]);
            }
            return  topChapter;
        }
        catch(err){
            throw err;
        }  
    }

     /**
     * 添加章节.
     * @param {object} data - 章节数据 {colId,name,parentId,sort,status:"默认状态true 章节发布"}.
     * @returns {unknown}. 返回添加的结果 
     */
    async setChapter(data){
        try{
            if(data.id)
            {
                return await this.dataModels.chapter.update(data,{
                    where:{
                        id:data.id
                    }
                });
            }
            else
            {
                return await this.dataModels.chapter.create(data);
            }
        }
        catch(err){
            throw err;
        }  
    }

     /**
     * 删除章节.
     * @param {array } data - 章节id索引 {章节的id数组}.
     * @returns {unknown}. 返回删除的结果 
     */
    async delChapter(data){
        try{
            var del = [];// 记录删除了哪些章节
            if(data.length == 0){
                throw "请传入章节数组";
            }
            for(let c of data)
            {
                //检测章节下面是否存在章节
               let child =  await this.dataModels.chapter.findOne({
                    where:{
                        parentId:c
                    }
                });
                if(child)
                {
                    continue;
                }

                // 检测章节下面是否存在文章
                let article  = await this.dataModels.article.findOne({
                    where:{
                        chapterId:c,
                    }
                })

                if(article)
                {
                    continue;
                }

                // 删除章节
                let res = await this.dataModels.chapter.destroy({
                    where:{
                        id:c
                    }
                })
                if(res)
                {
                    del.push(c);
                }
                
            }
            return del;
        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 根据专栏名字 获取专栏详细信息.
     * @param {string} name - 专栏名.
     * @returns {object}. 专栏详情
     */
    async getColumnByName(name){
        try{
            return await this.dataModels.column.findOne({
                where:{
                    name:name
                }
            });
        }
        catch(err){
            throw err;
        }  
    }

    /**
     * 根据专栏id 获取专栏详细信息.
     * @param {number} id - 专栏id.
     * @returns {object}. 专栏详情
     */
    async getColumnById(id){
        try{
            return await this.dataModels.column.findOne({
                where:{
                    id:id
                }
            });
        }
        catch(err){
            throw err;
        }  
    }


}
module.exports = c;