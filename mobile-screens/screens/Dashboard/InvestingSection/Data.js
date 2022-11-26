/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {
  BaseHeading,
  GrayBodyText,
  SmallOutlinedButton,
  Card,
  BlueSubHeading,
  GroupText,
  BlackBodyText,
  Heading,
  LabelValue,
  SubText,
  AuthHeading,
} from 'uin';
import {themes, useTheme} from 'theme';
import {
  BookmarkSelectedIcon,
  CoinIcon,
  GreenArrowUpIcon,
  InvestIcon,
  NBFCIcon,
  ReportOne,
} from 'assets';
import BookmarkIcon from 'assets/icons/bookmarkIcon';

const hardCodedData = [
  {label: '1', value: '1'},
  {label: '2', value: '2'},
  {label: '3', value: '3'},
  {label: '4', value: '4'},
];

export default function ({ref, ...props}) {
  const theme = useTheme();
  const [bookmarkSelected, setBookmarkSelected] = useState(false);
  const [selectedId, setSelectedId] = useState('');

  return (
    <View
      {...props}
      ref={ref}
      style={{
        position: 'relative',
      }}>
      <AuthHeading style={{paddingHorizontal: 16, paddingBottom: 52}}>
        Start Investing
      </AuthHeading>

      <Card style={{paddingHorizontal: 16, zIndex: 0}}>
        <View style={{flexDirection: 'row', top: -32}}>
          {[
            {
              label: 'Mutual Funds',
              value: 'Mutual Funds',
              selected: true,
              icon: <CoinIcon />,
            },
            {
              label: 'Digital Gold',
              value: 'Digital Gold',
              selected: false,
              icon: <InvestIcon />,
            },
            {
              label: 'Digital Gold',
              value: 'Digital Gold',
              selected: false,
              icon: <InvestIcon />,
            },
            {
              label: 'Digital Gold',
              value: 'Digital Gold',
              selected: false,
              icon: <InvestIcon />,
            },
            {
              label: 'Digital Gold',
              value: 'Digital Gold',
              selected: false,
              icon: <InvestIcon />,
            },
          ].map((item, index) => (
            <View key={index} style={{flexDirection: 'column'}}>
              <View
                key={index}
                style={{
                  height: 64,
                  width: 64,
                  borderRadius: 64 / 2,
                  marginRight: 16,
                  backgroundColor: item?.selected
                    ? theme.colors.primaryBlue
                    : theme.colors.backgroundOrange,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: theme.colors.background,
                }}>
                {item?.icon}
              </View>
              <View style={{paddingTop: 4}}>
                <BlackBodyText
                  style={{
                    ...theme.fontSizes.xsmall,
                    color: theme.colors.text,
                  }}>
                  {item?.label}
                </BlackBodyText>
              </View>
            </View>
          ))}
        </View>

        <BlackBodyText
          style={{
            marginTop: -8,
            paddingBottom: 16,
            fontWeight: theme.fontWeights.veryBold,
            fontSize: theme.fontSizes.medium.fontSize,
            lineHeight: 15.4,
          }}>
          TRENDING ON MUTUAL FUNDS
        </BlackBodyText>

        <View style={{}}>
          {hardCodedData?.map((item, index) => (
            <Card
              key={index}
              style={{
                borderColor: theme.colors.greyscale200,
                borderWidth: theme.borderWidth.thin,
                paddingLeft: 16,
                paddingVertical: 8,
                paddingRight: 12,
                borderRadius: 14,
                marginBottom: 8,
                elevation: 0,
              }}>
              <View style={{}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <View
                    style={{
                      flex: 1 / 4,
                      backgroundColor: theme.colors.background,
                      width: 46,
                      height: 46,
                      borderRadius: 46 / 2,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <NBFCIcon />
                  </View>
                  <View
                    style={{
                      flex: 2 / 4,
                    }}>
                    <Heading
                      style={{
                        color: theme.colors.text,
                        fontWeight: theme.fontWeights.lightBold,
                        ...theme.fontSizes.medium,
                      }}>
                      {item?.nbfc?.nbfc_name ||
                        'Axis Bluechip Fund Direct Plan-Growth'}
                    </Heading>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        paddingTop: 8,
                      }}>
                      <LabelValue
                        title="10%"
                        titleStyle={{
                          fontWeight: theme.fontWeights.lightBold,
                          color: theme.colors.success,
                          ...theme.fontSizes.xsmall,
                        }}
                        value={'1Y Return'}
                        valueStyle={{
                          color: theme.colors.greyscale500,
                          ...theme.fontSizes.xsmall,
                          paddingLeft: 4,
                        }}
                        style={{
                          flex: 1 / 2,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      />
                      <LabelValue
                        title="15%"
                        titleStyle={{
                          fontWeight: theme.fontWeights.lightBold,
                          color: theme.colors.success,
                          ...theme.fontSizes.xsmall,
                        }}
                        value={'3Y Return '}
                        valueStyle={{
                          color: theme.colors.greyscale500,
                          ...theme.fontSizes.xsmall,
                          paddingLeft: 4,
                        }}
                        style={{
                          flex: 1 / 2,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}
                      />
                    </View>
                  </View>
                  <LabelValue
                    style={{
                      flex: 1 / 4,
                      alignItems: 'flex-end',
                    }}
                    title="₹13.40"
                    titleStyle={{
                      fontWeight: theme.fontWeights.veryBold,
                      color: theme.colors.text,
                      ...theme.fontSizes.medium,
                      textAlign: 'right',
                    }}
                    value={
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingTop: 4,
                        }}>
                        <View>
                          <GreenArrowUpIcon />
                        </View>
                        <View>
                          <SubText
                            style={{
                              width: '100%',
                              color: theme.colors.success,
                              ...theme.fontSizes.xsmall,
                            }}>
                            0.24%
                          </SubText>
                        </View>
                      </View>
                    }
                  />
                </View>
                <View style={{paddingTop: 16}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingTop: 9,
                    }}>
                    <LabelValue
                      title={
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View>
                            <ReportOne />
                          </View>
                          <GroupText
                            style={{paddingLeft: 4, ...theme.fontSizes.xsmall}}>
                            <GrayBodyText
                              style={{
                                fontWeight: themes.fontWeights.veryBold,
                                ...theme.fontSizes.xsmall,
                              }}>
                              46.1K{' '}
                            </GrayBodyText>
                            <GrayBodyText style={{...theme.fontSizes.xsmall}}>
                              people invested{' '}
                            </GrayBodyText>
                            <GrayBodyText
                              style={{
                                fontWeight: themes.fontWeights.veryBold,
                                ...theme.fontSizes.xsmall,
                              }}>
                              ₹23.6Cr{' '}
                            </GrayBodyText>
                            <GrayBodyText style={{...theme.fontSizes.xsmall}}>
                              in last 3M
                            </GrayBodyText>
                          </GroupText>
                        </View>
                      }
                      style={{
                        flex: 2 / 3,
                      }}
                    />
                    <LabelValue
                      title={
                        <Pressable
                          hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}
                          onPress={() => {
                            if (selectedId !== index) {
                              setSelectedId(index);
                              setBookmarkSelected(prevState => !prevState);
                            } else {
                              setBookmarkSelected(prevState => !prevState);
                            }
                          }}>
                          {bookmarkSelected ? (
                            <BookmarkSelectedIcon />
                          ) : (
                            <BookmarkIcon />
                          )}
                        </Pressable>
                      }
                      style={{flex: 1 / 3, alignItems: 'flex-end'}}
                    />
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </Card>
    </View>
  );
}
