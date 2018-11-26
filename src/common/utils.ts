const uuidv1 = require('uuid/v4');
const fs = require("fs");
export  default {
	/**
	 * 内部方法，统一的异常抛出
	 * @param {number} page - 页数.
	 */
    _error(err) {
        throw `common.lib error: ${err}`;
    },

	/**
	 * 将页码转换为数据库分页查询的对象
	 * @param {number} page - 页数.
	 * @param {number} psize - 分页的大小.
	 * @returns {object}. 返回分页查询对象 {limit:xx,offset:xx}
	 */
    getPageForSql(page, psize) {
        if ((!page) || (!psize)) this._error("getPageForSql，page 或者psize 不能为空");
        page = parseInt(page);
        page--;
        if ((page) < 0) {
            page = 1
        }
        return {
            limit: parseInt(psize),
            offset: (parseInt(page)) * parseInt(psize),
        }
    },
	/**
	 * 生成随机任意长度的字符串
	 * @returns {string}. 返回字符串
	 */
    getRandomString() {
        return uuidv1();
    },

	/**
	 * 检测对象是否为数组
	 * @returns {object}. 返回字符串
	 */
    isArray(o) {
        return Object.prototype.toString.call(o) == '[object Array]';
    },

	/**
	 * 检测后台系统是否已登录
	 * @param {res} response 对象，用于直接输出信息
	 * @returns {boolean}. 返回是否已登录
	 */
    async isAdminLogin(res) {
        let admin = await $req.session("admin");
        if (admin) {
            return true;
        }

        if (res) {
            res.deny("管理员尚未登录")
        }
        return false;
    },

    // 格式化时间 "yyyy-MM-dd hh:mm:ss" 
    dateFormate(date:Date|number, fmt:string):string {
        var dd = new Date(date);
        function d(fmt):string{ //author: meizz 
            var o = {
                "M+": dd.getMonth() + 1, //月份 
                "d+": dd.getDate(), //日 
                "h+": dd.getHours(), //小时 
                "m+": dd.getMinutes(), //分 
                "s+": dd.getSeconds(), //秒 
                "q+": Math.floor((dd.getMonth() + 3) / 3), //季度 
                "S": dd.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dd.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
        return d(fmt);

    },

    sleep(time) {
        return new Promise((reslove) => {
            setTimeout(() => {
                reslove();
            }, time)
        })
    },


    // 数组合并 
    arrMerge(arr) {
        let res = [];
        for (let a of arr) {
            for (let i of a) {
                res.push(i);
            }
        }
        return res;
    },

    // 生成md5
    md5(str:string) {
        const crypto = require('crypto');
        const hash = crypto.createHash('md5');
        hash.update(str);
        return hash.digest('hex')
    },

    // 获取今日的时间范围
    getTodayTime() {
        return {
            start: new Date(this.dateFormate(new Date(), "yyyy-MM-dd") + " 00:00:00"),
            end: new Date(this.dateFormate(new Date(), "yyyy-MM-dd") + " 23:59:59")
        }
    },


}