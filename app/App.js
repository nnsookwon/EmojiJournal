/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button, 
    ScrollView,
    ViewPagerAndroid
} from 'react-native';
import { MenuContext } from 'react-native-popup-menu';
import MenuBar from './components/MenuBar';
import Home from './views/Home';
import Summary from './views/Summary';

import db from './db/SQLiteDB.android';


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedPageView: 0
        };
        this._onPageSelected = this._onPageSelected.bind(this);
        this._setPage = this._setPage.bind(this);
    }
    _onPageSelected(event) {
        const { position } = event.nativeEvent;
        this.setState({selectedPageView: position})
    }

    _setPage(index) {
        this.viewPager.setPage(index);
        this.setState({selectedPageView: index});
    }

    componentWillUnmount() {
        db.close();
    }

    render() {
        return (
            <View style={styles.container}r>
                <ViewPagerAndroid
                    initialPage={this.state.selectedPageView}
                    style={styles.pager}
                    onPageSelected = {this._onPageSelected}
                    ref={ viewPager => this.viewPager = viewPager }>
                    <View style={styles.pageview}>
                        <Home/>
                    </View>
                    <View style={styles.pageview}>
                        <Summary />
                    </View>
                {/*
                    <View style={styles.pageview}>
                        <Text>third page</Text>
                    </View>
                */}
                </ViewPagerAndroid>
                <MenuBar index={this.state.selectedPageView}
                    setPage={this._setPage}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D4E7E7',
    },
    pager: {
        flex: 1
    },
    pageview: {
        padding: 15
    }
});

export default App

