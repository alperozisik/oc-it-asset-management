const extend = require('js-base/core/extend');
const PgLoginDesign = require('ui/ui_pgLogin');
const rau = require("sf-extension-utils").rau;
const fingerprint = require("sf-extension-utils").fingerprint;
const Router = require("sf-core/ui/router");
const Color = require('sf-core/ui/color');

const PgLogin = extend(PgLoginDesign)(
    // Constructor
    function(_super) {
        _super(this);
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));

    });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow, data = {}) {
    superOnShow();
    const page = this;
    if (data.appStart) {
        rau.checkUpdate();


        fingerprint.init({
            userNameTextBox: page.tbName,
            passwordTextBox: page.tbPassword,
            button: page.btnLogin,
            autoLogin: true,
            autoEvents: true,
            callback: function(err, fingerprintResult) {
                var password;
                if (err)
                    password = page.tbPassword.text;
                else
                    password = fingerprintResult.password;
                if (!password)
                    return alert(global.lang.passwordRequired);
                loginWithUserNameAndPassword(page.tbName.text, password, function(err) {
                    if (err)
                        return alert(global.lang.cannotLogin);
                    fingerprintResult && fingerprintResult.success(); //Important!
                    Router.go('pgSearch', {
                        //some data
                    });
                });
            }
        });
    }


}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
}

module && (module.exports = PgLogin);



function loginWithUserNameAndPassword(username, password, callback) {
    callback(null);
    // Http.request({
    //     url: getTokenUrl,
    //     method: "POST",
    //     body: JSON.stringify({
    //         username,
    //         password
    //     })
    // }, function(response) {
    //     //handle response
    //     callback(null); //to call .success
    // }, function(e) {
    //     //invalid credentials?
    //     callback(e);
    // });
}