/** @jsx React.DOM */

var React = require('react');

var ImageGuidelines = React.createClass({
  componentDidMount: function(){
	  Analytics.track('L - Image Guidelines');

  },
   render: function() {


		return (
      <View>
        <Text>Trippple Image Guidelines</Text>
        <View>
          <Text>Don’t upload or share photos that aren’t yours.
            <View>
              <Text>Images that you have copied or cViewlected from the Internet that do not belong to you are prohibited.</Text>
            </View>
          </Text>
          <Text>Don’t upload or share photos that show nudity.
            <View><Text>Accounts found uploading or sharing nude content will be terminated. Period.</Text></View>
          </Text>
          <Text>Don’t upload or share photos of illegal content.
            <View><Text>Accounts found sharing prohibited or illegal content, including photographs of extreme violence/gore or child pornography, will be terminted. No exceptions. We will take appropriate action, which may include reporting you to the authorities.</Text></View>
          </Text>
        </View>
			</View>

		);
	}
});


module.exports = ImageGuidelines;
