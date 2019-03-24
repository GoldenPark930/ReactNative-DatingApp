/**
 * @flow
 */

import React from "react";

import {Text, TextInput, View, TouchableHighlight, StyleSheet} from "react-native";

const styles = StyleSheet.create({
    well: {
        height: 60,
        bottom:0,
        padding:10,
        backgroundColor:'#ddd',
        flexDirection: 'row',
        alignItems:'stretch'

    },
    default: {
        height: 40,
        borderWidth: 0.5,
        borderColor: '#0f0f0f',
        fontSize: 13,
        padding: 4,
        bottom:0,
        backgroundColor:'#fff'

    },
    sendButton: {
        borderRadius: 3,
        backgroundColor: '#aaa'
    }
});

class ChatInput extends Component{

    constructor(props){
        super(props);
        this.state = {
            curText: null,
            prevText: null
        }

    }
    _pressSend(){
    }

    render(){
        return (
          <View style={styles.well}>
            <TextInput
                placeholder="Say something"
                returnKeyType={"send"}
                enablesReturnKeyAutomatically={true}
                autoCorrect={false}
                clearButtonMode="never"
                multiline={false}
                onChange={(event) => this.updateText(
            event.nativeEvent.text
          )}
                style={styles.default}
            />
          <TouchableHighlight onPress={() => this._pressSend()}>
            <View style={styles.sendButton}>
              <Text>Send</Text>
            </View>
            </TouchableHighlight>

      </View>
    )
    }


    updateText(text) {
        this.setState({
            curText: text,
            prevText: this.state.curText,
        });
    }

}


export default ChatInput;
