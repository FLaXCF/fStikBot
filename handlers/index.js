module.exports = {
  handleError: require('./catch'),
  handleStart: require('./start'),
  handleSticker: require('./sticker'),
  handleDeleteSticker: require('./sticker-delete'),
  handleRestoreSticker: require('./sticker-restore'),
  handlePacks: require('./packs'),
  handleSelectPack: require('./pack-select'),
  handleHidePack: require('./pack-hide'),
  handleRestorePack: require('./pack-restore'),
  handleCopyPack: require('./pack-copy'),
  handleCoedit: require('./coedit'),
  handleCatalog: require('./catalog'),
  handleEmoji: require('./emoji'),
  handleStickerUpade: require('./sticker-update'),
  handleInlineQuery: require('./inline-query')
}
