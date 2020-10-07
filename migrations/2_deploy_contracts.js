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
        account1 = accounts[8];

        let emojiToken = await deployer.deploy(EmojiToken);
        await deployer.deploy(MasterChef, EmojiToken.address, dev_addr, 25, 0, 0);
        await deployer.deploy(EmojiBar, EmojiToken.address);

        let factory = await deployer.deploy(UniswapFactory, dev_addr);
        
        let wethToken = await deployer.deploy(MockERC20, "Wrapped Ether", "WETH", 1000);
        
        let anotherToken = await deployer.new(MockERC20, "Another Token", "AT", 10000000000); // using "new" it will create a new instance!

        let poolToken = 0x0;
        if(( (await factory.getPair(wethToken.address, anotherToken.address)).toString()) === '0x0000000000000000000000000000000000000000') {
            poolToken = await factory.createPair(wethToken.address, anotherToken.address);
            console.log('Result:', poolToken);
        }
     
        let router = await deployer.deploy(UniswapRouter, UniswapFactory.address, dev_addr);

        console.log("poolToken:", poolToken);
        console.log("Router:", router);

        await deployer.deploy(EmojiMaker, UniswapFactory.address, EmojiBar.address, EmojiToken.address, wethToken.address);

       /* await AnotherERC20Token.approve( router.address,10000000000 );
        router.addLiquidityETH(
            AnotherERC20Token.address,
            10000000000, //FIXME: Use BigNumbers (expandTo18Decimals)
            10000000000,
            1000000000,
            account1, // poolToken.address?
            1602088165,
            {from: account1, value: 10000000000}
        );
        */
        
    }

}