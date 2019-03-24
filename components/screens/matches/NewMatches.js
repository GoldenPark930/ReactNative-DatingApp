import { StyleSheet, Text, Image, TouchableOpacity, View, ListView, Dimensions } from 'react-native';
import React, {Component} from 'react';
import colors from '../../../utils/colors';

const DeviceWidth = Dimensions.get('window').width

const SectionHeader = ({content}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{content.toUpperCase()}</Text>
  </View>
)

class NewMatches extends Component{
  constructor(props){
    super()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(props.newMatches),
    }
  }
  componentWillReceiveProps(nProps){
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
      dataSource: ds.cloneWithRows(nProps.newMatches),
    })
  }
  shouldComponentUpdate(nProps){
    return nProps.newMatches && this.props.newMatches && nProps.newMatches.length != this.props.newMatches.length;
  }

  openChat(rowData, title){
    const payload = {
      title,
      match_id: rowData.match_id,
      matchInfo: rowData
    };
    this.props.navigator.push(this.props.navigator.navigationContext.router.getRoute('Chat', payload));
  }

  renderRow(rowData, sectionID, rowID){
    const userId = this.props.user.id;
    const partnerId = this.props.user.partner_id;
    const theirIds = Object.keys(rowData.users).filter(u => u != userId && u != partnerId);
    const them = theirIds.map(id => rowData.users[id]);
    const threadName = them.map((user) => user.firstname.trim()).join(' & ');
    const matchUser = them[0] || {}
    const img = matchUser.image_url;
    // console.log(rowData.users,img);
    return (
      <View
        key={`newmatch${rowID}${rowData.match_id}`}
        style={styles.listItem}
      >
        <TouchableOpacity
          style={{borderRadius: 45}}
          onPress={this.openChat.bind(this, rowData, threadName)}
        >
          <Image
            source={{uri: img}}
            defaultSource={require('./assets/placeholderUser@3x.png')}
            style={styles.listItemImage}
          />
          {global.__DEBUG__ && <Text>{rowData.match_id}</Text>}
        </TouchableOpacity>
      </View>
    )
  }
  render(){
    return (
      <View style={styles.newMatchesContainer}>

        <SectionHeader
          content={`NEW MATCHES${(global.__DEBUG__ ? ` (${this.props.newMatches.length})` : '')}`}
        />

        <ListView
          contentContainerStyle={styles.contentContainer}
          horizontal
          vertical={false}
          removeClippedSubviews
          initialListSize={4}
          pageSize={4}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow.bind(this)}
        />

        <SectionHeader
          content={`YOUR CHATS${(global.__DEBUG__ ? ` (${this.props.matchesCount})` : '')}`}
        />

      </View>
    )
  }
}


export default NewMatches;

const styles = StyleSheet.create({
  newMatchesContainer: {
    height: 180,
    backgroundColor: colors.outerSpace,
    overflow: 'hidden',
    flexDirection: 'column'
  },
  contentContainer: {
    backgroundColor: colors.outerSpace,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollView: {
    backgroundColor: colors.outerSpace,
    flex: 1,
  },
  listItem: {
    height: 80,
    borderRadius: 40,
    width: 80,
    backgroundColor:colors.dark,
    margin: 7
  },
  listItemImage: {
    height: 80,
    width: 80,
    borderRadius: 40
  },
  sectionHeader: {
    height: 25,
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: colors.dark,
    width: DeviceWidth,
    overflow: 'hidden',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  sectionHeaderText: {
    fontSize: 14,
    color: colors.offwhite,
    fontWeight: '800',
    fontFamily: 'montserrat'
  }
})
