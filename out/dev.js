var chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const watchfiles = [
    '../src/app.js',
     '../src/config.json',
      '../src/app.config.json'
]

module.exports = {
    autoCopyFile() {
        let startTime = new Date().getTime();
        // One-liner for current directory, ignores .dotfiles
        chokidar.watch(watchfiles, {
            // ignored: /(^|[\/\\])\../
        }).on('all', (event, path1) => {
           
            
            if((new Date().getTime() - startTime) < 500)
            {
                return console.log("初始化中，无需同步文件");
            }
            let from = path.join(__dirname, path1);
            let stat = fs.statSync(from);
            if (stat.isFile()) {
                let to = path.join(__dirname, path1.replace('src', 'out'));
                // 创建读取流
                let readable = fs.createReadStream(from);
                // 创建写入流
                let writable = fs.createWriteStream(to);
                // 通过管道来传输流
                readable.pipe(writable);
                console.log("文件同步..");
                // console.log(from, to)
                // console.log(path.join(__dirname, path1));
            }
        });
        console.log("文件同步进程启动...");
    }
}