///<reference path='../defined/db.d.ts' />
export class BaseModel {

    models:any
    constructor()
    {
        this.models = $db.models;
    }
    // 调动数据数据模型
    $m(dataModelName:string)
    {
        return $db.models[dataModelName]
    }
}

