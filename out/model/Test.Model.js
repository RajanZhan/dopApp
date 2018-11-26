"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path='../defined/common.d.ts' />
const Base_Model_1 = require("../lib/Base.Model");
class Test extends Base_Model_1.BaseModel {
    constructor(opt) {
        super();
        this.opt = opt;
    }
    async test(opt) {
        //console.log(, "user model is ");
        let key = 'cache';
        let cache = await $cache.get(key);
        if (cache) {
            //console.log("from cache");
            return cache;
        }
        cache = await this.$m("user").findAll();
        $cache.set(key, cache, 1);
        return cache;
        //return common.dateFormate(new Date(), "yyyy-MM-dd hh")
    }
}
exports.Test = Test;
