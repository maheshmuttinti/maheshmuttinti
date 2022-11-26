import React, {useRef, useEffect} from 'react';
import {View} from 'react-native';
import {DataLoadOrchestrator} from 'utils';
import SkeletonLoader from './SkeletonLoader';
import {getUser} from 'services';
import Data from './Data';
import Empty from './Empty';
import Error from './Error';

export default function ({wrapperStyles = {}, refreshOnScreenFocus}) {
  const orchestratorRef = useRef(null);

  useEffect(() => {
    if (refreshOnScreenFocus === true) {
      orchestratorRef.current.reload();
    }
  }, [refreshOnScreenFocus]);

  const handler = async () => {
    try {
      const user = await getUser();
      if (Object.keys(user).length === 0) {
        return {
          state: 'empty',
          data: user,
        };
      }

      return {
        state: 'data',
        data: user?.profile?.meta?.username,
      };
    } catch (error) {
      return {
        state: 'error',
        data: 'Something went wrong',
      };
    }
  };
  return (
    <View style={{...wrapperStyles}}>
      <DataLoadOrchestrator
        handler={handler}
        ref={orchestratorRef}
        components={{
          data: React.forwardRef((props, ref) => <Data ref={ref} {...props} />),
          loading: React.forwardRef((props, ref) => (
            <View ref={ref}>
              <SkeletonLoader {...props} />
            </View>
          )),
          empty: Empty,
          error: Error,
        }}
      />
    </View>
  );
}
