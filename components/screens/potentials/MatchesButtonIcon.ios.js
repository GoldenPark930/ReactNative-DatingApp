import {
  View,
  ActivityIndicator,
  Dimensions,
  AppState,
  NativeModules,
  TouchableOpacity,
  Image
} from 'react-native';
import React from 'react';
import colors from '../../../utils/colors';
import styles from './styles';
import { connect } from 'react-redux';
import { withNavigation } from '@exponent/ex-navigation';
import Btn from '../../Btn';

@withNavigation
class MatchesButton extends React.Component{
  render(){
    return (
      <View style={{overflow: 'hidden'}}>
        <Btn
          color={colors.outerSpace}
          round
          style={{
            paddingTop: 10,
            paddingLeft: 25,
            paddingBottom: 3,
            top: 3,
            position: 'relative'
          }}
          onPress={() => {
            this.props.navigator.push(this.props.navigation.router.getRoute('Matches'));
            this.props.dispatch({type: 'CLEAR_NEW_MATCH_NOTIFICATIONS'})
          }}
        >
          <Image
            resizeMode={Image.resizeMode.contain}
            tintColor={colors.white}
            style={{width: 32,
              top: 0,
              height: 40,
              marginRight: 15,
              tintColor: colors.white
            }}
            source={require('./assets/chat@3x.png')}
          />
          {this.props.unread.total && parseInt(this.props.unread.total) > 0 || this.props.unread.realTotal && parseInt(this.props.unread.realTotal) > 0 ?
            <View
              style={{borderWidth: 2,
                borderColor: colors.outerSpace,
                width: 10,
                height: 10,
                borderRadius: 10,
                backgroundColor: colors.mediumPurple,
                position: 'absolute',
                top: 12,
                right: 12
              }}
            /> : null}
        </Btn>
      </View>
    )
  }
}


const mapStateToProps = ({notifications, unread}, ownProps) => ({ ...ownProps, notifications, unread })

const mapDispatchToProps = (dispatch) => ({ dispatch })

export default connect(mapStateToProps, mapDispatchToProps)(MatchesButton);
