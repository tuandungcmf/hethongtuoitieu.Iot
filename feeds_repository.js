class FeedsRepository{
    constructor(dao){
        this.dao = dao
    }

    createTable(){
        const sql = `
        CREATE TABLE IF NOT EXISTS feeds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            channelId INTEGER,
            entryId INTEGER,
            content TEXT,
            createdAt DATETIME,
            CONSTRAINT channel_fk_channelId FOREIGN KEY (channelId)
                REFERENCES channel(id) ON UPDATE CASCADE ON DELETE CASCADE)`
        return this.dao.runquery(sql)
    }

    create(entryId, channelId, content, createdAt) {
        return this.dao.runquery(
          `INSERT INTO feeds (entryId, channelId, content, createdAt)
            VALUES (?, ?, ?, ?)`,
          [entryId, channelId, content, createdAt])
    }

    getById(entryId) {
        return this.dao.get(
          `SELECT * FROM feeds WHERE entryId = ?`,
          [entryId])
    }
}

module.exports = FeedsRepository