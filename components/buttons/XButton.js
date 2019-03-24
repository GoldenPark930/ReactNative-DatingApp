
import React from "react";
import {Component} from "react";
import {StyleSheet, Text, View, TouchableOpacity, Image} from "react-native";

const styles = StyleSheet.create({
    navBarLeftButton:{
        position:'absolute',
        top:50,
        width:50,
        zIndex:9999,
        height:50,
        backgroundColor:'transparent',
        left:10
    }
})

export default class XButton extends Component{

    onPress(){
        this.props.onTap && this.props.onTap() || this.props.navigator && this.props.navigator.pop()
    }
    render(){
        return (


            <TouchableOpacity
                onPress={this.onPress.bind(this)}
                style={[{padding:20,width:55,height:55,position:'absolute',
                 top:this.props.top || (!this.props.topZero && 12 ) || 0,
                zIndex:99999},this.props.style]}
            >
                <Image
                    resizeMode={Image.resizeMode.contain}
                    style={{width:15,height:15,marginTop:0,alignItems:'flex-start'}}
                    source={require('../screens/potentials/assets/close@3x.png')}
                />
            </TouchableOpacity>

        )
    }
}
