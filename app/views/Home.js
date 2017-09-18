import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button, 
    ScrollView,
    TouchableHighlight,
    Alert
} from 'react-native';

import Moment from 'moment';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import db from '../db/SQLiteDB.android';
import JournalEntry from '../components/JournalEntry';
import CustomModal from '../components/CustomModal';


class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            timestamp: new Date().toISOString(),
            emoji: "",
            description: "",
            entries: [],
            modalVisible: false
        };

        this.addEntry = this.addEntry.bind(this);
        this.verifyEntry = this.verifyEntry.bind(this);
        this.changeMonth = this.changeMonth.bind(this);
        this.refreshEntries = this.refreshEntries.bind(this);
        this.removeEntryById = this.removeEntryById.bind(this);
        this.updateEntry = this.updateEntry.bind(this);
        this.isEmoji = this.isEmoji.bind(this);
        this.renderAddEntryModal = this.renderAddEntryModal.bind(this);
        

    }

    componentDidMount() {
        db.open().then(this.refreshEntries);
    }

    refreshEntries() {
        return db.getMonthlyEntries(this.state.timestamp)
            .then( entries => this.setState({ entries }) )  
    }

    changeMonth(x) {
        this.setState( (prevState) => {
            const timestamp = Moment(prevState.timestamp).add(x, 'months');
            return { timestamp }
        }, () => {
            this.refreshEntries();
        })
    }   

    addEntry() {
        return db.addEntry(new Date().toISOString(), encodeURI(this.state.emoji, "utf-8"), this.state.description)
            .then(this.refreshEntries)
            .then( () => this.setState({modalVisible: false, emoji: "", description: ""}))
    }

    verifyEntry() {
        if (this.isEmoji(this.state.emoji)) {
            this.addEntry();
        }
        else {
            Alert.alert(
                'Emoji not detected',
                'The input was not recognized as an emoji. Would you like to save this entry anyway?',
                [
                    {text: 'No', onPress: null, style: 'cancel'},
                    {text: 'Yes', onPress: () => this.addEntry() },
                ],
                { cancelable: false }
            )
        }
    }

    /** 
     * To be passed into to JournalEntry component to properly delete entry when called.
     */
    removeEntryById(entry_id) {
        return db.removeEntryById(entry_id)
            .then(this.refreshEntries);
    }
    
    /** 
     * To be passed into to JournalEntry component to properly update entry when called.
     */
    updateEntry(entry_id, timestamp, emoji, description) {
        return db.updateEntry(entry_id, timestamp, emoji, description)
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
                <TextInput onChangeText={(emoji) => this.setState({emoji})}
                    placeholder="emoji"
                    maxLength={2}
                    style={{fontSize:18}}>
                </TextInput>
                <TextInput onChangeText={(description) => this.setState({description})}
                    placeholder="notes (optional)"
                    autoCapitalize="sentences"
                    multiline={true}
                    numberOfLines={2}
                    style={{fontSize:18}}>
                </TextInput>
                <Button
                    onPress={this.verifyEntry}
                    title="Add"
                    color="#841584"
                    disabled={this.state.emoji===""}/>
            </View>
        )
    }

    render() {
        const modalContent = this.renderAddEntryModal();
        const month = Moment(this.state.timestamp).format("MMM YYYY");

        return (
            <View style={styles.container}>
                <View style={styles.month_nav}>
                    <TouchableHighlight style={styles.icon_btn}
                        onPress={()=>this.changeMonth(-1)}
                        underlayColor="#E3E3E3">
                        <Icon name="arrow-left" size={18} />
                    </TouchableHighlight>

                    <TouchableHighlight style={styles.icon_btn}
                        onPress={()=>this.setState({timestamp: new Date().toISOString()}, ()=>this.refreshEntries())}
                        underlayColor="#E3E3E3">
                        <Text style={styles.month_text}>{month}</Text>
                    </TouchableHighlight>

                    <TouchableHighlight style={styles.icon_btn}
                        onPress={()=>this.changeMonth(1)}
                        underlayColor="#E3E3E3">
                        <Icon name="arrow-right" size={18} />
                    </TouchableHighlight>
                </View>
                
                <ScrollView style={styles.journal_entries}
                    showsVerticalScrollIndicator={false}>
                {
                    this.state.entries.map( (entry, i) => {
                        return (
                            <JournalEntry {...entry} key={i}
                                removeEntryById={this.removeEntryById.bind(this,entry.entry_id)}
                                updateEntry={this.updateEntry}/>
                        )
                    })
                }
                </ScrollView>

                <Button
                    onPress={()=>this.setState({modalVisible: true})}
                    title="Add new entry"
                    color="#841584"
                />

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
        flex: 1
    },
    month_nav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    month_text: {
        fontSize: 24,
        color: 'black',
        width: 140,
        textAlign: 'center'
    },
    icon_btn: {
        padding: 5
    },
    journal_entries: {
        alignSelf: 'stretch',
        marginVertical: 10
    }
});

export default Home