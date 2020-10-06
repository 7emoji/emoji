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
      network_id: "1"
    },
    test: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "1"
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          process.env.HDWALLET_MNEMONIC,
          process.env.INFURA_PROVIDER_URL,
          0, // we start with address[0]
          8 // notice that we unlock eight: which will be address[0] and address[1]
        )
      },
      network_id: 4,
      skipDryRun: true,
      gas: 4500000,
      gasPrice: 10000000000,
    }
  },
    
  //
  compilers: {
    solc: {
      version: "0.6.12",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1
        }
      }
    }
  }
};
