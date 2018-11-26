declare var  $common : {
   name:12,
   getname:()=>{},
   getRandomString:()=>{},
   isArray:(arr:any)=>{},
}
// req 全局对象
declare var $req : {
    session:(key:string)=>{},
    dsession:(key:string)=>{},
}

declare var  $logger :{
    error:(err:object)=>{}
}

declare var  $cache :{
    get:(key:string)=>{},
    set:(key:string,value:any,time?:number)=>{},
    delete:(key:string)=>{},
    expire:(key:string,time:number)=>{},
}

declare var $logic : (task:Array<any>,data:object)=>{
    
}
declare var $config :{
    noAuthPath:[]
}