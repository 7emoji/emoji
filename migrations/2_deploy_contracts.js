const EmojiToken = artifacts.require("EmojiToken");
const MasterChef = artifacts.require("MasterChef");
const EmojiBar = artifacts.require("EmojiBar");
//const EmojiMaker = artifacts.require("EmojiMaker");

const UniswapFactory = artifacts.require("UniSwapV2Factory");
const UniswapRouter = artifacts.require("UniswapV2Router02");

const Token0 = artifacts.require("Token0");
const Token1 = artifacts.require("Token1");


const migration = async function(deployer,network,accounts) {
    await Promise.all([
        deployToken(deployer,network,accounts),
    ]);
};

module.exports = migration;

async function deployToken(deployer,network,accounts) {

    if( network === 'test' || network === 'develop') {
        
        dev_addr = accounts[9];
        
        await deployer.deploy(EmojiToken);
        await deployer.deploy(MasterChef, EmojiToken.address, dev_addr, 25, 0, 0);
        await deployer.deploy(EmojiBar, EmojiToken.address);

        await deployer.deploy(UniswapFactory, dev_addr);
        await deployer.deploy(UniswapRouter, UniswapFactory.address, dev_addr);

        await deployer.deploy(Token0, "AAA", "AAA", 100000000 );
        await deployer.deploy(Token1, "ZZZ", "ZZZ", 100000000 );
        

        //await deployer.deploy(EmojiMaker, 
        //    UniswapFactory.address, EmojiBar.address, EmojiToken.address, weth_address);
  
    }

}