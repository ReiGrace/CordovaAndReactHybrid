import React, { Component } from 'react';
import { List, Modal, Toast } from "antd-mobile";
import { connect } from "react-redux";
import { action } from "../../../redux/action/index";
const alert = Modal.alert;
const Item = List.Item;
class Attachment extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    handelDownload = (name, path) => {
        DEVCONFIG.downloadFile(name, path)
    }
    render() {

        const { data } = this.props;
        return (
            <div>
                {
                    data ? <List renderHeader={() => '附件'} className="my-list">
                        {
                            data.map((v, k) => {
                                return (
                                    <Item
                                        key={k}
                                        extra="下载"
                                        // arrow="horizontal"
                                        onClick={() => {
                                            Toast.loading('', 20)
                                            this.props.appGetFileInfo({
                                                fileId: v.fileId
                                            }, (res) => {
                                                Toast.hide()
                                                if (res.code === 0) {
                                                    alert('附件下载', `下载附件${res.data.fileName}`, [
                                                        { text: '取消', onPress: () => { } },
                                                        {
                                                            text: '下载', onPress: () => {
                                                                this.handelDownload(res.data.fileName, res.data.filePath)
                                                            }
                                                        },
                                                    ])
                                                }
                                            })
                                        }}
                                    >
                                        {v.fileOriginalName}
                                    </Item>
                                )
                            })
                        }
                    </List> : ''
                }
            </div>

        );
    }
}

const mapDispatchToProps = dispatch => ({
    //获取文件路径
    appGetFileInfo: (params, succsess) => {
        dispatch(action.appGetFileInfo(params, succsess));
    },
});
const AttachmentC = connect(null, mapDispatchToProps)(Attachment);
export default AttachmentC;
