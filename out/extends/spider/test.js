const utils = require("./lib/utils")

async function go() {
    //let ip = `http://173.249.60.42:3128`;
    let ip = `http://164.115.22.45:8080`;
    let res = await utils.checkValidProxyIp(ip);
    console.log(ip,res);
} 
go()
