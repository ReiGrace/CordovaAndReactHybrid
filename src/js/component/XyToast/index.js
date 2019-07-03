import './index.less';

var currConfirmToast = null;

let Toast = {

    /**
     * 消息确认弹窗
     * @param {string} title 标题
     * @param {string} name 发送消息人名称
     * @param {string} message 消息
     * @param {function} callback 回调
     */
    confirm: (title, name, message, callback) => {
        let confirm = document.createElement('div');
        confirm.classList.add('xy-toast');
        confirm.id = 'xy_toast_confirm';
        confirm.innerHTML = `
            <div class="xy-toast-container">
                <div class="xy-toast-title">
                    <i class="iconfont icon-Z"></i>
                    <p>${title ? title : "通知"}</p>
                </div>
                <div class="xy-toast-body">
                    <div>${name ? name : ""}</div>
                    <div>${message ? message : "您有新消息"}</div>
                </div>
                <div class="xy-toast-footer">
                    <button type="button" data-role="cancel">关闭</button>
                    <button type="button" class="button-primary" data-role="enter">确定</button>
                </div>
            </div>
        `;

        if (document.querySelector('#xy_toast_confirm')) {

            // 移除节点前
            // 卸载点击事件
            // 防止内存泄露
            let btns = document.querySelectorAll('#xy_toast_confirm .xy-toast-footer button');
            for (let index = 0; index < btns.length; index++) {
                const element = btns[index];
                element.onclick = null;
            }
            document.body.removeChild(document.querySelector('#xy_toast_confirm'));
        }
        document.body.appendChild(confirm);

        setTimeout(() => {
            confirm.classList.add('xy-toast-confirm-show');
        }, 20);

        let btns = document.querySelectorAll('#xy_toast_confirm .xy-toast-footer button');
        btns[0].onclick = (() => {
            return (e) => {
                e = e || window.event;
                e.preventDefault();
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                callback(false);
            }
        })(callback);
        btns[1].onclick = (() => {
            return (e) => {
                e = e || window.event;
                e.preventDefault();
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                callback(true);
            }
        })(callback);
        currConfirmToast = confirm;
    },

    /**
     * 关闭所有Toast
     */
    close: () => {
        if (currConfirmToast != null) {
            currConfirmToast.onclick = null;
            document.body.removeChild(currConfirmToast);
        }
    }
}

export default {
    confirm: Toast.confirm,
    close: Toast.close
};

