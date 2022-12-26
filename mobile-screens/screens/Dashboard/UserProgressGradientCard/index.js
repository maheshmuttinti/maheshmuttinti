import React, {useRef} from 'react';
import {View} from 'react-native';
import {DataLoadOrchestrator, sleep} from 'utils';
import SkeletonLoader from './SkeletonLoader';
import {getDashboardPreApprovedLoanAmount} from 'services';
import Data from './Data';
import Empty from './Empty';
import Error from './Error';
import Config from 'react-native-config';

export default function ({
  showModal,
  navigation,
  wrapperStyles = {},
  setShowBannerSpace,
  userStage,
  onUploadNow = () => {},
}) {
  const orchestratorRef = useRef(null);

  const noLoanAmountLimits =
    Config.MOCK_ENVIRONMENT === 'STAGING' ? 'true' : '';

  const handler = async () => {
    try {
      const dashboardLoanAmountResponse =
        await getDashboardPreApprovedLoanAmount(noLoanAmountLimits);
      await sleep(2000);
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
        loading={true}
        components={{
          data: React.forwardRef((props, ref) => (
            <Data
              showModal={showModal}
              navigation={navigation}
              setShowBannerSpace={setShowBannerSpace}
              userStage={userStage}
              onUploadNow={onUploadNow}
              ref={ref}
              {...props}
            />
          )),
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
