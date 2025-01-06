
const fs = require('fs')

const bencode = require('bencodejs');
const open = (filepath) =>{
    return bencode.decode(fs.readFileSync(filepath), 'utf8'); /* NOTE: you can also pass the encode Schema as a second
                                                                                               argument in the decode method instead of passing it as a parameter when converting to string*/
}

const size = (torrent) => {

}
const infoHash = (torrent) => {
    /* NOTE: to create torrents info hash, we'll pass the info property through 
             a hashing algorithm (specifically a sha1 hashing function) the value 
             return will be the infoHash, the crypto library has a hashing algorithm 
             hashing is necessary to uniquely identify the torrent. */


    const info = bencode.encode(torrent.info);
    return crypto.createHash('sha1').update(info).digest();
}


module.exports = {open, size, infoHash}
