const telegraf = require('telegraf')
const axios = require('axios')
const { Client } = require('tdl')
const { TDLib } = require('tdl-tdlib-ffi')

const BOT_TOKEN = '1200197757:AAHHHItjtDGqyldnfBfkZHvZma69bJH1fcI'

const bot = new telegraf(BOT_TOKEN, {
  telegram: {
    username: 'limkaleb',
  }
})

bot.start((ctx) => ctx.reply('Welcome'))
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.help((ctx) => ctx.reply('/fortune [all, bible, computers, cookie, definitions, miscellaneous, people, platitudes, politics, science, and wisdom]'))

bot.command('fortune', async (ctx) => {
  category = ctx.message.text.split(' ')[1]
  url = `http://yerkee.com/api/fortune/${category}`
  const res = await axios.get(url)
  console.log(res)
  ctx.reply(res.data.fortune)
})

bot.on('inline_query', async (ctx) => {
  console.log('query: ', ctx.inlineQuery.query)
  query = ctx.inlineQuery.query
  url = `https://dev.to/api/articles?tag=${query}`

  res = await axios.get(url)
  // console.log(res.data)
  resArr = res.data
  console.log('length: ', resArr.length)

  result = resArr.map((e, i) => {
    return {
      type: 'article',
      id: String(i),
      title: e.title,
      description: e.description,
      input_message_content: {
        message_text: `${e.title}\n${e.description}\n${e.url}`
      },
      url: e.url,
    }
  })
  ctx.answerInlineQuery(result)
})

bot.url('https://www.google.com/', (ctx) => {
  console.log(ctx)
})

  // -1001386772020 channel id
// telegram.forwardMessage(chatId, fromChatId, messageId, [extra]) => Promise

bot.on('message', async (ctx) => {
  console.log(ctx.from)
  console.log(ctx.chat)
  console.log('this one: ', ctx.telegram.forward_from_chat)
  // const chatID = -1001495746346
  // res = await ctx.telegram.getChat(chatID)
  // console.log('donee! ', ctx.channelPost)
  ctx.reply('sent message..')
})


// bot.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log('Response time: %sms', ms)
// })

// bot.on('text', (ctx) => ctx.reply('Hello World'))

bot.launch()