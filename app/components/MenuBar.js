import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Alert,
    TouchableHighlight
} from 'react-native';

const pages = [ 'Entries', 'Summary']//, 'Settings' ]
class MenuBar extends Component {

    render() {

        return (
            <View style={styles.container}>
            {
                pages.map( (page, i) => {
                    const style = i === this.props.index ? {fontSize:24, color:'white'} : {fontSize: 18, color:'white'};
                    return (
                        <TouchableHighlight key={i} 
                            onPress={()=>this.props.setPage(i)}
                            underlayColor="#1D2D44">
                            <Text style={style}>{page}</Text>
                        </TouchableHighlight>
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
        backgroundColor: '#1D2D44'
    }

})


export default MenuBar