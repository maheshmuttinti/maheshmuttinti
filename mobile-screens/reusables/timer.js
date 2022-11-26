import React from 'react';
import {useState, useEffect} from 'react';
import {Text} from 'react-native';
import {useTheme} from 'theme';

const Timer = ({
  initialMinute = 0,
  initialSeconds = 10,
  setEnableResendOtp = false,
  afterDone = () => {},
  active = true,
}) => {
  const [minutes, setMinutes] = useState(initialMinute);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [done, setDone] = useState(false);
  const theme = useTheme();
  useEffect(() => {
    if (active) {
      setMinutes(initialMinute);
      setSeconds(initialSeconds);
    }
  }, [active]);

  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
        if (seconds - 1 === 1) {
          console.log('set enable otp true?');
          setEnableResendOtp(true);
        }
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
          afterDone();
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <Text
      style={{
        ...theme.fontSizes.small,
        color: theme.colors.text,
        fontFamily: theme.fonts.bold,
      }}>
      {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </Text>
  );
};

export default Timer;
