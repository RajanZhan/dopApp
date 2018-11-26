module.exports = (req, res, next) => {
    try {
        //console.log("post middle",req.body);
        if(typeof(req.body) == "string")
        {
            for (let k in req.body) {
                if (k) {
                    // console.log('kkk',k);
                    let str = k.slice(k.indexOf("{"), k.lastIndexOf('}') + 1)
                    console.log("post changed ", str);
                    req.body = JSON.parse(k);
                    break;
                }
                // console.log("trans k",k);
            }
        }
        
        
        next();
    }
    catch (err) {
        res.end(err);
    }

}