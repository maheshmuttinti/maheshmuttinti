/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, View, ScrollView} from 'react-native';
import {BaseHeading, Card, BlackBodyText} from 'uin';
import {useTheme} from 'theme';

const data = [
  {
    imgSrc: 'https://picsum.photos/id/100/128/168',
    title: '15 Crore business in 12 months, from.....',
  },
  {
    imgSrc: 'https://picsum.photos/id/111/128/168',
    title: 'How I make money using Credit Cards',
  },
  {
    imgSrc: 'https://picsum.photos/id/112/128/168',
    title: 'Should You BUY a new car? | Leas...',
  },
];

export default function ({ref, ...props}) {
  const theme = useTheme();
  return (
    <View
      {...props}
      ref={ref}
      style={{
        position: 'relative',
      }}>
      <BaseHeading
        style={{
          color: theme.colors.text,
          fontSize: theme.fontSizes.medium.fontSize,
          lineHeight: 15.4,
          fontWeight: theme.fontWeights.veryBold,
          marginBottom: 16,
        }}>
        NEWS AND ARTICLES
      </BaseHeading>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
          }}>
          {data?.map((item, index) => (
            <Card
              key={index}
              style={{
                paddingBottom: 8,
                borderRadius: 14,
                width: 128,
                height: 168,
                position: 'relative',
                marginRight: 8,
                justifyContent: 'flex-end',
              }}>
              <View
                style={{
                  position: 'absolute',
                  height: 168,
                  width: '100%',
                  top: 0,
                  left: 0,
                }}>
                <Image
                  style={{width: '100%', height: '100%', borderRadius: 14}}
                  source={{uri: item?.imgSrc}}
                  failure={() => console.log('failed to load image')}
                />
              </View>
              <View style={{paddingHorizontal: 8}}>
                <BlackBodyText
                  style={{
                    color: '#ffffff',
                    fontSize: theme.fontSizes.small.fontSize,
                    lineHeight: 15.65,
                    fontWeight: theme.fontWeights.moreBold,
                  }}>
                  {item?.title}
                </BlackBodyText>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
