const { ethers } = require("hardhat")

const main = async () => {
  const [owner, userOne] = await ethers.getSigners()

  const domainServiceContractFactory = await ethers.getContractFactory(
    "DomainService"
  )
  const domainServiceContract = await domainServiceContractFactory.deploy(
    "matic"
  )
  await domainServiceContract.deployed()
  console.log("contract deployed to", domainServiceContract.address)
  console.log("contract deployed by", owner.address)

  const tx = await domainServiceContract.register("verylongdomain", {
    value: ethers.utils.parseEther("0.1"),
  })
  await tx.wait()

  const balance = await ethers.provider.getBalance(
    domainServiceContract.address
  )
  console.log("contract balance", ethers.utils.formatEther(balance))

  try {
    const invalidWithdrawTx = await domainServiceContract
      .connect(userOne)
      .withdraw()
    await invalidWithdrawTx.wait()
  } catch (e) {
    console.error("could not rob contract")
  }

  const realWithdrawTx = await domainServiceContract.withdraw()
  await realWithdrawTx.wait()

  const contractBalance = await ethers.provider.getBalance(
    domainServiceContract.address
  )
  const ownerBalance = await ethers.provider.getBalance(owner.address)

  console.log(
    "Contract balance after withdrawal:",
    ethers.utils.formatEther(contractBalance)
  )
  console.log(
    "Balance of owner after withdrawal:",
    ethers.utils.formatEther(ownerBalance)
  )
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
