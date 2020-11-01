require('dotenv').config();

const EmojiToken = artifacts.require("EmojiToken");
const MasterChef = artifacts.require("MasterChef");
const EmojiBar = artifacts.require("EmojiBar");
const EmojiMaker = artifacts.require("EmojiMaker");

const UniswapFactory = artifacts.require("UniSwapV2Factory");
const UniswapRouter = artifacts.require("UniswapV2Router02");
const UniswapPair = artifacts.require("UniswapV2Pair");
const UniswapERC20 = artifacts.require("UniswapV2ERC20")

const Migrator = artifacts.require('Migrator');
const WETH = artifacts.require('WETH');

const Token0 = artifacts.require("Token0");
const Token1 = artifacts.require("Token1");

const migration = async function(deployer,network,accounts) {
    await Promise.all([
        deployToken(deployer,network,accounts),
    ]);
};

module.exports = migration;

async function deployToken(deployer,network,accounts) {

    let emojiPerBlock = 25;
    let startBlock = 0;
    let bonusEndBlock = 0;

    if( network === 'ropsten') {
        var dev_addr = process.env.DEV_ADDR;
        var weth = await WETH.at('0xc778417E063141139Fce010982780140Aa0cD5Ab');
    }
    else {
        var dev_addr = accounts[0];
        await deployer.deploy(WETH);
        var weth = await WETH.deployed();
    }

    let weth_addr = weth.address;

    const emojiToken = await deployer.deploy(EmojiToken);

    await deployer.deploy(MasterChef, EmojiToken.address, dev_addr, emojiPerBlock, startBlock, bonusEndBlock);
    await deployer.deploy(EmojiBar, EmojiToken.address);
    const factory = await deployer.deploy(UniswapFactory, dev_addr);

    const router = await deployer.deploy(UniswapRouter, factory.address, weth_addr);
    
    const masterChef = await MasterChef.deployed();
    // MasterChef is the master of Emoji. He can make Emoji and he is a fair guy.
    await emojiToken.transferOwnership(masterChef.address);

    await deployer.deploy(EmojiMaker,
            UniswapFactory.address, EmojiBar.address, EmojiToken.address, weth_addr);
    
    const emojiMaker = await EmojiMaker.deployed();
    await factory.setFeeTo(emojiMaker.address,  { from: dev_addr });


    if( network === 'ropsten' || network === 'test' || network === 'develop') {
        const AAAToken = await deployer.deploy(Token0, "AAA", "AAA", web3.utils.toWei('1000000') );
        const ZZZToken = await deployer.deploy(Token1, "ZZZ", "ZZZ", web3.utils.toWei('1000000') );
        console.log("AAAToken:", AAAToken.address);
        console.log("ZZZToken:", ZZZToken.address);
    }


    console.log("Admin:", dev_addr);
    console.log("WETH:",weth.address);
    console.log("EmojiToken:", emojiToken.address);
    console.log("MasterChef:",masterChef.address);
    console.log("(Uni|Emoji)swapV2Factory:",factory.address);
    console.log("(Uni|Emoji)swapV2Router02:", router.address);
    console.log("EmojiBar:", EmojiBar.address);
    console.log("EmojiMaker:",emojiMaker.address);


}