import { Picker } from 'antd-mobile';
import { connect } from 'react-redux';
import { action } from 'action/index';

class XyPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data ? props.data : [],
            value: props.value ? props.value : [],
            cols: props.cols ? props.cols : '1',
            okText: props.okText ? props.okText : '确定',
            dismissText: props.dismissText ? props.dismissText : '取消',
            title: props.title ? props.title : '',
            extra: props.extra ? props.extra : '请选择',
            disabled: props.disabled ? props.disabled : false,
            cascade: props.cascade ? props.cascade : true,

            sqlCode: props.sqlCode ? props.sqlCode : '',
            tenantId: props.tenantId ? props.tenantId : JSON.parse(DEVCONFIG.userInfo.tokenUserEx).tenantId,
            ctUniqueIndex: props.ctUniqueIndex ? props.ctUniqueIndex : '',
            noPaging: props.noPaging ? props.noPaging : true,
            filter: props.filter ? props.filter : [],
            sort: props.sort ? props.sort : [],
            roleName: props.roleName ? props.roleName : ''
        }
    }
    componentDidMount() {
        var _this = this;
        if (this.state.sqlCode != '' && this.state.tenantId != '' && this.state.ctUniqueIndex != '') {
            this.props.postSqlExecuteAction({
                sqlCode: this.state.sqlCode,
                tenantId: this.state.tenantId,
                ctUniqueIndex: this.state.ctUniqueIndex,
                noPaging: this.state.noPaging,
                filter: JSON.stringify(this.state.filter),
                sort: JSON.stringify(this.state.sort)
            }, (res) => {
                if (res.code == '0') {
                    let arr = [];
                    res.data.map((item) => {
                        arr.push({ label: item.ctName, value: item.ctName })
                    });
                    this.setState({ data: arr });

                } else {
                    throw new Error('参数错误，' + res.msg);
                }
            });
        } else if (this.state.sqlCode != '' && this.state.tenantId != '' && this.state.roleName != '') {
            this.props.postSqlExecuteAction({
                sqlCode: this.state.sqlCode,
                tenantId: this.state.tenantId,
                roleName: this.state.roleName,
                noPaging: this.state.noPaging,
                filter: JSON.stringify(this.state.filter),
                sort: JSON.stringify(this.state.sort)
            }, (res) => {
                if (res.code == '0') {
                    let arr = [];

                    res.data.map((item) => {
                        arr.push({ label: item.userName, value: item.userId + ',' + item.userName })
                    });

                    this.setState({ data: arr });

                } else {
                    throw new Error('参数错误，' + res.msg);
                }
            });
        }
    }

    render() {
        const { data, value, cols, okText, dismissText, title, extra, disabled, cascade } = this.state;

        return (
            <Picker
                {...this.props}
                data={data}
                cols={cols}
            // value={value}
            // okText={okText}
            // dismissText={dismissText}
            // title={title}
            // extra={extra}
            // disabled={disabled}
            // cascade={cascade}
            // onChange={(value) => {
            //     this.props.onChange && this.props.onChange instanceof Function && this.props.onChange(value);
            // }}
            // onPickerChange={(value) => {
            //     this.props.onPickerChange && this.props.onPickerChange instanceof Function && this.props.onPickerChange(value);
            // }}
            // onVisibleChange={(visible) => {
            //     this.props.onVisibleChange && this.props.onVisibleChange instanceof Function && this.props.onVisibleChange(visible);
            // }}
            // onOk={(value) => {
            //     this.props.onOk && this.props.onOk instanceof Function && this.props.onOk(value);
            // }}
            // onDismiss={() => {
            //     this.props.onDismiss && this.props.onDismiss instanceof Function && this.props.onDismiss();
            // }}
            >
                {this.props.children}
            </Picker>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        postState: state.postSqlExecuteData,
    }
}

const mapDispatchToProps = (dispatch) => ({
    postSqlExecuteAction: (params, succsess) => {
        dispatch(action.postSqlExecuteAction(params, succsess));
    },
});

const XyPickerC = connect(mapStateToProps, mapDispatchToProps)(XyPicker);

export default XyPickerC;
