module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  mocha: {
    enableTimeouts: false,
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    test: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    rinkeby: {
      provider: function() {
      return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/..."); // TODO: Your API KEY
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  },
    
  //
  compilers: {
    solc: {
      version: "0.6.12"
    }
  }
};
