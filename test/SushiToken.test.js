const { expectRevert } = require('@openzeppelin/test-helpers');
const EmojiToken = artifacts.require('EmojiToken');

contract('EmojiToken', ([alice, bob, carol]) => {
    beforeEach(async () => {
        this.emoji = await EmojiToken.new({ from: alice });
    });

    it('should have correct name and symbol and decimal', async () => {
        const name = await this.emoji.name();
        const symbol = await this.emoji.symbol();
        const decimals = await this.emoji.decimals();
        assert.equal(name.valueOf(), 'EmojiToken');
        assert.equal(symbol.valueOf(), 'EMOJI');
        assert.equal(decimals.valueOf(), '18');
    });

    it('should only allow owner to mint token', async () => {
        await this.emoji.mint(alice, '100', { from: alice });
        await this.emoji.mint(bob, '1000', { from: alice });
        await expectRevert(
            this.emoji.mint(carol, '1000', { from: bob }),
            'Ownable: caller is not the owner',
        );
        const totalSupply = await this.emoji.totalSupply();
        const aliceBal = await this.emoji.balanceOf(alice);
        const bobBal = await this.emoji.balanceOf(bob);
        const carolBal = await this.emoji.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '100');
        assert.equal(bobBal.valueOf(), '1000');
        assert.equal(carolBal.valueOf(), '0');
    });

    it('should supply token transfers properly', async () => {
        await this.emoji.mint(alice, '100', { from: alice });
        await this.emoji.mint(bob, '1000', { from: alice });
        await this.emoji.transfer(carol, '10', { from: alice });
        await this.emoji.transfer(carol, '100', { from: bob });
        const totalSupply = await this.emoji.totalSupply();
        const aliceBal = await this.emoji.balanceOf(alice);
        const bobBal = await this.emoji.balanceOf(bob);
        const carolBal = await this.emoji.balanceOf(carol);
        assert.equal(totalSupply.valueOf(), '1100');
        assert.equal(aliceBal.valueOf(), '90');
        assert.equal(bobBal.valueOf(), '900');
        assert.equal(carolBal.valueOf(), '110');
    });

    it('should fail if you try to do bad transfers', async () => {
        await this.emoji.mint(alice, '100', { from: alice });
        await expectRevert(
            this.emoji.transfer(carol, '110', { from: alice }),
            'ERC20: transfer amount exceeds balance',
        );
        await expectRevert(
            this.emoji.transfer(carol, '1', { from: bob }),
            'ERC20: transfer amount exceeds balance',
        );
    });
  });
