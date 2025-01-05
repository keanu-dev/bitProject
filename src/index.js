// const fs = require(`fs`)
// const bencode = require('bencode');

// // const torrent = fs.readFileSync('./dummy/puppy.torrent');
// const torrent = bencode.decode(fs.readFileSync(`./dummy/puppy.torrent`)) /* NOTE: you can also pass the encode Schema as a second
//                                                                                   argument in the decode method instead of passing it as a parameter when converting to string*/




// console.log(torrent.toString('utf8')) /* NOTE: readfileSync on its own doesn't return a string, 
//                                                it returns a buffer which is converted to string using utf-8 encoding schema */


const fs = require('fs');
const bencode = require('bencode');

// Read and decode the .torrent file
const torrentBuffer = fs.readFileSync('./dummy/puppy.torrent');
const torrent = bencode.decode(torrentBuffer);

// Log the decoded object in a readable format
console.log(JSON.stringify(torrent, null, 2));


