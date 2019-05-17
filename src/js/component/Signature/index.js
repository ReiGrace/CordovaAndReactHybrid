import React, { Component } from 'react';
import SignaturePad from 'react-signature-pad-wrapper'
import { Button, Modal, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
require("./index.less");
/**
 * 签名
 */
class Signature extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: this.props.disabled ? false : true,//是否可编辑
            model: false,//签名板展示控制  
            fileUrl: this.props.fileUrl ? this.props.fileUrl : undefined,//签名图片
            height: document.documentElement.clientHeight - 70,
            width: document.documentElement.clientWidth - 16,
        };
    }
    signatureClick = () => {//打开签名弹窗
        this.setState({ model: true });
    }
    onClose = key => (e) => {//关闭签名弹窗
        this.signaturePad.clear();
        this.setState({ model: false, });
    }
    handleClear = () => {//清除签名
        this.signaturePad.clear();
    }
    handleSubmit = () => {//确定签名
        if (this.signaturePad.isEmpty()) {
            Toast.offline('请先签名!!!', 1);
            return;
        }
        var dataURL = this.signaturePad.toDataURL('image/png');
        this.setState({ fileUrl: dataURL, model: false });
    }
    reSignatureClick = () => {//重新签名        
        this.setState({ model: true, });
    }
    render() {
        const { form, name, disabled } = this.props;
        return (
            <div className="signature">
                <div className="signature-container">
                    <span className="signature-container-img">
                        {
                            this.state.fileUrl ? <img src={this.state.fileUrl} alt="" /> : <span >暂无签名</span>
                        }
                    </span>
                    {form ?
                        <span style={{ display: 'none' }}>
                            {
                                form.getFieldDecorator(`${name}`, {
                                    initialValue: this.state.fileUrl,
                                })(<input type="text" />)
                            }
                        </span>
                        : ''}
                </div>
                {
                    this.state.disabled ?
                        this.state.fileUrl ?
                            <div className="signature-container" onClick={this.reSignatureClick}>
                                <span className="signature-container-lable">重签</span><img className="signature-container-ico" src="images/tbw/Sign.png" alt="" />
                            </div> :
                            <div className="signature-container" onClick={this.signatureClick}>
                                <span className="signature-container-lable">签名</span><img className="signature-container-ico" src="images/tbw/Sign.png" alt="" />
                            </div> : null
                }

                <Modal
                    visible={this.state.model}
                    transparent={false}
                    maskClosable={false}
                    onClose={this.onClose()}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <div className="signature-pad">
                        <WhiteSpace size="lg" />
                        <WingBlank size="lg" >
                            {/* style={{ height: this.state.height }} */}
                            <div className='signature-pad-body'>
                                <SignaturePad
                                    // height={this.state.height}
                                    width={this.state.width}
                                    ref={ref => this.signaturePad = ref}
                                    options={{ minWidth: 2, maxWidth: 3, }}
                                />
                            </div>
                            <WhiteSpace />
                            <Button onClick={() => { this.onClose()(); }} type="primary" size="small" inline>关闭</Button>
                            <Button onClick={this.handleClear} type="primary" size="small" inline>清除</Button>
                            <Button onClick={this.handleSubmit} type="primary" size="small" inline>确定</Button>
                        </WingBlank>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Signature;
