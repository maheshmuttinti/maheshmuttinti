/* eslint-disable react-native/no-inline-styles */
import {TickCircleMedium} from 'assets';
import * as React from 'react';
import {useState, useEffect, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from 'theme';
import {Heading, RadioInputNew} from 'uin';

export const SelectTenure = ({
  emiTenures = [],
  allEMITenures = [],
  defaultEMITenure = {},
  onSelect = () => {},
  style = {},
  labelStyle = {},
  columnCount = 1,
  textStyles = {},
  onToggleSeeMore = () => {},
}) => {
  const [defaultSelected, setDefaultSelected] = useState();
  const [refreshEMITenures, setRefreshEMITenures] = useState([]);
  const showSeeMore = useMemo(
    () => (allEMITenures?.length > 6 ? true : false),
    [allEMITenures?.length],
  );

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
        {emiTenures?.length > 0 && defaultSelected ? (
          <RadioInputNew
            dataSource={() => emiTenures}
            selectedIcon={<TickCircleMedium fill={theme.colors.primaryBlue} />}
            selectedTextColor={theme.colors.text}
            textStyles={{
              ...theme.fontSizes.small,
              fontFamily: 'Open Sans',
              ...textStyles,
            }}
            refresh={refreshEMITenures}
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

      {showSeeMore ? (
        <TouchableOpacity
          onPress={() => {
            setRefreshEMITenures(new Date().getTime());
            onToggleSeeMore();
          }}>
          <Heading
            style={{
              color: theme.colors.primaryOrange,
              ...theme.fontSizes.small,
              textDecorationLine: 'underline',
              lineHeight: 24,
              paddingBottom: 16,
              ...labelStyle,
            }}>
            {emiTenures?.length === allEMITenures?.length
              ? 'see less'
              : 'see more'}
          </Heading>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};
