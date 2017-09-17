import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button, 
    ScrollView,
    Picker,
    RefreshControl
} from 'react-native';

import db from '../db/SQLiteDB.android';

class Summary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            topEmojis: [],
            topEmojisDays: 7
        };

        this.refreshData = this.refreshData.bind(this);
        this.onDaysSelect = this.onDaysSelect.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this.renderTopEmojis = this.renderTopEmojis.bind(this);
    }

    componentDidMount() {
        db.open().then(this.refreshData.bind(this, 7));
    }

    refreshData(nDays) {
        return db.getTopEmojis(10,nDays)
            .then( results => this.setState({ topEmojis: results }) )
    }

    onDaysSelect(itemValue) {
        this.setState({topEmojisDays: itemValue}, ()=> {
            this.refreshData(this.state.topEmojisDays)
        })
    } 

    _onRefresh() {
        this.setState({refreshing: true});
        this.refreshData(this.state.topEmojisDays).then(() => {
            this.setState({refreshing: false});
        });
  }

    renderTopEmojis() {
        const emojiRow = (emoji, count, key) => {
            return (
                 <View style={styles.top_emoji_row} key={key}>
                    <Text style={{fontSize:35}}>{ emoji } </Text>
                    <Text style={{fontSize:24}}> - { count }</Text>
                </View>
            )
        }

        const cols = [];
        let col = [];

        for (let i = 0 ; i < this.state.topEmojis.length; i++) {
            if (i === 4 || i === 7) {
                cols.push(col);
                col = [];
            }
            const item = this.state.topEmojis[i];
            const emoji = decodeURI(item.emoji, 'utf-8');
            const count = item.count; 
            col.push(emojiRow(emoji, count, i))
        }
        cols.push(col);

        return (
            <View style={styles.top_emojis}>
            {
                cols.map( (col, i) => {
                    return (
                        <View key={i}>
                        { col }
                        </View>
                    )
                })
            }
            </View>
        )
    }

    render() {
        const topEmojis = this.renderTopEmojis();
        const refreshControl = (
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh} />
        )
        return (
            <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={refreshControl}>
                <View style={styles.top_emojis_header}>
                    <Text style={styles.section_header}>Top Emojis:</Text>
                    <Picker style={{width:140}}
                        selectedValue={this.state.topEmojisDays}
                        onValueChange={this.onDaysSelect}>
                        <Picker.Item label="Last 3 days" value={3} />
                        <Picker.Item label="Last 7 days" value={7} />
                        <Picker.Item label="Last 14 days" value={14} />
                        <Picker.Item label="Last 30 days" value={30} />
                    </Picker>
                </View>
                { topEmojis }
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    section_header: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    top_emojis_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    top_emojis: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    top_emoji_row: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});

export default Summary