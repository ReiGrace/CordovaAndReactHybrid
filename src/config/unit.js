var Unit = {};
Unit.DEFAULT_RADIUS = 6378137; // 默认地球半径

/**
 * 构造Get请求函数
 * @param {Object} data 数据
 * @param {Boolean} isAppend 是否附加?
 */
Unit.paramData = function (data, isAppend = true) {
  if (data === undefined) {
    return "";
  }

  var paramArr = [];
  var paramStr = "";

  for (var attr in data) {
    paramArr.push(attr + "=" + data[attr]);
  }

  paramStr = paramArr.join("&");

  if (isAppend !== false) {
    paramStr = paramStr === "" ? paramStr : "?" + paramStr;
  }

  return paramStr;
};

/**
 * 验证手机号是否合法
 * str 
 */
Unit.isPoneAvailable = function (str) {
  var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}

/**
 * 获取uuid，紧凑但性能较差
 * xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 */
Unit.getUuid = function () {
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * 获取11位数卡号
 */
Unit.getCardId = function () {
  return "xxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 10) | 0,
      v = c == "x" ? r : 0;
    return v;
  });
};

/**
 * 随机生成几位数
 * @param {Number} number: 生成位数
 */
Unit.RondomPass = function (number) {
  var arr = new Array;
  var arr1 = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9");

  for (var i = 0; i < number; i++) {
    var n = Math.floor(Math.random() * 10);
    arr[i] = arr1[n];
  }

  val = arr.join("")
  return val;
}

// 用户友好提示
/**
 * 返回结果异常枚举
 * @param {Number} code: code代码
 * @param {String} msg: 后台返回的信息
 * @param {Object} _this: 当前页面
 * @param {Function} callback: 执行的回调函数
 *
 * -1: 表示未知错误。
 *
 * 0: 无错误，接口执行成功。
 *
 * 1 - 100: 服务端直接向用户的友好提示， msg 携带的内容直接展示给用户，约定 100 代表 valid 注解 BindingResult 产生的错误提示。
 *
 * 101 - 1000: 用于框架核心与业务无关的通用性错误, 此枚举类只枚举此类 CODE。
 *
 * 1001 - 2000: 统一认证和权限管理模块。
 *
 * 2001 - 3000: SQL 服务模块。
 *
 * 3001 - 4000: 内容管理模块（文件管理，文章管理，excel 导入导出 和 云存储）。
 *
 * 4001 - 5000: 消息模块（WebSocket模块，邮件模块，短信模块）。
 *
 * 5001 - 6000: 任务调度模块。
 *
 * 6001 - 7000: 全文检索。
 *
 * 7001 - 8000: 会员系统。
 *
 * 8001 - 9000: 工单系统。
 *
 * 9001 - 10000: 工作流系统。
 * ......
 *
 * 业务模块的 code 值从 20000 开始由项目自行分配。
 * */
Unit.getCodeMsg = function (code, msg, _this, callback) {
  if (code == -1) {
    return "系统未知错误，请稍后再试！";
  } else if (code > 0 && code <= 100) {
    return msg;
  } else if (code == 101 || code == 102) {
    callback && callback instanceof Function && callback();
    _this.context.refs["router"].login();
    return "请重新登录";
  } else if (code > 102 && code < 105) {
    callback && callback instanceof Function && callback();
    return msg;
  } else if (code >= 105 && code < 1000) {
    return msg;
  } else {
    return msg;
  }
};

/**
 * 判断数据类型是否为数组
 * @param {Object} value 传入数据
 */
Unit.isArrayFn = function (value) {
  if (typeof Array.isArray === "function") {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === "[object Array]";
  }
};

/**
 * 判断数据类型
 * @param {Object} value 传入数据
 */
Unit.isTypeFn = function (value) {
  var type = Object.prototype.toString.call(value);

  if (type === "[object Array]") {
    return "Array";
  } else if (type === "[object Object]") {
    return "Object";
  } else {
    return "param is no object type";
  }
};

/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
Unit.isInArray = function (arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
};

/**
 * 使用indexOf判断元素是否存在于数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
Unit.isInArray3 = function (arr, value) {
  if (arr.indexOf && typeof arr.indexOf == "function") {
    var index = arr.indexOf(value);
    if (index >= 0) {
      return true;
    }
  }
  return false;
};

/**
 * 驼峰转下划线
 * @param {String} string 驼峰格式字符串
 */
Unit.humpToUnderline = function (string) {
  var newString = "";
  var reg = new RegExp(/[A-Z]/g);

  for (var i = 0; i < string.length; i++) {
    if (reg.test(string.charAt(i))) {
      newString += "_" + string.charAt(i).toLocaleLowerCase();
    } else {
      newString += string.charAt(i);
    }
  }

  return newString;
};

/**
 * 下划线转驼峰
 * @param {String} string 下划线格式字符串
 */
Unit.underlineToHump = function (string) {
  var newString = "";
  var reg = new RegExp(/_/g);

  for (var i = 0; i < string.length; i++) {
    if (reg.test(string.charAt(i))) {
      newString += string.charAt(i + 1).toLocaleUpperCase();
      i++;
    } else {
      newString += string.charAt(i);
    }
  }

  return newString;
};

/**
 * 获取下划线转驼峰的数据
 * @param {Object} data 需要转换的对象
 */
Unit.getUnderlineToHumpData = function (data) {
  var newData = {};

  for (var key in data) {
    var newKey = Unit.underlineToHump(key);

    newData[newKey] = data[key];
  }

  return newData;
};

/**
 * 获取insert的sql或sql数组
 * @param {Object or Array} data
 * @param {String} tableName
 * @param {Array} existCol
 */
Unit.getInsertSql = function (data, tableName, existCol) {
  // 当data为数组时，返回sql数组
  if (Unit.isTypeFn(data) == "Array") {
    var sqlArr = [];

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var sql = "",
        attrName = "",
        attrValue = "";

      for (var key in item) {
        if (existCol) {
          if (Unit.isInArray(existCol, Unit.humpToUnderline(key))) {
            attrName += Unit.humpToUnderline(key) + ",";
            attrValue += "'" + item[key] + "'" + ",";
          }
        } else {
          attrName += Unit.humpToUnderline(key) + ",";
          attrValue += "'" + item[key] + "'" + ",";
        }
      }

      attrName = attrName.substr(0, attrName.length - 1);
      attrValue = attrValue.substr(0, attrValue.length - 1);

      attrName = "(" + attrName + ")";
      attrValue = "(" + attrValue + ")";

      sql = `INSERT INTO ${tableName} ${attrName} VALUES ${attrValue}`;
      sqlArr.push(sql);
    }

    return sqlArr;
  }
  // 当data为对象，只有一条时，返回sql
  else if (Unit.isTypeFn(data) == "Object") {
    var sql = "",
      attrName = "",
      attrValue = "";

    for (var key in data) {
      if (existCol) {
        if (Unit.isInArray(existCol, Unit.humpToUnderline(key))) {
          attrName += Unit.humpToUnderline(key) + ",";
          attrValue += "'" + data[key] + "'" + ",";
        }
      } else {
        attrName += Unit.humpToUnderline(key) + ",";
        attrValue += "'" + data[key] + "'" + ",";
      }
    }

    attrName = attrName.substr(0, attrName.length - 1);
    attrValue = attrValue.substr(0, attrValue.length - 1);

    attrName = "(" + attrName + ")";
    attrValue = "(" + attrValue + ")";

    sql = `INSERT INTO ${tableName} ${attrName} VALUES ${attrValue}`;

    return sql;
  }
  // 返回空字符串
  else {
    return "";
  }
};

/**
 * 获取delete的sql
 * @param {String} tableName
 * @param {String} conditions
 */
Unit.getDeleteSql = function (tableName, conditions) {
  var sql = "";

  // 当有条件时
  if (conditions != null && conditions != undefined && conditions != "") {
    sql = `DELETE FROM ${tableName} ${conditions}`;
  }
  // 删除全部
  else {
    sql = `DELETE FROM ${tableName}`;
  }

  return sql;
};

/**
 * 区分巡检计划类型
 * @param {String} value 巡检计划类型
 */
Unit.getType = function (value) {
  switch (value) {
    case "1":
      return "常规计划";
    case "2":
      return "日周期计划";
    case "3":
      return "周周期计划";
    case "4":
      return "月周期计划";
    case "5":
      return "年周期计划";
    case "6":
      return "自定义周期计划";
    default:
      return "";
  }
};

/**
 * 获取巡检计划类型图片名称
 * @param {String} value
 */
Unit.getPlanTypeImg = function (value) {
  switch (value) {
    case "1":
      return "daily";
    case "2":
      return "day";
    case "3":
      return "week";
    case "4":
      return "month";
    case "5":
      return "year";
    case "6":
      return "custom";
    default:
      return "daily";
  }
};

/**
 * 获取工单类型图片名称
 * @param {String} value
 */
Unit.getOrderTypeImg = function (value) {
  switch (value) {
    case "1":
      return "dispatch";
    case "2":
      return "self";
    case "3":
      return "send";
    default:
      return "dispatch";
  }
};

/**
 * 获取信息类型图片名称
 * @param {String} value
 */
Unit.getInfoTypeImg = function (value) {
  switch (value) {
    case "1":
      return "app";
    case "2":
      return "phone";
    default:
      return "app";
  }
};

/**
 * 区分巡检点类型
 * @param {String} value 巡检点类型
 */
Unit.getCkpoiType = function (value) {
  switch (value) {
    case "1":
      return "设施设备";
    case "2":
      return "风险点";
    case "3":
      return "工地点";
    case "4":
      return "临时检查点";
    default:
      return "";
  }
};

/**
 * 图像文件转Base64
 * @param {Image} img 图片
 */
Unit.getBase64Image = function (img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);

  var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLocaleLowerCase();
  var dataUrl = canvas.toDataURL("image/" + ext);

  return dataUrl;
};

/**
 * Base64字符串转二进制
 * @param {String} dataurl
 */
Unit.dataUrlToBlob = function (dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], {
    type: mime
  });
};

/**
 * 组装FormData数据，适用于ant-m组件
 * @param {File} file 单个文件数据
 * @param {String} fileMD5 MD5码
 */
Unit.assembleFormData = function (file, fileMD5) {
  let formData = new FormData();
  formData.append("file", file);
  formData.append(
    "snowFileTypeId",
    JSON.parse(DEVCONFIG.userInfo.tokenUserTenant).tenantTopFiletypeId
  );
  formData.append(
    "snowFileStorageId",
    JSON.parse(DEVCONFIG.userInfo.tokenUserTenant).tenantFileStorageId
  );
  formData.append("fileMD5", fileMD5);

  return formData;
};

/**
 * 根据下标移除数组指定元素
 * @param {Array} arr
 * @param {Number} index
 */
Unit.rmEleFromArrByIndex = function (arr, index) {
  let newArr = [];

  if (arr && arr.length) {
    arr.map(function (item, _index) {
      if (_index != index) {
        newArr.push(item);
      }
    });
  }

  return newArr;
};

/**
 * 判断是否巡检到位
 * @param {number} lng1 第一点经度
 * @param {number} lat1 第一点纬度
 * @param {number} lng2 第一点经度
 * @param {number} lat2 第二点纬度
 * @param {Number} accuracy 巡检精度
 */
Unit.isPatrolArrived = function (lng1, lat1, lng2, lat2, accuracy) {
  var distance = Unit.DistanceLngLat(lng1, lat1, lng2, lat2);

  if (distance < accuracy) {
    return true;
  } else {
    return false;
  }
};

/**
 * 获取两点（经纬度坐标点）之间的距离值
 * @memberof Unit
 * @param {number} lng1 第一点经度
 * @param {number} lat1 第一点纬度
 * @param {number} lng2 第一点经度
 * @param {number} lat2 第二点纬度
 * @return {number} 两点距离值
 */
Unit.DistanceLngLat = function (lng1, lat1, lng2, lat2) {
  var radLat1 = Unit.Rad(lat1);
  var radLng1 = Unit.Rad(lng1);
  var radLat2 = Unit.Rad(lat2);
  var radLng2 = Unit.Rad(lng2);
  var a = radLat1 - radLat2;
  var b = radLng1 - radLng2;
  var result =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    ) *
    Unit.DEFAULT_RADIUS;
  return result;
};

/**
 * 经纬度转换成弧度值
 * @memberof Unit
 * @param {number} d 经纬度值
 * @return {number} 弧度值
 * @author zxy
 * @version 0.0.1
 */
Unit.Rad = function (d) {
  return (d * Math.PI) / 180;
};

/**
 * 判断时间是否为当天
 * @param {String} dateString '2018-07-30 17:45:57'
 */
Unit.isToday = function (dateString) {
  if (new Date(dateString).toDateString() === new Date().toDateString()) {
    // 今天
    return true;
  } else if (new Date(dateString) < new Date()) {
    // 之前
    return false;
  } else if (dateString == "") {
    // 时间戳清空为空，判断为昨天
    return false;
  }
};

/**
 * 根据返回值获取风险名称
 * @param {String} value 1.低风险 2.一般风险 3.较大风险 4.重大风险
 */
Unit.getRiskLevelNameByCode = function (value) {
  value = value.toString();

  switch (value) {
    case "1":
      return "低风险";
    case "2":
      return "一般风险";
    case "3":
      return "较大风险";
    case "4":
      return "重大风险";
    default:
      return "";
  }
};

/**
 * 根据返回值获取风险颜色
 * @param {String} value 1.低风险 2.一般风险 3.较大风险 4.重大风险
 */
Unit.getRiskLevelColorByCode = function (value) {
  if (value) {
    value = value.toString();

    switch (value) {
      case "1":
        return "#58b4fb";
      case "2":
        return "#fbd243";
      case "3":
        return "#fbac58";
      case "4":
        return "#fa6486";
      default:
        return "58b4fb";
    }
  } else {
    return "58b4fb";
  }
};

/**
 * 根据返回值获取风险渐变色
 * @param {String} value 1.低风险 2.一般风险 3.较大风险 4.重大风险
 */
Unit.getRiskLevelGradientColorByCode = function (value) {
  if (value) {
    value = value.toString();

    switch (value) {
      case "1":
        return "#abd9fd";
      case "2":
        return "#fde591";
      case "3":
        return "#fdd5ab";
      case "4":
        return "#fdb9c8";
      default:
        return "abd9fd";
    }
  } else {
    return "abd9fd";
  }
};

/**
 * 根据返回值获取隐患颜色
 * @param {String} value 1.一般隐患 2.重大隐患
 */
Unit.getDangerLevelColorByCode = function (value) {
  if (value) {
    value = value.toString();

    switch (value) {
      case "1":
        return "#fbd243";
      case "2":
        return "#fa6486";
      default:
        return "fbd243";
    }
  } else {
    return "fbd243";
  }
};

/**
 * 判断当前登录用户（组织）类型，以获取查询风险点列表的sqlCode
 * (1-企业；2-部门；6-班组；7-岗位)
 */
Unit.getRiskSqlCodeByOrgType = function () {
  var orgType = JSON.parse(DEVCONFIG.userInfo.tokenUserOrg).orgSysType;

  switch (orgType) {
    case "1":
      return "getCompanyControlDate";
    case "2":
      return "getDepartMentControlData";
    case "6":
      return "getTeamControlDataByTenantId";
    case "7":
      return "getRiskControlDataByNot";
    default:
      return "";
  }
};

/**
 * 判断当前登录用户（组织）类型，以获取查询隐患列表的sqlCode
 * (1-企业；2-部门；6-班组；7-岗位)
 */
Unit.getDangerSqlCodeByOrgType = function () {
  var orgType = JSON.parse(DEVCONFIG.userInfo.tokenUserOrg).orgSysType;

  switch (orgType) {
    case "1":
      return "getCompanyDangerDateByTenantId";
    case "2":
      return "getDepartmentDangerByTenantId";
    case "6":
      return "getTeamDangerByTenantId";
    case "7":
      return "getPostDangerByTenantId";
    default:
      return "";
  }
};

/**
 * 判断当前登录用户（角色）类型，以获取查询风险点列表的sqlCode
 * (1-企业；2-部门；6-班组；7-岗位)
 */
Unit.getRiskSqlCodeByRoleType = function () {
  var roleType = JSON.parse(DEVCONFIG.userInfo.tokenUserRole)[0].roleName;
  switch (roleType) {
    case "企业":
      return "getCompanyControlDate";
    case "部门":
      return "getDepartMentControlData";
    case "班组":
      return "getTeamControlDataByTenantId";
    // case '岗位':
    //     return 'getRiskControlDataByNot';
    case "岗位":
      return "getControlDatasByTenantIdAndPointName";
    default:
      return "";
  }
};

/**
 * 判断当前登录用户（角色）类型，以获取查询隐患列表的sqlCode
 * (1-企业；2-部门；6-班组；7-岗位)
 */
Unit.getDangerSqlCodeByRoleType = function () {
  var roleType = JSON.parse(DEVCONFIG.userInfo.tokenUserRole)[0].roleName;

  switch (roleType) {
    // case '企业':
    //     return 'getCompanyDangerDateByTenantId';
    case "验收":
      return "getDangerByCheckUserId";
    case "整改":
      return "getDangerByHandleUserId";
    case "审核":
      return "getDangerByExamineUserId";
    default:
      return "";
  }
};

/**
 * 根据状态值获取隐患状态颜色
 * @param {String} value 0.未处理 1.已处理 2.已上报
 */
Unit.getDangerStatusColorByCode = function (value) {
  value = value.toString();

  switch (value) {
    case "0":
      return {
        color: "#ff8686",
        backgroundColor: "#fee7e7",
        float: "right",
        padding: 5,
        borderRadius: 5
      };
    case "1":
      return {
        color: "#68d8e6",
        backgroundColor: "#d3f4f8",
        float: "right",
        padding: 5,
        borderRadius: 5
      };
    case "2":
      return {
        color: "#2ecc71",
        backgroundColor: "#bafed7",
        float: "right",
        padding: 5,
        borderRadius: 5
      };
    default:
      return "";
  }
};

/**
 * 判断是否是JSON字符串
 * @param {String} str 传值
 */
Unit.isJSON = function (str) {
  if (typeof str == "string") {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == "object" && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  } else {
    return false;
  }
};

/**
 * 获取当前日期的时间戳
 */
Unit.getDateTime = function () {
  var date = new Date();
  var seperator = "-";
  //默认为0-11
  var month = date.getMonth() + 1,
    day = date.getDate(),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (day >= 1 && day <= 9) {
    day = "0" + day;
  }
  if (hours >= 1 && hours <= 9) {
    hours = "0" + hours;
  }
  if (minutes >= 1 && minutes <= 9) {
    minutes = "0" + minutes;
  }
  if (seconds >= 1 && seconds <= 9) {
    seconds = "0" + seconds;
  }
  return (
    date.getFullYear() +
    seperator +
    month +
    seperator +
    day +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds
  );
};

/**
 * Blob to Base64
 * @param {*} blob
 * @param {*} callback
 */
Unit.blobToDataURL = function (blob, callback) {
  var a = new FileReader();
  a.onload = function (e) {
    callback(e.target.result);
  };
  a.readAsDataURL(blob);
};

/**
 * 从一个对象数组中通过对象的指定属性和值获取数组的元素
 * @memberof Unit
 * @method getElementByAttr
 * @param {Array} arr 数组，
 * @param {String} attrname 属性名称
 * @param {String} attrvalue 属性值
 * @return {Object|Boolean} 数组元素|false
 * @since 0.0.1
 * @Author: evilrule
 */
Unit.getElementByAttr = function (arr, attrname, attrvalue) {
  for (var i = 0, len = arr.length; i < len; i++) {
    if (!arr[i][attrname] || typeof arr[i][attrname] != "object")
      if (arr[i][attrname] == attrvalue) return arr[i];
  }
  return false;
};

/**
 * 根据出生年月日获取当前
 * @memberof Unit
 * @method status //出生年-月-日
 * @since 0.0.1
 * @Author: evilrule
 */
Unit.Age = function Age(status) {
  var r = status.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
  var aDate = new Date();
  var thisYear = aDate.getFullYear();
  var bDate = new Date(r);
  var brith = bDate.getFullYear();
  var age = (thisYear - brith);
  return age;
}

/**
 * 字符串日期格式化
 * @value 日期字符串
 */
Unit.FormatedDate = function (value) {
  var r = value.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3")
  return r
}

/**
 * 动火作业票状态
 */
Unit.hotWorkStatus = function (value) {
  switch (value) {
    case 1:
      return "待修改";
    case 2:
      return "待审批";
    case 3:
      return "已完成";
    case 4:
      return "无效";
  }

  /**
 * 申请事由
 */
  Unit.hotWorkStatus2 = function (value) {
    switch (value) {
      case 1:
        return "待修改";
      case 2:
        return "待审批";
      case 3:
        return "已完成";
      case 4:
        return "无效";
    }
  }
}

export default Unit;
