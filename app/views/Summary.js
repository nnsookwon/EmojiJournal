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

const daysOfWeek = [ "Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

class Summary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            topOverallEmojis: [],
            topDailyEmojis: [],
            topOverallDays: 7,
            topDailyDays: 7
        };

        this.refreshData = this.refreshData.bind(this);
        this.refreshOverall = this.refreshOverall.bind(this);
        this.refreshDaily = this.refreshDaily.bind(this);
        this.onDaysSelect = this.onDaysSelect.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this.renderTopOverallEmojis = this.renderTopOverallEmojis.bind(this);
    }

    componentDidMount() {
        db.open().then(this.refreshData)
    }

    refreshData() {
        return this.refreshOverall().then(this.refreshDaily);
    }

    refreshOverall() {
        return db.getTopEmojisOverall(10, this.state.topOverallDays)
            .then( results => this.setState({ topOverallEmojis: results }) )
    }

    async refreshDaily(nDays) {
        const results = [];
        for (let i = 0; i < 7; i++) {
            const result = await db.getTopEmojisDaily(i, 1, this.state.topDailyDays);
            results.push(result);
        }
        this.setState({ topDailyEmojis: results}, ()=>console.log(this.state));
    }

    onDaysSelect(name, value) {
        this.setState({ [name] : value }, ()=> {
            switch (name) {
                case "topOverallDays":
                    this.refreshOverall();
                    break;
                case "topDailyDays":
                    this.refreshDaily();
                    break;
            }
        })
    } 

    _onRefresh() {
        this.setState({refreshing: true});
        this.refreshData(this.state.topEmojisDays).then(() => {
            this.setState({refreshing: false});
        });
  }

    renderTopOverallEmojis() {
        const emojiRow = (emoji, count, key) => {
            return (
                 <View style={styles.top_overall_row} key={key}>
                    <Text style={{fontSize:35, color:'black'}}>{ emoji } </Text>
                    <Text style={{fontSize:24}}> - { count }</Text>
                </View>
            )
        }

        const cols = [];
        let col = [];

        for (let i = 0 ; i < this.state.topOverallEmojis.length; i++) {
            if (i === 4 || i === 7) {
                cols.push(col);
                col = [];
            }
            const item = this.state.topOverallEmojis[i];
            const emoji = decodeURI(item.emoji, 'utf-8');
            const count = item.count; 
            col.push(emojiRow(emoji, count, i))
        }
        cols.push(col);

        return (
            <View style={styles.top_overall}>
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

    renderTopDailyEmojis() {
        return (
            <View style={styles.top_daily}>
            {
                this.state.topDailyEmojis.map( (item, i) => {
                    const emoji = item[0].emoji ? decodeURI(item[0].emoji, "utf-8") : "";
                    const dayText = daysOfWeek[i];
                    return (
                        <View key={i} style={styles.top_daily_col}>
                            <Text style={{fontSize:20}}>{ dayText }</Text>
                            <Text style={{fontSize:25, color:'black'}}>{ emoji }</Text>
                        </View>
                    )
                })
            }
            </View>
        )
    }

    render() {
        const topOverallEmojis = this.renderTopOverallEmojis();
        const topDailyEmojis = this.renderTopDailyEmojis();

        const refreshControl = (
            <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh} />
        )
        return (
            <ScrollView style={styles.container}
                showsVerticalScrollIndicator={false}
                refreshControl={refreshControl}>

                <View style={styles.section}>
                    <View style={styles.section_header}>
                        <Text style={styles.section_header_text}>Top Overall:</Text>
                        <Picker style={{width:140}}
                            selectedValue={this.state.topOverallDays}
                            onValueChange={ itemValue => this.onDaysSelect("topOverallDays", itemValue) }>
                            <Picker.Item label="Last 3 days" value={3} />
                            <Picker.Item label="Last 7 days" value={7} />
                            <Picker.Item label="Last 14 days" value={14} />
                            <Picker.Item label="Last 30 days" value={30} />
                            <Picker.Item label="All time" value={30000} />
                        </Picker>
                    </View>
                    { topOverallEmojis }
                </View>

                <View style={styles.section}>
                    <View style={styles.section_header}>
                        <Text style={styles.section_header_text}>
                            Top Daily:
                        </Text>
                        <Picker style={{width:140}}
                            selectedValue={this.state.topDailyDays}
                            onValueChange={ itemValue => this.onDaysSelect("topDailyDays", itemValue)}>
                            <Picker.Item label="Last 7 days" value={7} />
                            <Picker.Item label="Last 14 days" value={14} />
                            <Picker.Item label="Last 30 days" value={30} />
                            <Picker.Item label="All time" value={30000} />
                        </Picker>
                    </View>
                    { topDailyEmojis }
                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    section: {
        backgroundColor: "#EDF0DA",
        padding: 15,
        marginVertical: 10,
        borderWidth: 1
    },
    section_header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    section_header_text: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black'
    },
    top_overall: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    top_overall_row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    top_daily: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    top_daily_col: {
        flexDirection: 'column',
        alignItems: 'center'
    }
});

export default Summary