const Threads = require('webworker-threads');

module.exports = () => {


    function create(func, funcName,thread) {
        
        return new Promise((resolve, reject) => {
            function cb(err, data) {
                if(err) {
                    return reject(err);
                }
                resolve(data);
            }
            thread =  Threads.create().eval(func).eval(funcName, cb);
        })
    }

    return {
        create,
        worker:Threads.Worker,
    }
}