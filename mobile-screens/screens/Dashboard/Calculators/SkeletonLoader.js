/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {useTheme} from 'theme';

export default function () {
  const theme = useTheme();
  return (
    <SkeletonContent
      containerStyle={{
        flex: 1,
        paddingTop: 16,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddinTop: 20,
        paddingBottom: 20,
        backgroundColor: theme.colors.background,
      }}
      isLoading={true}
      animationType={'shiver'}
      boneColor={'#fdfdfd'}
      layout={[
        {
          key: 'skeleton_1',
          width: '35%',
          height: 14,
          marginBottom: 20,
          zIndex: 3,
          borderRadius: 12,
          backgroundColor: '#fafafa',
        },
        {
          key: 'skeleton_2',
          width: '50%',
          height: 14,
          zIndex: 0,
          backgroundColor: '#fafafa',
          borderRadius: 12,
          marginBottom: 6,
        },
        {
          key: 'skeleton_3',
          width: '100%',
          height: 14,
          zIndex: 0,
          backgroundColor: '#fafafa',
          borderRadius: 12,
        },
        {
          key: 'skeleton_4',
          width: '35%',
          height: 14,
          marginTop: 90,
          marginBottom: 20,
          zIndex: 3,
          borderRadius: 12,
          backgroundColor: '#fafafa',
        },
        {
          key: 'skeleton_5',
          width: '50%',
          height: 14,
          zIndex: 0,
          backgroundColor: '#fafafa',
          borderRadius: 12,
          marginBottom: 6,
        },
        {
          key: 'skeleton_6',
          width: '100%',
          height: 14,
          zIndex: 0,
          backgroundColor: '#fafafa',
          borderRadius: 12,
        },
      ]}
    />
  );
}
