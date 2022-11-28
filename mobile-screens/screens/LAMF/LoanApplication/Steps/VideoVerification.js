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
import {openBrowser, prettifyJSON, sleep} from 'utils';
import {useFocusEffect} from '@react-navigation/native';
import Config from 'react-native-config';
import {WarningCard} from '../components/WarningCard';

const VideoVerification = ({applicationId, setStep, currentStep}) => {
  const theme = useTheme();
  const [isVideoVerificationCompleted, setVideoVerificationCompleted] =
    useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [applicationData, setApplicationData] = useState({});
  const getLoanApplicationData = useRef(() => {});
  const checkVideoVerificationCompletion = useRef(() => {});
  const [redirectingToVideoVerification, setRedirectingToVideoVerification] =
    useState(false);
  const [videoVerificationStatusMessage, setVideoVerificationStatusMessage] =
    useState(null);

  const getVideoKycDetails = async application => {
    try {
      setVideoVerificationStatusMessage(null);
      const videoKYCToken = application?.loan_application_data?.video_kyc_token;
      setCheckingStatus(true);
      await sleep(6000);
      if (!videoKYCToken) {
        setCheckingStatus(false);
        return;
      }
      const videoVerificationResponse = await videoKYCStatus(
        application?.loan_application_data?.video_kyc_token,
      );
      console.log(
        'kyc video verification response',
        prettifyJSON(videoVerificationResponse),
      );
      if (videoVerificationResponse?.error?.message) {
        setCheckingStatus(false);
        setVideoVerificationStatusMessage(
          videoVerificationResponse?.error?.message,
        );
        return;
      }

      if (
        videoVerificationResponse?.videoVerification?.faceFound &&
        videoVerificationResponse?.videoVerification?.isAudioProcessed &&
        videoVerificationResponse?.videoVerification?.isVideoProcessed
      ) {
        const loanData = {
          ...application?.loan_application_data,
          video_kyc_status: 'completed',
          video_kyc_data: videoVerificationResponse.videoVerification,
        };
        const loanPayload = {
          loan_application_data: loanData,
          loan_application_step: application?.loan_application_step,
        };
        loanPayload.loan_application_step = 'video_verification';
        await updateApplication(applicationId, loanPayload);
        setVideoVerificationCompleted(true);
        setCheckingStatus(false);
      } else {
        setVideoVerificationCompleted(false);
        setVideoVerificationStatusMessage(
          'Video Verification failed, Please try again.',
        );
        setCheckingStatus(false);
      }
      setCheckingStatus(false);
    } catch (err) {
      setCheckingStatus(false);
      setVideoVerificationStatusMessage(
        'Video Verification failed, Please try again.',
      );
    }
  };

  getLoanApplicationData.current = async () => {
    try {
      const application = await getLoanApplicationById(applicationId);
      setApplicationData(application);
      if (application?.loan_application_data?.video_kyc_status === 'pending') {
        await getVideoKycDetails(application);
      } else if (
        application?.loan_application_data?.video_kyc_status === 'completed'
      ) {
        setVideoVerificationCompleted(true);
      }
    } catch (error) {
      console.log('error while getting the loan application', error);
      return error;
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
    }, []),
  );

  const createVideoKycLink = async () => {
    try {
      setRedirectingToVideoVerification(true);
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
      const successRedirectUrl = Config.DIGIO_VIDEO_REDIRECT_URL;
      await openBrowser(response.videoUrl, successRedirectUrl);

      setRedirectingToVideoVerification(false);
    } catch (err) {
      setRedirectingToVideoVerification(false);
    }
  };

  const handleSubmit = async () => {
    setVideoVerificationStatusMessage(null);
    if (!isVideoVerificationCompleted) {
      await createVideoKycLink();
    } else {
      setStep(currentStep + 1);
    }
  };

  return (
    <View style={{flex: 1}}>
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
          {checkingStatus === true && (
            <View style={{marginTop: 16}}>
              <WarningCard
                message={
                  'Please Wait, Checking the Video Verification Status...'
                }
              />
            </View>
          )}
          {videoVerificationStatusMessage && (
            <View style={{marginTop: 16}}>
              <WarningCard message={videoVerificationStatusMessage} />
            </View>
          )}
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
        <View style={{paddingTop: 12}}>
          <BaseButton
            onPress={async () => {
              await handleSubmit();
            }}
            textStyles={redirectingToVideoVerification && {fontSize: 12}}
            disable={
              checkingStatus === true || redirectingToVideoVerification === true
            }>
            {redirectingToVideoVerification === true
              ? 'You are being redirected to Video Verification...'
              : isVideoVerificationCompleted
              ? 'Continue To Next Step'
              : 'Start Video Verification'}
          </BaseButton>
        </View>
      </View>
    </View>
  );
};

export default VideoVerification;
