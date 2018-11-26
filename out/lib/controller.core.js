/**
 *  这里是controller的核心方法
 * 
 */
module.exports = (app,controllers)=>{
    for(let key in controllers)
    {
        app.use(key,controllers[key].middle,controllers[key].router)
    }
}