import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button, 
  ScrollView
} from 'react-native';


import db from '../db/SQLiteDB.android';
import JournalEntry from '../components/JournalEntry';
import CustomModal from '../components/CustomModal';


class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			emoji: "",
			description: "",
		  	mostRecentEntries: [],
		  	modalVisible: false
		};

		this.db = new db();

		this.addEntry = this.addEntry.bind(this);
		this.refreshEntries = this.refreshEntries.bind(this);
		this.removeEntryById = this.removeEntryById.bind(this);
		this.updateEntry = this.updateEntry.bind(this);
		this.isEmoji = this.isEmoji.bind(this);
		this.renderAddEntryModal = this.renderAddEntryModal.bind(this);
		

	}

	componentDidMount() {
		this.db.open()
			.then(this.refreshEntries)
	}

	componentWillUnmount() {
		if (this.db) {
			this.db.close()
		  		.then( () => this.db = null )	
	  	}
	}

	refreshEntries() {
		return this.db.getMostRecentEntries(10)
			.then( mostRecentEntries => this.setState({ mostRecentEntries }) )	
	}	

	addEntry() {
		return this.db.addEntry(new Date().toISOString(), this.state.emoji, this.state.description)
			.then(this.refreshEntries)
			.then( () => this.setState({modalVisible: false, emoji: "", description: ""}))
	}

	/** 
	 * To be passed into to JournalEntry component to properly delete entry when called.
	 */
	removeEntryById(entry_id) {
		return this.db.removeEntryById(entry_id)
			.then(this.refreshEntries);
	}
	
	/** 
	 * To be passed into to JournalEntry component to properly update entry when called.
	 */
	updateEntry(entry_id, timestamp, emoji, description) {
		return this.db.updateEntry(entry_id, timestamp, emoji, description)
			.then(this.refreshEntries);
	}

	/** 
	 * Returns true if 'emoji' parameter passed in is an emoji, false otherwise.
	 */
	isEmoji(emoji) {
		const emojiRegEx = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/
		return emojiRegEx.test(emoji);
	}

	renderAddEntryModal() {
		return (
			<View>
				<TextInput onChangeText={(emoji) => this.setState({emoji: encodeURI(emoji, "utf-8")})}
					placeholder="emoji"
					maxLength={2}
					style={{fontSize:18}}>
		        </TextInput>
		        <TextInput onChangeText={(description) => this.setState({description})}
					placeholder="add notes"
					autoCapitalize="sentences"
					multiline={true}
					numberOfLines={2}
					style={{fontSize:18}}>
		        </TextInput>
		        <Button
					onPress={this.addEntry}
					title="Add"
					color="#841584"/>
			</View>
		)
	}

	render() {
		const modalContent = this.renderAddEntryModal();

		return (
			<View style={styles.container}>
				<Button
					onPress={()=>this.setState({modalVisible: true})}
					title="Add new entry"
					color="#841584"
				/>
				<ScrollView style={styles.journal_entries}
					showsVerticalScrollIndicator={false}>
				{
					this.state.mostRecentEntries.map( (entry, i) => {
						return (
							<JournalEntry {...entry} key={i}
								removeEntryById={this.removeEntryById.bind(this,entry.entry_id)}
								updateEntry={this.updateEntry}/>
						)
					})
				}
				</ScrollView>

				{/* Display modal to add entry */}
				<CustomModal modalVisible={this.state.modalVisible}
         			onRequestClose={()=>this.setState({modalVisible:false, emoji: "", description: ""})}
					content={modalContent}/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
  	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#D4E7E7',
		padding: 15
  	},
  	journal_entries: {
    	alignSelf: 'stretch',
    	marginTop: 10
  	}
});

export default Home