//module.exports = function(deployer) {};

const EmojiToken = artifacts.require("EmojiToken");
const MasterChef = artifacts.require("MasterChef");
const EmojiBar = artifacts.require("EmojiBar");


const UniswapFactory = artifacts.require("UniSwapV2Factory");
const UniswapRouter = artifacts.require("UniswapV2Router02");
const MockERC20 = artifacts.require("MockERC20");

const EmojiMaker = artifacts.require("EmojiMaker");

const migration = async function(deployer,network,accounts) {
    await Promise.all([
        deployToken(deployer,network,accounts),
    ]);
};

module.exports = migration;

async function deployToken(deployer,network,accounts) {

    if( network === 'test' ) {
        
        dev_addr = accounts[9];

        await deployer.deploy(EmojiToken);
        await deployer.deploy(MasterChef, EmojiToken.address, dev_addr, 25, 0, 0);
        await deployer.deploy(EmojiBar, EmojiToken.address);


        await deployer.deploy(MockERC20, "Wrapped Ether", "WETH", 1000);
        await deployer.deploy(UniswapFactory, dev_addr);
        await deployer.deploy(UniswapRouter, UniswapFactory.address, dev_addr);

        await deployer.deploy(EmojiMaker, UniswapFactory.address, EmojiBar.address, EmojiToken.address, MockERC20.address);
    }

}