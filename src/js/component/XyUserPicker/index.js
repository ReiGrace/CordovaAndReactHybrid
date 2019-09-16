import PropTypes from 'prop-types';
import { NavBar, SearchBar, Toast, List, Checkbox, Button } from "antd-mobile";
import { connect } from 'react-redux';
import { action } from 'action/index';

require('./index.less');

const CheckboxItem = Checkbox.CheckboxItem;
const Brief = List.Item.Brief;

// TODO: 目前还不够完善，必须通过reducer来保证数据一致
class XyUserPicker extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      current: 0,
      orgId: '',
      orgPage: [],
      orgData: [],
      userData: [],
      selected: {},
      selectedNum: 0,
      selectedMax: 5,
      selectedShow: false,
      searchShow: false
    };
  }

  static contextTypes = {
    refs: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.context.refs['XyUserPicker'] = this;

    let orgId = this.props.orgId,
      orgName = this.props.orgName,
      max = this.props.max,
      selected = this.props.selected,
      id = this.props.id;

    if (typeof id !== 'string' || id.length === 0) {
      this.context.refs['router'].pop();
      throw new Error('缺少必要参数：id');
    }

    // 在此接收参数
    if (!orgId || !orgName) {
      this.setState({
        orgId: 'bb606b54c9f14cae88138447f7168c46',
        orgPage: [{ orgId: 'bb606b54c9f14cae88138447f7168c46', orgName: '成都建工集团' }],
        selectedMax: max && max > 0 ? max : 5,
        selected: selected || {},
        selectedNum: (selected && Object.keys(selected).length) || 0
      });
    } else {
      if (typeof orgId !== 'string' || orgId.length !== 32) {
        this.context.refs['router'].pop();
        throw new Error('传入的组织机构ID不合法');
      }
      if (typeof orgName !== 'string' || orgName.length === 0) {
        this.context.refs['router'].pop();
        throw new Error('传入的组织机构名称不合法');
      }

      this.setState({
        orgId: orgId,
        orgPage: [{ orgId: orgId, orgName: orgName }],
        selectedMax: max && max > 0 ? max : 5,
        selected: selected || {},
        selectedNum: (selected && Object.keys(selected).length) || 0
      });
    }

  }

  // 一定要清理数据，防止其他组件使用的时候存在影响
  componentWillUnmount() {
    this.props.xyUserPickerAction({ clean: true });
  }

  // 加入组织页面
  push = (orgId, orgName) => {
    this.state.orgPage.push({ orgId: orgId, orgName: orgName });

    this.setState({
      orgPage: this.state.orgPage,
      current: this.state.current + 1
    });
  }

  // 返回指定页面
  pop = (orgId) => {
    if (typeof orgId == 'string' && orgId.length > 0) {
      let current = this.state.current;

      while (orgId != this.state.orgPage[current].orgId) {
        this.state.orgPage.pop();

        current = current - 1;
      }

      this.setState({
        current: current
      });
    } else {
      this.state.orgPage.pop();

      this.setState({
        current: this.state.current - 1
      });
    }
  }

  // 切换到下属单位
  onSubClick = (orgId, orgName) => {
    this.push(orgId, orgName);
  }

  // 切换单位导航
  onNavClick = (orgId) => {
    this.pop(orgId);
  }

  // 多选框改变
  onCheckboxChange = (e, user) => {
    let selectedNum = this.state.selectedNum,
      selectedMax = this.state.selectedMax,
      selected = this.state.selected;

    if (e.target && e.target.checked && selectedNum === selectedMax) {
      Toast.info('超过最大选择人数', 1.5);
      return;
    }

    // 选中人员改变
    if (e.target && e.target.checked) {
      selected[user.userId] = user;
      selectedNum++;
    } else if (e.target && !e.target.checked && selectedNum > 0) {
      delete selected[user.userId];
      selectedNum--;
    }
    this.setState({ selected: selected, selectedNum: selectedNum });

    // 更新调用组件数据（格式唯一）
    this.props.xyUserPickerAction({ id: this.props.id, data: selected });
  }

  // 显示已选择人员界面
  onSelectedClick = () => {
    let page = document.querySelector('.selected-page');

    if (this.state.selectedShow) {
      page.classList.remove('selected-page-show');
      page.classList.add('selected-page-hide');
    } else {
      page.classList.add('selected-page-show');
      page.classList.remove('selected-page-hide');
    }

    this.setState({ selectedShow: !this.state.selectedShow });
  }

  // 已选择人员界面，删除人员
  onIconCancelClick = (userId) => {
    let selectedNum = this.state.selectedNum,
      selected = this.state.selected;
    if (userId && selected[userId] !== undefined) {
      delete selected[userId];
      selectedNum--;
      this.setState({ selected: selected, selectedNum: selectedNum });

      // 更新调用组件数据（格式唯一）
      this.props.xyUserPickerAction({ id: this.props.id, data: selected });
    }
  }

  // 显示搜索页面
  onSearchClick = () => {
    this.setState({ searchShow: !this.state.searchShow }, () => {
      if (this.refs && this.refs.autoFocusInst) {
        this.refs.autoFocusInst.focus();
      }
    });
  }

  // 返回值
  onOkClick = () => {

    // 更新调用组件数据（格式唯一）
    this.props.xyUserPickerAction(
      {
        id: this.props.id,
        data: this.state.selected
      },
      () => {
        this.context.refs['router'].pop();
      });
  }


  render() {
    const { selected, selectedNum, selectedMax, orgPage, current, searchShow, orgId } = this.state;

    let htmlArr = [];
    for (let index = 0; index < orgPage.length; index++) {
      const element = orgPage[index];

      let offset = (index - current) * (window.screen.width);

      htmlArr.push(
        <SelectPageC
          orgId={element.orgId}
          key={index}
          index={index}
          left={offset}
          selected={selected}
          selectedNum={selectedNum}
          selectedMax={selectedMax}
          onSubClick={this.onSubClick}
          onCheckboxChange={this.onCheckboxChange}
        ></SelectPageC>
      );

    }

    return (
      <div className='xy-user-picker'>
        <NavBar
          className="return-nav"
          leftContent={
            <span className="nav-left-content" onClick={() => { this.context.refs['router'].pop(); }} >
              <i className="iconfont icon-fanhui1" />
              <p>返回</p>
            </span>

          }
        >选择用户</NavBar>

        <UnableSearchBar onSearchClick={this.onSearchClick} />

        <SelectBar orgPage={orgPage} onNavClick={this.onNavClick} />

        <div className='select-cnt'>
          {htmlArr}
        </div>

        <div className='footer'>
          {
            selectedNum > 0 ?
              <div onClick={this.onSelectedClick} className='prompt active'>
                已选择：{selectedNum}人<div className='top-arrow'></div>
              </div> :
              <div className='prompt'>最多选择{selectedMax}人</div>
          }
          <Button type="primary" inline size="small" onClick={this.onOkClick}>确定（{selectedNum}/{selectedMax}）</Button>
        </div>

        <SelectSearchC
          show={searchShow}
          orgId={orgId}
          selected={selected}
          selectedNum={selectedNum}
          selectedMax={selectedMax}
          onCheckboxChange={this.onCheckboxChange}
          onSearchClick={this.onSearchClick}
        />

        <SelectedPage
          obj={selected}
          onSelectedClick={this.onSelectedClick}
          onIconCancelClick={this.onIconCancelClick}
        />
      </div>
    );
  }
}

// 组织机构下属以及用户选择
class SelectPage extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      orgData: [],
      userData: [],
      selectedNum: 0
    };
  }

  componentDidMount() {
    this.loadOrg();
    this.loadUser();
  }

  loadOrg = () => {
    let filter = [
      {
        property: "orgShowStatus",
        operator: "eq",
        value: 1
      }
    ];

    filter.push(
      {
        property: "orgPid",
        operator: "eq",
        value: this.props.orgId
      }
    );

    this.props.postSqlExecuteAction(
      {
        sqlCode: 'getOrgList_app',
        filter: JSON.stringify(filter),
        sort: JSON.stringify([
          {
            property: 'displayOrder',
            direction: 'ASC'
          }
        ]),
        noPaging: true
      },
      (res) => {
        if (res.code === 0) {

          if (res.data && res.data.length) {
            this.setState({ orgData: res.data });
          } else {
            this.setState({ orgData: [] });
          }

        } else {
          Toast.fail(Unit.getCodeMsg(res.code, '加载失败！' + res.msg, this), 2);
        }
      }
    );
  }

  loadUser = () => {
    let filter = [
      {
        property: "adminOrg",
        operator: "eq",
        value: this.props.orgId
      }
    ];

    this.props.postSqlExecuteAction(
      {
        sqlCode: 'getUserAdminList_app',
        filter: JSON.stringify(filter),
        noPaging: true
      },
      (res) => {
        if (res.code === 0) {

          if (res.data && res.data.length) {
            this.setState({ userData: res.data });
          } else {
            this.setState({ userData: [] });
          }

        } else {
          Toast.fail(Unit.getCodeMsg(res.code, '加载失败！' + res.msg, this), 2);
        }
      }
    );
  }

  render() {
    const { orgData, userData } = this.state;
    const { selected, selectedNum, selectedMax } = this.props;

    return (
      <div className='select-page' style={{ width: window.screen.width, left: this.props.left }} >
        {
          orgData && orgData.length ? <List renderHeader={() => '组织机构'}>

            {
              orgData.map(item => {
                return (
                  <List.Item platform="android" onClick={() => { }}>
                    <div className='check-item'>
                      <div className='check-item-main'>
                        <div>{item.orgName}</div>
                        {/* <span>（2 人）</span> */}
                      </div>

                      <div className='check-item-sub'>
                        |<span onClick={() => { this.props.onSubClick(item.orgId, item.orgName) }}>
                          <i className='iconfont icon-xiashudikuai'></i>下属</span>
                      </div>
                    </div>
                  </List.Item>
                  // 无法全选，暂时使用List.Item
                  // <CheckboxItem key={item.orgId} onChange={(item) => this.onChange(1)}>
                  //   <div className='check-item'>
                  //     <div className='check-item-main'>
                  //       <div>{item.orgName}</div>
                  //       <span>（2 人）</span>
                  //     </div>

                  //     <div className='check-item-sub'>
                  //       |<span onClick={() => { this.props.onSubClick(item.orgId, item.orgName) }}>
                  //         <i className='iconfont icon-xiashudikuai'></i>下属</span>
                  //     </div>
                  //   </div>
                  // </CheckboxItem>
                );
              })
            }
          </List> : <div></div>
        }

        <List renderHeader={() => '用户'}>
          {
            userData && userData.length ? userData.map(item => {
              return (
                <CheckboxItem
                  key={item.userId}
                  checked={selected[item.userId] === undefined ? false : true}
                  disabled={selectedNum < selectedMax ? false : selected[item.userId] === undefined ? true : false}
                  onChange={(e) => this.props.onCheckboxChange(e, item)}
                >
                  <div className='check-item'>
                    <div className='check-item-img'>
                      <img src={item.userProfilephoto ? item.userProfilephoto : 'images/My_Page/My_Portrait.jpg'} />
                    </div>
                    <div className='check-item-name'>{item.userName}</div>
                  </div>
                </CheckboxItem>
              );
            }) : <div className='empty'>暂无用户</div>
          }
        </List>
      </div>
    )
  }
}

// 组织机构标签栏
class SelectBar extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      orgNav: []
    };
  }

  componentWillReceiveProps(props) {
    if (props.orgPage && Array.isArray(props.orgPage) && props.orgPage.length) {
      this.setState({ orgNav: props.orgPage });
    }
  }

  render() {
    const { orgNav } = this.state;

    let htmlArr = [];
    for (let index = 0; index < orgNav.length; index++) {
      const element = orgNav[index];

      if (index === orgNav.length - 1) {
        htmlArr.push(
          <div className='nav-cnt'>
            <a className='active'>{element.orgName}</a>
          </div>
        );
      } else {
        htmlArr.push(
          <div className='nav-cnt'>
            <a className='nav-return' onClick={() => { this.props.onNavClick(element.orgId) }}>{element.orgName}</a>
            <i className='iconfont icon-jiantouarrow487'></i>
          </div>
        );
      }

    }

    return (
      <div className='select-bar'>
        <div className='bar-cnt'>
          {htmlArr}
        </div>
      </div>
    );
  }
}

// 搜索栏，只负责点击没有实际搜索功能
class UnableSearchBar extends React.Component {
  constructor(...args) {
    super(...args);
  }

  render() {

    return (
      <div className='search-bar'>
        <div className='search-input' onClick={this.props.onSearchClick}>
          <div className='search-synthetic-ph'>
            <span className='search-synthetic-ph-container'>
              <i className='search-synthetic-ph-icon'></i>
              <span className='search-synthetic-ph-placeholder'>搜索</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

// 搜索页面
class SelectSearch extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      searchText: '',
      userData: []
    }
  }

  onCancel = () => {
    this.setState({ searchText: '', userData: [] }, () => {
      this.props.onSearchClick();
    });
  }

  onChange = (val) => {
    this.setState({ searchText: val }, () => {
      if (val) {
        this.loadUser();
      } else {
        this.setState({ userData: [] });
      }
    });
  }

  onClear = () => {
    this.setState({ userData: [] });
  }

  loadUser = () => {
    let filter = [
      {
        property: "orgId",
        operator: "like",
        value: this.props.orgId,
        group: 'org'
      },
      {
        property: "orgPidTree",
        operator: "like",
        value: this.props.orgId,
        group: 'org'
      },
      {
        property: "userName",
        operator: "like",
        value: this.state.searchText,
        group: 'search'
      },
      {
        property: "userPhone",
        operator: "like",
        value: this.state.searchText,
        group: 'search'
      },
      {
        property: "userAccount",
        operator: "like",
        value: this.state.searchText,
        group: 'search'
      }
    ];


    this.props.postSqlExecuteAction(
      {
        sqlCode: 'getUserAdminList_app',
        filter: JSON.stringify(filter),
        noPaging: true
      },
      (res) => {
        if (res.code === 0) {

          if (res.data && res.data.length) {
            this.setState({ userData: res.data });
          } else {
            this.setState({ userData: [] });
          }

        } else {
          Toast.fail(Unit.getCodeMsg(res.code, '加载失败！' + res.msg, this), 2);
        }
      }
    );
  }

  render() {
    const { userData, searchText } = this.state;
    const { show, selected, selectedNum, selectedMax } = this.props;

    return (
      <div className='search-page' style={{ display: show ? 'block' : 'none' }}>
        <SearchBar
          placeholder="搜索（姓名/账号/电话）"
          maxLength={20}
          showCancelButton
          value={searchText}
          onCancel={this.onCancel}
          onChange={this.onChange}
          onClear={this.onClear}
          ref={ref => this.refs.autoFocusInst = ref}
        />
        <List>
          {
            userData && userData.length ? userData.map(item => {
              return (
                <CheckboxItem
                  key={item.userId}
                  checked={selected[item.userId] === undefined ? false : true}
                  disabled={selectedNum < selectedMax ? false : selected[item.userId] === undefined ? true : false}
                  onChange={(e) => this.props.onCheckboxChange(e, item)}
                >
                  <div className='check-item'>
                    <div className='check-item-img'>
                      <img src={item.userProfilephoto ? item.userProfilephoto : 'images/My_Page/My_Portrait.jpg'} />
                    </div>
                    <div className='check-item-cnt'>
                      <div className='check-item-name'>{item.userName}</div>
                      <div className='check-item-org'>{item.orgNameTree && item.orgNameTree.replace(/,/g, '-')}</div>
                    </div>

                  </div>
                </CheckboxItem>
              );
            }) : <div className='empty transparent'>暂无用户</div>
          }
        </List>
      </div>
    );
  }
}

// 已选择页面
class SelectedPage extends React.Component {
  constructor(...args) {
    super(...args);
  }

  render() {
    const { obj } = this.props;

    return (
      <div className='selected-page'>
        <NavBar
          className="return-nav"
          rightContent={
            <span className="nav-right-content" onClick={this.props.onSelectedClick} >
              <p>确定</p>
            </span>
          }
        >已选：{Object.keys(obj).length}人</NavBar>
        <List>
          {
            obj && Object.keys(obj).length ? Object.values(obj).map(item => {
              return (
                <List.Item
                  className='user-item'
                  align="middle"
                  thumb={item.userProfilephoto ? item.userProfilephoto : 'images/My_Page/My_Portrait.jpg'}
                  extra={<i onClick={() => { this.props.onIconCancelClick(item.userId); }} className='iconfont icon-quxiao'></i>}
                >{item.userName}<Brief>{item.orgNameTree && item.orgNameTree.replace(/,/g, '-')}</Brief>
                </List.Item>
              );
            }) : <div className='empty'>暂无内容</div>
          }
        </List>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  postSqlExecuteAction: (params, succsess) => {
    dispatch(action.postSqlExecuteAction(params, succsess));
  },
  xyUserPickerAction: (params, succsess) => {
    dispatch(action.xyUserPickerAction(params, succsess));
  }
});
const XyUserPickerC = connect(null, mapDispatchToProps)(XyUserPicker);
const SelectSearchC = connect(null, mapDispatchToProps)(SelectSearch);
const SelectPageC = connect(null, mapDispatchToProps)(SelectPage);

export default XyUserPickerC;