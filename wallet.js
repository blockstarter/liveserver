// Generated by LiveScript 1.5.0
(function(){
  var bitcoin, bip32utils, bip39, generateKeys, generateWallet, out$ = typeof exports != 'undefined' && exports || this;
  bitcoin = require('bitcoinjs-lib');
  bip32utils = require('bip32-utils');
  bip39 = require('bip39');
  out$.generateKeys = generateKeys = function(mnemonic){
    var seed, hdnode, privateKey, address, publicKey;
    seed = bip39.mnemonicToSeedHex(mnemonic);
    hdnode = bitcoin.HDNode.fromSeedHex(seed, network).derive(0);
    privateKey = hdnode.keyPair.toWIF();
    address = hdnode.getAddress();
    publicKey = hdnode.getPublicKeyBuffer().toString('hex');
    return {
      privateKey: privateKey,
      address: address,
      publicKey: publicKey
    };
  };
  out$.generateWallet = generateWallet = function(){
    var mnemonic, keys;
    mnemonic = bip39.generateMnemonic();
    keys = generateKeys(mnemonic);
    return {
      mnemonic: mnemonic,
      address: keys.address
    };
  };
}).call(this);