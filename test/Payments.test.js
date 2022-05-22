const {expect} = require('chai')
const {ethers} = require('hardhat')

describe("Payments", function () {
  let acc1, acc2, payments 
  beforeEach(async function () {
    [acc1, acc2] = await ethers.getSigners()
    const Payments = await ethers.getContractFactory('Payments', acc1)
    payments = await Payments.deploy()
  })
  it('Should be deployed', async function () {
    expect(payments.address).to.be.properAddress
  })
  it('Should has 0 ether by default ', async function () {
    const balance = await payments.currentBalance()
    expect(balance).to.eq(0)
  })
  it('Should be possible to send funds', async function () {
    const sum = 100,
          message = 'Hello from hardhat',
          transaction = await payments.connect(acc2).pay(message, { value: sum})
    await expect(() => transaction).to.changeEtherBalances([payments, acc2], [sum, -sum])
    await transaction.wait()
    const newPayment = await payments.getPayment(acc2.address, 0)
    expect(newPayment.message).to.eq(message)
    expect(newPayment.amount).to.eq(sum)
    expect(newPayment.from).to.eq(acc2.address)
  })
})