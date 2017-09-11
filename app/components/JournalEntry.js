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
} from 'react-native-popup-menu';
import IconFa from 'react-native-vector-icons/FontAwesome';
import IconEntypo from 'react-native-vector-icons/Entypo';
import CustomModal from './CustomModal';

class JournalEntry extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = { };

	  this.renderMenuOptions = this.renderMenuOptions.bind(this);
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
		        <MenuOption onSelect={() => alert('Edit')}>
		        	<View style={styles.icon_text}>
						<IconFa name="pencil" size={24} />
						<Text style={{fontSize:20}}>  Edit</Text>
					</View>
				</MenuOption>
		        <MenuOption onSelect={() => alert('Delete')} >
		          <View style={styles.icon_text}>
					<IconFa name="trash-o" size={24} />
					<Text style={{fontSize:20}}>  Delete</Text>
				  </View>
		        </MenuOption>
		      </MenuOptions>
		    </Menu>
		)
	}

	render() {
		const datetime = new Date(this.props.timestamp);
		const menuOptions = this.renderMenuOptions();

		return (
			<View style={styles.container}>

				<View style={styles.header}>
					<Text style={styles.header_text}>
						{ datetime.toDateString() }
					</Text>

					
					{ menuOptions }
					
				</View>
				<TouchableHighlight onLongPress={()=>this.setState({modalVisible:true})}>
					<View style={styles.content}>
			            <Text style={styles.emoji}>
		              		{ decodeURI(this.props.emoji, "utf-8") }
			            </Text>
			            <View style={styles.info}>
				            <Text style={styles.timestamp}>
			             		{ datetime.toLocaleTimeString() } 
			         		</Text>
				            <Text style={styles.description}
				            	numberOfLines={4}>
			             		{ this.props.description } 
			         		</Text>
		         		</View>
	         		</View>
         		</TouchableHighlight>

         		
          	</View>
		)
	}
}

export default JournalEntry


const styles = StyleSheet.create({
	container: {
		flex: 1,
        marginVertical: 12,
    	borderWidth:1
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
		width: 30,
		alignSelf: 'flex-end',
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
		fontSize: 50
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