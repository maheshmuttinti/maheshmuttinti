import React, {useRef} from 'react';
import {View} from 'react-native';
import {DataLoadOrchestrator} from 'utils';
import SkeletonLoader from './SkeletonLoader';
import {dummyAPI} from 'services';
import Data from './Data';
import Empty from './Empty';
import Error from './Error';

export default function ({wrapperStyles = {}}) {
  const orchestratorRef = useRef(null);

  const handler = async () => {
    try {
      const dashboardLoanAmountResponse = await dummyAPI();
      if (Object.keys(dashboardLoanAmountResponse).length === 0) {
        return {
          state: 'empty',
          data: dashboardLoanAmountResponse,
        };
      }

      return {
        state: 'data',
        data: dashboardLoanAmountResponse,
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
