/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Text,
  StatusBar,
} from 'react-native';
import {StyleSheet, Dimensions} from 'react-native';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

const styleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
    width: '100%',
    // backgroundColor: 'gray',
  },
  footer: {
    position: 'absolute',
    height: '7%',
    width: ScreenWidth,
    left: 0,
    bottom: 0,
  },
  pageControl: {
    // flex: 3,
    // height: '100%',
    // backgroundColor: 'green',
    alignItems: 'center',
    // marginBottom: ScreenWidth * 0.15,
    // alignSelf: 'flex-start',
  },
  skipSlideShow: {
    width: '100%',
    height: 30,
  },
  initAgreeButton: {
    width: ScreenWidth * 0.3,
    // height: ScreenWidth * 0.13,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    // alignItems: 'center',
    fontSize: 13,
    borderRadius: ScreenHeight * 0.5,
    marginRight: ScreenWidth * 0.03,
  },
  initAgreeBtnText: {
    fontSize: 15,
    color: '#FFF',
    textAlign: 'right',
  },

  // --- SlideShow Item - CSS ---
  bannerView: {
    flex: 1,
  },
  banner: {
    height: ScreenHeight,
    width: ScreenWidth,
  },
  // --- PageControl Item - CSS ---
  dotListView: {
    flex: 1,
    justifyContent: 'center',
  },
  dotView: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginHorizontal: 3,
  },
});

let timeInterval;
var animaInterval = null;

export default class AppIntro extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 0,
      isFromPageControl: true,
    };
    if (this.props.extraData.defaultTint === undefined) {
      this.props.extraData.defaultTint = 'gray';
    }
    if (this.props.extraData.selectedTint === undefined) {
      this.props.extraData.selectedTint = 'lightgray';
    }
    if (this.props.extraData.buttonStyle === undefined) {
      this.props.extraData.buttonStyle = {
        fontSize: 15,
        color: '#000000',
        textAlign: 'right',
      };
    }
    if (this.props.extraData.isAutoScroll === true) {
      if (this.props.extraData.timeDuration === undefined) {
        timeInterval = 3000;
      } else if (this.props.extraData.timeDuration <= 2000) {
        timeInterval = 3000;
      } else {
        timeInterval = this.props.extraData.timeDuration;
      }
      this.setIntervalToScroll();
    } else {
      clearInterval(animaInterval);
    }
  }

  setIntervalToScroll() {
    // To set time interval for jump to next page

    animaInterval = setInterval(
      function () {
        if (this.props.extraData.isAutoScroll === true) {
          const {pageIndex} = this.state;
          let nextIndex = 0;

          if (pageIndex < this.props.extraData.DATA.length - 1) {
            nextIndex = pageIndex + 1;
          }

          this.setState({pageIndex: nextIndex}, () => {
            if (nextIndex === this.props.extraData.DATA.length - 1) {
              this.scrollToIndex(nextIndex, nextIndex === 0 ? false : true);
              clearInterval(animaInterval);
            } else {
              this.scrollToIndex(nextIndex, nextIndex === 0 ? false : true);
            }
          });
        } else {
          clearInterval(animaInterval);
        }
      }.bind(this),
      timeInterval,
    );
  }

  /**
   * Method for verifying list refrence exists or not
   * Apply animation when move to next page or index with timeout
   *
   * @param {*} index
   * @param {*} animated
   */

  scrollToIndex = (index, animated) => {
    this.ref_flatList && this.ref_flatList.scrollToIndex({index, animated});
    this.flatList_Ref && this.flatList_Ref.scrollToIndex({index, animated});
  };

  onScrollEnd(e) {
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    const pageNum = Math.round(contentOffset.x / viewSize.width);
    if (this.state.isFromPageControl) {
      this.setState({pageIndex: pageNum});
    }
    setTimeout(() => {
      this.flatList_Ref.scrollToIndex({animated: true, index: pageNum});
    }, 0.5);
  }

  renderBanner = banner => (
    <View style={styleSheet.bannerView}>
      {this.props.extraData.sourceType === 'SVG' ? (
        <View style={{width: ScreenWidth, alignItems: 'center'}}>
          {banner.bannerImage}
          {banner.text}
        </View>
      ) : (
        <ImageBackground
          style={styleSheet.banner}
          source={
            this.props.extraData.sourceType === 'LOCAL'
              ? banner.bannerImage
              : {uri: banner}
          }
          resizeMode="cover"
        />
      )}
    </View>
  );

  renderPageControl = index => {
    return (
      <View style={[styleSheet.dotContainer, this.props.dotsContainerStyle]}>
        <View
          style={[
            styleSheet.dotView,
            {
              backgroundColor:
                this.state.pageIndex === index
                  ? this.props.extraData.selectedTint
                  : this.props.extraData.defaultTint,
              width: this.state.pageIndex === index ? 17 : 5,
              height: 5,
            },
          ]}
        />
      </View>
    );
  };

  closeHelp() {
    if (this.props.onSkipTapped) {
      this.props.onSkipTapped(this.state.index);
    }
    clearInterval(animaInterval);
    this.props.navigation.navigate('Auth', {screen: 'SignupWithEmailAndPhoneNumber'});
  }

  scrollNext() {
    if (this.state.pageIndex < this.props.extraData.DATA.length - 1) {
      this.setState(
        {isFromPageControl: false, pageIndex: this.state.pageIndex + 1},
        () => {
          this.ref_flatList.scrollToIndex({
            animated: true,
            index: this.state.pageIndex,
          });
        },
      );
    }
  }

  scrollPrev() {
    if (this.state.pageIndex > 0) {
      this.setState(
        {isFromPageControl: false, pageIndex: this.state.pageIndex - 1},
        () => {
          this.ref_flatList.scrollToIndex({
            animated: true,
            index: this.state.pageIndex,
          });
        },
      );
    }
  }

  render() {
    return (
      <View style={styleSheet.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <FlatList // first
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          legacyImplementation={false}
          style={styleSheet.flatList}
          data={this.props.extraData.DATA}
          renderItem={({item, index}) => this.renderBanner(item, index)}
          keyExtractor={(_, index) => {
            return `item-${index}`;
          }}
          onMomentumScrollEnd={e => this.onScrollEnd(e)}
          onScrollBeginDrag={() => this.setState({isFromPageControl: true})}
          ref={refe => {
            this.ref_flatList = refe;
          }}
        />
        {/* <View style={[styleSheet.footer, this.props.footerStyle]}> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={[styleSheet.pageControl, this.props.pageControlStyle]}>
            <FlatList // second
              scrollEnabled={false}
              horizontal
              bounces={false}
              showsHorizontalScrollIndicator={false}
              style={styleSheet.flatList}
              data={this.props.extraData.DATA}
              renderItem={({index}) => this.renderPageControl(index)}
              keyExtractor={banner => banner.id}
              ref={ref => {
                this.flatList_Ref = ref;
              }}
            />
          </View>

          <View
            style={[styleSheet.skipSlideShow, this.props.skipSlideShowStyle]}>
            <TouchableOpacity onPress={() => this.closeHelp()}>
              <View style={styleSheet.initAgreeButton}>
                {this.props.footerButton ? (
                  this.props.footerButton
                ) : (
                  <Text style={this.props.extraData.buttonStyle}>
                    {this.state.pageIndex ===
                    this.props.extraData.DATA.length - 1
                      ? 'Continue'
                      : 'Skip'}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

AppIntro.defaultProps = {
  extraData: {
    defaultTint: 'white',
    selectedTint: 'white',
  },
};
