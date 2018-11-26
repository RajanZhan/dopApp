/* 应用配置文件 */
export default {
    appName: "测试应用",
    width: 700,
    height: 500,
    // 顶部菜单
    menu: [{
            name: "编辑",
            icon: "el-icon-success",
            value: "edit"
        },
        {
            name: "开始",
            icon: "el-icon-success",
            value: "start",
            menu: [{
                    name: "新建工程",
                    icon: "add",
                    value: "newProject",
                    menu: [{
                            name: "新建学习工程",
                            value: '112'
                        },
                        {
                            name: "新建娱乐工程",
                            value: '113'
                        },
                    ],
                    handle: (that) => {
                        console.log("新建工程");
                    }
                },
                {
                    name: "退出",
                    icon: "exit",
                    value: "exit",
                    handle: (that) => {
                        console.log("新建工程");
                    }
                },
            ]
        },
    ],
    
    // 对应的页面配置
    pages: [{
            text: "用户管理",
            icon: "fa fa-wpforms",
            state: "open",
            value:"userMgt",
            children: [{
                    value: "default",
                    closable:false,
                    page:"default",
                    icon: "fa fa-wpforms",
                    text: "主页"
                },
                {
                    value: "addUser",
                    closable:true,
                    page:"user",
                    icon: "fa fa-wpforms",
                    text: "新增用户"
                },
                {
                    closable:true,
                    icon: "fa fa-wpforms",
                    value: "getUser",
                    page:"role",
                    text: "查询用户"
                },
                {
                    closable:true,
                    icon: "fa fa-wpforms",
                    value: "delUser",
                    page:"user",
                    text: "删除用户"
                },
                {
                    closable:true,
                    icon: "fa fa-wpforms",
                    value: "test",
                    page:"user",
                    text: "test"
                },
                {
                    closable:true,
                    icon: "fa fa-wpforms",
                    value: "test1",
                    page:"user",
                    text: "test1"
                },
                {
                    closable:true,
                    icon: "fa fa-wpforms",
                    value: "test2",
                    page:"user",
                    text: "test2"
                }
            ]
        },
       
    ]
}