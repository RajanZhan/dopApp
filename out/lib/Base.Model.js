"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path='../defined/db.d.ts' />
class BaseModel {
    constructor() {
        this.models = $db.models;
    }
    // 调动数据数据模型
    $m(dataModelName) {
        return $db.models[dataModelName];
    }
}
exports.BaseModel = BaseModel;
