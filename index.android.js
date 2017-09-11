/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button, 
  ScrollView
} from 'react-native';
import { MenuContext } from 'react-native-popup-menu';
import Home from './app/views/Home';


export default class EmojiJournal extends Component {


  render() {
    return (
      <MenuContext>
        <Home/>
      </MenuContext>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4E7E7'
  },
  journal_entries: {
    alignSelf: 'stretch',
    marginTop: 10
  }
});

AppRegistry.registerComponent('EmojiJournal', () => EmojiJournal);
