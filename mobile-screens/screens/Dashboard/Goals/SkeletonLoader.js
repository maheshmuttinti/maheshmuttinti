/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {View} from 'react-native';

export default function () {
  return (
    <View>
      <SkeletonContent
        containerStyle={{
          flex: 1,
          borderRadius: 12,
          backgroundColor: 'transparent',
        }}
        isLoading={true}
        animationType={'shiver'}
        boneColor={'#fdfdfd'}
        layout={[
          {
            key: 'single_bar_1_1',
            width: '50%',
            height: 16,
            zIndex: 3,
            borderRadius: 7,
            backgroundColor: '#ffffff',
          },
        ]}
      />
      <View style={{flexDirection: 'row', width: '100%', marginTop: 15}}>
        {'.'
          .repeat(4)
          .split('')
          .map((_, index) => (
            <SkeletonContent
              key={index}
              containerStyle={{
                borderRadius: 12,
                backgroundColor: '#ffffff',
                height: 152,
                width: 152,
                paddingVertical: 15,
                paddingHorizontal: 16,
                marginRight: 8,
              }}
              isLoading={true}
              animationType={'shiver'}
              boneColor={'#fdfdfd'}
              layout={[
                ...Object.values(cardWithContentRectangleAndCircle(index)),
              ]}
            />
          ))}
      </View>
    </View>
  );
}

const cardWithContentRectangleAndCircle = (key = 1) => ({
  rectangle_1: {
    key: `single_bar_1_1_${key}`,
    width: '35%',
    height: 16,
    borderRadius: 7,
    backgroundColor: '#fafafa',
  },
  rectangle_2: {
    key: `single_bar_1_2_${key}`,
    width: '60%',
    height: 16,
    borderRadius: 7,
    marginTop: 8,
    backgroundColor: '#fafafa',
  },
  circle: {
    key: `single_bar_1_3_${key}`,
    marginTop: 'auto',
    height: 31,
    width: 31,
    borderRadius: 31 / 2,
    backgroundColor: '#fafafa',
  },
});
