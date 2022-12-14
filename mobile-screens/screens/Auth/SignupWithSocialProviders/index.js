/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {View, Text, TouchableOpacity, Linking, Platform} from 'react-native';
import {
  GrayBodyText,
  AuthHeading,
  BaseButton,
  SubText,
  TextButton,
  GroupText,
  GoogleButton,
  AppleButton,
} from 'uin';
import {useTheme} from 'theme';
import AuthWrapper from '../../../hocs/AuthWrapper';
import {Separator} from 'assets';
import {appleLogin, googleLogin} from 'services';
import {openBrowser} from 'utils';
import Config from 'react-native-config';

export default function SignupOptionsScreen({navigation}) {
  const theme = useTheme();

  const handleGoogleLogin = async () => {
    try {
      const data = await googleLogin();
      console.log('handleGoogleLogin->data: ', data);
      const url = data?.redirect_to;
      await openBrowser(url);
    } catch (error) {
      return error;
    }
  };

  const handleAppleLogin = async () => {
    try {
      const data = await appleLogin();
      const url = data?.redirect_to;
      await openBrowser(url);
    } catch (error) {
      return error;
    }
  };

  const handleSubmit = () => {
    navigation.navigate('Auth', {screen: 'SignupWithEmailAndPhoneNumber'});
  };

  return (
    <AuthWrapper showBackArrowIcon={navigation.canGoBack()}>
      <AuthHeading>Enhance your Financial Well-Being!</AuthHeading>

      <View style={{paddingTop: 18}}>
        <GrayBodyText>
          Join in with your e-mail linked to Investments for Analysis, Insights
          and More...
        </GrayBodyText>
      </View>

      <View style={{paddingTop: 24}}>
        {Platform.OS === 'ios' && (
          <View>
            <GoogleButton
              isSingleButton={true}
              onPress={() => handleGoogleLogin()}>
              Continue with Google
            </GoogleButton>
            <View style={{marginTop: 15}}>
              <AppleButton
                isSingleButton={true}
                onPress={() => handleAppleLogin()}>
                Continue with Apple
              </AppleButton>
            </View>
          </View>
        )}

        {Platform.OS === 'android' && (
          <View>
            <GoogleButton
              isSingleButton={true}
              onPress={() => handleGoogleLogin()}>
              Continue with Google
            </GoogleButton>
          </View>
        )}
      </View>

      <GroupText
        style={{
          flexDirection: 'row',
          width: '100%',
          marginTop: 24,
        }}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            alignItems: 'flex-start',
          }}>
          <SubText style={{color: theme.colors.bodyGray}}>
            By clicking the{' '}
          </SubText>

          <SubText style={{color: theme.colors.primaryOrange800}}>
            Sign Up{' '}
          </SubText>

          <SubText style={{color: theme.colors.bodyGray}}>
            button, you agree to the{' '}
          </SubText>
        </View>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL(`${Config.FINEZZY_TERMS_AND_CONDITIONS_URL}`);
          }}
          style={{
            alignSelf: 'flex-start',
          }}>
          <SubText
            style={{
              color: theme.colors.primaryBlue800,
              textDecorationLine: 'underline',
              alignSelf: 'flex-start',
            }}>
            terms and conditions{' '}
          </SubText>
        </TouchableOpacity>
      </GroupText>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 24,
        }}>
        <Separator />
        <Text style={{marginHorizontal: 8, color: theme.colors.bodyGray}}>
          or
        </Text>
        <Separator />
      </View>

      <View style={{paddingTop: 24}}>
        <BaseButton
          onPress={() => {
            handleSubmit();
          }}>
          Sign Up With Other Account
        </BaseButton>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 63,
        }}>
        <TextButton onPress={() => navigation.navigate('SigninHome')}>
          Already Registered?
        </TextButton>
      </View>
    </AuthWrapper>
  );
}
