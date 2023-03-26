
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("DeathRoller", function () {
  it("Should deploy and get three events", async function () {
    const DeathRoller = await ethers.getContractFactory("DeathRoller");
    const deathRoller = await DeathRoller.deploy();
    await deathRoller.deployed();

    expect(await deathRoller.getCurrentEntryFee(0)).to.equal(10000000000000000n);
    expect(await deathRoller.getCurrentEntryFee(1)).to.equal(50000000000000000n);
    expect(await deathRoller.getCurrentEntryFee(2)).to.equal(100000000000000000n);

    
  });
});
