import { connect } from "react-redux";
import { action } from "../../../redux/action/index";
import PropTypes from "prop-types";
import { Button, InputItem, WhiteSpace, Toast, Checkbox } from "antd-mobile";
import ProjectHome from "../ProjectHome/index";
import Api from '../../../config/config'
import moment from 'moment'
moment.locale('zh-cn');

const AgreeItem = Checkbox.AgreeItem;

require("./index.less");
/**
 * 登陆
 */
class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      checked: localStorage.getItem("zhgdusername") ? true : false,
      usernameValue: localStorage.getItem("zhgdusername"),
      password: localStorage.getItem("zhgdpassword"),
      height: document.documentElement.clientHeight
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  componentWillMount() {
    if (
      localStorage.getItem("accessToken") != null &&
      localStorage.getItem("accessToken") != ""
    ) {

    }
  }
  componentDidMount() {

    if (
      localStorage.getItem("username") != null &&
      localStorage.getItem("username") != ""
    ) {
      this.setState({
        usernameValue: localStorage.getItem("username") ? localStorage.getItem("username") : '',
        password: localStorage.getItem("zhgdpassword") ? localStorage.getItem("zhgdpassword") : ''
      });
    }

    // 处理键盘导致的页面变形
    window.onresize = () => {
      document.querySelector(".login-bg").style.height = this.state.height + "px";
    };
    //存入返回导航
    window.nav = this;
  }

  // 忘记密码
  forgetPassword = () => {
    // this.context.refs["router"].push(ForgetPassword);
  }

  //登陆
  enter = () => {
    if (
      this.state.usernameValue == "" ||
      this.refs["password"].state.value == ""
    ) {
      Toast.info("请填写正确的登录信息", 1);
      return false;
    }
    Toast.loading("登陆中...", 10);

    this.context.refs["router"].push(ProjectHome);
    Toast.hide();
    // this.props.postUserLogin({
    //   userAccount: this.state.usernameValue.replace(/\s+/g, ""),
    //   userPassword: this.refs["password"].state.value
    // }, (res) => {
    //   Toast.hide();
    //   if (res.code === 0) {
    //     DEVCONFIG.LoginInfo = res.data;
    //     localStorage.setItem("accessToken", res.data.accessToken);

    //     this.context.refs["router"].push(ProjectHome);

    //     if (this.state.checked) {
    //       localStorage.setItem('zhgdusername', this.state.usernameValue);
    //       localStorage.setItem('zhgdpassword', this.refs["password"].state.value);
    //     } else {
    //       localStorage.removeItem('zhgdusername');
    //       localStorage.removeItem('zhgdpassword');
    //     }
    //   } else {
    //     Toast.hide();
    //     Toast.fail("登陆失败！" + res.msg, 1.5);
    //   }
    // });


  };

  onUsernameChange = value => {
    this.setState({
      usernameValue: value
    });
  };
  onPasswordChange = value => {
    this.setState({
      password: value
    });
  }
  onCheckbox = (e) => {
    this.setState({
      checked: e.target.checked
    })
  }

  render() {
    return (
      <div className="login-bg" style={{ height: this.state.height, backgroundColor: "##f0f2f5" }}>
        <div className="login-logo">
          <img src="images/logo.png" />
        </div>
        <div className="login-title"></div>
        <div className="login-form">
          <InputItem placeholder="您的手机号" type="phone" ref="username" onChange={this.onUsernameChange} value={this.state.usernameValue} >
            用户
          </InputItem>
          <WhiteSpace />
          <InputItem placeholder="您的密码" type="password" ref="password" onChange={this.onPasswordChange} value={this.state.password}>
            密码
          </InputItem>

          <div className="my-checkbox">
            <AgreeItem data-seed="logId" onChange={(e) => this.onCheckbox(e)} checked={this.state.checked}>
              记住密码
          </AgreeItem>
            <a className="user-login-register" onClick={() => { this.forgetPassword(); }} style={{ float: "right" }}>
              <span>忘记密码</span>
            </a>
          </div>

          <div className="login-btn">
            <Button type="submit" onClick={() => { this.enter(); }} >
              登录
            </Button>
          </div>

          <div className="login-version">

          </div>
        </div>

        <div className="login-copyright">
          <div className="list-block-label">
            <p>科技有限公司</p>
            <p>Copyright@2019</p>
          </div>
        </div>

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loginState: state.inspectorLoginData,
    userInfoState: state.inspectorUserInfoData,
    UserLogin: state.UserLogin
  };
};

const mapDispatchToProps = dispatch => ({
  postUserLogin: (params, succsess) => {
    dispatch(action.postUserLogin(params, succsess));
  }
});

const LoginC = connect(mapStateToProps, mapDispatchToProps)(Login);
export default LoginC;
