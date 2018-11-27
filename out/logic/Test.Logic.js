"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Test_Model_1 = require("../model/Test.Model");
const testModel = new Test_Model_1.Test({});
exports.default = {
    async test(obj) {
        try {
            if (obj.name != 'test') {
                throw new Error("test.name is not test");
            }
            return await testModel.test({ name: obj.name, age: 12 });
        }
        catch (err) {
            throw err;
        }
    }
};
