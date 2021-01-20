require('babel-register');
require('babel-polyfill');

var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "";

module.exports = {
  networks: {
     /*development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    }, */
   rinkeby: {
      provider: function() { 
       return new HDWalletProvider(mnemonic,
         "");
      },
      network_id: 4,
      gasPrice: 20000000000,
      skipDryRun: true
      }  
     
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  
  compilers: {
    solc: {
      version: "0.8.0",
      optimizer: {
        enabled: true,
        runs: 200
      },
    }
  }
}
