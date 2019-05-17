import PropTypes from 'prop-types';
import React, { Component } from "react";
import { NavBar, Carousel, Grid, PullToRefresh, Toast } from "antd-mobile";
import { connect } from "react-redux";
import { action } from "../../../../redux/action/index";

require('./index.less');

class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,//是否显示刷新状态
            data: [
                "",
                "",
                ""
            ],
            imgHeight: 160,
            width: document.documentElement.clientWidth,
            title: ''
        };

    }
    static contextTypes = {
        refs: PropTypes.object.isRequired
    };

    componentWillMount() {
        // this.loadData();
    }

    loadData() {
        this.setState({ refreshing: true });
        this.props.getUserRoleResData({
            userId: DEVCONFIG.userInfo.tokenUserId,
        }, (res) => {
            console.log('getUserRoleResData: ', res);
            res.data && res.data.userAppResDataDTOList.length && res.data.userAppResDataDTOList.sort((a, b) => {
                if (a.parentNode.resShowOrder > b.parentNode.resShowOrder) {
                    return 1;
                } else if (a.parentNode.resShowOrder < b.parentNode.resShowOrder) {
                    return -1;
                }
                return 0;
            });
            res.data && res.data.userAppResDataDTOList.length && res.data.userAppResDataDTOList.map((item) => {
                item.childNodeList && item.childNodeList.length && item.childNodeList.sort((a, b) => {
                    if (a.resShowOrder > b.resShowOrder) {
                        return 1;
                    } else if (a.resShowOrder < b.resShowOrder) {
                        return -1;
                    }
                    return 0;
                });
            });
            this.setState({ refreshing: false });
        })
    }

    applyClick = (_el) => {
        var text = _el.path
        console.log('text: ', text);
        switch (text) {
            default:
                break;
        }
    }

    render() {
        const { title } = this.state;
        const { powerData, height } = this.props;

        return (
            <div style={{ height: height }}>
                <NavBar
                    className="mainnav"
                    rightContent={<span onClick={this.handleClick} >项目</span>}
                    className="single-top-nav-bar"
                    leftContent={<span><i className="iconfont icon-dingwei"
                        style={{ marginRight: "4px" }}
                    /></span>}>
                    <span style={{ width: document.documentElement.clientWidth * 0.55 + 'px' }}>{title}</span>
                </NavBar>
                <Carousel
                    autoplay={true}
                    infinite
                    beforeChange={(from, to) => { }}
                    afterChange={index => { }}
                >
                    {this.state.data.map(val => (
                        <a key={val} style={{ display: "inline-block", width: "100%", height: this.state.imgHeight }}>
                            <img src={val} alt="" style={{ width: "100%", verticalAlign: "top" }}
                                onLoad={() => {
                                    window.dispatchEvent(new Event("resize"));
                                    this.setState({ imgHeight: "auto" });
                                }}
                            />
                        </a>
                    ))}
                </Carousel>
                <PullToRefresh
                    damping={30}
                    ref={el => this.ptr = el}
                    style={{
                        height: height - 45 - 160,
                        overflow: 'auto',
                    }}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                        this.loadData()
                    }}
                    className="drop-down-refresh"
                >
                    <div className="cnt-container">
                        {powerData !== undefined && powerData !== null ?
                            <div>
                                {powerData.userAppResDataDTOList.map((v, i) => {
                                    let listData = [];
                                    v.childNodeList.forEach(element => {
                                        listData.push({
                                            icon: element.resAppIcon,
                                            text: element.resName,
                                            path: element.resPath,
                                        });
                                    });
                                    return (
                                        <div className="cmt-list" key={i}>
                                            <div className="cmt-list-title">
                                                <div className="title-name-gw-tag" />
                                                {v.parentNode.resName}
                                            </div>
                                            <div className="cmt-list-term" />
                                            <Grid data={listData} activeStyle={false} columnNum={4} hasLine={false} LabourServices
                                                onClick={_el => {
                                                    this.applyClick(_el)
                                                }}
                                                itemStyle={{ backgroundColor: "#F5F5F9" }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            : null
                        }
                    </div>
                </PullToRefresh>

            </div >
        );
    }
}

const mapStateToProps = state => {
    return {
        powerData: state.UserRoleRes
    };
};
const mapDispatchToProps = dispatch => ({
    postSqlExecuteOpenAction: (params, succsess) => {
        dispatch(action.postSqlExecuteOpenAction(params, succsess));
    },
});
const HomePageC = connect(mapStateToProps, mapDispatchToProps)(HomePage);
export default HomePageC;
