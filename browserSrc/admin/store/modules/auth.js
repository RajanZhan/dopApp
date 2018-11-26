export default {
	namespaced: true,
	state: {
		login:false, //标志是否登录
		userInfo:{},// 
	},
    getters: {
		isLogin(state){
			//sessionStorage.set
			return sessionStorage.getItem("login");
		}
	},
    mutations: {
		setLogin(state,login){
			sessionStorage.setItem("login",login);
		},
		setUserMenu(state,userMenu){
			state.userMenu = userMenu;
			if(typeof(sessionStorage) != "undefined")
			{
				let menuArr = [];
				for(let m of userMenu){
					menuArr.push(m);
				}
				sessionStorage.setItem("userMenu",JSON.stringify(menuArr));
			}
		},
		
	},
	modules:{
		
	},
	actions:{
		
	},
}