const extend = require('js-base/core/extend');
const PgSearchDesign = require('ui/ui_pgSearch');
const modifyPage = require("../lib/modifyPage");
const ActionKeyType = require('sf-core/ui/actionkeytype');
const HeaderBarItem = require('sf-core/ui/headerbaritem');
const Image = require('sf-core/ui/image');
const Picker = require("sf-core/ui/picker");
const Router = require("sf-core/ui/router");
const barcodeScanner = require("../lib/barcodeScanner");
const AlertView = require('sf-core/ui/alertview');

const models = [
    "Model A",
    "Model B",
    "Model C",
    "Model D",
    "Model E"
];


const PgSearch = extend(PgSearchDesign)(
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

        if (!page.hbiScan) {
            let hbiScan = new HeaderBarItem({
                image: Image.createFromFile("images://camera_search.png"),
                onPress: function() {
                    barcodeScanner(page).then((e) => {
                        page.tbAssetNumber.text = e.text;
                    });
                }
            });
            this.headerBar.setItems([hbiScan]);
            page.hbiScan = hbiScan;
        }
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
                    submitSearchForm.call(page);
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

    page.btnSearch.onPress = submitSearchForm.bind(page);
    page.flModel.onTouchEnded = pickModel.bind(page);
}

function submitSearchForm() {
    const page = this;

    page.tbLocation.removeFocus();

    alert({
        message: "No records found. Do you want to create an asset with this ID?",
        title: "Add New Record",
        buttons: [{
                text: "Yes",
                type: AlertView.Android.ButtonType.POSITIVE,
                onClick: function() {
                    Router.go("pgEditAsset", {
                        newAsset: true,
                        assetDetails: {
                            assetNumber: page.tbAssetNumber.text,
                            serialNumber: page.tbSerialNumber.text,
                            make: page.tbMake.text,
                            model: page.lblModel.text,
                            location: page.tbLocation.text
                        }
                    });
                },
            },
            {
                text: "No",
                type: AlertView.Android.ButtonType.NEGATIVE,
                onClick: function() {
                    Router.go("pgAssetList");
                },
            }
        ]
    });
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



module && (module.exports = PgSearch);
