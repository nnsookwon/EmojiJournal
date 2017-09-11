const SQLite = require('react-native-sqlite-storage')

SQLite.DEBUG(false);
SQLite.enablePromise(true);

class SQLiteDB {
	constructor() {
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.addEntry = this.addEntry.bind(this);
		this.getMostRecentEntries = this.getMostRecentEntries.bind(this);
		this.removeEntryById = this.removeEntryById.bind(this);
	}

	open() {
		const self = this;

		return SQLite.openDatabase({name: 'journal.db', location: 'default'})
			.then( DB => {
				self.db = DB;
			})
			.catch( error => {
				console.log("DB opening ERROR: " + error.message);
				throw new Error(error);
			})
			.then ( () => {
				return self.db.transaction( tx => {
					tx.executeSql('CREATE TABLE IF NOT EXISTS JournalTable ' + 
						'(entry_id INTEGER PRIMARY KEY, timestamp DATETIME, emoji TEXT, description TEXT)');
				})
			})
			.catch( error => {
				console.log("DB initialization ERROR: " + error.message);
				throw new Error(error);
			})
	}
	

	close() {
		const self = this;

		return this.db.close()
			.then( () => self.db = null )
			.catch( error => {
				console.log("Error closing DB: " + error.message);
				throw new Error(error);
			})
	}

	addEntry(timestamp, emoji, description) {
		
		return this.db.transaction( tx => {
				const query = "INSERT INTO JournalTable (timestamp, emoji, description) VALUES (?,?,?)";
				tx.executeSql(query, [timestamp, emoji, description])
				tx.executeSql('SELECT * FROM JournalTable ORDER BY timestamp desc') 
					.then( ([tx, rs]) => {
						for (let i = 0; i < rs.rows.length; i++) {
				      		console.log(rs.rows.item(i));
						}
				    })
			})
			.catch( error => {
				console.log("DB add row ERROR: " + error.message);
				throw new Error(error);
			})
	}

	getMostRecentEntries(n) {
		let execResults = null;

		return this.db.transaction( tx => {
				return tx.executeSql('SELECT * FROM JournalTable ORDER BY timestamp desc LIMIT ' + n) 
					.then( ([tx, rs]) => {
						let results = [];
						for (let i = 0; i < rs.rows.length; i++) {
				      		results.push(rs.rows.item(i));
						}
						execResults = results;
				    })
			})
			.then( () => execResults )
			.catch( error => {
				console.log("DB access entries ERROR: " + error.message);
				throw new Error(error);
			})

	}

	removeEntryById(entry_id) {
		return this.db.transaction( tx => {
				const query = "DELETE FROM JournalTable WHERE entry_id = ?";
				tx.executeSql(query, [entry_id])
			})
			.catch( error => {
				console.log("DB delete row ERROR: " + error.message);
				throw new Error(error);
			})
	}


}

export default SQLiteDB

/*

	function addItem(first, last, acctNum) {

	    db.transaction(function (tx) {

	        var query = "INSERT INTO customerAccounts (firstname, lastname, acctNo) VALUES (?,?,?)";

	        tx.executeSql(query, [first, last, acctNum], function(tx, res) {
	            console.log("insertId: " + res.insertId + " -- probably 1");
	            console.log("rowsAffected: " + res.rowsAffected + " -- should be 1");
	        },
	        function(tx, error) {
	            console.log('INSERT error: ' + error.message);
	        });
	    }, function(error) {
	        console.log('transaction error: ' + error.message);
	    }, function() {
	        console.log('transaction ok');
	    });
	}
	*/