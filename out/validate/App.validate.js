module.exports = {
    
    // 用户名
    async name(value){
        if((!value) || (value != "name")){
            console.log(value);
            return [false,'name不合法']
        }
        return [true]
    },
}