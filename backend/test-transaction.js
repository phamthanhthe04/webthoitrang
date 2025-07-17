const { Transaction, Wallet, User } = require('./src/models');

async function checkData() {
  try {
    const transactionCount = await Transaction.count();
    console.log('Số lượng transaction:', transactionCount);

    const walletCount = await Wallet.count();
    console.log('Số lượng wallet:', walletCount);

    if (transactionCount > 0) {
      const sampleTransaction = await Transaction.findOne({
        include: [
          {
            model: Wallet,
            include: [User],
          },
        ],
      });
      console.log(
        'Sample transaction:',
        JSON.stringify(sampleTransaction, null, 2)
      );
    }
  } catch (error) {
    console.error('Error:', error);
  }
  process.exit(0);
}

checkData();
