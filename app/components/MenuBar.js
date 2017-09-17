import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Alert,
    Modal
} from 'react-native';

const pages = [ 'Entries', 'Summary', 'Settings' ]
class MenuBar extends Component {

    render() {

        return (
            <View style={styles.container}>
            {
                pages.map( (page, i) => {
                    const style = i === this.props.index ? {fontSize:24} : {fontSize: 18};
                    return (
                        <Text key={i} style={ style }>{page}</Text>
                    )
                })
            }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        
        justifyContent:'space-around',
        alignItems: 'center',
        backgroundColor: 'white'
    }

})


export default MenuBar