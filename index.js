
// const bencodeParser = require('./src/utils/bencodeParser');

// const torrent = fs.readFileSync('./src/dummy/puppy.torrent')
// const torrent = bencodeParser(fs.readFileSync('./src/dummy/puppy.torrent'))

const { getPeers }  = require('./src/tracker');
const fs = require('fs');
const bencode = require('bencodejs');
const torrentParser = require('./src/utils/torrent-parser');
// const torrent = fs.readFileSync('./dummy/puppy.torrent');

const torrent = torrentParser.open('./src/dummy/puppy.torrent')
 /* console.log(torrent.announce.toString());  NOTE: readfileSync on its own doesn't return a string, 
                                                        it returns a buffer which is converted to string using utf-8 encoding schema */
// console.log(JSON.stringify(torrent));





// socket.on('connect', () => {
//     console.log('user connected')
// })

getPeers(torrent, (peers)=>{
    console.log(`list of peers ${peers}`)
})