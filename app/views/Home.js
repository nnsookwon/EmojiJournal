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
		this.isEmoji = this.isEmoji.bind(this);
		this.renderAddEntryModal = this.renderAddEntryModal.bind(this);

	}

	componentDidMount() {
		this.db.open()
			.then( () => this.db.getMostRecentEntries(10) )
		  	.then( mostRecentEntries => this.setState({ mostRecentEntries }) )
	}

	componentWillUnmount() {
		this.db.close()
		  	.then( () => this.db = null )	
	}

	addEntry() {
		this.db.addEntry(new Date().toISOString(), this.state.emoji, this.state.description)
			.then( () => this.db.getMostRecentEntries(10) )
			.then( mostRecentEntries => this.setState({ mostRecentEntries }) )
			.then( () => this.setState({modalVisible: false}))
	}

	isEmoji(emoji) {
		const emojiRegEx = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/
		return emojiRegEx.test(emoji);
	}

	renderAddEntryModal() {
		return (
			<View>
				<TextInput onChangeText={(emoji) => { console.log(this.isEmoji(emoji));this.setState({emoji: encodeURI(emoji, "utf-8")})} }
					placeholder="emoji"
					maxLength={2}
					style={{fontSize:18}}>
		        </TextInput>
		        <TextInput onChangeText={(description) => this.setState({description})}
					placeholder="add notes"
					autoCapitalize="sentences"
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
					title="ADD NEW ENTRY"
					color="#841584"
				/>
				<ScrollView style={styles.journal_entries}
					showsVerticalScrollIndicator={false}>
				{
					this.state.mostRecentEntries.map( (entry, i) => {
						return (
							<JournalEntry {...entry} key={i}/>
						)
					})
				}
				</ScrollView>

				<CustomModal modalVisible={this.state.modalVisible}
         			onRequestClose={()=>this.setState({modalVisible:false})}
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