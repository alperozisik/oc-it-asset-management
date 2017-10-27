/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');

const LviAssetDesign = require('library/LviAsset');

const LviAsset = extend(LviAssetDesign)(
  //constructor
  function(_super, props, pageName) {
    // initalizes super class for this scope
    _super(this, props || LviAssetDesign.defaults);
    this.pageName = pageName;
  }

);

delete LviAssetDesign.defaults.width;
delete LviAssetDesign.defaults.height;

module && (module.exports = LviAsset);