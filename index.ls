require! {
   \./container.js
   \./wallet.js
}

{ get-container, get-container-list } = container
{ generate-wallet, generate-keys, get-address-by-index } = wallet

exports <<< { get-container, generate-wallet, get-container-list, generate-keys }


    


