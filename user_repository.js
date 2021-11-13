class UserRepository{
    constructor(dao){
        this.dao = dao
    }

    createTable(){
        const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT)`
        return this.dao.runquery(sql)
    }

    create(username, password) {
        return this.dao.runquery(
            'INSERT INTO users (username, password) VALUES (?,?)',
            [username, password])
    }

    authenticator(username, password){
        return this.dao.runquery(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password])
    }
}

module.exports = UserRepository