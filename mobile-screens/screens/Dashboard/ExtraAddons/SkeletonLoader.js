/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {useTheme} from 'theme';
import {View} from 'react-native';

export default function () {
  const theme = useTheme();
  return (
    <View style={{flexDirection: 'row'}}>
      {'.'
        .repeat(4)
        .split('')
        .map((_, index) => (
          <SkeletonContent
            key={index}
            containerStyle={{
              width: '96%',
              marginRight: 8,
              borderRadius: 12,
              backgroundColor: theme.colors.background,
            }}
            isLoading={true}
            animationType={'shiver'}
            boneColor={'#fdfdfd'}
            layout={[
              {
                key: `banner_1_${index}`,
                height: 136,
                zIndex: 3,
                borderRadius: 12,
                backgroundColor: '#fafafa',
              },
            ]}
          />
        ))}
    </View>
  );
}
