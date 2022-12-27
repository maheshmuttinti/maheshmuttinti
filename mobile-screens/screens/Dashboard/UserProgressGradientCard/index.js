import React, {useRef} from 'react';
import {View} from 'react-native';
import {DataLoadOrchestrator, debugLog, prettifyJSON, sleep} from 'utils';
import SkeletonLoader from './SkeletonLoader';
import Data from './Data';
import Empty from './Empty';
import Error from './Error';

export default function ({
  showModal,
  navigation,
  wrapperStyles = {},
  setShowBannerSpace,
  userStageCardContent,
  onUploadNow = () => {},
  onApplyNow = () => {},
}) {
  const orchestratorRef = useRef(null);

  const handler = async () => {
    try {
      const apiResponse = userStageCardContent;
      await sleep(2000);
      if (Object.keys(apiResponse).length === 0) {
        return {
          state: 'empty',
          data: apiResponse,
        };
      }

      return {
        state: 'data',
        data: apiResponse,
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
              userStageCardContent={userStageCardContent}
              onUploadNow={onUploadNow}
              onApplyNow={onApplyNow}
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
