const FlexLayout = require('sf-core/ui/flexlayout');
const Color = require('sf-core/ui/color');
const Button = require('sf-core/ui/button');
const Font = require('sf-core/ui/font');
const BarcodeScanner = require("sf-extension-barcode").BarcodeScanner;
const System = require('sf-core/device/system');
const Application = require("sf-core/application");
const permission = require("sf-extension-utils").permission;
const AlertView = require('sf-core/ui/alertview');
const tag = "Scan Barcode";
const barcodeScanner = new BarcodeScanner();

module.exports = exports = scanBarcode;

const btnHideScanner = new Button({
    text: "",
    positionType: FlexLayout.PositionType.ABSOLUTE,
    top: 20,
    right: 10,
    width: 80,
    height: 80,
    textColor: Color.WHITE,
    backgroundColor: Color.create(100, 0, 0, 0),
    borderRadius: 40,
    font: Font.create("FontAwesome", 30, Font.NORMAL)
});

barcodeScanner.layout.addChild(btnHideScanner);

function scanBarcode(page) {
    var pageHeaderBarVisible = page.headerBar.visible;
    var oldBackButtonAction = page.android.onBackButtonPressed;
    return new Promise((resolve, reject) => {
        if (System.OS == "iOS") {
            BarcodeScanner.ios.checkPermission({
                onSuccess: function() {
                    showScanner("permission not granted");
                },
                onFailure: function() {
                    alert({
                        message: "Need Permission",
                        buttons: [{
                            type: AlertView.Android.ButtonType.NEGATIVE,
                            text: "Ok",
                            onClick: function() {
                                reject("permission not granted");
                            }
                        }]
                    });
                }
            });
        }
        else {
            permission.getPermission(Application.android.Permissions.CAMERA,
                function(err) {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        showScanner();
                    }
                });
        }


        function showScanner() {

            barcodeScanner.onResult = function(e) {
                resolve(e.barcode);
                hideScanner();
            };

            barcodeScanner.show({ page, tag });
            page.android.onBackButtonPressed = hideScanner.bind(null, true);
            page.headerBar.visible = false;
            page.layout.applyLayout();

            btnHideScanner.onPress = function() {
                hideScanner(true);
            };
        }

        function hideScanner(doReject) {
            if (pageHeaderBarVisible)
                page.headerBar.visible = true;
            barcodeScanner.stopCamera();
            barcodeScanner.hide();
            page.android.onBackButtonPressed = oldBackButtonAction;
            if (doReject)
                reject("user cancelled");
        }
    });
}
