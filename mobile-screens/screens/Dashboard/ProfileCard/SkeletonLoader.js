/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef} from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {BlurView} from '@react-native-community/blur';
import {BlurGraph} from 'assets';
import {useTheme} from 'theme';
import {View, findNodeHandle, Platform} from 'react-native';

export default function () {
  const [viewRef, setViewRef] = useState(null);
  const graphViewRef = useRef(null);
  const theme = useTheme();

  const onViewLoaded = () => {
    setViewRef(findNodeHandle(graphViewRef.current));
  };
  return (
    <View
      style={{
        backgroundColor: theme.colors.background,
        borderRadius: 12,
        position: 'relative',
      }}>
      <SkeletonContent
        containerStyle={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 16,
          backgroundColor: 'transparent',
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
            width: '25%',
            height: 14,
            zIndex: 0,
            backgroundColor: '#fafafa',
            borderRadius: 12,
            marginBottom: 6,
          },
          {
            key: 'skeleton_3',
            width: '50%',
            height: 14,
            zIndex: 0,
            backgroundColor: '#fafafa',
            borderRadius: 12,
          },
          {
            key: 'skeleton_4',
            width: '25%',
            height: 14,
            left: '50%',
            top: '-19%',
            marginLeft: 6,
            zIndex: 0,
            backgroundColor: '#fafafa',
            borderRadius: 12,
            marginBottom: 6,
          },
          {
            key: 'skeleton_5',
            width: '50%',
            height: 14,
            left: '50%',
            top: '-19%',
            marginLeft: 6,
            zIndex: 0,
            backgroundColor: '#fafafa',
            borderRadius: 12,
          },
          {
            key: 'skeleton_6',
            width: '25%',
            height: 14,
            zIndex: 0,
            backgroundColor: '#fafafa',
            borderRadius: 12,
            marginBottom: 6,
          },
          {
            key: 'skeleton_7',
            width: '50%',
            height: 14,
            zIndex: 0,
            backgroundColor: '#fafafa',
            borderRadius: 12,
          },
          {
            key: 'skeleton_8',
            width: '25%',
            height: 14,
            left: '50%',
            top: '-19%',
            marginLeft: 6,
            zIndex: 0,
            backgroundColor: '#fafafa',
            borderRadius: 12,
            marginBottom: 6,
          },
          {
            key: 'skeleton_9',
            width: '50%',
            height: 14,
            left: '50%',
            top: '-19%',
            marginLeft: 6,
            zIndex: 0,
            backgroundColor: '#fafafa',
            borderRadius: 12,
          },
        ]}
      />
      {/* <View
        ref={containerRef => {
          graphViewRef.current = containerRef;
        }}
        onLayout={onViewLoaded}
        style={{
          borderRadius: 12,
          alignItems: 'center',
          flex: 1,
        }}>
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

      <SkeletonContent
        containerStyle={{
          flex: 1,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 20,
          backgroundColor: 'transparent',
        }}
        isLoading={true}
        animationType={'shiver'}
        boneColor={'#fdfdfd'}
        layout={[
          {
            key: 'skeleton_10',
            width: '50%',
            height: 14,
            alignSelf: 'center',
            marginLeft: 6,
            marginTop: 32,
            zIndex: 0,
            backgroundColor: '#fafafa',
            borderRadius: 12,
          },
        ]}
      /> */}
    </View>
  );
}
