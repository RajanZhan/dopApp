export default {

	namespaced: true,
	state: {
		 menu:[
			 {
				title:"内容管理",
				icon:"ios-analytics",
				children:[
					{
						title:"主页",
						key:"home",
						icon:"clipboard",
						show:true,
					},
					// {
					// 	title:"专栏管理",
					// 	key:"column",
					// 	icon:"clipboard",
					// 	show:true,// 在左侧导航显示
					// },
					// {
					// 	title:"文章管理",
					// 	key:"article",
					// 	icon:"ios-book-outline",
					// 	show:false,
					// },
					{
						title:"订单管理",
						key:"orders",
						icon:"ios-book-outline",
						show:true,
					},
				]
			 }
		 ],
		 activeTagName:"",
		 opendTags:[],// 已打开的 tags
		 tagKeyMap:new Map(),// 菜单项索引
	},
    getters: {
		getMenu(state){
			return state.menu;
		},
		getActiveTagName(state){
			if(state.activeTagName){
				return state.activeTagName;
			}
			return sessionStorage.getItem("activeTagName");
			
		},
		getOpendTags(state){
			if((!state.opendTags) || (state.opendTags.length == 0) )
			{
				let cache = sessionStorage.getItem("opendTags");
				if(cache)
				{
					state.opendTags =  JSON.parse(cache);
				}
			}

			return state.opendTags;
			
		},
		getTagKeyMap(state){
			return state.tagKeyMap;
		}
	},
    mutations: {
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
		setActiveTagName(state,name){
			state.activeTagName = name;
			sessionStorage.setItem("activeTagName",name);
		},
		setOpendTags(state,opendTags){
			state.opendTags = opendTags;
			sessionStorage.setItem("opendTags",JSON.stringify(state.opendTags))
		},

		// 追加已打开tag 队列
		pushOpendTags(state,tag){
			state.opendTags.push(tag);
			sessionStorage.setItem("opendTags",JSON.stringify(state.opendTags))
			//console.log("opened tags",state.opendTags);
		},

		// 关闭tag 
		closeTag(state,key){
			var newOpend = [];
			for(let t of state.opendTags){
				if(t.key != key){
					newOpend.push(t);
				}
			}
			console.log("new opend" ,newOpend,key);
			state.opendTags = newOpend;
			sessionStorage.setItem("opendTags",JSON.stringify(state.opendTags))
		},
		

		setTagKeyMap(state,tag){
			if(tag && tag.key){
				state.tagKeyMap.set(tag.key,tag);
			}
		}
		
	},
	modules:{
		
	},
	actions:{
		
	},
}