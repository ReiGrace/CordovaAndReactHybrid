import { Menu, ActivityIndicator, NavBar } from 'antd-mobile';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { action } from 'action/index';

require('./index.less');

const data = [
  {
    value: '1',
    label: '风险等级',
    children: [
      {
        label: '一般风险',
        value: '1',
      },
      {
        label: '重大风险',
        value: '2',
      }],
  }, {
    value: '2',
    label: '风险周期',
    children: [
      {
        label: '1次/天',
        value: '1',
      }, {
        label: '1次/月',
        value: '2',
      }, {
        label: '1次/年',
        value: '3',
      }]
  }
];

class XyMenu extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      initData: '',
      show: false,
    };
  }

  static contextTypes = {
      refs: PropTypes.object.isRequired
  }

  onChange = (value) => {
    console.log(value);
  }

  componentDidMount() {
      this.context.refs['XyMenu'] = this;
  }

  onOk = (value) => {
    console.log(value);
    this.onCancel();
  }

  onCancel = () => {
    this.setState({ show: false });
  }

  handleClick = (e) => {
    e.preventDefault(); // Fix event propagation on Android
    this.setState({
      show: !this.state.show,
    });
    // mock for async data loading
    if (!this.state.initData) {
      setTimeout(() => {
        this.setState({
          initData: data,
        });
      }, 500);
    }
  }

  onMaskClick = () => {
    this.setState({
      show: false,
    });
  }

  render() {
    const { initData, show } = this.state;
    const menuEl = (
      <Menu
        className="multi-foo-menu"
        data={initData}
        value={['1', ['3', '4']]}
        onChange={this.onChange}
        onOk={this.onOk}
        onCancel={this.onCancel}
        height={document.documentElement.clientHeight * 0.4}
        multiSelect
      />
    );
    const loadingEl = (
      <div style={{ position: 'absolute', width: '100%', height: document.documentElement.clientHeight * 0.4, display: 'flex', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </div>
    );
    return (
      <div className={show ? 'multi-menu-active' : ''}>
        <div>
          <NavBar
            leftContent="筛选"
            mode="light"
            onLeftClick={this.handleClick}
            className="multi-top-nav-bar"
          >
          </NavBar>
        </div>
        {show ? initData ? menuEl : loadingEl : null}
        {show ? <div className="menu-mask" onClick={this.onMaskClick} /> : null}
      </div>
    );
  }
}

export default XyMenu;