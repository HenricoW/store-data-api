const ethUtil = require("ethereumjs-util");

const getSignerAddress = (messageString, signedMessage) => {
    // message string prep
    const mssgBuff = Buffer.from(messageString);
    const mssgHashBuff = ethUtil.hashPersonalMessage(mssgBuff);

    // signature prep
    const sigRSV = ethUtil.fromRpcSig(signedMessage);

    // get public key
    const pubKey = ethUtil.ecrecover(mssgHashBuff, sigRSV.v, sigRSV.r, sigRSV.s);

    // extract address from public key & return
    return ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey));
};

module.exports = getSignerAddress;
