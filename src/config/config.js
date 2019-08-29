let Api = {};
let isDebug = false;

//APP接口地址
Api.Common = isDebug ? "http://192.168.31.234:8888" : "";

// 系统SQL服务通用接口
Api.Sql = {};
Api.Sql.execute = Api.Common + "/score/sql/execute";
Api.Sql.executeOpen = Api.Common + "/score/sql/executeOpen";

//登陆
Api.Login = {};
Api.Login.userLogin = Api.Common + "/app/user/login";

// 忘记密码
Api.Password = {};
Api.Password.forgetePassword = Api.Common + "/app/user/forgetPassword";


module.exports = Api;
