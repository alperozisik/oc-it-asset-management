const extend = require('js-base/core/extend');
const PgEditAssetDesign = require('ui/ui_pgEditAsset');
const modifyPage = require("../lib/modifyPage");
const Picker = require("sf-core/ui/picker");
const Router = require("sf-core/ui/router");
const ActionKeyType = require('sf-core/ui/actionkeytype');
const barcodeScanner = require("../lib/barcodeScanner");
const HeaderBarItem = require('sf-core/ui/headerbaritem');
const Image = require('sf-core/ui/image');

const models = [
    "Model A",
    "Model B",
    "Model C",
    "Model D",
    "Model E"
];

const PgEditAsset = extend(PgEditAssetDesign)(
    function(_super) {
        _super(this);
        this.onShow = onShow.bind(this, this.onShow.bind(this));
        this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
        const page = this;
        const formItems = [{
            item: page.tbAssetNumber,
            action: page.tbAssetNumber.requestFocus.bind(page.tbAssetNumber)
        }, {
            item: page.tbSerialNumber,
            action: page.tbSerialNumber.requestFocus.bind(page.tbSerialNumber)
        }, {
            item: page.tbMake,
            action: page.tbMake.requestFocus.bind(page.tbMake)
        }, {
            item: page.flModel, //check
            action: pickModel.bind(page)
        }, {
            item: page.tbLocation,
            action: page.tbLocation.requestFocus.bind(page.tbLocation)
        }];
        page.formItems = formItems;

        page.onHide = () => page.tbLocation.removeFocus();
    });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow, data) {
    superOnShow();
    const page = this;
    data = data || page.data || {};
    page.data = data;
    modifyPage(page);
    if (data.newAsset) {
        let newBarcode = null;
        data.data && (newBarcode = data.data.barcode);
        page.headerBar.title = "New Asset";
        if (!data.newAssetInit) {
            page.tbAssetNumber.text = newBarcode || "";
            page.tbSerialNumber.text = "";
            page.tbMake.text = "";
            page.lblModel.text = "Model";
            page.tbLocation.text = "";
            
        }
    }
    if (data.assetDetails && !data.newAssetInit) {
        !data.newAsset && (page.headerBar.title = "Edit Asset");
        page.tbAssetNumber.text = data.assetDetails.assetNumber;
        page.tbSerialNumber.text = data.assetDetails.serialNumber;
        page.tbMake.text = data.assetDetails.make;
        page.lblModel.text = data.assetDetails.model;
        page.tbLocation.text = data.assetDetails.location;
    }
    data.newAssetInit = true;

    if (!page.hbiSave) {
        let hbiSave = new HeaderBarItem({
            image: Image.createFromFile("images://save.png"),
            onPress: function() {
                save.call(page);
            }
        });
        this.headerBar.setItems([hbiSave]);
        page.hbiSave = hbiSave;
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

    for (let i in page.formItems) {
        i = Number(i);
        let formItem = page.formItems[i];
        if (typeof formItem.item.actionKeyType !== "undefined") {
            let lastItem = i === (page.formItems.length - 1);
            if (lastItem) {
                formItem.item.actionKeyType = ActionKeyType.SEARCH;
                formItem.item.onActionButtonPress = () => {
                    save.call(page);
                };
            }
            else {
                formItem.item.actionKeyType = ActionKeyType.NEXT;
                formItem.item.onActionButtonPress = () => {
                    let nextItem = page.formItems[i + 1];
                    nextItem && nextItem.action();
                };
            }
        }
    }

    page.flModel.onTouchEnded = pickModel.bind(page);

    page.imgCamera.onTouchEnded = function() {
        barcodeScanner(page).then((e) => {
            page.data.assetDetails.assetNumber = e.text;
            page.tbAssetNumber.text = e.text;
        });
    };
}


function save() {
    const page = this;
    page.tbLocation.removeFocus();
    Router.goBack();
}

function pickModel() {
    const page = this;
    var pickerOptions = {
        items: models
    };
    var currentIndex = pickerOptions.items.indexOf(page.lblModel.text);
    if (currentIndex > -1)
        pickerOptions.currentIndex = currentIndex;

    var modelPicker = new Picker(pickerOptions);

    function okCallback(params) {
        page.lblModel.text = pickerOptions.items[params.index];
        page.flModel.selectedIndex = params.index;
        page.formItems[4].action();
    }

    function cancelCallback() {}
    modelPicker.show(okCallback, cancelCallback);
}

module && (module.exports = PgEditAsset);
