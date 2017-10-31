const extend = require('js-base/core/extend');
const PgAssetDetailDesign = require('ui/ui_pgAssetDetail');
const Router = require("sf-core/ui/router");
const modifyPage = require("../lib/modifyPage");
const HeaderBarItem = require('sf-core/ui/headerbaritem');
const Image = require('sf-core/ui/image');

const PgAssetDetail = extend(PgAssetDetailDesign)(
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
  modifyPage(page);

  if (!page.hbiEdit) {
    let hbiEdit = new HeaderBarItem({
      image: Image.createFromFile("images://edit.png"),
      onPress: function() {
        Router.go("pgEditAsset", {
          assetDetails: {
            assetNumber: page.lblAssetNumber.text,
            serialNumber: page.lblSerialNumber.text,
            make: page.lblMake.text,
            model: page.lblModel.text,
            location: page.lblLocation.text
          }
        });
      }
    });
    this.headerBar.setItems([hbiEdit]);
    page.hbiEdit = hbiEdit;
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

module && (module.exports = PgAssetDetail);
