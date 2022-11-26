/* eslint-disable react-native/no-inline-styles */
import {RadioCircleFill, RecheckPortfolio} from 'assets';
import * as React from 'react';
import {useState, useCallback, useRef} from 'react';
import {View} from 'react-native';
import {
  createVideoKycRequest,
  getFilesById,
  getLoanApplicationById,
  updateApplication,
  videoKYCStatus,
} from 'services';
import {useTheme} from 'theme';
import {BaseButton, Heading} from 'uin';
import Loader from '../../../reusables/loader';
import {openBrowser, prettifyJSON, showToast, sleep} from 'utils';
import {useFocusEffect} from '@react-navigation/native';
import Config from 'react-native-config';

const VideoVerification = ({applicationId, setStep, currentStep}) => {
  const theme = useTheme();
  const [isVideoVerificationCompleted, setVideoVerificationCompleted] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [applicationData, setApplicationData] = useState({});
  const getLoanApplicationData = useRef(() => {});
  const checkVideoVerificationCompletion = useRef(() => {});
  const [
    redirectingToVideoVerificationLink,
    setRedirectingToVideoVerificationLink,
  ] = useState(false);

  checkVideoVerificationCompletion.current = async () => {
    if (
      applicationData &&
      applicationData?.loan_application_data &&
      applicationData?.loan_application_data?.video_kyc_token &&
      applicationData?.loan_application_data?.video_kyc_status === 'pending'
    ) {
      setLoading(true);
      await getVideoKycDetails();
    } else if (
      applicationData &&
      applicationData?.loan_application_data &&
      applicationData?.loan_application_data?.video_kyc_token &&
      applicationData?.loan_application_data?.video_kyc_status === 'completed'
    ) {
      setVideoVerificationCompleted(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getLoanApplicationData.current();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      checkVideoVerificationCompletion.current();
    }, [applicationData]),
  );

  const createVideoKycLink = async () => {
    try {
      setRedirectingToVideoVerificationLink(true);
      let photoUrl = '';
      if (
        applicationData?.loan_application_data?.proofs_Upload_via ===
          'digilocker' &&
        applicationData?.loan_application_data?.digilockerData?.photo
      ) {
        photoUrl =
          applicationData?.loan_application_data?.digilockerData?.photo;
      } else if (
        applicationData?.loan_application_data?.proofs_Upload_via ===
          'manually' &&
        applicationData?.loan_application_data?.address_proof_id
      ) {
        const fileResponse = await getFilesById(
          applicationData?.loan_application_data?.address_proof_id,
        );
        photoUrl = fileResponse?.download_url;
      }

      console.log('photoUrl-112233', photoUrl);
      const payload = {
        match_image_url: photoUrl,
      };
      const response = await createVideoKycRequest(payload);
      const loanData = {
        ...applicationData.loan_application_data,
        video_kyc_token: response.token,
        video_kyc_status: 'pending',
      };
      const loanPayload = {loan_application_data: loanData};
      await updateApplication(applicationId, loanPayload);
      // openBrowser(response.videoUrl);
      // const successRedirectUrl = 'finezzy://signzy/video';
      const successRedirectUrl = Config.DIGIO_VIDEO_REDIRECT_URL;
      await openBrowser(response.videoUrl, successRedirectUrl);

      setRedirectingToVideoVerificationLink(false);
    } catch (err) {
      console.log(err);
      setRedirectingToVideoVerificationLink(false);
    }
  };

  const getVideoKycDetails = async () => {
    try {
      await sleep(3000);
      const videoData = await videoKYCStatus(
        applicationData?.loan_application_data?.video_kyc_token,
      );
      console.log('kyc video verification response', prettifyJSON(videoData));

      if (
        videoData?.videoVerification?.faceFound &&
        videoData?.videoVerification?.isAudioProcessed &&
        videoData?.videoVerification?.isVideoProcessed
      ) {
        const loanData = {
          ...applicationData?.loan_application_data,
          video_kyc_status: 'completed',
          video_kyc_data: videoData.videoVerification,
        };
        const loanPayload = {
          loan_application_data: loanData,
          loan_application_step: applicationData?.loan_application_step,
        };
        loanPayload.loan_application_step = 'video_verification';
        await updateApplication(applicationId, loanPayload);
        setVideoVerificationCompleted(true);
        setLoading(false);
      } else {
        setVideoVerificationCompleted(false);
        showToast('Video Verification failed, Please try again.');
        setLoading(false);
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      showToast('Video Verification failed, Please try again.');
      setLoading(false);
    }
  };

  getLoanApplicationData.current = async () => {
    try {
      const application = await getLoanApplicationById(applicationId);
      setApplicationData(application);
    } catch (error) {
      console.log('error while getting the loan application', error);
      return error;
    }
  };

  const handleSubmit = async () => {
    if (!isVideoVerificationCompleted) {
      await createVideoKycLink();
    } else {
      setStep(currentStep + 1);
    }
  };

  return (
    <>
      <Loader
        loading={loading}
        text={'Checking the Video Verification Status...'}
      />

      <Loader
        loading={redirectingToVideoVerificationLink}
        text={'Redirecting to Video Verification Screen...'}
      />
      <View style={{paddingTop: 8}}>
        <View>
          <Heading
            style={{
              color: theme.colors.text,
              fontFamily: theme.fonts.regular,
              ...theme.fontSizes.heading5,
              fontWeight: theme.fontWeights.veryBold,
            }}>
            Video Verification
          </Heading>
          <View style={{paddingTop: 8}}>
            <Heading
              style={{
                color: theme.colors.text,
                ...theme.fontSizes.medium,
                fontWeight: theme.fontWeights.semiBold,
              }}>
              Please read out the OTP displayed on the screen during the
              verification
            </Heading>
          </View>
        </View>
        <View
          style={{
            paddingTop: 40,
          }}>
          <RecheckPortfolio />
        </View>
        {isVideoVerificationCompleted && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 38,
            }}>
            <View>
              <RadioCircleFill />
            </View>
            <Heading
              style={{
                color: theme.colors.success,
                fontWeight: theme.fontWeights.moreBold,
                ...theme.fontSizes.small,
                paddingLeft: 6,
              }}>
              Completed Successfully
            </Heading>
          </View>
        )}
        <View style={{paddingTop: 12, paddingBottom: 100}}>
          <BaseButton
            onPress={async () => {
              await handleSubmit();
            }}>
            {isVideoVerificationCompleted
              ? 'Continue'
              : 'Start Video Verification'}
          </BaseButton>
        </View>
      </View>
    </>
  );
};

export default VideoVerification;
