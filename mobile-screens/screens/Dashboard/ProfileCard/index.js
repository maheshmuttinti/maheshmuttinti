import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {DataLoadOrchestrator} from 'utils';
import SkeletonLoader from './SkeletonLoader';
import {getUserPortfolios} from 'services';
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
      const portfolios = await getUserPortfolios();
      if (Object.keys(portfolios).length === 0) {
        return {
          state: 'empty',
          data: portfolios,
        };
      }

      return {
        state: 'data',
        data: portfolios,
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
