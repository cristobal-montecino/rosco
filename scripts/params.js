function encode_base64(x) {
    return btoa(unescape(encodeURIComponent(x)));
}

function decode_base64(x) {
    return decodeURIComponent(escape(atob(x)));
}

function parse_params() {
    const params = {};
    window.location.search.substr(1).split('&').forEach(
        x => {
            const param = x.split('=', 2);

            if (param.length == 2) {
                params[param[0]] = decode_base64(param[1]);
            }
        }
    )

    return params;
}