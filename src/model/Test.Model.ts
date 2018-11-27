///<reference path='../defined/common.d.ts' />
import { BaseModel } from "../lib/Base.Model"
import common from "../common/utils"



export interface getName {
    name: string,
    age: number,
}
export class Test extends BaseModel {
    opt: object;
    constructor(opt: object) {
        super();
        this.opt = opt;

    }

    async test(opt: getName) {
        //console.log(, "user model is ");
        // let key = 'cache';
        // let cache = await $cache.get(key);
        // if(cache)
        // {
        //     //console.log("from cache");
        //     return cache;
        // }
        // cache = await this.$m("user").findAll();
        // $cache.set(key,cache,1);
        // return cache;
        return {
            result:'hahah1'
        }

        //return common.dateFormate(new Date(), "yyyy-MM-dd hh")
    }

}
