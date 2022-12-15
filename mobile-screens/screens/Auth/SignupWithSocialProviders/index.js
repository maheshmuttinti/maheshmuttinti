/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useState} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import {
  GrayBodyText,
  AuthHeading,
  BaseButton,
  SubText,
  TextButton,
  GroupText,
  GoogleAppleButton,
  GoogleButton,
} from 'uin';
import {useTheme} from 'theme';
import AuthWrapper from '../../../hocs/AuthWrapperWithOrWithoutBackButton';
import {TermsAndConditionsModal} from '../../../reusables/TermsAndConditionsModal';
import {Separator} from 'assets';
import Config from 'react-native-config';
import {useSocialLoginsHandler} from '../../../reusables/useSocialLoginsHandler';

export default function SignupOptionsScreen({navigation}) {
  const theme = useTheme();
  const [openTCModal, setOpenTCModal] = useState(false);

  const {handleAppleLogin, handleGoogleLogin} = useSocialLoginsHandler();

  const handleSubmit = () => {
    navigation.navigate('Auth', {screen: 'SignupWithEmailAndPhoneNumber'});
  };

  return (
    <AuthWrapper showBackArrowIcon={navigation.canGoBack()}>
      <TermsAndConditionsModal
        open={openTCModal}
        setOpen={setOpenTCModal}
        onClose={() => setOpenTCModal(false)}
      />
      <AuthHeading>Enhance your Financial Well-Being!</AuthHeading>

      <View style={{paddingTop: 18}}>
        <GrayBodyText>
          Join in with your e-mail linked to Investments for Analysis, Insights
          and More...
        </GrayBodyText>
      </View>

      {Platform.OS === 'android' &&
      Config.ENABLE_APPLE_LOGIN_FOR_ANDROID === 'true' ? (
        <GoogleAppleButton
          type="column"
          onGoogleLogin={() => handleGoogleLogin()}
          onAppleLogin={() => handleAppleLogin()}
        />
      ) : (
        Platform.OS === 'android' && (
          <View style={{paddingTop: 24}}>
            <GoogleButton
              isSingleButton={true}
              onPress={() => handleGoogleLogin()}>
              Continue with Google
            </GoogleButton>
          </View>
        )
      )}

      {Platform.OS === 'ios' && (
        <GoogleAppleButton
          type="column"
          onGoogleLogin={() => handleGoogleLogin()}
          onAppleLogin={() => handleAppleLogin()}
        />
      )}
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
            By clicking Continue you{' '}
          </SubText>

          <SubText style={{color: theme.colors.primaryOrange800}}>
            Sign Up{' '}
          </SubText>

          <SubText style={{color: theme.colors.bodyGray}}>
            automatically and agree to the{' '}
          </SubText>
        </View>
        <TouchableOpacity
          onPress={() => {
            setOpenTCModal(true);
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
          or continue
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
