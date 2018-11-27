
import { Test } from "../model/Test.Model"
const testModel = new Test({});


// test 参数接口
interface test {
    name: string
}

export default {
    

    async test(obj:test) {
        try {
            if (obj.name != 'test') {
                throw new Error("test.name is not test");
            }
            return await testModel.test({name:obj.name,age:12});
        }
        catch (err) {
            throw err
        }
    }

}