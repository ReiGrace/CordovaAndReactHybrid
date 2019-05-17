import PropTypes from 'prop-types';
import Api from 'config/config';

// import InfoDeal from '../../page/InfoDeal/index';
// import WorkOrderDeal from '../../page/WorkOrderDeal/index';

/**
 * 适用于蚂蚁金服steps组件
 * @param {String} stepContent 内容
 * @param {String} stepFiles 格式为"917c4ff2cbfd49179be213e514317844,0a35d8f38a164865a83328ebc52fc74e|clear.png,back.png"
 * @param {String} stepExtraParam 额外参数，保存信息或工单id
 */
class StepDescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stepContent: this.props.stepContent,
            stepFiles: this.props.stepFiles,
            stepExtraParam: this.props.stepExtraParam,
            stepUser: this.props.stepUser,
            stepLevel: this.props.stepLevel,
            stepTime: this.props.stepTime,
            stepFlowFlg: this.props.stepFlowFlg,
            stepStatus: this.props.stepStatus,
            stepCapital: this.props.stepCapital,
        }
    }
    static contextTypes = {
        refs: PropTypes.object.isRequired
    }
    onClick = () => {
        // if (this.state.stepContent && this.state.stepContent.indexOf('GD') >= 0) {
        //     this.context.refs['router'].push(WorkOrderDeal, { woId: this.state.stepExtraParam });
        // } else if (this.state.stepContent && this.state.stepContent.indexOf('XX') >= 0) {
        //     this.context.refs['router'].push(InfoDeal, { infoId: this.state.stepExtraParam })
        // }
    }

    render() {

        if (this.state.stepExtraParam) {
            return (
                <div>
                    {
                        <a onClick={() => { this.onClick(); }} >{this.state.stepContent}</a>
                    }
                    {
                        this.state.stepFiles && this.state.stepFiles.split('|')[0].split(',').map((imgId) => {
                            return <img
                                style={{ width: 100, height: 100, marginRight: 10 }}
                                src={Api.File.download + '?id=' + imgId}
                            />
                        })
                    }
                </div>
            );
        } else {
            if (this.state.stepFiles && this.state.stepFiles.indexOf('base64') > -1) {
                return (
                    <div>
                        <div>{this.state.stepContent}</div>
                        {
                            this.state.stepFiles && this.state.stepFiles.split('|').map((base64Img) => {
                                return <img
                                    style={{ width: 100, height: 100, marginRight: 10 }}
                                    src={base64Img}
                                />
                            })
                        }
                    </div>
                );
            } else {
                switch (this.state.stepFlowFlg) {
                    case 0:
                        return (
                            <div>
                                <div>上报时间：{this.state.stepTime}</div>
                                <div>隐患描述：{this.state.stepContent}</div>
                                <div>上报人：{this.state.stepUser}</div>
                                <div>隐患等级：
                                <span style={{ color: this.state.stepLevel == 1 ? '#f4ea2a' : '#d81e06' }}>
                                        {this.state.stepLevel == 1 ? '一般隐患' : '重大隐患'}
                                    </span>
                                </div>
                                {
                                    this.state.stepFiles && this.state.stepFiles.split('|')[0].split(',').map((imgId) => {
                                        return <img
                                            style={{ width: 100, height: 100, marginRight: 10, border: '1px solid #888' }}
                                            src={Api.File.download + '?id=' + imgId}
                                        />
                                    })
                                }
                            </div>
                        );
                    case 1:
                        return (
                            <div>
                                <div>审核状态：{this.state.stepStatus}</div>
                                <div>审核时间：{this.state.stepTime}</div>
                                <div>审核描述：{this.state.stepContent}</div>
                                <div>审核人：{this.state.stepUser}</div>
                                {
                                    this.state.stepFiles && this.state.stepFiles.split('|')[0].split(',').map((imgId) => {
                                        return <img
                                            style={{ width: 100, height: 100, marginRight: 10, border: '1px solid #888' }}
                                            src={Api.File.download + '?id=' + imgId}
                                        />
                                    })
                                }
                            </div>
                        );
                    case 2:
                        return (
                            <div>
                                <div>整改状态：{this.state.stepStatus}</div>
                                <div>整改时间：{this.state.stepTime}</div>
                                <div>整改资金：{this.state.stepCapital}</div>
                                <div>整改描述：{this.state.stepContent}</div>
                                <div>整改人：{this.state.stepUser}</div>
                                {
                                    this.state.stepFiles && this.state.stepFiles.split('|')[0].split(',').map((imgId) => {
                                        return <img
                                            style={{ width: 100, height: 100, marginRight: 10, border: '1px solid #888' }}
                                            src={Api.File.download + '?id=' + imgId}
                                        />
                                    })
                                }
                            </div>
                        );
                    case 3:
                        return (
                            <div>
                                <div>验收状态：{this.state.stepStatus}</div>
                                <div>验收时间：{this.state.stepTime}</div>
                                <div>验收描述：{this.state.stepContent}</div>
                                <div>验收人：{this.state.stepUser}</div>
                                {
                                    this.state.stepFiles && this.state.stepFiles.split('|')[0].split(',').map((imgId) => {
                                        return <img
                                            style={{ width: 100, height: 100, marginRight: 10, border: '1px solid #888' }}
                                            src={Api.File.download + '?id=' + imgId}
                                        />
                                    })
                                }
                            </div>
                        );
                    default:
                        return null;

                }

            }
        }

    }
}

export default StepDescription;