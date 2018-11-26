import { uptime } from "os";

export default {

    getRandomValue(size) {
        if (size < 0) {
            size = 5;
        }
        return Math.random().toFixed(size);
    },

    // 还原iview 的tree 的所有节点的选中状态
    resetTreeSelected(tree) {
        console.log("还原");
        var setSelected = (tree) => {
            for (let i in tree) {
                tree[i].selected = true;

                if ((tree[i].children) && (tree[i].children.length > 0)) {
                    setSelected(tree[i].children);
                }
            }
        }
        setSelected(tree);
    },

    /**
     * 从指定树形组件中删除指定id的元素
     * @param {array} tree  树形元素
     * @param {array} ids 要删除的 id 数组
     * @return {null} 无返回值
     */
    removeItemFromTree(tree, ids) {

        var del = (tree) => {
            var newTree = [];
            for (let i in tree) {
                let isIn = false; // 标志本元素是否是删除的目标
                for (let id of ids) {
                    if (tree[i].id == id) {
                        isIn = true;
                        break;
                    }
                }
                if (isIn) {
                    continue;
                }

                if ((tree[i].children) && (tree[i].children.length > 0)) {
                    tree[i].children = del(tree[i].children);
                }
                newTree.push(tree[i])
            }

            return newTree;
        }
        return del(tree);
    },

    /**
     * 从指定树形组件中更新指定id的元素
     * @param {array} tree  树形元素
     * @param {array} ids 要更新的 id 数组
     * @return {null} 无返回值
     */
    updateItemFromTree(tree, ids) {

        var deal = (tree) => {
            var newTree = [];
            for (let i in tree) {
                let isIn = false; // 标志本元素是否是删除的目标
                var upitem = tree[i];
                for (let up of ids) {
                    if (tree[i].id == up.id) {
                        isIn = true;
                        upitem = up;
                        break;
                    }
                }

                if ((tree[i].children) && (tree[i].children.length > 0)) {
                    tree[i].children = deal(tree[i].children);
                }
                upitem.title = upitem.name + ` [${upitem.sort}]`
                newTree.push(upitem) // 更新节点
            }
            return newTree;
        }
        
        let newc = deal(tree);
        console.log("更新节点",newc);
        return newc;
    },

    // 等分数据
    divideArr(data,size){
        var result = [];
        for(var i=0,len=data.length;i<len;i+=size){
            result.push(data.slice(i,i+size));
         }
         return result;
    },
}

