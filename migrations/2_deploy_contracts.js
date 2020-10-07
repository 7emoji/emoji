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

        await deployer.deploy(EmojiToken);
        let emojiToken = await EmojiToken.deployed(); // deze gedraagt zich anders!
        console.log(emojiToken.address)

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

        await deployer.deploy(EmojiMaker, UniswapFactory.address, EmojiBar.address, EmojiToken.address, wethToken.address);

        // console.log(MockERC20)
        // console.log('=======================================================================================================')
        // console.log(wethToken)
        // console.log("routeraddress", router.address)
        // console.log("pooltoken", poolToken)
        // console.log("pooltokenaddress", poolToken.logs[0].address)
        // console.log("account1", account1)

        await anotherToken.approve( router.address,10000000000 );
        await wethToken.approve( router.address, 10000000000);
        // console.log(await wethToken.totalSupply())
        // console.log(await anotherToken.totalSupply())
        // console.log(await anotherToken.allowance(accounts[0], router.address))
        // console.log(await wethToken.allowance(accounts[0], router.address))
        console.log(emojiToken.address)
        await emojiToken.mint(router.address, 10000000000);
        console.log(await emojiToken.balanceOf(router.address))

        try {
            await router.addLiquidityETH( // hier gaat nog altijd iets mis, maar wat?
                anotherToken.address, // welk address moet hier precies?
                10000000000, // FIXME: use BigNumbers ExpandTo!8Decimals
                5000000000,
                1000000000,
                account1, // poolToken.address? welk address moet hier precies?
                ~~((Date.now() + 1000*24*60*60) / 1000), // dit moet even netjes, maar het werk op zich wel
                {from: router.address, value: 10, gas: 1000000000}
            );
            
        } catch(err){
            console.error(err)
        }
    } 

}