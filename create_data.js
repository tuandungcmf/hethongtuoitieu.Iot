const AppDAO = require('./dao')
const ChannelRepository = require('./repository/channel_repository')  
const FeedsRepository = require('./repository/feeds_repository')
const TreeLogsRepository = require('./repository/tree_logs_repository')
const BillHistoriesRepository = require('./repository/bill_histories_repository')

module.exports = {
    createDatabase: function(){
      const dao = new AppDAO('./config/database.sqlite3')
      const channelRepo = new ChannelRepository(dao)
      const feedsRepo = new FeedsRepository(dao)
      const treeLogsRepo = new TreeLogsRepository(dao)
      const billHistoriesRepo = new BillHistoriesRepository(dao)

      channelRepo.createTable()
      .then(() => feedsRepo.createTable())
      .then(() => treeLogsRepo.createTable())
      .then(() => billHistoriesRepo.createTable())
      // .then(() => {
      //   const bills = [
      //     {
      //       title: '11-2021',
      //       price: 520000,
      //       type: 0
      //     },
      //     {
      //       title: '10-2021',
      //       price: 510000,
      //       type: 0
      //     },
      //     {
      //       title: '11-2021',
      //       price: 220000,
      //       type: 1
      //     },
      //     {
      //       title: '10-2021',
      //       price: 210000,
      //       type: 1
      //     }
      //   ]
      //   return Promise.all(bills.map((bill)=>{
      //     const {title, price, type} = bill
      //     return billHistoriesRepo.create(title, price, type)
      //   }))
      // })
      .catch((err) => {
        console.log('Error: ')
        console.log(JSON.stringify(err))
      })
  }
}