const { ethers } = require("hardhat")

const main = async () => {
  const domainServiceContractFactory = await ethers.getContractFactory(
    "DomainService"
  )
  const domainServiceContract = await domainServiceContractFactory.deploy(
    "matic"
  )
  await domainServiceContract.deployed()
  console.log("contract deployed to", domainServiceContract.address)

  const tx = await domainServiceContract.register("layertwo", {
    value: ethers.utils.parseEther("0.1"),
  })
  await tx.wait()

  const recordTx = await domainServiceContract.setRecord(
    "layertwo",
    "layer two blockchains are sweet"
  )
  await recordTx.wait()

  const domainOwner = await domainServiceContract.getAddress("layertwo")
  console.log("domain owner of layertwo", domainOwner)

  const balance = await ethers.provider.getBalance(
    domainServiceContract.address
  )
  console.log("contract balance", ethers.utils.formatEther(balance))
}

const runMain = async () => {
  try {
    await main()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

runMain()
