/* eslint-disable react-native/no-inline-styles */
import React, {useMemo} from 'react';
import {View} from 'react-native';
import {dummySchemesData} from './data/dummySchemesData';
import {SchemeCard} from './SchemeCard';

export const SchemesList = ({schemes = []}) => {
  const memorizedSchemes = useMemo(
    () => (schemes?.length > 0 ? schemes : dummySchemesData),
    [schemes],
  );
  //   console.log('SchemesList->memorizedSchemes: ', memorizedSchemes);
  return (
    <>
      {memorizedSchemes?.length > 0 &&
        memorizedSchemes?.map((scheme, index) => (
          <View key={`scheme-card-${index}`} style={{width: '100%'}}>
            <SchemeCard scheme={scheme} />
          </View>
        ))}
    </>
  );
};
