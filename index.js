const TeleBot = require('telebot');
const TOKEN= '436046804:AAFV1StNl7ZwqJy6LfdCWusu5rO-rpti9lQ';

const {getPlaylist} = require('./getMusic');

const bot = new TeleBot({
   token: TOKEN,
   polling: {  
   },
//    webhook: { 
//     url: 'https://telegram-shop-bot2.herokuapp.com/',
//     host: '0.0.0.0',
//     port: process.env.PORT, 
// },
   usePlugins: ['askUser']
});

bot.on(/^\/music (.+)$/, (msg, props) => {
    const text = props.match[1];
    getPlaylist(text, 'getAllSongs', (tracks) => {
        console.log(tracks);
        let replyMarkup = bot.keyboard( tracks, {resize: true});
    
        return bot.sendMessage(msg.from.id, 'Виберіть потрібний трек', {replyMarkup});
    });
});

bot.on(/^\d* .*/, (msg, props) => {
    getPlaylist(msg, 'getChosenSong', (song) => {
        console.log('send song');
        return bot.sendAudio(msg.from.id, song);
    });
});


bot.start();