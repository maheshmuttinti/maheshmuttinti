/* eslint-disable react-native/no-inline-styles */
import {
  View,
  BackHandler,
  Text,
  Dimensions,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import * as React from 'react';
import {useEffect, useCallback, useRef, useState, useMemo} from 'react';
import ScreenWrapper from '../../hocs/screen_wrapper';
import {
  Card,
  GrayBodyText,
  Heading,
  LabelValue,
  RoundedBarGraph,
  RoundedFilledButton,
} from 'uin';
import {Arrow, BackArrow, CalenderReportIcon} from 'assets';
import {useTheme} from 'theme';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import ExtraAddons from '../Dashboard/ExtraAddons';
// import LineGraph from './LineGraph';
// import {lineGraphData} from './lineGraphDataOld';
import Carousel from 'react-native-snap-carousel-v4';
import {formatDate, prettifyJSON} from 'utils';
import ReportsHeader from './components/Header';

const barGraphColorsObjects = {
  1: {
    frontColor: '#FFE580',
    gradientColor: '#FFB500',
  },
  2: {
    frontColor: '#FF5500',
    gradientColor: '#FF7954',
  },
};

const getBarData = () => {
  return {
    status: 'success',
    data: [
      {
        client_id: 1098839,
        total_cost: 101199.96,
        total_market_value: 160977.661,
        quarterly_date: '2021-12-31',
      },
      {
        client_id: 1098839,
        total_cost: 101199.96,
        total_market_value: 159354.513,
        quarterly_date: '2022-03-31',
      },
      {
        client_id: 1098839,
        total_cost: 101199.96,
        total_market_value: 145003.155,
        quarterly_date: '2022-06-30',
      },
      {
        client_id: 1098839,
        total_cost: 101199.96,
        total_market_value: 160363.581,
        quarterly_date: '2022-09-30',
      },
    ],
  };
};

const transformBarGraphData = data => {
  const pairBarsObject = item => ({
    1: {
      value: item.total_cost,
      spacing: 0,
      ...Object.values(barGraphColorsObjects)[0],
    },
    2: {
      value: item.total_market_value,
      ...Object.values(barGraphColorsObjects)[1],
    },
  });
  let finalArr = [];
  data?.forEach(item => {
    Object.values(pairBarsObject(item))?.forEach(_item => {
      finalArr.push(_item);
    });
  });

  return finalArr;
};

export default function () {
  const theme = useTheme();
  const navigation = useNavigation();
  const [graphsData, setGraphsData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [activeGraph, setActiveGraph] = useState(0);
  const carouselRef = useRef(null);
  const {width} = Dimensions.get('window');

  useEffect(() => {
    const barDataResponse = getBarData();
    const transformedFinalData = transformBarGraphData(barDataResponse.data);
    setBarData(transformedFinalData);
  }, []);

  useEffect(() => {
    if (barData?.length > 0) {
      setGraphsData(() => {
        const barGraphData = {data: barData};
        return [barGraphData];
      });
    }
  }, [barData]);

  const xirrResponse = useMemo(
    () => ({
      status: 'success',
      data: [
        {
          client_id: 1119201,
          Withdrawals: 0,
          Reinvestment: 0,
          Payout: 0,
          Investments: 100,
          SwitchIns: 0,
          SwitchOuts: 0,
          Net_Investments: 0,
          CurrentValue: 106.3004,
          si_xirr_percent: 0,
          new_net_gain_or_loss: 106.3004,
          net_gain_or_loss: 6.3004,
        },
        {
          client_id: 1119201,
          Withdrawals: 0,
          Reinvestment: 0,
          Payout: 0,
          Investments: 100,
          SwitchIns: 0,
          SwitchOuts: 0,
          Net_Investments: 0,
          CurrentValue: 106.3004,
          live_xirr_percent: 181.66,
          new_net_gain_or_loss: 106.3004,
          net_gain_or_loss: 6.3004,
        },
      ],
    }),
    [],
  );

  const renderTopLabelComponent = item => {
    if (!item) {
      return null;
    }
    return (
      <Text
        style={{
          color: '#0A0521',
          fontSize: 9,
        }}>{`₹${item.value}`}</Text>
    );
  };

  const renderBottomTitle = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginTop: 24,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              borderRadius: 6,
              backgroundColor: '#FFE580',
              height: 8,
              width: 8,
              marginRight: 8,
            }}
          />
          <Text
            style={{
              color: theme.colors.background,
              fontWeight: theme.fontWeights.veryBold,
            }}>
            Invested Value
          </Text>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              height: 8,
              width: 8,
              borderRadius: 6,
              backgroundColor: theme.colors.primaryOrange,
              marginRight: 8,
            }}
          />

          <Text
            style={{
              color: theme.colors.background,
              fontWeight: theme.fontWeights.veryBold,
            }}>
            Portfolio Value
          </Text>
        </View>
      </View>
    );
  };

  const goBack = useRef(() => {});
  goBack.current = () => {
    navigation.jumpTo('Home');
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', goBack.current);
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', goBack.current);
      };
    }, []),
  );

  const handleOnPressBarItem = useCallback(
    item => {
      const lastClickedBarItem = barData?.find(barItem =>
        barItem.hasOwnProperty('topLabelComponent'),
      );
      delete lastClickedBarItem?.topLabelComponent;
      item.topLabelComponent = () => renderTopLabelComponent(item);
      item.topLabelContainerStyle = BARGRAPH_TOPLABEL_CONTAINER_STYLE;
      setBarData(prevData => [...prevData]);
    },
    [barData],
  );

  const onChangeGraph = index => {
    setActiveGraph(index);
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={{}} key={`render_item-${index}`}>
        {index % 2 === 0 ? (
          <View style={{paddingRight: 16, marginLeft: -8}}>
            <PortfolioXIRR wrapperStyle={{zIndex: 1}} xirrData={xirrResponse} />
            <RoundedBarGraph
              data={item?.data}
              containerStyle={{
                width: width * 0.9,
                overflow: 'scroll',
                marginLeft: -30,
              }}
              handleOnPressBarItem={_ => handleOnPressBarItem(_)}
              maxValue={200000}
              xAxisThickness={1}
              xAxisColor={theme.colors.primary}
              renderTitle={renderBottomTitle}
              barWidth={24}
              spacing={28}
            />
          </View>
        ) : (
          <Card
            style={{
              borderColor: theme.colors.greyscale200,
              borderWidth: theme.borderWidth.thin,
              width: width * 0.838,
              padding: 16,
              zIndex: 10,
            }}>
            <LineGraphTopSection
              wrapperStyle={{zIndex: 1}}
              xirrData={xirrResponse}
            />
            {/* <LineGraph data={item?.data} /> */}
          </Card>
        )}
      </View>
    );
  };

  return (
    <ScreenWrapper backgroundColor={theme.colors.primaryBlue}>
      <ReportsHeader navigation={navigation} />
      <View style={{position: 'relative'}}>
        <Carousel
          layout="default"
          ref={carouselRef}
          data={graphsData?.map((item, index) => {
            if (index === 0) {
              item.data = barData;
            }
            return {...item};
          })}
          sliderWidth={width}
          itemWidth={width * 0.838}
          renderItem={renderItem}
          onSnapToItem={index => {
            onChangeGraph(index);
          }}
          slideStyle={{zIndex: 1}}
          firstItem={activeGraph}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          scrollEnabled={false}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 24,
            marginHorizontal: 12,
            position: 'absolute',
            top: 0,
            width: '95%',
          }}>
          {activeGraph !== 0 ? (
            <RoundedFilledButton
              onPress={() => {
                if (activeGraph !== 0) {
                  carouselRef.current.snapToPrev();
                  onChangeGraph(carouselRef.current._activeItem);
                }
              }}
              bgColor={'#FF5500'}
              textColor={theme.colors.primary}
              buttonStyles={{width: 40, height: 40}}>
              <BackArrow fill={theme.colors.primary} />
            </RoundedFilledButton>
          ) : (
            <View />
          )}
          {graphsData?.length > 0 && activeGraph !== graphsData?.length - 1 ? (
            <RoundedFilledButton
              onPress={() => {
                if (
                  graphsData.length > 0 &&
                  activeGraph !== graphsData?.length - 1
                ) {
                  carouselRef.current.snapToNext();
                  onChangeGraph(carouselRef.current._activeItem);
                }
              }}
              bgColor={'#FF5500'}
              textColor={theme.colors.primary}
              buttonStyles={{width: 40, height: 40, marginLeft: 10}}>
              <Arrow stroke={theme.colors.primary} />
            </RoundedFilledButton>
          ) : (
            <View />
          )}
        </View>
      </View>

      <View
        style={{
          marginTop: 35,
          flex: 1,
          backgroundColor: theme.colors.background,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          padding: 24,
        }}>
        <Heading
          style={{
            color: theme.colors.text,
            fontWeight: theme.fontWeights.veryBold,
            paddingTop: 24,
          }}>
          Let’s get to know your Portfolio a little more
        </Heading>
        <LabelValue
          title="Risk Score"
          titleStyle={{
            fontWeight: theme.fontWeights.veryBold,
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.heading5,
          }}
          value={
            'An investor’s risk is represented by a number between 1 (low risk) and 10 (high risk) on their user page. This is their Risk Score.'
          }
          valueStyle={{
            color: theme.colors.text,
            ...theme.fontSizes.medium,
            marginTop: 8,
          }}
          style={{
            marginTop: 34,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: theme.colors.greyscale600,
          }}
        />
        <LabelValue
          title="Max Dropdown %"
          titleStyle={{
            fontWeight: theme.fontWeights.veryBold,
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.heading5,
          }}
          value={
            'A maximum drawdown (MDD) is the maximum observed loss from a peak to a trough of a portfolio, before a new peak is attained. Maximum drawdown is an indicator of downside risk over a specified time period.'
          }
          valueStyle={{
            color: theme.colors.text,
            ...theme.fontSizes.medium,
            marginTop: 8,
          }}
          style={{
            marginTop: 34,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: theme.colors.greyscale600,
          }}
        />
        <LabelValue
          title="Overlap %"
          titleStyle={{
            fontWeight: theme.fontWeights.veryBold,
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.heading5,
          }}
          value={
            'Fund overlap can reduce portfolio diversification and create concentrated positions, often with the investor largely unaware.'
          }
          valueStyle={{
            color: theme.colors.text,
            ...theme.fontSizes.medium,
            marginTop: 8,
          }}
          style={{
            marginTop: 34,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderColor: theme.colors.greyscale600,
          }}
        />
        <ExtraAddons wrapperStyles={{paddingTop: 24}} />

        <View style={{marginBottom: 74}} />
      </View>
    </ScreenWrapper>
  );
}

const PortfolioXIRR = ({wrapperStyle = {}, xirrData = {}}) => {
  const theme = useTheme();
  const [XIRRValues, setXIRRValues] = useState([
    [
      {label: 'Current Portfolio Value', value: '₹0'},
      {label: 'Total Gains', value: '₹0'},
    ],
    [
      {label: 'Total amount invested', value: '₹ 0'},
      {label: 'XIRR%', value: '0%'},
    ],
  ]);

  useEffect(() => {
    const xirrDataFirstObj = xirrData?.data?.[1];

    setXIRRValues(prevState => {
      const finalArr = prevState
        ?.map(item => {
          const insideMap = item?.map(_item => {
            if (_item?.hasOwnProperty('label')) {
              const finalItem = {
                ..._item,
                value: getXIRRValues(xirrDataFirstObj, _item.label),
              };
              return finalItem;
            }
          });
          return insideMap;
        })
        .filter(item => item.map(_i => !_i));
      return finalArr;
    });
  }, [xirrData]);

  return (
    <View style={{...wrapperStyle}}>
      {XIRRValues?.map((item, index) => (
        <View
          style={{flexDirection: 'row', paddingLeft: 8, paddingRight: 16}}
          key={`xirr_attribute_${index}`}>
          {item?.map((_item, _index) => (
            <LabelValue
              key={`xirr_inside_${_index}`}
              title={`${_item?.label}`}
              titleStyle={{
                textAlign: _index % 2 === 0 ? 'left' : 'right',
                fontWeight: theme.fontWeights.lightBold,
                color: theme.colors.primary,
                fontSize: theme.fontSizes.small.fontSize,
                lineHeight: 26,
              }}
              value={`${_item.value}`}
              valueStyle={{
                textAlign: _index % 2 === 0 ? 'left' : 'right',
                fontWeight: theme.fontWeights.veryBold,
                color: theme.colors.primary,
                fontSize: theme.fontSizes.heading5.fontSize,
                lineHeight: 34,
              }}
              style={{
                paddingTop: 8,
                flex: 1 / 2,
              }}
            />
          ))}
        </View>
      ))}
      <GrayBodyText
        style={{
          fontSize: theme.fontSizes.xsmall.fontSize,
          lineHeight: 26,
          fontFamily: theme.fonts.italic,
          color: theme.colors.primary,
          paddingTop: 10,
          paddingLeft: 8,
          paddingRight: 16,
        }}>
        Last updated: {`${formatDate(new Date(), 'dMy', Platform.OS)}`}
      </GrayBodyText>
      <View
        style={{
          borderColor: theme.colors.primary,
          borderBottomWidth: 1,
          paddingTop: 8,
        }}
      />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <SmallTabButtons
          wrapperStyle={{marginBottom: 16, marginTop: 16, flex: 3 / 4}}
          tabButtonStyle={{
            paddingHorizontal: 12,
            paddingVertical: 2,
            borderRadius: 15,
            borderColor: theme.colors.primary,
          }}
          labelStyle={{
            color: theme.colors.primary,
            fontSize: theme.fontSizes.small.fontSize,
            lineHeight: 32,
            fontWeight: theme.fontWeights.veryBold,
          }}
          tabLabels={['Q1', 'Q2', 'Q3', 'Q4']}
        />
        <View style={{marginLeft: 'auto'}}>
          <CalenderReportIcon fill={theme.colors.primary} />
        </View>
      </View>
    </View>
  );
};

const LineGraphTopSection = ({wrapperStyle = {}, xirrData = {}}) => {
  const theme = useTheme();

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: 8,
          alignItems: 'center',
          paddingRight: 8,
          marginBottom: 36,
          ...wrapperStyle,
        }}>
        <LabelValue
          title={'Current Portfolio Value'}
          titleStyle={{
            fontWeight: theme.fontWeights.lightBold,
            color: theme.colors.greyscale600,
            fontSize: theme.fontSizes.small.fontSize,
            lineHeight: 26,
          }}
          value={`${xirrData?.data?.[1]?.CurrentValue}`}
          valueStyle={{
            fontWeight: theme.fontWeights.veryBold,
            color: theme.colors.text,
            fontSize: theme.fontSizes.heading3.fontSize,
            lineHeight: 34,
            paddingTop: 4.15,
          }}
          style={{
            paddingTop: 8,
            flex: 3 / 4,
          }}
        />
        <View style={{marginLeft: 'auto'}}>
          <CalenderReportIcon />
        </View>
      </View>
      {/* <SmallTabButtons
        wrapperStyle={{marginBottom: 16}}
        tabButtonStyle={{
          paddingHorizontal: 12,
          paddingVertical: 2,
          borderRadius: 15,
        }}
        labelStyle={{
          fontSize: theme.fontSizes.small.fontSize,
          lineHeight: 32,
          fontWeight: theme.fontWeights.veryBold,
        }}
        tabLabels={['1Y', '2Y', '3Y', '4Y', '5Y']}
      /> */}
    </>
  );
};
export const SmallTabButtons = ({
  wrapperStyle = {},
  tabLabels = ['Tab1', 'Tab2'],
  labelStyle = {},
  tabButtonStyle = {},
  onPress = () => {},
}) => {
  const theme = useTheme();
  return (
    <View style={{flexDirection: 'row', ...wrapperStyle}}>
      {tabLabels?.map((label, index) => (
        <Pressable
          key={`tab-${index}`}
          onPress={() => onPress(label, index)}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.greyscale600,
            borderRadius: 50,
            marginRight: 9,
            ...tabButtonStyle,
          }}>
          <Text style={{color: theme.colors.greyscale600, ...labelStyle}}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const BARGRAPH_TOPLABEL_CONTAINER_STYLE = StyleSheet.create({
  paddingBottom: 3,
  backgroundColor: '#E9F0FF',
  paddingHorizontal: 12,
  width: '400%',
  paddingVertical: 7,
  borderRadius: 10,
  flexDirection: 'row',
  alignSelf: 'center',
});

const getXIRRValues = (xirrData, label) => {
  switch (label) {
    case 'Current Portfolio Value':
      return `₹${xirrData?.CurrentValue || '0'}`;
    case 'Total Gains':
      return `₹${xirrData?.new_net_gain_or_loss || '0'}`;
    case 'Total amount invested':
      return `₹ ${
        xirrData?.Net_Investments_new || xirrData?.Net_Investments || '0'
      }`;
    case 'XIRR%':
      return `${xirrData?.live_xirr_percent || '0'}%`;
    default:
      return '';
  }
};
