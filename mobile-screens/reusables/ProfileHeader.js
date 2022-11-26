import {View, Platform} from 'react-native';
import React from 'react';
import {CloseCircleWithCrossIcon, BlueProfileIcon} from 'assets';
import LinearGradient from 'react-native-linear-gradient';
import {Heading, Card, BaseButton} from 'uin';
import Ripple from 'react-native-material-ripple';
import {useTheme} from 'theme';

export default function ({closeCallback = () => {}, ...props}) {
  const theme = useTheme();
  return (
    <LinearGradient
      colors={['#3F76FF', '#003AC9'].reverse()}
      start={props.start ? props.start : {x: 0.0, y: 1.0}}
      end={props.end ? props.end : {x: 1.0, y: 1.0}}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'ios' ? 48 : 16,
        paddingRight: 16,
      }}>
      <View style={{width: '100%'}}>
        <View style={{alignSelf: 'flex-end'}}>
          <Ripple
            rippleColor={theme.colors.background}
            onPress={() => {
              closeCallback();
            }}
            rippleContainerBorderRadius={24 / 2}>
            <View style={{padding: 2}}>
              <CloseCircleWithCrossIcon />
            </View>
          </Ripple>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 10,
          marginRight: 16,
          marginBottom: 24,
        }}>
        <Card
          style={{
            height: 64,
            width: 64,
            borderRadius: 64 / 2,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 24,
          }}>
          {/* <Heading
              style={{
                color: theme.colors.primaryBlue,
                fontWeight: "800",
                fontSize: theme.fontSizes.heading5.fontSize,
                lineHeight: 27.14,
              }}
            >
              VK
            </Heading> */}
          <BlueProfileIcon />
        </Card>
        <View style={{marginLeft: 12}}>
          <Heading
            style={{
              fontSize: theme.fontSizes.heading5.fontSize,
              lineHeight: 27.84,
              fontWeight: '800',
            }}>
            Unknown
          </Heading>
          <View style={{paddingTop: 8}}>
            <BaseButton
              gradientColors={['#FF5500', '#FF7954'].reverse()}
              onPress={() => {}}
              wrapperStyles={{
                paddingHorizontal: 23.3,
                borderRadius: 50,
              }}
              textStyles={{
                lineHeight: 32,
                fontSize: theme.fontSizes.small.fontSize,
                fontWeight: theme.fontWeights.veryBold,
              }}
              extraStyles={{paddingVertical: 0}}>
              Upload Portfolio
            </BaseButton>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}
