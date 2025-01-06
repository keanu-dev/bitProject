const fs = require('fs')

// const bencodeParser = require('./src/utils/bencodeParser');

// const torrent = fs.readFileSync('./src/dummy/puppy.torrent')
// const torrent = bencodeParser(fs.readFileSync('./src/dummy/puppy.torrent'))

const bencode = require('bencodejs');
const { getPeers } = require('./src/tracker');

// const torrent = fs.readFileSync('./dummy/puppy.torrent');


const torrent = bencode.decode(fs.readFileSync('./src/dummy/puppy.torrent'), 'utf8'); /* NOTE: you can also pass the encode Schema as a second
                                                                                               argument in the decode method instead of passing it as a parameter when converting to string*/

 /* console.log(torrent.announce.toString());  NOTE: readfileSync on its own doesn't return a string, 
                                                        it returns a buffer which is converted to string using utf-8 encoding schema */
// console.log(JSON.stringify(torrent));





// socket.on('connect', () => {
//     console.log('user connected')
// })


getPeers(torrent, (peers)=>{
    console.log(`list of peers ${peers}`)
})