/**
 * Created by caowenhai on 16/4/27.
 */

(function(window) {
    var ua = navigator.userAgent;
    ipad = ua.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
    iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
    uc = ua.indexOf("UCBrowser") > -1 ? true : false;
    ios = ipad || iphone;
    var scale = 1, rate = 1, meta;
    if (ios) {
        if (window.devicePixelRatio >= 2) {
            scale *= 0.5;
            rate *= 2;
        }
    } else {
        if (uc && window.devicePixelRatio >= 2) {
            scale *= 0.5;
            rate *= 2;
        }
    }
    meta = '<meta name="viewport" content="initial-scale=' + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ', width=device-width, user-scalable=no" />';
    document.write(meta);
    document.documentElement.style.fontSize = 20 * rate + "px";
    window.base_rate = rate;
})(window);
