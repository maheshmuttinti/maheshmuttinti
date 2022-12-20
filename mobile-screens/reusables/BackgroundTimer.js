/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Timer from './timer';
import {useTheme} from 'theme';
import {SubText} from 'uin';

/**
 * @author
 * @function ResendOtpTimer
 **/
const ResendOtpTimer = ({type, callBack = new Promise(), ...props}) => {
  const [timerActive, setTimerActive] = useState(false);
  const theme = useTheme();

  const handleResendOtp = async () => {
    setTimerActive(false);
    try {
      const result = await callBack();
      console.log('handleResendOtp->result: ', result);
      if (result) {
        setTimerActive(true);
      }
    } catch (error) {
      console.log('handleResendOtp', error);
    }
  };

  return (
    <View style={{marginBottom: 25, ...props.wrapperStyles}}>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {!timerActive && (
          <SubText style={{color: theme.colors.bodyGray}}>
            Didn’t receive a code?{' '}
          </SubText>
        )}
        {!timerActive && (
          <TouchableOpacity onPress={() => handleResendOtp()}>
            <SubText
              style={{
                color: theme.colors.primaryOrange800,
                textDecorationLine: 'underline',
              }}>
              Resend Code
            </SubText>
          </TouchableOpacity>
        )}
      </View>
      {timerActive && (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <SubText style={{color: theme.colors.bodyGray}}>
            resend verification code in{' '}
          </SubText>
          <Timer
            initialMinute={1}
            initialSeconds={0}
            setEnableResendOtp={() => {}}
            active={timerActive}
            afterDone={() => {
              setTimerActive(false);
            }}
          />
        </View>
      )}
    </View>
  );
};

export default ResendOtpTimer;
