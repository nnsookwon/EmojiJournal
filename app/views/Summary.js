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

class Summary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            topEmojis: []
        };

        this.refreshData = this.refreshData.bind(this);
        this.renderTopEmojis = this.renderTopEmojis.bind(this);
    }

    componentDidMount() {
        db.open().then(this.refreshData);
    }

    refreshData() {
        db.getTopEmojis(10,10)
            .then( results => this.setState({ topEmojis: results }) )
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
        return (
            <View style={styles.container}>
                <Text style={styles.section_header}>Top Emojis:</Text>
                { topEmojis }
            </View>
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