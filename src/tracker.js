/* NOTE: udp tracker protocol, in short, is as follows

     Send a connect request
     Get the connect response and extract the connection id
     Use the connection id to send an announce request - this is where we tell the tracker which files we’re interested in
     Get the announce response and extract the peers list */



/** NOTE: tracker related code will be moved from index.js to here and will be export when needed  */

/** NOTE: url library is no longer required for url parsing apparently */
const dgram = require('dgram')
const bufferEncode = require('buffer').Buffer
const torrentParser = require('./utils/torrent-parser')
const util = require('./utils/util')
const crypto = require('crypto')

function getPeers(torrent, callback){


    
    const socket = dgram.createSocket('udp4')

    // NOTE: step 1 send connection request
    const url = new URL(torrent.announce.toString())        
    udpSend(socket,buildConnReq(), url)

    socket.on('message', (res) =>{
        if (resType(res) === 'connect') {
            // NOTE: step 2 receive and parse response
            const connRes = parseConnRes(res);

            // NOTE: step 3 send announce request
            const announceReq = buildAnnounceReq(connRes.connectionId, torrent)
            udpSend(socket, announceReq, url)
        } else if(resType(res) === 'announce') {
            // NOTE: step 4 parse announce response
            const announceRes = parseAnnounceRes(res)
            // NOTE: step 5 pass peers to callback
           callback(announceRes.peers) 
        }
    })

}


function udpSend(socket, message, rawUrl, callback=()=>{}) {
  const url = new URL(torrent.announce.toString())        /* NOTE: the url standard node libary's parse method is deprecated
                                                                    apparently this is the new way to parse urls */

  socket.send(message, 0, message.length, url.port, url.host, callback);
}

function resType(res) {
  // ...
    const action = resp.readUInt32BE(0);
  if (action === 0) return 'connect';
  if (action === 1) return 'announce';
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
  // ... NOTE: message formatting
    /** Offset  Size            Name            Value
        0       32-bit integer  action          0 // connect
        4       32-bit integer  transaction_id
        8       64-bit integer  connection_id
        16 
        
        offset being the datas bite size, 4 
        */


  return{
    action:res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    connectionId: res.slice(8)
  }
}

function buildAnnounceReq(connId, torrent, port=6881) {
  // ... NOTE: building announce message, the formatting is a bit different in this instance

    /** Offset  Size    Name    Value
        0       64-bit integer  connection_id
        8       32-bit integer  action          1 // announce
        12      32-bit integer  transaction_id
        16      20-byte string  info_hash
        36      20-byte string  peer_id
        56      64-bit integer  downloaded
        64      64-bit integer  left
        72      64-bit integer  uploaded
        80      32-bit integer  event           0 // 0: none; 1: completed; 2: started; 3: stopped
        84      32-bit integer  IP address      0 // default
        88      32-bit integer  key             ? // random
        92      32-bit integer  num_want        -1 // default
        96      16-bit integer  port            ? // should be betwee
        98 */

    const buf = Buffer.allocUnsafe(98);

  // NOTE: connection id
  connId.copy(buf, 0);
  // NOTE: action
  buf.writeUInt32BE(1, 8);
  // NOTE: transaction id
  crypto.randomBytes(4).copy(buf, 12);
  // NOTE: info hash
  torrentParser.infoHash(torrent).copy(buf, 16);
  // NOTE: peerId
  util.genId().copy(buf, 36);
  // NOTE: downloaded
  Buffer.alloc(8).copy(buf, 56);
  // NOTE: left
  torrentParser.size(torrent).copy(buf, 64);
  // NOTE: uploaded
  Buffer.alloc(8).copy(buf, 72);
  // NOTE: event
  buf.writeUInt32BE(0, 80);
  // NOTE: ip address
  buf.writeUInt32BE(0, 80);
  // NOTE: key
  crypto.randomBytes(4).copy(buf, 88);
  // NOTE: num want
  buf.writeInt32BE(-1, 92); /* NOTE: the number expected is negative 
                                     therefore writeInt32BE is used instead of writeUInt32BE */

  // NOTE: port
  buf.writeUInt16BE(port, 96);

  return buf;
}

function parseAnnounceRes(res) {
  // ... NOTE: Parsing
  
  /*Offset      Size            Name            Value
    0           32-bit integer  action          1 // announce
    4           32-bit integer  transaction_id
    8           32-bit integer  interval
    12          32-bit integer  leechers
    16          32-bit integer  seeders
    20 + 6 * n  32-bit integer  IP address
    24 + 6 * n  16-bit integer  TCP port
    20 + 6 * N*/

    function group(iterable, groupSize) {
    let groups = [];
    for (let i = 0; i < iterable.length; i += groupSize) {
      groups.push(iterable.slice(i, i + groupSize));
    }
    return groups;
  }

  return {
    action: res.readUInt32BE(0),
    transactionId: res.readUInt32BE(4),
    leechers: res.readUInt32BE(8),
    seeders: res.readUInt32BE(12),
    peers: group(res.slice(20), 6).map(address => {
      return {
        ip: address.slice(0, 4).join('.'),
        port: address.readUInt16BE(4)
      }
    })
  }

}


module.exports = { getPeers }