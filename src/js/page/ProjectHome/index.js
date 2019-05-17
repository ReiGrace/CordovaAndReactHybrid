import PropTypes from 'prop-types';
import React, { Component } from "react";
import { TabBar } from "antd-mobile";
import HomePage from "./HomePage/index";

require("./index.less");
class ProjectHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: "HomeTab",
      height: document.documentElement.clientHeight - 50
    };
  }
  static contextTypes = {
    refs: PropTypes.object.isRequired
  };
  componentDidMount() {
    this.context.refs['Home'] = this;
  }

  renderContent(pageText) {
    if (pageText === "Home") {
      return <HomePage height={this.state.height} />
    } else if (pageText === "My") {

    }
  }

  render() {
    return (
      <div className="Projec-Home">
        <TabBar unselectedTintColor="#949494" tintColor="#e60012" barTintColor="white" hidden={this.state.hidden}>
          <TabBar.Item
            // icon={{ uri: "images/Project_Icon/Home_Gray.png" }}
            // selectedIcon={{ uri: "images/Project_Icon/Home.png" }}
            icon={
              <div
                style={{
                  width: "22px",
                  height: "20.5px",
                  background:
                    "url(images/Project_Icon/Home_Gray.png) center center /  22px 20.5px no-repeat"
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: "22px",
                  height: "20.5px",
                  background:
                    "url(images/Project_Icon/Home.png) center center /  22px 20.5px no-repeat"
                }}
              />
            }
            title="首页" key="0" selected={this.state.selectedTab === "HomeTab"}
            onPress={() => { this.setState({ selectedTab: "HomeTab" }); }}
          >
            {this.renderContent("Home")}
          </TabBar.Item>
          <TabBar.Item
            // icon={{ uri: "images/Project_Icon/Message_Gray.png" }}
            // selectedIcon={{ uri: "images/Project_Icon/Message.png" }}
            icon={
              <div
                style={{
                  width: "23.5px",
                  height: "20.5px",
                  background:
                    "url(images/Project_Icon/Message_Gray.png) center center /  23.5px 16.5px no-repeat"
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: "23.5px",
                  height: "20.5px",
                  background:
                    "url(images/Project_Icon/Message.png) center center /  23.5px 16.5px no-repeat"
                }}
              />
            }
            title="消息" key="1" selected={this.state.selectedTab === "MessageTab"}
            onPress={() => { this.setState({ selectedTab: "MessageTab" }); }}
          >
            {this.renderContent("Message")}
          </TabBar.Item>
          <TabBar.Item
            // icon={{ uri: "images/Project_Icon/Camera_Gray.png" }}
            // selectedIcon={{ uri: "images/Project_Icon/Camera.png" }}
            icon={
              <div
                style={{
                  width: "23px",
                  height: "20px",
                  background:
                    "url(images/Project_Icon/Camera_Gray.png) center center /  23px 18px no-repeat"
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: "23px",
                  height: "20px",
                  background:
                    "url(images/Project_Icon/Camera.png) center center /  23px 18px no-repeat"
                }}
              />
            }
            title="随手拍" key="2" selected={this.state.selectedTab === "CameraTab"}
            onPress={() => { this.setState({ selectedTab: "CameraTab" }); }}
          >
            {this.renderContent("Camera")}
          </TabBar.Item>
          <TabBar.Item
            // icon={{ uri: "images/Project_Icon/My_Gray.png" }}
            // selectedIcon={{ uri: "images/Project_Icon/My.png" }}
            icon={
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  background:
                    "url(images/Project_Icon/My_Gray.png) center center /  20px 20px no-repeat"
                }}
              />
            }
            selectedIcon={
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  background:
                    "url(images/Project_Icon/My.png) center center /  20px 20px no-repeat"
                }}
              />
            }
            title="我的" key="3" selected={this.state.selectedTab === "MyTab"}
            onPress={() => { this.setState({ selectedTab: "MyTab" }); }}
          >
            {this.renderContent("My")}
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

export default ProjectHome;
