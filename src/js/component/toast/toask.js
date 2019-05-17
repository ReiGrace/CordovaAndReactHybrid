import './toask.less';
var currInfoToast = null;
var currConfirmToast = null;
let Toast = {
    /**
     * 消息弹窗
     * @param {string} message 消息
     * @param {number} duration 时间
     */
    info: (message, duration) => {
        var toastDiv = document.createElement('div');
        toastDiv.id = 'com_toast_info';
        toastDiv.innerText = message;
        toastDiv.classList.add('com_toast_div');
        if (document.querySelector('#com_toast_info')) {
            document.body.removeChild(document.querySelector('#com_toast_info'));
        }
        document.body.appendChild(toastDiv);
        setTimeout(() => {
            toastDiv.classList.add('toast-info-show');
            setTimeout(() => {
                if (toastDiv) {
                    toastDiv.style.display = 'none';
                }
            }, duration * 2);
        }, 20);
        currInfoToast = toastDiv;
    },

    /**
     * 消息确认弹窗
     * @param {string} message 消息
     * @param {function} duration 时间
     */
    confirm: (message, callback) => {
        var divConfirm = document.createElement('div');
        divConfirm.classList.add('ui-dialog');
        divConfirm.id = 'com_toast_confirm';
        divConfirm.innerHTML = `
            <div class="ui-dialog-cnt toast-confirm-show">
                <div class="ui-dialog-bd">
                    <p>${message}</p>
                </div>
                <div class="ui-dialog-ft">
                    <button type="button" data-role="cancel">取消</button>
                    <button type="button" data-role="enter">确定</button>
                </div>
            </div>
        `;

        if (document.querySelector('#com_toast_confirm')) {
            // 移除节点前
            // 卸载点击事件
            // 防止内存泄露
            var btns = document.querySelectorAll('#com_toast_confirm .ui-dialog-ft button');
            for (let index = 0; index < btns.length; index++) {
                const element = btns[index];
                element.onclick = null;
            }
            document.body.removeChild(document.querySelector('#com_toast_confirm'));
        }
        document.body.appendChild(divConfirm);

        setTimeout(() => {
            divConfirm.classList.add('show');
        }, 20);

        var btns = document.querySelectorAll('#com_toast_confirm .ui-dialog-ft button');
        btns[0].onclick = (function () {
            return (e) => {
                e = e || window.event;
                e.preventDefault();
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                callback(false);
            }
        })(callback);
        btns[1].onclick = (function () {
            return (e) => {
                e = e || window.event;
                e.preventDefault();
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                callback(true);
            }
        })(callback);
        currConfirmToast = divConfirm;
    },

    /**
     * 输入框
     */
    input: (message, defaultValue, callback, readOnly) => {
        if (defaultValue !== undefined) {
            defaultValue = defaultValue > 100 ? defaultValue : (defaultValue > 10 ? ('0' + defaultValue) : '00' + defaultValue);
        }
        var divInput = document.createElement('div');
        divInput.classList.add('ui-dialog');
        divInput.id = 'com_toast_input';
        divInput.innerHTML = `
            <div class="ui-dialog-cnt toast-input-show">
                <div class="ui-dialog-bd">
                    <p>${message}</p>
                    <button class="ui-btn inputBtn">—</button>
                    <input type="number" min="0" ${typeof readOnly !== 'undefined' ? 'readonly' : ''} class="input-number" value="${defaultValue}" name="inputText"/>
                    <button class="ui-btn inputBtn">+</button>
                </div>
                <div class="ui-dialog-ft">
                    <button type="button" data-role="cancel">取消</button>
                    <button type="button" data-role="enter">确定</button>
                </div>
            </div>
        `;

        if (document.querySelector('#com_toast_input')) {
            // 移除节点前
            // 卸载点击事件
            // 防止内存泄露
            var btns = document.querySelectorAll('#com_toast_input .ui-dialog-ft button');
            for (let index = 0; index < btns.length; index++) {
                const element = btns[index];
                element.onclick = null;
            }

            var btns = document.querySelectorAll('#com_toast_input .ui-dialog-bd button');
            for (let index = 0; index < btns.length; index++) {
                const element = btns[index];
                element.onclick = null;
            }
            document.body.removeChild(document.querySelector('#com_toast_input'));
        }
        document.body.appendChild(divInput);

        setTimeout(() => {
            divInput.classList.add('show');
        }, 20);

        var btns = document.querySelectorAll('#com_toast_input .ui-dialog-ft button');
        btns[0].onclick = (function () {
            return (e) => {
                e = e || window.event;
                e.preventDefault();
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                var currValue = document.querySelector('#com_toast_input input').value;
                callback(false, currValue);
            }
        })(callback);
        btns[1].onclick = (function () {
            return (e) => {
                e = e || window.event;
                e.preventDefault();
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                var currValue = document.querySelector('#com_toast_input input').value;
                callback(true, currValue);
            }
        })(callback);

        var btnsInput = document.querySelectorAll('#com_toast_input .ui-dialog-bd button');
        btnsInput[0].onclick = (function () {
            return (e) => {
                e = e || window.event;
                e.preventDefault();
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                var input = document.querySelector('#com_toast_input input');
                input.value = (parseInt(input.value) - 1) < 100 ?
                    (
                        (parseInt(input.value) - 1) >= 10 ?
                            '0' + (parseInt(input.value) - 1) :
                            '00' + (parseInt(input.value) - 1)
                    ) :
                    (parseInt(input.value) - 1)
                    ;
            }
        })(callback);
        btnsInput[1].onclick = (function () {
            return (e) => {
                e = e || window.event;
                e.preventDefault();
                e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                var input = document.querySelector('#com_toast_input input');
                input.value = (parseInt(input.value) + 1) < 100 ?
                    (
                        (parseInt(input.value) + 1) >= 10 ?
                            '0' + (parseInt(input.value) + 1) :
                            '00' + (parseInt(input.value) + 1)
                    ) :
                    (parseInt(input.value) + 1)
                    ;
            }
        })(callback);
        currConfirmToast = divInput;
    },

    /**
     * 关闭所有Toast
     */
    close: (type) => {
        switch (type) {
            case 'info':
                if (currInfoToast != null) {
                    currInfoToast.onclick = null;
                    document.body.removeChild(currInfoToast);
                }
                break;
            case 'confirm':
                if (currConfirmToast != null) {
                    currConfirmToast.onclick = null;
                    document.body.removeChild(currConfirmToast);
                }
                break;
            case 'input':
                if (currConfirmToast != null) {
                    currConfirmToast.onclick = null;
                    document.body.removeChild(currConfirmToast);
                }
                break;
            default:
                break;
        }
    }
}

export default {
    info: Toast.info,
    confirm: Toast.confirm,
    input: Toast.input,
    close: Toast.close
};