/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef, no-multi-assign, no-plusplus, no-bitwise, @typescript-eslint/no-unused-vars, @typescript-eslint/no-this-alias, prefer-rest-params, one-var */

/* 时间戳转换日期函数 */
function conversionTime(t, format) {
    // t = 时间戳或时间对象字符串  format = 格式 默认格式："Y-M-D H:m:s"
    t || (t = Date.now());
    format || (format = "Y-M-D H:m:s");
    if (typeof t === "number") {
        const count = String(Date.now()).length;
        String(t).length < count && (t = String(t).slice(0, count - 3) * 1000);
    }
    const data = new Date(t); // 取时间对象
    const dateArr = [
        { key: "Y", value: data.getFullYear() },
        { key: "M", value: data.getMonth() + 1 },
        { key: "D", value: data.getDate() },
        { key: "H", value: data.getHours() },
        {
            key: "h",
            value:
                (data.getHours() > 12 && data.getHours() - 12) ||
                data.getHours(),
        },
        { key: "m", value: data.getMinutes() },
        { key: "s", value: data.getSeconds() },
    ];

    dateArr.forEach((v) => {
        v.value < 10 && (v.value = `0${v.value}`);
        format.indexOf(v.key) > -1 && (format = format.replace(v.key, v.value));
    });
    return format;
}
/* 函数节流 */
function throttle(fn, interval) {
    let enterTime = 0; // 触发的时间
    const gapTime = interval || 300; // 间隔时间，如果interval不传值，默认为300ms
    return  ()=> {
        const that = this;
        const backTime = new Date(); // 第一次函数return即触发的时间
        if (backTime - enterTime > gapTime) {
            fn.call(that, arguments);
            enterTime = backTime; // 赋值给第一次触发的时间 保存第二次触发时间
        }
    };
}

/* 函数防抖 */
function debounce(fn, interval) {
    let timer;
    const gapTime = interval || 500; // 间隔时间 不传值默认为1000ms
    // eslint-disable-next-line func-names
    return function() {
        timer && clearTimeout(timer);
        const that = this;
        const args = arguments; // 保存arguments setTimeout是全局的 arguments不是防抖函数需要的
        if (timer) clearTimeout(timer);
        timer = setTimeout(()=> {
            timer = null;
            fn.apply(that, args);
        }, gapTime);
    };
}

/* 文件流转base64 */
function fileToBase64(file) {
    if (!file && !file.size) return false;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
    });
}

const Base64 = {
    keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    encode(input){
        let output = '',chr1, chr2, chr3, enc1, enc2, enc3, enc4,i=0;
        input = this.utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output += 
            this.keyStr.charAt(enc1) + this.keyStr.charAt(enc2) +
            this.keyStr.charAt(enc3) + this.keyStr.charAt(enc4);
        }
        return output;
    },
    decode(str) {
        let output = '',chr1, chr2, chr3, enc1, enc2, enc3, enc4,i=0;
        str = str.replace(/[^A-Za-z0-9+/=]/g, "");
        while (i < str.length) {
            enc1 = this.keyStr.indexOf(str.charAt(i++));
            enc2 = this.keyStr.indexOf(str.charAt(i++));
            enc3 = this.keyStr.indexOf(str.charAt(i++));
            enc4 = this.keyStr.indexOf(str.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output += String.fromCharCode(chr1);
            if (enc3 !== 64) {
                output += String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output += String.fromCharCode(chr3);
            }
        }
        output = Base64.utf8_decode(output);
        return output;
    },
    utf8_encode(string) {
        string = string.replace(/\r\n/g, "\n");
        let utfText = "";
        for (let n = 0; n < string.length; n++) {
            const c = string.charCodeAt(n);
            if (c < 128) {
                utfText += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utfText += String.fromCharCode((c >> 6) | 192);
                utfText += String.fromCharCode((c & 63) | 128);
            }
            else {
                utfText += String.fromCharCode((c >> 12) | 224);
                utfText += String
                        .fromCharCode(((c >> 6) & 63) | 128);
                utfText += String.fromCharCode((c & 63) | 128);
            }
        }
        return utfText;
    },
    utf8_decode(utfText) {
        let string = "";
        let i = 0;
        let c,c1,c2,c3;
        c = c1 = c2 = 0;
        while (i < utfText.length) {
            c = utfText.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224)) {
                c2 = utfText.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6)
                        | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utfText.charCodeAt(i + 1);
                c3 = utfText.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12)
                        | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
};

export {
    conversionTime,
    throttle,
    debounce,
    fileToBase64,
    Base64
};
