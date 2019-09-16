import { Toast, ActionSheet } from "antd-mobile";
import { action } from "action/index";

const coordtransform = require('coordtransform');

// 判断是否是IOS
const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
    wrapProps = {
        onTouchStart: e => e.preventDefault(),
    };
}

/**
 * Cordova调用其它导航APP
 * 需要配合DEVCONFIG全局文件使用
 */
let XyNavigation = {

    // 调用导航功能
    showNavigatorSheet: (orgId) => {
        if (!orgId) {
            Toast.info('请选择需要导航的项目', 1.5);
            return;
        }
        Toast.loading('正在获取导航应用...', 30);

        XyNavigation.checkNavigatorApp(
            (BUTTONS) => {
                Toast.hide();

                if (BUTTONS.length === 0) {
                    Toast.info('请下载高德地图、百度地图、腾讯地图任意一款导航应用', 2);
                    return;
                }
                BUTTONS.push('取消');

                ActionSheet.showActionSheetWithOptions({
                    options: BUTTONS,
                    cancelButtonIndex: BUTTONS.length - 1,
                    // title: 'title',
                    message: '请选择导航应用',
                    maskClosable: true,
                    'data-seed': 'logId',
                    wrapProps,
                },

                    // 点击回调
                    (buttonIndex) => {

                        // 取消直接返回
                        if (BUTTONS[buttonIndex] === '取消') {
                            return;
                        }

                        let originName = '',
                            origin = [],
                            destinationName = '',
                            destination = [];

                        Toast.loading('定位中...', 30);

                        // 处理出发地与目的地坐标及名称
                        DEVCONFIG.GLHandle.getCurrPosition((position) => {

                            // 起始点坐标为WGS84，为统一需要转换为GCJ02
                            origin = coordtransform.wgs84togcj02(position.coords.longitude, position.coords.latitude);

                            // 国测局坐标转百度经纬度坐标，用于获取逆地址解析
                            let temp = coordtransform.gcj02tobd09(origin[0], origin[1]);

                            let point = new BMap.Point(temp[0], temp[1]),
                                gc = new BMap.Geocoder(),
                                pt = point;

                            gc.getLocation(pt, (rs) => {
                                let addComp = rs.addressComponents;

                                // 组装出发地地址
                                originName = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;

                                // 查询项目地址及坐标
                                store.dispatch(action.postSqlExecuteAction(
                                    {
                                        sqlCode: 'getProject_app',
                                        filter: JSON.stringify([
                                            {
                                                property: "projectId",
                                                operator: "eq",
                                                value: orgId
                                            }
                                        ]),
                                        noPaging: true
                                    },
                                    (res) => {
                                        Toast.hide();

                                        if (res.code === 0) {
                                            let project = res.data;

                                            if (project && project.length && project[0].projectLng && project[0].projectLat) {

                                                // 组装目的地地址
                                                destinationName = (project[0].projectAddrPro || '') + (project[0].projectAddrCity || '') +
                                                    (project[0].projectAddrDist || '') + (project[0].projectAddrDetail || '');

                                                // 目前项目的坐标是百度坐标（BD09），需要转换为GCJ02，传给高德、腾讯地图
                                                destination = coordtransform.bd09togcj02(project[0].projectLng, project[0].projectLat);

                                                // 处理坐标系，并调用相应APP
                                                XyNavigation.handleMapCoordinate(
                                                    BUTTONS[buttonIndex],
                                                    originName,
                                                    origin,
                                                    destinationName,
                                                    destination
                                                );
                                            } else {
                                                Toast.info('缺少项目地理信息，请联系项目人员填写项目详情', 2);
                                            }

                                        } else {
                                            Toast.fail(Unit.getCodeMsg(res.code, '加载失败！' + res.msg, this), 2);
                                        }
                                    }
                                ));

                            });

                        }, { enableHighAccuracy: true });

                    });
            }
        );

    },

    // 判断APP是否存在
    checkNavigatorApp: (callback) => {
        let BUTTONS = [];
        let count = 0;
        let gaodePackageName = "com.autonavi.minimap";
        let baiduPackageName = "com.baidu.BaiduMap";
        let tengxunPackageName = "com.tencent.map";


        appAvailability.check(
            gaodePackageName,
            () => {
                BUTTONS.push('高德地图');
                count++;
            },
            () => { count++; }
        );
        appAvailability.check(
            baiduPackageName,
            () => {
                BUTTONS.push('百度地图');
                count++;
            },
            () => { count++; }
        );
        appAvailability.check(
            tengxunPackageName,
            () => {
                BUTTONS.push('腾讯地图');
                count++;
            },
            () => { count++; }
        );


        let timer = setInterval(() => {
            if (count === 3) {
                clearInterval(timer);
                callback && callback instanceof Function && callback(BUTTONS);
            }
        }, 1000);

    },

    // 启动App
    startNavigatorApp: (mapPackage, mapUri) => {
        let sApp = startApp.set({ /* params */
            "action": "ACTION_VIEW",
            "category": "CATEGORY_DEFAULT",
            "type": "text/css",
            "package": mapPackage,
            "uri": mapUri,
            "flags": ["FLAG_ACTIVITY_CLEAR_TOP", "FLAG_ACTIVITY_CLEAR_TASK"],
            "intentstart": "startActivity"
        });
        sApp.start(
            () => {
                /* success */
            },
            (error) => {
                /* fail */
                Toast.error(error, 2);
            }
        );
    },

    // 处理坐标体系
    handleMapCoordinate: (button, originName, origin, destinationName, destination) => {
        let mapPackage = '',
            mapUri = '';

        // 组装相应的API
        switch (button) {
            case '高德地图':
                mapPackage = 'com.autonavi.minimap';
                mapUri = "amapuri://route/plan/?slat=" + origin[1] + "&slon=" + origin[0] + "&sname=" + originName +
                    "&dlat=" + destination[1] + "&dlon=" + destination[0] + "&dname=" + destinationName + "&dev=0&t=0";
                break;
            case '百度地图':
                mapPackage = 'com.baidu.BaiduMap';
                mapUri = "baidumap://map/direction?origin=name:" + originName + "|latlng:" + origin[1] + "," + origin[0] +
                    "&destination=name:" + destinationName + "|latlng:" + destination[1] + "," + destination[0] +
                    "&mode=driving&coord_type=gcj02";
                break;
            case '腾讯地图':
                mapPackage = 'com.tencent.map';
                mapUri = "qqmap://map/routeplan?type=drive&from=" + originName + "&fromcoord=" + origin[1] + "," + origin[0] +
                    "&to=" + destinationName + "&tocoord=" + destination[1] + "," + destination[0] + "&coord_type=1&policy=0";
                break;
            default:
                mapPackage = 'com.autonavi.minimap';
                mapUri = "amapuri://route/plan/?slat=" + origin[1] + "&slon=" + origin[0] + "&sname=" + originName +
                    "&dlat=" + destination[1] + "&dlon=" + destination[0] + "&dname=" + destinationName + "&dev=0&t=0";
                break;
        }

        XyNavigation.startNavigatorApp(mapPackage, mapUri);
    },

    // 获取百度坐标系的起始点
    getBaiduStartAndEndCoordinate: (callback) => {
        DEVCONFIG.GLHandle.getCurrPosition((position) => {

            // 起始点坐标WGS84转换GCJ02
            let origin = coordtransform.wgs84togcj02(position.coords.longitude, position.coords.latitude);

            // 国测局坐标转百度经纬度坐标
            let result = coordtransform.gcj02tobd09(origin[0], origin[1]);

            callback && callback instanceof Function && callback(result);

        }, { enableHighAccuracy: true });
    }
}


export default {
    show: XyNavigation.showNavigatorSheet,
    getBdStartCoor: XyNavigation.getBaiduStartAndEndCoordinate
};