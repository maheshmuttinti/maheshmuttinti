/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';

export default function () {
  return (
    <SkeletonContent
      containerStyle={{
        flex: 1,
        paddingTop: 16,
        marginTop: 32,
        flexDirection: 'row',
        paddingLeft: 16,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        height: 593,
      }}
      isLoading={true}
      animationType={'shiver'}
      boneColor={'#fdfdfd'}
      layout={[
        ...Object.values(
          circleWithRectangle(
            1,
            {top: -54, width: 64, height: 64},
            {top: 34, left: 26, width: 45, height: 16},
            {x: 16},
          ),
        ),
        ...Object.values(
          circleWithRectangle(
            2,
            {top: -54, width: 64, height: 64, color: '#FFD3BD'},
            {top: 34, left: 106, width: 45, height: 16},
            {x: 16},
          ),
        ),
        ...Object.values(
          circleWithRectangle(
            3,
            {top: -54, width: 64, height: 64, color: '#FFD3BD'},
            {top: 34, left: 186, width: 45, height: 16},
            {x: 16},
          ),
        ),
        ...Object.values(
          circleWithRectangle(
            4,
            {top: -54, width: 64, height: 64, color: '#FFD3BD'},
            {top: 34, left: 266, width: 45, height: 16},
            {x: 16},
          ),
        ),

        ...Object.values(
          circleWithRectangle(
            5,
            {top: -54, width: 64, height: 64, color: '#FFD3BD'},
            {top: 34, left: 346, width: 45, height: 16},
            {x: 16},
          ),
        ),
        ...Object.values(
          circleWithRectangle(
            6,
            {top: -54, width: 64, height: 64, color: '#FFD3BD'},
            {top: 34, left: 426, width: 45, height: 16},
            {x: 16},
          ),
        ),
        {
          key: 'single_bar_1',
          width: '35%',
          height: 16,
          zIndex: 3,
          borderRadius: 7,
          marginRight: 16,
          backgroundColor: '#fafafa',
          position: 'absolute',
          marginLeft: 25,
          top: 88,
        },
        ...Object.values(
          card(
            1,
            {x: 24, y: 0, absolutePercentage: {x: 0, y: 19.5}},
            {x: 12, y: 28},
          ),
        ),
        ...Object.values(
          card(
            2,
            {x: 24, y: 0, absolutePercentage: {x: 0, y: 37.5}},
            {x: 12, y: 28},
          ),
        ),
        ...Object.values(
          card(
            3,
            {x: 24, y: 0, absolutePercentage: {x: 0, y: 55.5}},
            {x: 12, y: 28},
          ),
        ),
        ...Object.values(
          card(
            4,
            {x: 24, y: 0, absolutePercentage: {x: 0, y: 73.5}},
            {x: 12, y: 28},
          ),
        ),
        {
          key: 'single_bar_2',
          width: '35%',
          height: 16,
          zIndex: 3,
          borderRadius: 7,
          marginRight: 16,
          backgroundColor: '#fafafa',
          position: 'absolute',
          left: '35%',
          top: '100%',
          marginTop: -16,
        },
      ]}
    />
  );
}

const circleWithRectangle = (
  key = 1,
  circle = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 64,
    height: 64,
    color: '#f9f9f9',
  },
  rectangle = {
    top: 34,
    left: 26,
    right: 0,
    bottom: 0,
    width: 45,
    height: 16,
    color: '#f9f9f9',
  },
  gap = {
    x: 0,
    y: 0,
  },
) => ({
  circle: {
    key: `circle_001_${key}`,
    width: circle.width,
    height: circle.height,
    marginBottom: 6,
    zIndex: 3,
    borderRadius: 64 / 2,
    top: circle.top ? circle.top : -54,
    borderWidth: 2,
    borderColor: '#ffffff',
    marginRight: gap.x,
    marginTop: gap.y,
    backgroundColor: circle.color ? circle.color : '#fafafa',
  },
  rectangle: {
    key: `rectangle_001_${key}`,
    width: rectangle.width,
    height: rectangle.height,
    marginBottom: 6,
    zIndex: 3,
    borderRadius: 7,
    marginRight: gap.x,
    marginTop: gap.y,
    backgroundColor: rectangle.color ? rectangle.color : '#fafafa',
    position: 'absolute',
    left: rectangle.left,
    top: rectangle.top,
    bottom: rectangle.bottom,
    right: rectangle.right,
  },
});

const card = (
  key = 1,
  boxPosition = {x: 0, y: 0, absolutePercentage: {x: 0, y: 0}},
  childrenPosition = {x: 0, y: 0},
) => ({
  box: {
    key: `border_box_${key}`,
    height: 98,
    width: '92%',
    borderColor: '#eeeeee',
    borderRadius: 12,
    position: 'absolute',
    backgroundColor: 'transparent',
    top: `${
      boxPosition?.absolutePercentage?.y
        ? boxPosition?.absolutePercentage?.y + '%'
        : '0'
    }`,
    marginLeft: boxPosition?.x,
    borderWidth: 1,
  },
  small_circle: {
    key: `small_circle_${key}`,
    height: 21,
    width: 21,
    borderRadius: 21 / 2,
    position: 'absolute',
    top: `${
      boxPosition?.absolutePercentage?.y
        ? boxPosition?.absolutePercentage?.y + '%'
        : '2%'
    }`,
    marginTop: childrenPosition?.y,
    marginLeft: childrenPosition?.x + boxPosition?.x,
  },
  very_small_bar: {
    key: `very_small_bar_${key}`,
    height: 14,
    width: '10%',
    borderRadius: 12,
    position: 'absolute',
    top: `${
      boxPosition?.absolutePercentage?.y
        ? boxPosition?.absolutePercentage?.y + '%'
        : '2%'
    }`,
    marginTop: childrenPosition?.y,
    marginLeft: childrenPosition?.x + 52,
  },
  large_bar: {
    key: `large_bar_${key}`,
    height: 14,
    width: '70%',
    borderRadius: 12,
    position: 'absolute',
    top: `${
      boxPosition?.absolutePercentage?.y
        ? boxPosition?.absolutePercentage?.y + '%'
        : '2%'
    }`,
    marginTop: childrenPosition?.y + 24,
    marginLeft: childrenPosition?.x + 52,
  },
});
