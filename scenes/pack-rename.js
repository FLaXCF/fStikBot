const Scene = require('telegraf/scenes/base')
const Markup = require('telegraf/markup')
const { escapeHTML } = require('../utils')

const packRename = new Scene('packRename')

packRename.enter(async (ctx) => {
  const stickerSet = await ctx.db.StickerSet.findById(ctx.match[2])

  if (stickerSet.owner.toString() !== ctx.session.userInfo.id.toString()) {
    return ctx.scene.leave()
  }

  ctx.session.userInfo.stickerSet = stickerSet

  const linkPrefix = stickerSet.packType === 'custom_emoji' ? ctx.config.emojiLinkPrefix : ctx.config.stickerLinkPrefix

  await ctx.replyWithHTML(ctx.i18n.t('scenes.rename.enter_name', {
    title: escapeHTML(stickerSet.title),
    link: `${linkPrefix}${stickerSet.name}`
  }), {
    reply_markup: Markup.keyboard([
      [
        ctx.i18n.t('scenes.btn.cancel')
      ]
    ]).resize()
  })
})

packRename.on('text', async (ctx) => {
  const titleSuffix = ctx.session.userInfo.premium ? '' : ` :: @${ctx.options.username}`
  const charTitleMax = ctx.session.userInfo.premium ? ctx.config.premiumCharTitleMax : ctx.config.charTitleMax

  let newTitle = ctx.message.text

  if (newTitle.length > charTitleMax) {
    newTitle = newTitle.substr(0, charTitleMax)
  }

  newTitle += titleSuffix

  const { stickerSet } = ctx.session.userInfo

  const result = await ctx.telegram.callApi('setStickerSetTitle', {
    name: stickerSet.name,
    title: newTitle
  })

  if (!result) {
    return ctx.replyWithHTML(ctx.i18n.t('error.unknown'))
  }

  stickerSet.title = newTitle
  await stickerSet.save()

  const linkPrefix = stickerSet.packType === 'custom_emoji' ? ctx.config.emojiLinkPrefix : ctx.config.stickerLinkPrefix

  await ctx.replyWithHTML(ctx.i18n.t('scenes.rename.success', {
    title: escapeHTML(stickerSet.title),
    link: `${linkPrefix}${stickerSet.name}`
  }), {
    reply_markup: Markup.removeKeyboard()
  })

  ctx.scene.leave()
})

module.exports = packRename
