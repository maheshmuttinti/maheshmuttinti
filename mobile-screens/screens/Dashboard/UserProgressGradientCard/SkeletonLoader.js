/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {useTheme} from 'theme';

export default function () {
  const theme = useTheme();
  return (
    <SkeletonContent
      containerStyle={{flex: 1}}
      isLoading={true}
      animationType={'shiver'}
      boneColor={theme.colors.primary || '#FFFFFF'}
      layout={[
        {
          key: 'big_card',
          width: '100%',
          height: 96,
          zIndex: 3,
          borderRadius: 12,
        },
        {
          key: 'backlayer_card',
          width: '85%',
          height: 20,
          position: 'absolute',
          alignSelf: 'center',
          top: '87%',
          zIndex: 0,
          backgroundColor: '#fafafa',
          borderRadius: 12,
        },
      ]}
    />
  );
}
