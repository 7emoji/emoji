require('dotenv').config();

const EmojiToken = artifacts.require("EmojiToken");
const MasterChef = artifacts.require("MasterChef");
const EmojiBar = artifacts.require("EmojiBar");
const EmojiMaker = artifacts.require("EmojiMaker");

const UniswapFactory = artifacts.require("UniSwapV2Factory");
const UniswapRouter = artifacts.require("UniswapV2Router02");

const Migrator = artifacts.require('Migrator');
const WETH = artifacts.require('WETH');

const Token0 = artifacts.require("Token0")
const Token1 = artifacts.require("Token1")

const migration = async function(deployer,network,accounts) {
    await Promise.all([
        deployToken(deployer,network,accounts),
    ]);
};

module.exports = migration;

async function deployToken(deployer,network,accounts) {

    if( network === 'develop' ) {

        let dev_addr = accounts[9];

        await deployer.deploy(WETH);
        const weth = await WETH.deployed();

        let weth_addr = weth.address;

        await deployer.deploy(EmojiToken);
        await deployer.deploy(MasterChef, EmojiToken.address, dev_addr, 25, 0, 0);
        await deployer.deploy(UniswapFactory, dev_addr);
        await deployer.deploy(UniswapRouter, UniswapFactory.address, weth_addr);

        // Two dummy tokens to test pairing
        await deployer.deploy(Token0, "AAA", "AAA",  web3.utils.toWei('1000000') );
        await deployer.deploy(Token1, "ZZZ", "ZZZ",  web3.utils.toWei('1000000') );
    }
    else if( network === 'test' ) {
        
        let dev_addr = accounts[0];
       
        await deployer.deploy(WETH);
        const weth = await WETH.deployed();

        let weth_addr = weth.address;
        
        const emojiToken = await deployer.deploy(EmojiToken);
        const AAAToken = await deployer.deploy(Token0, "AAA", "AAA", web3.utils.toWei('1000000') );
        const ZZZToken = await deployer.deploy(Token1, "ZZZ", "ZZZ", web3.utils.toWei('1000000') );

        await deployer.deploy(MasterChef, EmojiToken.address, dev_addr, 25, 0, 0);
        await deployer.deploy(EmojiBar, EmojiToken.address);
        const factory = await deployer.deploy(UniswapFactory, dev_addr);


        await deployer.deploy(UniswapRouter, factory.address, weth_addr);

        
        const masterChef = await MasterChef.deployed();
        // MasterChef is the master of Emoji. He can make Emoji and he is a fair guy.
        await emojiToken.transferOwnership(masterChef.address);

        await deployer.deploy(EmojiMaker,
             UniswapFactory.address, EmojiBar.address, EmojiToken.address, weth_addr);
        
        const emojiMaker = await EmojiMaker.deployed();
        await factory.setFeeTo(emojiMaker.address);


    }
    else if ( network === 'ropsten' ) {

        let dev_addr = process.env.DEV_ADDR;

        await deployer.deploy(WETH);
        const weth = await WETH.deployed();

        let weth_addr = weth.address;
        
        const emojiToken = await deployer.deploy(EmojiToken);
        const AAAToken = await deployer.deploy(Token0, "AAA", "AAA", web3.utils.toWei('1000000') );
        const ZZZToken = await deployer.deploy(Token1, "ZZZ", "ZZZ", web3.utils.toWei('1000000') );

        await deployer.deploy(MasterChef, EmojiToken.address, dev_addr, 25, 0, 0);
        await deployer.deploy(EmojiBar, EmojiToken.address);
        const factory = await deployer.deploy(UniswapFactory, dev_addr);


        await deployer.deploy(UniswapRouter, factory.address, weth_addr);

        
        const masterChef = await MasterChef.deployed();
        // MasterChef is the master of Emoji. He can make Emoji and he is a fair guy.
        await emojiToken.transferOwnership(masterChef.address);

        await deployer.deploy(EmojiMaker,
             UniswapFactory.address, EmojiBar.address, EmojiToken.address, weth_addr);
        
        const emojiMaker = await EmojiMaker.deployed();
        await factory.setFeeTo(emojiMaker.address);


        await deployer.deploy(
            Migrator,
            masterChef.address,
            // https://ropsten.etherscan.io/address/0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f 
            '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
            factory.address,
            1
        );
    }

}