
const request = require("request");
const fs = require("fs");
const path =require("path");
class c {
   async test() {
        return 18000;
    }
    
    getName()
    {
        return "rajan"
    }
	
	// 测试微信的上传信息接口 
	async wxUpload()
	{
		try{
			
			return new Promise((resolve,reject)=>{
				
				let url = "http://file.api.weixin.qq.com/cgi-bin/media/upload?access_token=15_qrLgjICyH6-qvB9pae3nSuo0mWLjpW6UjgeHH_iweLsX148xktsprL9iuShwb0YkA4w1qBNj5tGs2jQ3lnNDX6VFB6mA9pj0CH0i-qwCcJBux8vl8Du0DvU4kU5GIzPBMZ23VR_vz2JnjxRPDQAaAGAUHR&type=voice"
			
			let staticpath = path.join(__dirname,"../static/upload.mp3");
			if(!fs.existsSync(staticpath))
			{
				return reject("文件不存在");
			}
			//return staticpath;
			let formData = {
					media: {
					value:  fs.createReadStream(staticpath),
					options: {
					  filename: 'upload.mp3',
					  contentType: 'audio/mp3'
					}
			  }
			}
				request.post({url:url, formData: formData}, function optionalCallback(err, httpResponse, body) {
			  if (err) {
				  reject(err)
				return console.error('upload failed:', err);
			  }
			  resolve(body);
			  console.log('Upload successful!  Server responded with:', body);
			  
				});
			})
			
			
		}
		catch(err)
		{
			throw err
		}
	}
}
module.exports = () => {
    return new c();
}