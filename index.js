const fs = require('fs')
const dgram = require('dgram')
const urlParser = require('url')
const bufferEncode = require('buffer').Buffer

// const bencodeParser = require('./src/utils/bencodeParser');

// const torrent = fs.readFileSync('./src/dummy/puppy.torrent')
// const torrent = bencodeParser(fs.readFileSync('./src/dummy/puppy.torrent'))

const bencode = require('bencodejs');

// const torrent = fs.readFileSync('./dummy/puppy.torrent');

const torrent = bencode.decode(fs.readFileSync('./src/dummy/puppy.torrent'), 'utf8'); /* NOTE: you can also pass the encode Schema as a second
                                                                              argument in the decode method instead of passing it as a parameter when converting to string*/


 /* console.log(torrent.announce.toString());  NOTE: readfileSync on its own doesn't return a string, 
                                                        it returns a buffer which is converted to string using utf-8 encoding schema */
// console.log(JSON.stringify(torrent));

const url = new URL(torrent.announce.toString())        /* NOTE: the url standard node libary's parse method is deprecated
                                                                 apparently this is the new way to parse urls */
// console.log(url.port)  NOTE: test parsing 

const socket = dgram.createSocket('udp4')
// socket.on('connect', () => {
//     console.log('user connected')
// })

const myMsg = bufferEncode.from('message','utf8')

const callback = () => {
    // NOTE: function to be called after send method is executed 
}


socket.send(myMsg, 0, myMsg.length, url.port, url.host, callback)

socket.on('message', (msg) =>{
    console.log('message: ', msg)
})

