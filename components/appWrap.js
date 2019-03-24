import React from 'react';
import { connect } from 'react-redux';

import App from './app'


class AppWrap extends React.Component{

  state = {};
  componentDidMount(){
    if(this.props.navigation && this.props.navigation.navigators){
      this.setState({ready:true})

    }
  }
  componentWillReceiveProps(nProps){

    if(nProps.navigation && nProps.navigation.navigators && (!this.props.navigation || !this.props.navigation.navigators)){
      this.setState({ready:true})
    }
  }
  render(){
    return this.state.ready ? <App/> : null
  }
}
const mapStateToProps = ({user, ui, navigation}, ownProps) => {
  return {...ownProps,  navigation }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppWrap);
