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


class CustomModal extends Component {

	render() {
		return (
			<Modal
				animationType="fade"
				transparent={true}
				visible={this.props.modalVisible}
				onRequestClose={this.props.onRequestClose}>

				<View style={styles.backdrop}>
		     		<View style={styles.modal}>

			     		{ this.props.content }
	     			</View>
		    	</View>
		    </Modal>
		)
	}

}

export default CustomModal

const styles = StyleSheet.create({
	backdrop: {
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		flex: 1,
	    justifyContent: 'center',
	},
	modal: {
		width: '80%',
		backgroundColor: 'white',
	    alignSelf: 'center',
	    padding: 20
	}

})