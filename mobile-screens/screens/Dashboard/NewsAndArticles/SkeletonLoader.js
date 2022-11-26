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
                height: 168,
                width: 152,
                paddingVertical: 15,
                paddingHorizontal: 16,
                marginRight: 8,
              }}
              isLoading={true}
              animationType={'shiver'}
              boneColor={'#fdfdfd'}
              layout={[...Object.values(cardEmpty(index))]}
            />
          ))}
      </View>
    </View>
  );
}

const cardEmpty = (key = 1) => ({key: `card_empty_${key}`});
