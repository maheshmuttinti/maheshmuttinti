/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

export default function () {
  return (
    <SkeletonContent
      containerStyle={{
        flex: 1,
        borderRadius: 12,
        backgroundColor: 'transparent',
        position: 'relative',
        height: 364,
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
        ...Object.values(
          grayWhiteCard(
            1,
            {relativePercentage: {y: 5}},
            {absolutePercentage: {y: 18}},
          ),
        ),
        ...Object.values(
          grayWhiteCard(
            2,
            {relativePercentage: {x: 49, y: 5}},
            {absolutePercentage: {x: 49, y: 18}},
          ),
        ),
        ...Object.values(
          grayWhiteCard(
            3,
            {relativePercentage: {x: 98, y: 5}},
            {absolutePercentage: {x: 98, y: 18}},
          ),
        ),
        ...Object.values(
          grayWhiteCard(
            4,
            {relativePercentage: {x: 0, y: 54}},
            {absolutePercentage: {x: 0, y: 68}},
          ),
        ),
        ...Object.values(
          grayWhiteCard(
            5,
            {relativePercentage: {x: 49, y: 54}},
            {absolutePercentage: {x: 49, y: 68}},
          ),
        ),
        ...Object.values(
          grayWhiteCard(
            6,
            {relativePercentage: {x: 98, y: 54}},
            {absolutePercentage: {x: 98, y: 68}},
          ),
        ),
      ]}
    />
  );
}

const grayWhiteCard = (
  key = 1,
  grayRectange = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    relativePercentage: {x: 0, y: 0},
  },
  whiteBehindRectange = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    left: 0,
    top: 0,
    absolutePercentage: {x: 0, y: 0},
  },
) => ({
  grayRectange: {
    key: `gray_reactangle_1_1_${key}`,
    width: grayRectange?.width ? grayRectange?.width : '47%',
    height: grayRectange?.height ? grayRectange?.height : 112,
    zIndex: 2,
    backgroundColor: '#fafafa',
    borderRadius: 14,
    marginTop: grayRectange?.y ? grayRectange?.y : 15,
    marginLeft: grayRectange?.x ? grayRectange?.x : 0,
    position: 'absolute',
    top: grayRectange?.relativePercentage?.y
      ? grayRectange?.relativePercentage?.y + '%'
      : 0,
    left: grayRectange?.relativePercentage?.x
      ? grayRectange?.relativePercentage?.x + '%'
      : 0,
  },
  whiteBehindRectange: {
    key: `white_behind_reactangle_1_1_${key}`,
    width: whiteBehindRectange?.width ? whiteBehindRectange?.width : '47%',
    height: whiteBehindRectange?.height ? whiteBehindRectange?.height : 104,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: grayRectange?.y ? grayRectange?.y : 15,
    marginLeft: grayRectange?.x ? grayRectange?.x : 0,
    position: 'absolute',
    top: whiteBehindRectange?.absolutePercentage?.y
      ? whiteBehindRectange?.absolutePercentage?.y + '%'
      : 0,
    left: whiteBehindRectange?.absolutePercentage?.x
      ? whiteBehindRectange?.absolutePercentage?.x + '%'
      : 0,
    zIndex: 0,
  },
});
