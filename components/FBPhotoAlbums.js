import {
  StyleSheet,
  Image,
  Text,
  View,
  PixelRatio,
  Dimensions,
  ListView,
  Platform,
  TouchableHighlight
} from 'react-native';
import React from 'react';
import FBSDK from 'react-native-fbsdk'
import _ from 'lodash'
import {NavigationStyles} from '@exponent/ex-navigation';
import {connect} from 'react-redux';
import colors from '../utils/colors'
import ActionMan from '../actions/';
import PropTypes from 'prop-types';

const iOS = Platform.OS == 'ios';

const {GraphRequest, GraphRequestManager} = FBSDK
const DeviceHeight = Dimensions.get('window').height;
const DeviceWidth = Dimensions.get('window').width;

class PhotoAlbums extends React.Component {

  static route = {
    styles: iOS ? NavigationStyles.SlideHorizontal : NavigationStyles.FloatVertical,
    navigationBar: {
      backgroundColor: colors.shuttleGrayAnimate,
      visible: true,
      translucent: false,
      titleStyle: {
        color: colors.white,
        fontFamily: 'montserrat',
        borderBottomWidth: 0,
        fontWeight: '800'
      },
      tintColor: colors.white,
      title() {
        return 'YOUR FACEBOOK ALBUMS'
      }
    }
  };

  static propTypes = {
    fbUser: PropTypes.object.isRequired
  };

  constructor(props) {
    super()
    this.aDS = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 != row2
    });
    this.state = {
      albumSource: null,
      view_loaded: 'list_albums',
      albums: []
    };
  }

  componentWillMount() {
    // if(!this.props.fbUser) {
    //   this.props.dispatch(ActionMan.facebookAuth())
    // }else if(!this.props.fbUser.accessToken) {
    //   this.props.dispatch(ActionMan.facebookAuth())
    // }else if(this.props.fbUser.permissions.indexOf('user_photos') < 0) {
    //   this.props.dispatch(ActionMan.addFacebookPermissions())
    // }
  }

  componentDidMount() {
    // setTimeout(() => {
      this.oldFBRequest()

    // },0);
  }

  componentWillReceiveProps(nProps) {
    // console.log(nProps,this.props.fbUser.permissions.indexOf('user_photos'), nProps.fbUser.permissions.indexOf('user_photos'));
    if((!this.props.fbUser.accessToken && nProps.fbUser.accessToken) || (this.props.fbUser.permissions.indexOf('user_photos') < 0 && nProps.fbUser.permissions.indexOf('user_photos') >= 0)) {
      this.oldFBRequest();
    }

  }

  getAlbums() {
    const fbUser = this.props.fbUser;
    const _handleAlbums = this._handleAlbums.bind(this)
    if(!fbUser.accessToken) return;
    const {userID,accessToken} = fbUser
    // console.log(userID,accessToken);

    const infoRequest = new GraphRequest(`${userID}/albums`, {
      parameters: {
        fields: {
          string: 'id,photos{images},name,link,picture{url},count'
        }
      },
      accessToken
    }, this._handleAlbums.bind(this));
    const FBG = new GraphRequestManager();
    FBG.addRequest(infoRequest).start();
  }

  async oldFBRequest(){
    this.props.dispatch(ActionMan.fetchFacebookAlbums(this.props.fbUser))
    // this.getAlbums()
    // // return
    //
    // const {fbUser} = this.props;
    // console.log(fbUser);
    // const fbUrl = `https://graph.facebook.com/v2.8/${fbUser.userID}/albums?access_token=${fbUser.accessToken}&fields=id,photos{images},name,link,picture{url},count`;
    //
    // console.log('FB api > ProfilePhoto',fbUrl);
    //
    // return  fetch(fbUrl).then(res => {
    //   console.log(res);
    //     return res.json()
    // })
    // .then(responseData => {
    //   console.log(responseData);
    //   return this._handleAlbums(responseData);
    // })
  }

  componentWillReceiveProps(nProps){
    if(nProps.albums){
      // this.setState({
      //   albums: nProps.albums,
      //   albumSource: this.aDS.cloneWithRows(nProps.albums),
      //   view_loaded: 'list_albums',
      //   // paging: responseData.paging
      // });
      this._handleAlbums(nProps.albums)
    }
  }
  _handleAlbums(responseData){
    __DEV__ && console.log('_handleAlbums',responseData);
    const albums = _.filter(responseData, al => al.count > 0);
    __DEV__ && console.log(albums);

    this.setState({
      albums: [
        ...this.state.albums,
        ...albums
      ],
      albumSource: this.aDS.cloneWithRows(albums),
      view_loaded: 'list_albums',
      paging: responseData.paging
    });
  }

  openAlbum(album) {
    this.fetchAlbumPhotos(album)
  }

  fetchAlbumPhotos(album) {
    this.props.navigator.push(this.props.navigation.router.getRoute('FBAlbumView', {
      name: 'FB Photos View',
      key: 'fbalbumsz',
      photos: album.photos.data,
      album,
      view_loaded: 'list_album_photos',
      album_details: album,
      albumTitle: album.name
    }))
  }

  renderLoadingView(){
    return (
      <View style={styles.bottomBump} />
    );
  }

  renderAlbumCover(album) {
    return (
      <View
        style={[{
          width: DeviceWidth
        }]}
      >
        <TouchableHighlight
          underlayColor={colors.shuttleGray}
          onPress={() => this.openAlbum(album)}
        >
          <View
            style={[styles.album_list_row, {
              borderBottomWidth: 1 / PixelRatio.get(),
              borderColor: colors.shuttleGray,
              height: 80,
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              paddingRight: 25,
              marginLeft: iOS ? 25 : 0
            }
          ]}
          >
            <Image
              style={styles.album_cover_thumbnail}
              source={{ uri: album.picture.data.url }}
            />
            <View
              style={{
                flexDirection: 'column'
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: 16,
                  fontFamily: 'montserrat',
                  fontWeight: '800'
                }}
              >{album && album.name ? album.name.toUpperCase() : ''}</Text>
              <Text
                style={{
                  color: colors.shuttleGray,
                  fontSize: 14
                }}
              >{`${album.count} photos`}</Text>
            </View>

          </View>

        </TouchableHighlight>

      </View>
    );
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: colors.outerSpace,
          width: DeviceWidth
        }}
      >
        {this.state.albums.length ? (
          <ListView
            style={{
              flexGrow: 1,
              marginTop: 0,
            }}
            dataSource={this.state.albumSource}
            renderRow={this.renderAlbumCover.bind(this)}
            showsVerticalScrollIndicator={false}

          />
          ) :
          this.renderLoadingView()
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({
  photo_list_item: {
    justifyContent: 'center',
    padding: 0,
    flexWrap: 'wrap',
    margin: 6,
    borderRadius: 6,
    width: (DeviceWidth / 3) - 15,
    alignItems: 'center'
  },
  list_album_container: {
    flex: 1,
    backgroundColor: colors.outerSpace,
    marginBottom: 10
  },
  album_list_row: {
    flexDirection: 'row',
    height: 80,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 15,
    margin: 0,
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  album_cover_thumbnail: {
    width: 60,
    height: 60,
    marginRight: 20,
    borderRadius: 6
  },
  pic: {
    flex: 1,
    // flexWrap: 'nowrap',
    width: (DeviceWidth / 3) - 15,
    height: (DeviceWidth / 3) - 15,
    borderRadius: 6
  }
});

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  fbUser: state.fbUser,
  user: state.user,
  albums: Object.values(state.facebookAlbums)
})

const mapDispatchToProps = (dispatch) => ({dispatch});

export default connect(mapStateToProps, mapDispatchToProps)(PhotoAlbums);
