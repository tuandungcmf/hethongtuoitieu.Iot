const Promise = require('bluebird')
const AppDAO = require('./dao')
const ChannelRepository = require('./channel_repository')  
const FeedsRepository = require('./feeds_repository')

module.exports = {
    sampleDatabase: function(){
      const dao = new AppDAO('./database.sqlite3')
      const channelRepo = new ChannelRepository(dao)
      const feedsRepo = new FeedsRepository(dao)
      const channel = [{ channelId: 18,title: 'Tiêu đề 1', position:'home', description:'in the garden' }]
      let channelId = channel[0].channelId

      channelRepo.createTable()
      .then(() => feedsRepo.createTable())
      .then(() => {
          return Promise.all(channel.map((c) => {
              const { channelId, title, position, description} = c
              return channelRepo.create(channelId, title, position, description)
          }))
      })
      .then((data) => {
        const feeds = [
          {
              id:1360,
              channelId,
              content:'{"created_at":"2021-10-31T17:23:50Z","entry_id":1360,"field1":"0","field2":"74.30","field3":"25.40","field4":"14\r\n\r\n\r\n\r\n"}', 
              createdAt:'2021-10-31T17:23:50Z'
          },
          {
              id:1361,
              channelId,
              content:'{"created_at":"2021-10-31T17:24:06Z","entry_id":1361,"field1":"78","field2":"74.20","field3":"25.40","field4":"14\r\n\r\n\r\n\r\n"}', 
              createdAt:'2021-10-31T17:35:13Z'
          }
        ]
        return Promise.all(feeds.map((feed) => {
          const { id, channelId, content, createdAt } = feed
          return feedsRepo.create(id, channelId, content, createdAt)
        }))
      })
      .then(() => channelRepo.getById(channelId))
      .then((channel) => {
        console.log(`\nRetreived channel from database`)
        console.log(`channel id = ${channel.id}`)
        console.log(`channel title = ${channel.title}`)
        return channelRepo.getFeeds(channel.id)
      })
      .then((feeds) => {
        console.log('\nRetrieved channel feeds from database')
        return new Promise((resolve, reject) => {
          tasks.forEach((feed) => {
            console.log(`feed id = ${feed.id}`)
            console.log(`feed name = ${feed.content}`)
          })
        })
        resolve('success')
      })
      .catch((err) => {
        console.log('Error: ')
        console.log(JSON.stringify(err))
      })
  }
}