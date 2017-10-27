const extend = require('js-base/core/extend');
const PgAssetListDesign = require('ui/ui_pgAssetList');
const LviAsset = require("../components/LviAsset");
const Router = require("sf-core/ui/router");
const modifyPage = require("../lib/modifyPage");

const PgAssetList = extend(PgAssetListDesign)(
    function(_super) {
        _super(this);
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        this.lvAssets.refreshEnabled = false;
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
    modifyPage(page);
    const lvAssets = page.lvAssets;
    lvAssets.itemCount = 8;
    lvAssets.refreshData();
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
    const page = this;
    const lvAssets = page.lvAssets;
    lvAssets.onRowCreate = function() {
        const lviAsset = new LviAsset();
        return lviAsset;
    };

    lvAssets.onRowBind = function(listViewItem, index) {};

    lvAssets.onRowSelected = function(listViewItem, index) {
        Router.go("pgAssetDetail");
    };
}

module && (module.exports = PgAssetList);
