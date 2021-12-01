class ChannelRepository{
    constructor(dao){
        this.dao = dao
    }

    createTable(){
        const sql = `
        CREATE TABLE IF NOT EXISTS channel (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            channelId INTEGER,
            title TEXT,
            position TEXT,
            description TEXT)`
        return this.dao.runquery(sql)
    }

    create(channelId, title, position, description) {
        return this.dao.runquery(
          'INSERT INTO channel (channelId, title, position, description) VALUES (?,?,?,?)',
          [channelId, title, position, description])
    }

    update(channel) {
        const { channelId, title, position, description } = channel
        return this.dao.runquery(
          `UPDATE channel SET title = ? and position = ? and description = ? WHERE channelId = ?`,
          [ title, position, description, channelId]
        )
    }

    delete(id) {
        return this.dao.runquery(
          `DELETE FROM channel WHERE id = ?`,
          [id]
        )
    }

    getAll() {
        return this.dao.all(`SELECT * FROM channel`)
    }

    getById(id) {
        return this.dao.get(
          `SELECT * FROM channel WHERE id = ?`,
          [id])
    }

    getFeeds(channelId) {
        return this.dao.all(
          `SELECT * FROM feeds WHERE channelId = ?`,
          [channelId])
    }
}

module.exports = ChannelRepository