/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import { AppRegistry } from 'react-native';
import { MenuContext } from 'react-native-popup-menu';
import App from './app/App';


export default class EmojiJournal extends Component {


    render() {
        return (
            <MenuContext>
                <App />
            </MenuContext>
        )
    }
}


AppRegistry.registerComponent('EmojiJournal', () => EmojiJournal);
