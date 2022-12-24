/* eslint-disable react-native/no-inline-styles */
import {TickCircleMedium} from 'assets';
import * as React from 'react';
import {useState, useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from 'theme';
import {BaseButton, Heading, RadioInputNew} from 'uin';

export const SelectTenure = ({
  emiTenures = [],
  defaultEMITenure = {},
  onSelect = () => {},
  style = {},
  labelStyle = {},
  columnCount = 1,
  textStyles = {},
  onSeeMore = () => {},
}) => {
  const [value, setValue] = useState('');
  const [defaultSelected, setDefaultSelected] = useState();

  useEffect(() => {
    const foundedScheme = emiTenures?.find(
      item => item?.label === defaultEMITenure?.label,
    );
    setDefaultSelected([foundedScheme]);
  }, [defaultEMITenure, emiTenures]);

  const theme = useTheme();
  return (
    <View style={{...style}}>
      <Heading
        style={{
          color: theme.colors.text,
          ...theme.fontSizes.medium,
          fontWeight: theme.fontWeights.veryBold,
          lineHeight: 24,
          paddingBottom: 16,
          ...labelStyle,
        }}>
        SELECT TENURE
      </Heading>

      <View>
        {defaultSelected ? (
          <RadioInputNew
            dataSource={() => emiTenures}
            selectedIcon={<TickCircleMedium fill={theme.colors.primaryBlue} />}
            selectedTextColor={theme.colors.text}
            textStyles={{
              ...theme.fontSizes.small,
              fontFamily: 'Open Sans',
              ...textStyles,
            }}
            columnCount={columnCount}
            isWrap={true}
            pressableStyle={{paddingHorizontal: 10}}
            defaultSelected={defaultSelected}
            wrapperStyle={{alignItems: 'center', marginBottom: 0}}
            onChange={v => {
              onSelect(v);
            }}
            multiple={false}
          />
        ) : null}
      </View>

      <TouchableOpacity onPress={() => onSeeMore()}>
        <Heading
          style={{
            color: theme.colors.primaryOrange,
            ...theme.fontSizes.small,
            textDecorationLine: 'underline',
            lineHeight: 24,
            paddingBottom: 16,
            ...labelStyle,
          }}>
          see more
        </Heading>
      </TouchableOpacity>
    </View>
  );
};
