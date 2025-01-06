/* NOTE: udp tracker protocol, in short, is as follows

     Send a connect request
     Get the connect response and extract the connection id
     Use the connection id to send an announce request - this is where we tell the tracker which files we’re interested in
     Get the announce response and extract the peers list */



/** NOTE: tracker related code will be moved from index.js to here and will be export when needed  */

/** NOTE: url library is no longer required for url parsing apparently */
const dgram = require('dgram')
const bufferEncode = require('buffer').Buffer

const crypto = require('crypto')

function getPeers(torrent, callback){


    const url = new URL(torrent.announce.toString())        /* NOTE: the url standard node libary's parse method is deprecated
                                                                    apparently this is the new way to parse urls */


    const socket = dgram.createSocket('udp4')


    // NOTE: step 1 send connection request
    udpSend(socket,buildConnReq(), url)

    socket.on('message', (res) =>{
        if (respType(res) === 'connect') {
            // NOTE: step 2 receive and parse response
            const connRes = parseConnRes(res);

            // NOTE: step 3 send announce request
            const announceReq = buildAnnounceReq(connRes.connectionId)
            udpSend(socket, announceReq, url)
        } else if(respType(res) === 'announce') {
            // NOTE: step 4 parse announce response
            const announceRes = parseAnnounceRes(res)
            // NOTE: step 5 pass peers to callback
           callback(announceRes.peers) 
        }
    })
}


function udpSend(socket, message, rawUrl, callback=()=>{}) {
  const url = urlParse(rawUrl);
  socket.send(message, 0, message.length, url.port, url.host, callback);
}

function respType(res) {
  // ...
}

function buildConnReq() {
  // ...
    const buf = bufferEncode.alloc(16)
    buf.writeUInt32BE(0x417, 0);  // High 32 Bits
    buf.writeUInt32BE(0x27101980, 4); // Low 32 Bits

    /** NOTE: Node.js does not provide native support for writing precise 64-bit integers (like writeInt64LE or writeInt64BE).
              Instead, you must split a 64-bit integer into two 32-bit chunks and write them separately:
                    High 32 bits: Most significant part.
                    Low 32 bits: Least significant part. */


    buf.writeUInt32BE(0, 8);

    crypto.randomBytes(4).copy(buf, 12);  /* NOTE: total buffer allocation was 16 bytes however the buffer passed only utilizes 12 
                                                   crypto is used to generate a random 4 bit number to fill the rest of the allocated memory */
                                                   
    
    return buf;
}

function parseConnRes(res) {
  // ...

  return{
    action:res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    connectionId: res.slice(8)
  }
}

function buildAnnounceReq(connId) {
  // ...
}

function parseAnnounceRes(res) {
  // ...
}


module.exports = { getPeers }