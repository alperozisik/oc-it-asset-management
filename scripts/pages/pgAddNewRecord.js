const extend = require('js-base/core/extend');
const PgAddNewRecordDesign = require('ui/ui_pgAddNewRecord');
const modifyPage = require("../lib/modifyPage");
const Router = require("sf-core/ui/router");
const PgAddNewRecord = extend(PgAddNewRecordDesign)(
    function(_super) {
        _super(this);
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        const page = this;
        page.data = {};
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
    if(data.barcode) {
        page.data.barcode = data.barcode;
    }
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
    superOnLoad();
    const page = this;

    page.btnNo.onPress = () => { Router.go("pgAssetList"); };
    page.btnYes.onPress = () => {
        Router.go("pgEditAsset", {
            newAsset: true,
            data: page.data
        });
    };

}

module && (module.exports = PgAddNewRecord);
