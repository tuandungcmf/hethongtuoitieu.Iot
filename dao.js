const sqllite3 = require('sqlite3')
const Promise = require('bluebird')
const { resolve, reject } = require('bluebird')

class AppDAO {
    constructor (dbFilePath){
        this.db = new sqllite3.Database(dbFilePath, (err)=>{
            if(err){
                console.log('Could not connect to database',err)
            }else{
                console.log('Connected to database')
            }
        })
    }
    
    runquery(sql, params=[]){
        return new Promise((resolve,reject)=>{
            this.db.run(sql, params, function(err){
                if(err){
                    console.log('Error running sql ' + sql)
                    console.log(err)
                    reject(err)
                }else{
                    resolve({ id: this.lastID })
                }
            })
        })
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.get(sql, params, (err, result) => {
            if (err) {
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(result)
            }
          })
        })
    }

    getAll(sql, params = []) {
        return new Promise((resolve, reject) => {
          this.db.all(sql, params, (err, rows) => {
            if (err) {
              console.log('Error running sql: ' + sql)
              console.log(err)
              reject(err)
            } else {
              resolve(rows)
            }
          })
        })
    }
}

module.exports = AppDAO