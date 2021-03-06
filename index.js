// How to use numeral? http://numeraljs.com/
const numeral = require('numeral');
const { Telegraf } = require('telegraf');
const { getContractInfo } = require('./queries');
const { getAltePrice } = require('./alte_price-queries');

// Init bot 
const bot = new Telegraf(process.env.BOT_TOKEN);

const welcomeMessage = `Welcome!đ I am Altered Bot your personal assistant.

Here you can get some info about Altered ecosystem. Click and let yourself be guided!

đĒ ALTE:
/altecurrentprice@AlteredProtocolBot - Get ALTE current price
/tokenomics@AlteredProtocolBot - Get Tokenomics

đ§ Help:
/help
  
Website:
  đ Website: https://alteredprotocol.com
  đ Doc: https://docs.alteredprotocol.com
  đž Source code: https://github.com/LoTerra

Social Network:
  đĻ Twitter: https://twitter.com/Altered_ALTE
  đŦ Telegram: https://t.me/Altered_ALTE`;

const helpMessage = `*If you need help, you can contact:* 
- @YundoRocket đ
- @codeSnake đ
`;

// Basic commands
bot.start((ctx) => ctx.reply(welcomeMessage));
bot.help((ctx) => ctx.reply(helpMessage, {parse_mode: "Markdown"}));

bot.hears('/altecurrentprice@AlteredProtocolBot', async (ctx) => {
  if (ctx.message.chat.title == 'Altered::Official') {
    return ctx.reply("Please join @LoTerraTrading for discussing price speculation")
  } 
  const contractInfo = await getContractInfo();
  const altePrice = await getAltePrice();
  
  let marketCap = contractInfo[0] * altePrice 
  
  const getPrice = `*âšī¸ Price info:*
*Market Cap:* ${numeral(marketCap).format('0,0.00')}īŧ
---
*$ALTE price:* ${numeral(altePrice).format('0,0.000000')}$
`;
  ctx.reply(getPrice ,{ parse_mode: "Markdown" })

});

bot.hears('/tokenomics@AlteredProtocolBot', async (ctx) => {
  const contractInfo = await getContractInfo()

  const tokenomics = `*đĒ Tokenomics:*

*Info:*
Token type - *CW20*
Name - *Altered*
Symbol - *ALTE*
Decimals - *6*
Role - *utility*
Blockchain - *Terra*

*Supply:*
Total supply - *${numeral(contractInfo[0]).format('0,0.00')} $ALTE*
Circulating supply - *${numeral(contractInfo[0]).format('0,0.00')} $ALTE*

*Supply distribution:*
Community - *${contractInfo[2]} $ALTE*
Team - *${contractInfo[3]} $ALTE*
Treasury - *${contractInfo[4]} $ALTE*
`;
        
  ctx.reply(tokenomics , { parse_mode: "Markdown" })

});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));