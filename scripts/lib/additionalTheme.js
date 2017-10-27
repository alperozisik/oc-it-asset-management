const themeFiles = ["Defaults"];
const Color = require('sf-core/ui/color');
const StatusBarStyle = require('sf-core/ui/statusbarstyle');

global.getCombinedStyle = require("library/styler-builder").getCombinedStyle;
global.Color = Color;

themeFiles.forEach(item => modifyTheme(require(`../themes/${item}.json`)));

function modifyTheme(theme) {
    global.theColor = Color.create("#FFFFFF");
    theme[".headerBar"].itemColor = global.theColor;
    // theme[".headerBar"].itemColor = "#FFFFFF";
    theme[".statusBar"].ios = theme[".statusBar"].ios || {};
    theme[".statusBar"].ios.style = StatusBarStyle.LIGHTCONTENT;
}
