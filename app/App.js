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


class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedPageView: 0
        };

        this._onPageScroll = this._onPageScroll.bind(this);
    }

    _onPageScroll(event) {
        const { position, offset } = event.nativeEvent;
        // Position indicates left pageview.
        // If offset greater than half, more of the right pageview is visible.
        const index = offset > 0.5 ? position + 1 : position;
        this.setState({selectedPageView: index})
    }

    render() {
        return (
            <View style={styles.container}r>
                <ViewPagerAndroid
                    initialPage={this.state.selectedPageView}
                    style={styles.pager}
                    onPageScroll = {this._onPageScroll}>
                    <View style={styles.pageview}>
                        <Home/>
                    </View>
                    <View style={styles.pageview}>
                        <Text>Second page</Text>
                    </View>
                    <View style={styles.pageview}>
                        <Text>third page</Text>
                    </View>
                </ViewPagerAndroid>
                <MenuBar index={this.state.selectedPageView}/>
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

