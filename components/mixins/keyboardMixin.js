 const keyboardMixin = {
   // getDefaultProps(){

   //   return { keyboardSpace: 0, isKeyboardOpened: false };
   // },
   updateKeyboardSpace(frames) {
     this.setState({
       keyboardSpace: frames.endCoordinates ? frames.endCoordinates.height : frames.end.height,
       isKeyboardOpened: true
     });
   },

   resetKeyboardSpace(){
     this.setState({
       keyboardSpace: 0,
       isKeyboardOpened: false
     });
   },

 }
 export default keyboardMixin

