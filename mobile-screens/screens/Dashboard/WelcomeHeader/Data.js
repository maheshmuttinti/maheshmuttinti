import React from 'react';
import {BaseHeading} from 'uin';
import {useTheme} from 'theme';

export default function ({...props}) {
  const theme = useTheme();
  return (
    <BaseHeading
      style={{
        ...theme.fontSizes.heading4,
        fontFamily: theme.fonts.bold,
        fontWeight: theme.fontWeights.veryBold,
        color: theme.colors.text,
      }}>
      Welcome {props?.response?.data || ''}!
    </BaseHeading>
  );
}
