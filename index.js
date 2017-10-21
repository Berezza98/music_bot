const TeleBot = require('telebot');
const TOKEN= '436046804:AAFV1StNl7ZwqJy6LfdCWusu5rO-rpti9lQ';

const {getPlaylist} = require('./getMusic');

const bot = new TeleBot({
   token: TOKEN,
//    polling: {  
//    },
   webhook: { 
    url: 'https://roman-music-bot.herokuapp.com/',
    host: '0.0.0.0',
    port: process.env.PORT, 
},
   usePlugins: ['askUser']
});
console.log("BOT", bot);

bot.on(/^\/music (.+)$/, (msg, props) => {
    console.log("AAA");
    const text = props.match[1];
    getPlaylist(text, 'getAllSongs', (tracks) => {
        console.log(tracks);
        let replyMarkup = bot.keyboard( tracks, {resize: true});
    
        return bot.sendMessage(msg.from.id, 'Виберіть потрібний трек', {replyMarkup});
    });
});

bot.on(/^\d* (.+)/, (msg, props) => {
    const text = props.match[1];
    console.log(text);
    getPlaylist(text, 'getChosenSong', (songLink) => {
        console.log(__dirname);
        return bot.sendAudio(msg.from.id, songLink, {fileName: text});
    });
});

bot.start();