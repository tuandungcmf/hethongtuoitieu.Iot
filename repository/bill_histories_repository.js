class BillHistoriesRepository{
    constructor(dao){
        this.dao = dao
    }

    createTable(){
        const sql = `
        CREATE TABLE IF NOT EXISTS bill_histories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title STRING,
            price INTEGER,
            type BOOLEAN,
            CONSTRAINT bill_histories_fk_billId FOREIGN KEY (id)
                REFERENCES bill_histories(id) ON UPDATE CASCADE ON DELETE CASCADE)`
        return this.dao.runquery(sql)
    }

    create(title, price, type) {
        return this.dao.runquery(
          `INSERT INTO bill_histories (title, price, type)
            VALUES (?, ?, ?)`,
          [title, price, type])
    }

    getById(entryId) {
        return this.dao.get(
          `SELECT * FROM bill_histories WHERE id = ?`,
          [entryId])
    }

    getAll() {
        return this.dao.get(`SELECT * FROM bill_histories`);
    }
}

module.exports = BillHistoriesRepository