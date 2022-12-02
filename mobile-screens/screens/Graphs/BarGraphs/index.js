/* eslint-disable react-native/no-inline-styles */
import {
  View,
  BackHandler,
  Text,
  Dimensions,
  StyleSheet,
  Pressable,
} from 'react-native';
import * as React from 'react';
import {useEffect, useCallback, useRef, useState, useMemo} from 'react';
import ScreenWrapper from '../../../hocs/screen_wrapper';
import {BaseHeading, RoundedBarGraph} from 'uin';
import {useTheme} from 'theme';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

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
  const [barData, setBarData] = useState([]);
  const {width} = Dimensions.get('window');

  useEffect(() => {
    const barDataResponse = getBarData();
    const transformedFinalData = transformBarGraphData(barDataResponse.data);
    setBarData(transformedFinalData);
  }, []);

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

  return (
    <ScreenWrapper backgroundColor={theme.colors.primaryBlue}>
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <View style={{paddingVertical: 12}}>
          <BaseHeading style={{color: theme.colors.background, fontSize: 32}}>
            Bar Graph
          </BaseHeading>
        </View>
        <View>
          <RoundedBarGraph
            data={barData}
            containerStyle={{
              width: width * 0.9,
              overflow: 'scroll',
              marginLeft: -30,
            }}
            handleOnPressBarItem={_ => handleOnPressBarItem(_)}
            maxValue={200000}
            xAxisThickness={1}
            xAxisColor={theme.colors.primary}
            renderTitle={() => {}}
            barWidth={24}
            spacing={28}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
}

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
  width: '300%',
  paddingVertical: 7,
  borderRadius: 10,
  flexDirection: 'row',
  alignSelf: 'center',
});
