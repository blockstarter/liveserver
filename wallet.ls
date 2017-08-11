require! {
   \bitcoinjs-lib : bitcoin
   \bip32-utils : bip32utils
   \bip39
   \waves.js/dist/waves.js
}

network = bitcoin.networks.bitcoin

get-waves-address-by-index = (mnemonic, index, network)->
    symbol = if network is \waves then \W else \T
    utils =  new waves.default { chainId : symbol.charCodeAt(0)  }
    { address } = utils.create-account "#{mnemonic} / #{index}"
    address
    
get-bitcoin-address-by-index = (mnemonic, index, network)->
    seed = bip39.mnemonic-to-seed-hex mnemonic 
    hdnode = bitcoin.HDNode.from-seed-hex(seed, network).derive(index)
    hdnode.get-address!

export get-address-by-index = (mnemonic, index, network)->
    type = network?message-prefix
    console?log \type, type
    fun =
        | not type? => "Wrong Network"
        | type is \Waves or type is \WavesTest => get-waves-address-by-index
        | _ => get-bitcoin-address-by-index 
    fun mnemonic, index, network
    
export generate-keys = (mnemonic)->
    seed = bip39.mnemonic-to-seed-hex mnemonic 
    hdnode = bitcoin.HDNode.from-seed-hex(seed, network).derive(0)
    private-key = hdnode.key-pair.toWIF!
    address =  hdnode.get-address!
    public-key = hdnode.get-public-key-buffer!.to-string(\hex)
    { private-key, address, public-key }

export generate-wallet = ->
    mnemonic = bip39.generate-mnemonic!
    keys = generate-keys mnemonic
    { mnemonic, keys.address }