/* globals lang */
require("i18n/i18n.js"); // Generates global lang object

const Application = require("sf-core/application");

// Set uncaught exception handler, all exceptions that are not caught will
// trigger onUnhandledError callback.
Application.onUnhandledError = function(e) {
    alert({
        title: lang.applicationError,
        message: e.message + "\n\n*" + e.sourceURL + "\n*" + e.line + "\n*" + e.stack
    });
};

require("sf-extension-utils");
const Router = require("sf-core/ui/router");
// require("./lib/additionalTheme");
const stylerBuilder = require("library/styler-builder");
const settings = require("./settings.json");
stylerBuilder.registerThemes(settings.config.theme.themes || "Defaults");
stylerBuilder.setActiveTheme(settings.config.theme.currentTheme);

var pages = ["pgLogin",
    "pgSearch",
    "pgAddNewRecord",
    "pgAssetList",
    "pgAssetDetail",
    "pgEditAsset"
];

pages.forEach(pageName => Router.add(pageName, require(`./pages/${pageName}`)));

Router.go("pgLogin", {
    appStart: true
});

global.require = require;
