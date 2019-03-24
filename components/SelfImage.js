import React from "react";

import FacebookImageSource from './screens/FacebookImageSource';


class SelfImage extends React.Component{
  constructor(props){
    super()
  }

  render(){
    return <FacebookImageSource {...this.props} imageType={'profile'} />
  }
}

export default SelfImage
