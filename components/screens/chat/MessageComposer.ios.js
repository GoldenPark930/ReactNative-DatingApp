
import React, {Component} from "react";

import {StyleSheet, Text, PixelRatio, View, Image, TextInput, TouchableHighlight, TouchableOpacity, Animated, Dimensions} from "react-native";

const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;
import {MagicNumbers} from '../../../utils/DeviceConfig'
import emojiCheck from '../../../utils/emoji-regex';
import colors from '../../../utils/colors'
import { BlurView, VibrancyView } from 'react-native-blur'
import Analytics from '../../../utils/Analytics';
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);
import {pure} from 'recompose'


const shouldMakeBigger = (msg) => {
    if(msg.length > 9)return false;
    return emojiCheck().test(msg)
}


@pure
class MessageComposer extends React.Component{

    static defaultProps = {
        textInputValue: ''
    };

    constructor(props){
        super()
        this.state = {
            txt:'',
            inputFocused: false,
            height:36,
            bottomColor: new Animated.Value(0)

        }
    }

    sendMessage(){
        if(this.state.txt == ''){ return false }

        this.props.sendMessage(this.state.txt)
        this._textInput.setNativeProps({text: '',style:{height:40}});
        this.setState({height:40,txt:''})

    }

    render(){
        const giant = shouldMakeBigger(this.state.txt);
        return (

      <View style={styles.messageComposer}>

        <AnimatedTextInput
            multiline={true}
            autoGrow={true}
            ref={component => this._textInput = component}
            style={[styles.messageComposerInput,{
                borderBottomColor: this.state.bottomColor ? this.state.bottomColor.interpolate({
                    inputRange: [0, 100],
                    outputRange: [colors.shuttleGrayAnimate,colors.whiteAnimate],
                }) : colors.shuttleGray,
                height:  giant ? this.state.height + 10: this.state.height,
                paddingBottom:  giant ? 5 : 0, overflow:'visible',
                fontFamily:'omnes'
            }]}
            keyboardAppearance={'dark'}
            autoCorrect={true}
            placeholder={'Type Message...'}
            placeholderTextColor={colors.shuttleGray}
            autoFocus={true}
            selectionColor={colors.mediumPurple}
            clearButtonMode={'never'}
            returnKeyType={'send'}
            enablesReturnKeyAutomatically
            onSubmitEditing={this.sendMessage.bind(this)}
            blurOnSubmit={true}
            onFocus={(e)=>{
                Animated.timing(this.state.bottomColor, {
                    toValue: 100,
                    duration: 200
                }).start((r => {
                    this.setState({inputFocused:true})
                }))
            }}
            onBlur={(e)=>{
                Animated.timing(this.state.bottomColor, {
                    toValue: 0,
                    duration: 200,
                }).start((r => {
                    this.setState({inputFocused:false})
                }))

            }}
            onChange={(event)=>{
                const eh = parseInt(event.nativeEvent.contentSize.height)

                // console.log('onchange',event.nativeEvent.contentSize.height)

                this.setState({
                    txt: event.nativeEvent.text,
                    height: giant ? 52 : Math.max(40,eh)
                });


            }}
            onContentSizeChange={(event)=>{
              // console.log('oncontentsizechange',event.nativeEvent)
                const eh = Math.max(40,parseInt(event.nativeEvent.contentSize.height))
                this.setState({
                    height:eh,
                });

            }}
        >
            <Text style={{ overflow:'visible',fontSize: giant ? 36 : 18, marginBottom:giant ? 0 : 0,alignSelf:'center', height: giant ? this.state.height : this.state.height, flex:1,color:colors.white, }} >{
                this.state.txt
            }</Text>
        </AnimatedTextInput>
        <TouchableOpacity
            style={[styles.sendButton,{backgroundColor:colors.dark}]}
            onPress={this.sendMessage.bind(this)}
        >
          <Text style={[styles.sendButtonText,{
              backgroundColor:'transparent',
              color: this.state.txt.length ? colors.white : colors.white20,
              fontFamily:'montserrat',
              textAlign:'center'
          }]}>SEND</Text>
        </TouchableOpacity>
      </View>


    )
    }
}


export default MessageComposer


const styles = StyleSheet.create({


    inputField: {
        height: 50,
        backgroundColor:colors.dark,
        margin:0,
        fontSize:14,

        bottom:0
    },
    sendButton:
    {
        margin: 0,
        padding: 5,
        marginLeft: 5,
        borderRadius: 5,
    // paddingVertical: 0,
        marginBottom:5,
    // backgroundColor: colors.dark,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    sendButtonText:{
        textAlign:'center',
        fontFamily:'omnes',
        fontSize:18,
        color:colors.white
    },
    messageComposer: {
        flexDirection:'row',
        backgroundColor:colors.dark,
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'flex-end',
        width:DeviceWidth,
        margin:0,
        minHeight:55,
        bottom:0,
        paddingLeft:20,
        paddingVertical:10,
        paddingRight:10,
        bottom:0,
        position:'relative',
        borderTopWidth: 1 / PixelRatio.get() ,
        borderTopColor:'#000'
    },
    messageComposerInput:{
        flex:1,
        paddingHorizontal:0,
        paddingTop:0,
        marginBottom:10,
        lineHeight:0,
        paddingBottom:0,
        alignSelf:'center',
        fontSize:16,
        color:colors.white,
        borderBottomColor:colors.white,
        borderBottomWidth:1,
        overflow:'hidden',
    },

});
