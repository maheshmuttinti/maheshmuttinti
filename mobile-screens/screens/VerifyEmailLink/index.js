/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import {useTheme} from 'theme';
import {BaseButton, AuthHeading, GroupText, GrayBodyText} from 'uin';
import {EmailActivation} from 'assets';
import AuthWrapper from '../../hocs/AuthWrapper';
import useGetCASEmails from '../../reusables/useGetCASEmails';
import useUser from '../../reusables/useUser';
import {useSelector, shallowEqual} from 'react-redux';

export default function ({navigation, route}) {
  const theme = useTheme();

  const user = useUser();
  const email = route?.params?.email;
  const type = route?.params?.type;
  const verificationStatus = route?.params?.verification_status;

  const emails = useGetCASEmails();

  const {isUserLoggedInWithMPIN} = useSelector(
    ({auth}) => ({
      isUserLoggedInWithMPIN: auth.isUserLoggedInWithMPIN,
    }),
    shallowEqual,
  );

  console.log('mpinStatus', isUserLoggedInWithMPIN);

  return (
    <AuthWrapper>
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
          {email
            ? email
            : emails && emails.length > 0 && `${emails[0]['cas_emails*email']}`}
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
          Please note that, until you verify your email id, you won’t be able to
          make investments.
        </GrayBodyText>

        <View style={{paddingTop: 22, width: '100%'}}>
          <BaseButton
            wrapperStyles={{marginBottom: 16, height: 48}}
            onPress={() => {
              if (type === 'auth_flow' || isUserLoggedInWithMPIN !== true) {
                console.log(
                  'user?.profile?.meta?.mpin_set === true',
                  user,
                  user?.profile?.meta?.mpin_set,
                );
                if (user?.profile?.meta?.mpin_set === true) {
                  navigation.replace('Auth', {
                    screen: 'EnterPINHome',
                    params: {
                      verificationStatus: verificationStatus,
                    },
                  });
                } else {
                  navigation.replace('Auth', {
                    screen: 'SetPINHome',
                    params: {
                      verificationStatus: verificationStatus,
                    },
                  });
                }
              } else {
                navigation.replace('Protected');
              }
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
