import Toast from "../js/component/toast/toask";
import Unit from "./unit";
import Api from "./config";
import moment from "moment";

// 约定: 所用需要 DEVCONFIG 属性再这里先声明再使用
window.DEVCONFIG = {
  UserInfo: {}, // 用户信息
  DbHandle: {}, // 数据库操作对象
  GLHandle: {}, // geolocation操作对象
  Position: {}, // gps获取当前位置
  WatchId: null, // 监视位置id
  ConnHandle: {} // 网络链接操作对象
};

document.addEventListener("deviceready", onDeviceReady.bind(this), false);
function onDeviceReady() {
  console.log("Device is Ready!");
  // 后退按钮
  document.addEventListener(
    "backbutton",
    DEVCONFIG.BackButton.bind(this),
    false
  );

  // 设备在线
  // document.addEventListener("online", DEVCONFIG.ConnHandle.DeviceOnline.bind(this), false);
  // 设备离线
  document.addEventListener(
    "offline",
    DEVCONFIG.ConnHandle.DeviceOffline.bind(this),
    false
  );
  // 设备从后台恢复
  // document.addEventListener("resume", DEVCONFIG.DeviceResume.bind(this), false);
}

let exitTime = 0;
// 使用暂停回退按钮
DEVCONFIG.BackButton = function () {
  var router = window.nav.context.refs.router;
  if (router && router.pageOfProps && Object.keys(router.pageOfProps).length <= 2) {
    //进入后台
    var time = new Date().getTime();
    if (time - exitTime > 1000) {
      exitTime = time;

    } else {
      // navigator.app.exitApp();
      navigator.Backbutton.goHome(function () {

      }, function () {

      });
    }
  } else if (router && router.pageOfProps && Object.keys(router.pageOfProps).length > 2) {
    router.pop();
  } else {
    navigator.Backbutton.goHome(function () {

    }, function () {

    });
  }

};

// 打开初始化sqliteDb
DEVCONFIG.DbHandle.openDb = function (currDbPath, success, failure) {
  if (typeof cordova !== "undefined" && cordova.plugins.SqliteHelper) {
    cordova.plugins.SqliteHelper.open(
      function (res) {
        DEVCONFIG.Db = cordova.plugins.SqliteHelper;

        if (success && success instanceof Function) success();
      },
      function (err) {
        if (failure && failure instanceof Function) failure(err);
      },
      { dbPath: currDbPath }
    );
  } else {
    console.log("数据库未准备就绪");
  }
};

// 关闭数据库连接
DEVCONFIG.DbHandle.closeDb = function () {
  if (typeof cordova !== "undefined" && cordova.plugins.SqliteHelper) {
    cordova.plugins.SqliteHelper.open(
      function (res) {
        DEVCONFIG.Db = null;
      },
      function (err) { },
      {}
    );
  }
};

// 执行sql
DEVCONFIG.DbHandle.execSql = function (sql, sucCallback, failCallback) {
  if (DEVCONFIG.Db) {
    DEVCONFIG.Db.execSql(sucCallback, failCallback, {
      sql: sql
    });
    return;
  } else {
    failCallback &&
      failCallback instanceof Function &&
      failCallback("db 没有打开");
  }
};

// 查询sql
DEVCONFIG.DbHandle.querySql = function (sql, sucCallback, failCallback) {
  if (DEVCONFIG.Db) {
    DEVCONFIG.Db.querySql(sucCallback, failCallback, {
      sql: sql
    });
    return;
  } else {
    failCallback &&
      failCallback instanceof Function &&
      failCallback("db 没有打开");
  }
};

/**
 * 获取当前位置
 * @param {Function} callback
 * @param {Object} posOptions
 * enableHighAccuracy: 是否使用精确位置，默认为false
 * timeout: 获取位置的等待时间，单位毫秒，默认没限制
 * maximumAge: 重复获取位置时间间隔
 */
DEVCONFIG.GLHandle.getCurrPosition = function (callback, posOptions = {}) {
  var onSuccess = function (position) {
    DEVCONFIG.Position.currPosition = position;
    DEVCONFIG.Position.lastLongitude = position.coords.longitude;
    DEVCONFIG.Position.lastLatitude = position.coords.latitude;

    callback && callback instanceof Function && callback(position);
  };

  var onError = function (error) {
    alert("code: " + error.code + "\n" + "定位失败: " + error.message + "\n");
  };

  navigator.geolocation.getCurrentPosition(onSuccess, onError, posOptions);
};

/**
 * 监视位置信息
 * @param {Function} callback
 * @param {Object} posOptions
 */
DEVCONFIG.GLHandle.watchPosition = function (callback, posOptions = {}) {
  var onSuccess = function (position) {
    DEVCONFIG.currPosition = position;

    callback && callback instanceof Function && callback(position);
  };

  var onError = function (error) {
    alert("code: " + error.code + "\n" + "定位失败: " + error.message + "\n");
  };

  DEVCONFIG.WatchId = navigator.geolocation.watchPosition(
    onSuccess,
    onError,
    posOptions
  );
};

/**
 * 清除监视位置信息，同时取消记录gps信息
 */
DEVCONFIG.GLHandle.clearWatchPosition = function () {
  if (DEVCONFIG.WatchId) {
    navigator.geolocation.clearWatch(DEVCONFIG.WatchId);
  }
};

/**
 * 设备离线
 */
DEVCONFIG.ConnHandle.DeviceOffline = function () {
  Toast.info("设备离线！", 1000);
  return false;
};

/**
 * 判断上传时所需要的网络
 */
DEVCONFIG.ConnHandle.isConnection = function () {
  if (
    navigator.connection.type == Connection.WIFI ||
    navigator.connection.type == Connection.CELL_4G
  ) {
    return true;
  } else {
    return false;
  }
};

/**
 * 拍照
 */
DEVCONFIG.openCamera = function (callback) {
  navigator.camera.getPicture(onSuccess, onError, {
    quality: 100,
    destinationType: Camera.DestinationType.DATA_URL, //返回FILE_URI类型DATA_URL
    correctOrientation: true,
    sourceType: Camera.PictureSourceType.CAMERA, //指定图片来自拍照
    cameraDirection: Camera.Direction.FRONT, //指定前后摄像头--好像没起作用
    allowEdit: false,  //是否编辑图像
    targetWidth: 1680,
    targetHeight: 1050,
    encodingType: Camera.EncodingType.JPEG //指定返回图片是png格式还是jpeg
  });
  //拍照成功后回调
  function onSuccess(imageURI) {
    callback(imageURI);
  }
  //所有获取图片失败都回调此函数
  function onError(message) {
    // navigator.notification.alert("拍照失败，原因：" + message, null, "警告");
  }
};

/**
 * 打开相册
 */
DEVCONFIG.openAlbum = function (callback) {
  navigator.camera.getPicture(onSuccess, onError, {
    quality: 100,
    destinationType: Camera.DestinationType.DATA_URL, //返回Base64编码字符串
    sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM, //指定图片来自相册
    encodingType: Camera.EncodingType.JPEG //指定返回图片是png格式还是jpeg
  });
  function onSuccess(data) {
    callback(data);
  }
  function onError() {
    // navigator.notification.alert('获取失败');
  }
};

// 下载文件
DEVCONFIG.downloadFile = function (fileName, fileUrl) {
  Toast.info("下载中...", 5000)
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
    fs.root.getFile(fileName, { create: true, exclusive: false }, function (fileEntry) {
      //调用fileTransfer插件，下载图片
      var fileURL = fileEntry.nativeURL;
      var fileTransfer = new FileTransfer();
      // 服务器下载地址
      var uri = encodeURI(fileUrl);
      // 调用download方法
      fileTransfer.download(
        uri,         //uri网络下载路径
        fileURL,      //url本地存储路径
        function (entry) {
          Toast.close();
          Toast.info("下载成功", 1000);
        },
        function (error) {
          Toast.close();
          Toast.info(error.code, 1000);
        }
      );
    }, function (err) {
      Toast.info(err, 1000);
    });
  }, function (error) {
    Toast.info(err, 1000);
  });
}