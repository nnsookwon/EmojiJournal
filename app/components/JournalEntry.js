import React, { Component } from 'react';

import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    Alert,
    TouchableHighlight,
    Modal
} from 'react-native';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
    renderers
} from 'react-native-popup-menu';
import Moment from 'moment';
import IconFa from 'react-native-vector-icons/FontAwesome';
import IconEntypo from 'react-native-vector-icons/Entypo';
import CustomModal from './CustomModal';

class JournalEntry extends Component{
    constructor(props) {
        super(props);

        this.state = { 
            modalVisible: false,
            emoji: this.props.emoji,
            description: this.props.description
        };

        this.updateEntry = this.updateEntry.bind(this);
        this.showEditEntryModal = this.showEditEntryModal.bind(this);
        this.renderMenuOptions = this.renderMenuOptions.bind(this);
        this.renderEditEntryModal = this.renderEditEntryModal.bind(this);
    }

    componentWillReceiveProps(newProps) {
        // If props are updated, reset default input values
        this.setState({
            emoji: newProps.emoji,
            description: newProps.description
        });
    }

    updateEntry() {
        this.props.updateEntry(this.props.entry_id,
            this.props.timestamp,
            this.state.emoji,
            this.state.description)
            .then(() => this.setState({modalVisible: false}))
    }

    showEditEntryModal() {
        this.setState({modalVisible: true})
    }

    renderMenuOptions() {
        const triggerComponent = (
            <View style={styles.menu_trigger}>
                <IconEntypo name="dots-three-vertical" 
                    size={16} color="white"/>
            </View>
        )

        return (
            <Menu>
                <MenuTrigger>
                    { triggerComponent }
                </MenuTrigger>

                <MenuOptions>

                    <MenuOption onSelect={this.showEditEntryModal}>
                        <View style={styles.icon_text}>
                            <IconFa name="pencil" size={24} />
                            <Text style={{fontSize:20}}>  Edit</Text>
                        </View>
                    </MenuOption>

                    <MenuOption onSelect={this.props.removeEntryById} >
                            <View style={styles.icon_text}>
                        <IconFa name="trash-o" size={24} />
                        <Text style={{fontSize:20}}>  Delete</Text>
                      </View>
                    </MenuOption>

                </MenuOptions>
            </Menu>
        )
    }

    renderEditEntryModal() {
        return (
            <View>
                <TextInput onChangeText={(emoji) => this.setState({emoji: encodeURI(emoji, "utf-8")})}
                    value={decodeURI(this.state.emoji, "utf-8")}
                    placeholder="emoji"
                    maxLength={2}
                    style={{fontSize:18}}>
                </TextInput>
                <TextInput onChangeText={(description) => this.setState({description})}
                    value={this.state.description}
                    placeholder="add notes"
                    autoCapitalize="sentences"
                    multiline={true}
                    numberOfLines={2}
                    style={{fontSize:18}}>
                </TextInput>
                <Button
                    onPress={this.updateEntry}
                    title="Done"
                    color="#841584"
                    disabled={this.state.emoji===""}/>
            </View>
        )
    }


    render() {

        Moment.locale('en');
        const dateString = Moment(this.props.timestamp).format("ddd MMM D, YYYY");
        const timeString = Moment(this.props.timestamp).format("h:mm a");
        const menuOptions = this.renderMenuOptions();
        const modalContent = this.renderEditEntryModal();

        return (
            <View style={styles.container}>

                <View style={styles.header}>
                    <Text style={styles.header_text}>
                        { dateString }
                    </Text>
                    
                    { menuOptions }
                    
                </View>
                <TouchableHighlight onLongPress={this.showEditEntryModal}>
                    <View style={styles.content}>
                        <Text style={styles.emoji}>
                            { decodeURI(this.props.emoji, "utf-8") }
                        </Text>
                        <View style={styles.info}>
                            <Text style={styles.timestamp}>
                                { timeString } 
                            </Text>
                            <Text style={styles.description}
                                numberOfLines={4}>
                                { this.props.description } 
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>

                {/* Display modal to edit entry information */}
                <CustomModal modalVisible={this.state.modalVisible}
                    onRequestClose={()=>this.setState({modalVisible:false, emoji: this.props.emoji, description: this.props.description})}
                    content={modalContent}/>

            
            </View>
        )
    }
}

export default JournalEntry


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginVertical: 12,
        borderWidth: 1
    },
    header: {
        flexDirection: 'row',
        paddingLeft: 15,
        paddingVertical: 3,
        backgroundColor: '#58355E',
        alignItems: 'center',
        justifyContent:'space-between'
    },
    header_text: {
        fontSize: 20,
        color: 'white',
    },
    menu_trigger: {
        width: 40,
        alignItems: 'center', 
    },
    icon_text: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    content: {
        flexDirection:'row',
        alignItems:'center',
        backgroundColor: "#EDF0DA",
        padding: 10
    },
    emoji: {
        flex: 1,
        textAlign:'center',
        fontSize: 50,
        color: 'black'
    },
    info: {
        flex: 3,
        paddingLeft: 10
    },
    timestamp: {
        fontSize: 20
    },
    description: {
        fontSize: 20,
        fontStyle: 'italic'
    }
});