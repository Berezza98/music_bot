const request = require('request');
const cheerio = require('cheerio');

function getPlaylist(name, params, done){
    request(`http://zaycev.net/search.html?query_search=${encodeURIComponent(name)}`, function (error, response, body) {
        if(error){
            done(new Error('You have bad internet connection'));
            return;
        }
        if(params === 'getAllSongs'){
            console.log('yees');
            let tracks = getAllSongs(body, (tracks) => {
                done(tracks);
            });
        }
        else if(params === 'getChosenSong'){
            console.log('song');
            getChosenSong(body, (songLink) => {
                done(songLink);
            })
        }
      });
}

function getAllSongs(data, done){
    const $ = cheerio.load(data);
    let track_list = $('.musicset-track-list__items .musicset-track.clearfix');
    let list = [];
    for(let i = 0; i < track_list.length; i++){
        let obj = {};
        let current_track = track_list.eq(i);
        obj.name = current_track.find('.musicset-track__track-name a').text().trim();
        obj.artist = current_track.find('.musicset-track__artist a').text().trim();
        list.push(obj);
    }
    list = list.map((track, index) => {
        return [`${index+1} ${track.artist} ${track.name}`];
    });
    done(list);
}

function getChosenSong(data, done){
    const $ = cheerio.load(data);
    let jsonLink = $('.musicset-track-list__items .musicset-track.clearfix').eq(0).attr('data-url');
    let link= `http://zaycev.net${jsonLink}`;
    request(link, (error, response, body) => {
        if(error){
            done(new Error('somethink went wrong'));
            return;
        }
        let linkToSong = JSON.parse(body).url;
        done(linkToSong);
    });
}



module.exports = {
    getPlaylist
};