class TreeLogsRepository{
    constructor(dao){
        this.dao = dao
    }

    createTable(){
        const sql = `
        CREATE TABLE IF NOT EXISTS tree_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tree_name STRING,
            memo TEXT,
            created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT tree_logs_fk_treeLogsId FOREIGN KEY (id)
                REFERENCES tree_logs(id) ON UPDATE CASCADE ON DELETE CASCADE)`
        return this.dao.runquery(sql)
    }

    create(tree_name, memo) {
        return this.dao.runquery(
          `INSERT INTO tree_logs (tree_name, memo)
            VALUES (?, ?)`,
          [tree_name, memo])
    }

    update(id,memo) {
        return this.dao.runquery(
          `UPDATE tree_logs SET memo = ? WHERE id = ?`,
          [ memo,id ]
        )
    }

    getById(entryId) {
        return this.dao.get(
          `SELECT * FROM tree_logs WHERE id = ?`,
          [entryId])
    }
}

module.exports = TreeLogsRepository