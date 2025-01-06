const fs = require('fs');
const bencodejs = require('bencode');

// const torrent = fs.readFileSync('./dummy/puppy.torrent');
const torrent = bencode.decode(fs.readFileSync('./dummy/puppy.torrent')); /* NOTE: you can also pass the encode Schema as a second
                                                                                  argument in the decode method instead of passing it as a parameter when converting to string*/

console.log(torrent.toString('uts:qf8')); /* NOTE: readfileSync on its own doesn't return a string, 
                                                        it returns a buffer which is converted to string using utf-8 encoding schema */
