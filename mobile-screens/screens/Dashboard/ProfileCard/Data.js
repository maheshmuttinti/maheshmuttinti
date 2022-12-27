/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import {View, findNodeHandle, Dimensions, Platform} from 'react-native';
import {
  BaseHeading,
  GrayBodyText,
  // SmallOutlinedButton,
  Card,
  LabelValue,
  SmallOutlinedButton,
} from 'uin';
import {useTheme} from 'theme';
// import {BlurGraph} from 'assets';
import {BlurView} from '@react-native-community/blur';
import Carousel from 'react-native-snap-carousel-v4';
import {formatDate} from 'utils';
import {BlurGraph} from 'assets';

export default function ({ref, ...props}) {
  const [viewRef, setViewRef] = useState(null);
  const graphViewRef = useRef(null);
  const theme = useTheme();
  const carouselRef = useRef(null);
  const {width} = Dimensions.get('window');
  const [active, setActive] = useState(0);

  const onViewLoaded = () => {
    setViewRef(findNodeHandle(graphViewRef.current));
  };
  return (
    <View
      {...props}
      ref={ref}
      style={{
        position: 'relative',
      }}>
      {props?.response?.data?.length > 0 ? (
        <Carousel
          layout="default"
          ref={carouselRef}
          data={props?.response?.data}
          enableSnap
          sliderWidth={width}
          itemWidth={width * 0.82}
          renderItem={({item, index}) => (
            <Card
              style={{
                paddingTop: 16,
                paddingBottom: 20,
                width: index === 0 ? width * 0.85 : width * 0.8,
                marginLeft: index === 0 ? -20 : 0,
              }}
              key={`profile-${index}`}>
              <View
                style={{
                  paddingHorizontal: 16,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <BaseHeading
                    style={{
                      color: theme.colors.text,
                      fontSize: theme.fontSizes.medium.fontSize,
                      lineHeight: 15.4,
                      fontWeight: theme.fontWeights.veryBold,
                      flex: 1 / 2,
                    }}>
                    {`${item?.name}`}
                  </BaseHeading>
                  <GrayBodyText
                    style={{
                      flex: 1 / 2,
                      fontSize: theme.fontSizes.xsmall.fontSize,
                      lineHeight: 26,
                      textAlign: 'right',
                      fontFamily: theme.fonts.italic,
                    }}>
                    Last updated:{' '}
                    {`${formatDate(
                      new Date(item?.updated_at),
                      'dMy',
                      Platform.OS,
                    )}`}
                  </GrayBodyText>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <LabelValue
                    style={{paddingTop: 8, flex: 1 / 2}}
                    titleStyle={{
                      fontSize: 12,
                      lineHeight: 26,
                      textAlign: 'left',
                    }}
                    valueStyle={{
                      fontSize: 14,
                      lineHeight: 24,
                      fontWeight: theme.fontWeights.veryBold,
                      textAlign: 'left',
                    }}
                    title="Current Portfolio Value"
                    value={`₹${item?.data?.data[0]?.CurrentValue}`}
                  />
                  <LabelValue
                    style={{paddingTop: 8, flex: 1 / 2}}
                    titleStyle={{
                      fontSize: 12,
                      lineHeight: 26,
                      textAlign: 'right',
                    }}
                    valueStyle={{
                      fontSize: 14,
                      lineHeight: 24,
                      fontWeight: theme.fontWeights.veryBold,
                      textAlign: 'right',
                    }}
                    title="Total Gains"
                    value={`₹${item?.data?.data[0]?.new_net_gain_or_loss}`}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <LabelValue
                    style={{paddingTop: 8, flex: 1 / 2}}
                    titleStyle={{
                      fontSize: 12,
                      lineHeight: 26,
                      textAlign: 'left',
                    }}
                    valueStyle={{
                      fontSize: 14,
                      lineHeight: 24,
                      fontWeight: theme.fontWeights.veryBold,
                      textAlign: 'left',
                    }}
                    title="Total amount invested"
                    value={`₹${item?.data?.data[0]?.Net_Investments_new}`}
                  />
                  <LabelValue style={{paddingTop: 8, flex: 1 / 2}} />
                </View>
              </View>
              {/* <View
                    style={{
                      paddingTop: 11,
                      alignItems: 'center',
                    }}
                    ref={containerRef => {
                      graphViewRef.current = containerRef;
                    }}
                    onLayout={onViewLoaded}>
                    <BlurView
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 2,
                      }}
                      blurType="light"
                      blurAmount={1}
                      reducedTransparencyFallbackColor="white"
                    />
                    <BlurGraph />
                  </View> */}

              {/* <View
                style={{
                  paddingHorizontal: 16,
                  marginTop: 21,
                  width: 232,
                  alignSelf: 'center',
                }}>
                <SmallOutlinedButton
                  outlineColor={theme.colors.primaryOrange}
                  textColor={theme.colors.primaryOrange}
                  onPress={async () => {}}
                  extraStyles={{paddingVertical: 4}}>
                  View Detailed Report
                </SmallOutlinedButton>
              </View> */}
            </Card>
          )}
          onSnapToItem={i => {
            props?.response?.data?.map(async (item, index) => {
              if (i === index) {
                setActive(index);
              }
            });
          }}
          firstItem={active}
          inactiveSlideScale={1.2}
          inactiveSlideOpacity={1}
          scrollEnabled={true}
        />
      ) : (
        <>
          <Card
            style={{
              paddingTop: 16,
              paddingBottom: 20,
              // width: width * 0.85,
              // marginLeft: -20,
            }}>
            <View
              style={{
                paddingHorizontal: 16,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <BaseHeading
                  style={{
                    color: theme.colors.text,
                    fontSize: theme.fontSizes.medium.fontSize,
                    lineHeight: 15.4,
                    fontWeight: theme.fontWeights.veryBold,
                    flex: 1 / 2,
                  }}>
                  {`MAHESH MUTTINTI`}
                </BaseHeading>
                <GrayBodyText
                  style={{
                    flex: 1 / 2,
                    fontSize: theme.fontSizes.xsmall.fontSize,
                    lineHeight: 26,
                    textAlign: 'right',
                    fontFamily: theme.fonts.italic,
                  }}>
                  Last updated:{' '}
                  {`${formatDate(new Date(), 'dMy', Platform.OS)}`}
                </GrayBodyText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <LabelValue
                  style={{paddingTop: 8, flex: 1 / 2}}
                  titleStyle={{
                    fontSize: 12,
                    lineHeight: 26,
                    textAlign: 'left',
                  }}
                  valueStyle={{
                    fontSize: 14,
                    lineHeight: 24,
                    fontWeight: theme.fontWeights.veryBold,
                    textAlign: 'left',
                  }}
                  title="Current Portfolio Value"
                  value={`10001`}
                />
                <LabelValue
                  style={{paddingTop: 8, flex: 1 / 2}}
                  titleStyle={{
                    fontSize: 12,
                    lineHeight: 26,
                    textAlign: 'right',
                  }}
                  valueStyle={{
                    fontSize: 14,
                    lineHeight: 24,
                    fontWeight: theme.fontWeights.veryBold,
                    textAlign: 'right',
                  }}
                  title="Total Gains"
                  value={`₹1300`}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <LabelValue
                  style={{paddingTop: 8, flex: 1 / 2}}
                  titleStyle={{
                    fontSize: 12,
                    lineHeight: 26,
                    textAlign: 'left',
                  }}
                  valueStyle={{
                    fontSize: 14,
                    lineHeight: 24,
                    fontWeight: theme.fontWeights.veryBold,
                    textAlign: 'left',
                  }}
                  title="Total amount invested"
                  value={`₹10000`}
                />
                <LabelValue style={{paddingTop: 8, flex: 1 / 2}} />
              </View>
            </View>
            <View
              style={{
                paddingTop: 11,
                alignItems: 'center',
              }}
              ref={containerRef => {
                graphViewRef.current = containerRef;
              }}
              onLayout={onViewLoaded}>
              <BlurView
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 2,
                }}
                blurType="light"
                blurAmount={1}
                reducedTransparencyFallbackColor="white"
              />
              <BlurGraph />
            </View>

            <View
              style={{
                paddingHorizontal: 16,
                marginTop: 21,
                width: 232,
                alignSelf: 'center',
              }}>
              <SmallOutlinedButton
                outlineColor={theme.colors.primaryOrange}
                textColor={theme.colors.primaryOrange}
                onPress={async () => {}}
                extraStyles={{paddingVertical: 4}}>
                View Detailed Report
              </SmallOutlinedButton>
            </View>
          </Card>
        </>
      )}
    </View>
  );
}
