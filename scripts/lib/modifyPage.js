// const System = require('sf-core/device/system');
const StatusBarStyle = require('sf-core/ui/statusbarstyle');
const Color = require('sf-core/ui/color');
const Router = require("sf-core/ui/router");
module.exports = exports = modifyPage;

function modifyPage(page) {
    page.statusBar.ios.style = StatusBarStyle.LIGHTCONTENT;
    page.headerBar.itemColor = Color.WHITE;

    page.android.onBackButtonPressed = () => Router.goBack();
}
