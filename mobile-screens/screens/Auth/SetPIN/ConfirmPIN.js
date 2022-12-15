/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Platform, View} from 'react-native';
import {CustomKeyboard} from 'uin';
import AuthWrapper from '../../../hocs/AuthWrapperWithOrWithoutBackButton';
import {updatePassword, updateUserProfile, getUser} from 'services';
import {useTheme} from 'theme';
import {KeyboardDoneIcon, KeyboardDeleteIcon} from 'assets';
import {SetupLaterButton} from '.';
import {setIsUserLoggedInWithMPIN} from 'store';
import {useDispatch} from 'react-redux';
import OverLayLoader from '../../../reusables/loader';
import {useSetPINLaterRedirection} from '../../../reusables/useSetPINLaterRedirection';
import useOnboardingHandleRedirection from '../../../reusables/useOnboardingHandleRedirection';

export default function ({navigation, route}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [confirmMpin, setConfirmMpin] = useState('');
  const [confirmMpinError, setConfirmMpinError] = useState('');
  const [loading, setLoading] = useState(false);

  const mpin = route?.params?.mpin;
  const pinScreenRef = useRef(null);

  const {handleRedirection} = useOnboardingHandleRedirection();
  const handleSkipRedirection = useSetPINLaterRedirection(navigation);

  const updatePasswordCallback = useCallback(async () => {
    try {
      const user = await getUser();
      if (confirmMpin?.length === 4) {
        if (confirmMpin === mpin) {
          setLoading(true);
          const payload = {
            password: confirmMpin,
          };
          const updatePasswordResponse = await updatePassword(payload);

          if (
            updatePasswordResponse?.message === 'Password successfully updated'
          ) {
            const updateProfilePayload = {
              meta: {
                ...user?.profile?.meta,
                mpin_set: true,
              },
            };
            const updateProfileResponse = await updateUserProfile(
              updateProfilePayload,
            );

            if (updateProfileResponse) {
              dispatch(setIsUserLoggedInWithMPIN(true));
              await handleRedirection(user);
              setConfirmMpinError('');
              setLoading(false);
            }
          } else {
            setLoading(false);

            return;
          }
        } else {
          setLoading(false);

          setConfirmMpinError('Pin should match');
        }
      }
    } catch (err) {
      setLoading(false);
      return err;
    }
  }, [confirmMpin, dispatch, mpin]);

  useEffect(() => {
    updatePasswordCallback();
  }, [updatePasswordCallback]);

  return (
    <AuthWrapper>
      <OverLayLoader loading={loading} backdropOpacity={0.5} />
      <CustomKeyboard
        onRef={() => pinScreenRef}
        keyDown={pin => setConfirmMpin(pin)}
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
        tagline="Confirm Pin"
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
        errorText={confirmMpinError}
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
              <KeyboardDoneIcon
                fill={
                  confirmMpin?.length === 4 &&
                  confirmMpin === mpin &&
                  theme.colors.primaryBlue
                }
              />
            </View>,
          ],
        ]}
        rippleContainerBorderRadius={50}
        // onEnterPress={() => updatePasswordCallback()}
        ItemFooter={
          <SetupLaterButton
            navigation={navigation}
            onSkip={async () => {
              setLoading(true);
              await handleSkipRedirection();
              setLoading(false);
            }}
          />
        }
      />
    </AuthWrapper>
  );
}
