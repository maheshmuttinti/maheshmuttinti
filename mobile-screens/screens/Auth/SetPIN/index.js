/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect} from 'react';
import {Platform, View} from 'react-native';
import {TextButton, CustomKeyboard} from 'uin';
import AuthWrapper from '../../../hocs/AuthWrapper';
import {useTheme} from 'theme';
import {KeyboardDoneIcon, KeyboardDeleteIcon} from 'assets';
import useOnboardingHandleRedirection from '../../../reusables/useOnboardingHandleRedirection';
import {useDispatch} from 'react-redux';
import {setIsUserLoggedInWithMPIN} from 'store';
import OverLayLoader from '../../../reusables/loader';

export default function ({navigation}) {
  const theme = useTheme();
  const [mpin, setMpin] = useState('');
  const [loading, setLoading] = useState(false);

  const pinScreenRef = useRef(null);

  useEffect(() => {
    navigation?.addListener('blur', () => {
      setMpin('');
    });
  }, [navigation]);

  const {handleRedirection} = useOnboardingHandleRedirection();

  return (
    <AuthWrapper showBackArrowIcon={false}>
      <OverLayLoader loading={loading} backdropOpacity={0.5} />
      <CustomKeyboard
        onRef={() => pinScreenRef}
        keyDown={pin => setMpin(pin)}
        numberOfPins={4}
        numberOfPinsActive={2}
        taglineStyle={{
          fontFamily: theme.fonts.regular,
          color: theme.colors.text,
          fontSize: theme.fontSizes.heading4.fontSize,
        }}
        theme={theme}
        keyTextStyle={{
          backgroundColor: theme.colors.greyscale25,
          width: 60,
          height: 60,
          borderRadius: 60 / 2,
          paddingTop: 30,
          fontFamily: theme.fonts.semibold,
          fontWeight: theme.fontWeights.moreBold,
          fontSize: 30,
          lineHeight: 18,
        }}
        tagline="Setup 4-digit pin"
        pinActiveStyle={{
          backgroundColor: theme.colors.primaryOrange,
          borderWidth: 0,
        }}
        errorStyle={{
          backgroundColor: 'transparent',
          bottom: 16,
          fontFamily: theme.fonts.regular,
        }}
        errorTextStyle={{
          color: theme.colors.error,
          fontFamily: theme.fonts.regular,
        }}
        keyStyle={{
          borderRightWidth: 0,
          borderLeftWidth: 0,
          borderBottomWidth: 0,
          alignItems: 'center',
          justifyContent: 'center',
          width: 60,
          height: 60,
          borderRadius: 50,
        }}
        keyboardRowStyle={{marginBottom: 16}}
        keyboard={[
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [
            <View
              style={
                Platform.OS === 'ios' && {
                  transform: [{translateY: 2.5}, {scale: 0.98}],
                }
              }>
              <KeyboardDeleteIcon />
            </View>,
            0,
            <View
              style={
                Platform.OS === 'ios' && {
                  transform: [{translateY: 2.5}, {scale: 0.98}],
                }
              }>
              <KeyboardDoneIcon />
            </View>,
          ],
        ]}
        navigation={navigation}
        rippleContainerBorderRadius={50}
        onEnterPress={() => {
          if (mpin?.length === 4) {
            navigation.navigate('Auth', {
              screen: 'ConfirmPIN',
              params: {mpin},
            });
          }
        }}
        ItemFooter={
          <SetupLaterButton
            navigation={navigation}
            onSkip={async () => {
              setLoading(true);
              await handleRedirection();
              setLoading(false);
            }}
          />
        }
      />
    </AuthWrapper>
  );
}

export const SetupLaterButton = ({onSkip = () => {}}) => {
  const dispatch = useDispatch();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 48,
      }}>
      <TextButton
        onPress={async () => {
          dispatch(setIsUserLoggedInWithMPIN(true));
          onSkip();
        }}>
        Setup Later
      </TextButton>
    </View>
  );
};
