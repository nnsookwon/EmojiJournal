const SQLite = require('react-native-sqlite-storage')

SQLite.DEBUG(false);
SQLite.enablePromise(true);


/**
 * Wrapper class for accessing and interacting with the SQLite Database
 * for journal entries on Android. 
 */
class SQLiteDB {
	constructor() {
		this.open = this.open.bind(this);
		this.close = this.close.bind(this);
		this.addEntry = this.addEntry.bind(this);
		this.getMostRecentEntries = this.getMostRecentEntries.bind(this);
		this.removeEntryById = this.removeEntryById.bind(this);
	}

	open() {
		return SQLite.openDatabase({name: 'journal.db', location: 'default'})
			.then( DB => {
				this.db = DB;
			})
			.catch( error => {
				console.log("DB opening ERROR: " + error.message);
				throw new Error(error);
			})
			.then ( () => {
				return this.db.transaction( tx => {
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
		return this.db.close()
			.then( () => this.db = null )
			.catch( error => {
				console.log("Error closing DB: " + error.message);
				throw new Error(error);
			})
	}

	addEntry(timestamp, emoji, description) {
		return this.db.transaction( tx => {
				const query = "INSERT INTO JournalTable (timestamp, emoji, description) VALUES (?,?,?)";
				tx.executeSql(query, [timestamp, emoji, description])
			})
			.catch( error => {
				console.log("DB add row ERROR: " + error.message);
				throw new Error(error);
			})
	}

	getMostRecentEntries(n) {
		// hold query results to return 
		let execResults = null;

		return this.db.transaction( tx => {
				tx.executeSql('SELECT * FROM JournalTable ORDER BY timestamp desc LIMIT ' + n) 
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

	updateEntry(entry_id, timestamp, emoji, description) {
		return this.db.transaction( tx => {
				const query = "UPDATE JournalTable SET timestamp = ?, emoji = ?, description = ? WHERE entry_id = ?";
				tx.executeSql(query, [timestamp, emoji, description, entry_id])
			})
			.catch( error => {
				console.log("DB edit row ERROR: " + error.message);
				throw new Error(error);
			})
	}


}

export default SQLiteDB
