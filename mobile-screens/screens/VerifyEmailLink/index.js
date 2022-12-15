/* eslint-disable react-native/no-inline-styles */
import React, {useMemo} from 'react';
import {View, Text} from 'react-native';
import {useTheme} from 'theme';
import {BaseButton, AuthHeading, GroupText, GrayBodyText} from 'uin';
import {EmailActivation} from 'assets';
import AuthWrapper from '../../hocs/AuthWrapperWithOrWithoutBackButton';
import useGetCASEmails from '../../reusables/useGetCASEmails';
import useUser from '../../reusables/useUser';
import {useSelector, shallowEqual} from 'react-redux';

export default function ({navigation, route}) {
  const theme = useTheme();

  const user = useUser();
  const email = route?.params?.email;
  console.log('email: ', email);
  const type = route?.params?.type;
  console.log('type: ', type);
  const verificationStatus = route?.params?.verification_status;

  const emails = useGetCASEmails();

  const {isUserLoggedInWithMPIN} = useSelector(
    ({auth}) => ({
      isUserLoggedInWithMPIN: auth.isUserLoggedInWithMPIN,
    }),
    shallowEqual,
  );

  const finalEmailToShow = useMemo(() => {
    return email
      ? email
      : emails && emails?.length > 0
      ? `${emails[0]['cas_emails*email']}`
      : null;
  }, [email, emails]);

  console.log('finalEmailToShow-------: ', finalEmailToShow);
  console.log('mpinStatus', isUserLoggedInWithMPIN);

  const handleSubmit = () => {
    if (type === 'auth_flow' || isUserLoggedInWithMPIN !== true) {
      const mpinStatus = user?.profile?.meta?.mpin_set;
      console.log('mpinStatus', user, mpinStatus);
      if (mpinStatus === true) {
        navigation.replace('PINSetup', {
          screen: 'EnterPINHome',
          params: {
            verificationStatus: verificationStatus,
          },
        });
      } else if (mpinStatus === 'skip') {
        navigation.replace('Protected');
      } else {
        navigation.replace('PINSetup', {
          screen: 'SetPINHome',
          params: {
            verificationStatus: verificationStatus,
          },
        });
      }
    } else {
      navigation.replace('Protected');
      navigation.reset({
        index: 0,
        routes: [{name: 'Auth'}],
      });
    }
  };

  if (finalEmailToShow === null) {
    return (
      <AuthWrapper showBackArrowIcon={navigation.canGoBack()}>
        <View style={{width: '100%', flex: 1, alignItems: 'center'}}>
          <View style={{paddingTop: 20}}>
            <EmailActivation />
          </View>
          <AuthHeading style={{textAlign: 'center', paddingTop: 24}}>
            Something went wrong, Email Not Found. Please add Email.
          </AuthHeading>
          <View style={{width: '100%'}}>
            <BaseButton
              wrapperStyles={{
                marginTop: 24,
                marginBottom: 16,
                height: 48,
              }}
              onPress={() => {
                handleSubmit();
              }}
              bgColor={theme.colors.primaryOrange}
              textColor={theme.colors.primary}>
              Let’s Move Ahead
            </BaseButton>
          </View>
        </View>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper showBackArrowIcon={navigation.canGoBack()}>
      <AuthHeading>Activation Link Sent</AuthHeading>

      <GroupText style={{paddingTop: 24}}>
        <GrayBodyText
          style={{
            fontFamily: theme.fonts.regular,
          }}>
          FinEzzy has sent an email with a activation link to{' '}
        </GrayBodyText>
        <Text
          style={{
            fontWeight: theme.fontWeights.moreBold,
            color: theme.colors.text,
            fontFamily: theme.fonts.medium,
          }}>
          {finalEmailToShow}
        </Text>
        <GrayBodyText>
          . Please click on the link sent to verify your account within 24
          hours.
        </GrayBodyText>
      </GroupText>
      <View style={{alignItems: 'center'}}>
        <View style={{paddingTop: 20}}>
          <EmailActivation />
        </View>

        <GrayBodyText
          style={{
            fontFamily: theme.fonts.regular,
            paddingTop: 22,
          }}>
          Please note, until you won't verify your email id, you will need be
          able to enjoy various benefits
        </GrayBodyText>

        <View style={{paddingTop: 22, width: '100%'}}>
          <BaseButton
            wrapperStyles={{marginBottom: 16, height: 48}}
            onPress={() => {
              handleSubmit();
            }}
            bgColor={theme.colors.primaryOrange}
            textColor={theme.colors.primary}>
            Let’s Move Ahead
          </BaseButton>
        </View>
      </View>
    </AuthWrapper>
  );
}
