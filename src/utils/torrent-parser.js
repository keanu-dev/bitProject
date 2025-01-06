
const fs = require('fs')

const bencode = require('bencodejs');
const torrent = bencode.decode(fs.readFileSync('../dummy/puppy.torrent'), 'utf8'); /* NOTE: you can also pass the encode Schema as a second
                                                                                               argument in the decode method instead of passing it as a parameter when converting to string*/
