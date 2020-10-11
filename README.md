# Emoji 🍣

Feel free to read the code. More details coming soon.

## Setting up your workspace

1. run 'npm install' in your workspace
2. run Ganache and setup a workspace
3. run 'npm test' in your workspace

### Deploying locally

For testing:
1. run 'npx ganache-cli --deterministic --allowUnlimitedContractSize --networkId 2'
2. run 'npx truffle migrate --network test'

For development:
1. run 'npx ganache-cli --deterministic --allowUnlimitedContractSize --networkId 1 -p 7545'
2. run 'npx truffle migrate --network develop'

## Deploying on Ropsten

1. Edit secrets.env.template and set variables
2. truffle console --network ropsten
3. truffle(ropsten)> await web3.eth.getAccounts()
4. truffle(ropsten)> await web3.eth.getBalance('<ADDRESS>')
5. Get some ether 
- https://faucet.ropsten.be/
- https://faucet.metamask.io/
- https://faucet.kyber.network/
6. truffle migrate --reset --network ropsten


## Deployed Contracts / Hash

- EmojiToken - https://etherscan.io/token/0x0
- MasterChef - https://etherscan.io/address/0x0
- (Uni|Emoji)swapV2Factory - https://etherscan.io/address/0x0
- (Uni|Emoji)swapV2Router02 - https://etherscan.io/address/0x0
- (Uni|Emoji)swapV2Pair init code hash - `e18a34eb0e04b04f7a0ac29a6e80748dca96319b42c54d679cb821dca90c6303` (UniswapV2Library.sol)
- EmojiBar - https://etherscan.io/address/0x0
- EmojiMaker - https://etherscan.io/address/0x0

## License

WTFPL
