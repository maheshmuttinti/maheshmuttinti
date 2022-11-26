/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {Platform, View} from 'react-native';
import {useTheme} from 'theme';
import {Heading, Card, GradientCard, OutlinedButton, BaseButton} from 'uin';
import {
  digiLockerRequest,
  digiLockerStatus,
  getLoanApplicationById,
  updateApplication,
} from 'services';
import {
  Digilocker,
  LineIcon,
  FileIcon,
  CameraIcon,
  RadioCircleFill,
} from 'assets';
import Loader from '../../../reusables/loader';
import useBetaForm from '@reusejs/react-form-hook';
import SingleImageUpload from '../../../mobile-scope-components/FileUpload/singleImageUpload';
import {prettifyJSON, showToast} from 'utils';

const UploadProof = ({navigation, applicationId, setStep, currentStep}) => {
  const theme = useTheme();
  const [redirecting, setRedirecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applicationData, setApplicationData] = useState({});
  const [digilockerUploadSuccess, setDigilockerUploadSuccess] = useState(false);
  const [manualUploadSuccess, setManualUploadSuccess] = useState(false);
  const [redirectingToDigilockerStatus, setRedirectingToDigilockerStatus] =
    useState(false);

  const form = useBetaForm({
    proofs_Upload_via: '',
    digilocker_req_id: '',
    digilockerData: '',
    proof_upload_status: '',
    pan_card_id: '',
    address_proof_id: '',
  });

  useEffect(() => {
    (async () => {
      await getLoanApplicationData();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (
        applicationData.loan_application_data &&
        applicationData.loan_application_data.digilocker_req_id &&
        applicationData.loan_application_data.proofs_Upload_via ===
          'digilocker' &&
        applicationData.loan_application_data.digilockerData
      ) {
        setDigilockerUploadSuccess(true);
        setLoading(false);
      } else if (
        applicationData.loan_application_data &&
        applicationData.loan_application_data.digilocker_req_id
      ) {
        setLoading(true);
        if (!redirecting) {
          await checkDigilockerStatus(
            applicationData.loan_application_data.digilocker_req_id,
          );
        }
        setLoading(false);
      }
    })();
  }, [applicationData]);

  useEffect(() => {
    if (applicationData.loan_application_data) {
      const details = applicationData.loan_application_data;
      form.setField('proofs_Upload_via', details.proofs_Upload_via);
      form.setField('digilocker_req_id', details.digilocker_req_id);
      form.setField('digilockerData', details.digilockerData);
      form.setField(
        'pan_card_id',
        details.pan_card_id ? details.pan_card_id : '',
      );
      form.setField(
        'address_proof_id',
        details.address_proof_id ? details.address_proof_id : '',
      );
    }
  }, [applicationData]);

  const createDigilockerLink = async () => {
    try {
      setRedirectingToDigilockerStatus(true);
      const response = await digiLockerRequest();
      setRedirecting(true);
      const applicationPayload = {
        loan_application_data: {
          ...applicationData.loan_application_data,
          proofs_Upload_via: 'digilocker',
          digilocker_req_id: response.requestId,
        },
      };
      setRedirectingToDigilockerStatus(false);

      await updateApplication(applicationId, applicationPayload);
      navigation.navigate('WebBrowser', {
        uri: response.url,
        applicationId,
      });
    } catch (err) {
      setRedirectingToDigilockerStatus(false);

      console.log(err);
    }
  };

  const checkDigilockerStatus = async id => {
    try {
      const details = await digiLockerStatus(id);
      console.log('details of digilocker', prettifyJSON(details));
      if (details.userDetails && details.files) {
        const loanData = {
          ...applicationData?.loan_application_data,
          proofs_Upload_via: 'digilocker',
          digilockerData: details,
          proof_upload_status: 'success',
        };
        const loanPayload = {
          loan_application_data: loanData,
          loan_application_step: applicationData?.loan_application_step,
        };
        loanPayload.loan_application_step = 'upload_proof';
        await updateApplication(applicationId, loanPayload);
        setLoading(false);
        setDigilockerUploadSuccess(true);
        setRedirecting(false);
      } else {
        setLoading(false);
        showToast('Error in Document Fetching');
      }
    } catch (err) {
      setLoading(false);
      showToast(`Error: ${JSON.stringify(err.response.data)}`);
    }
  };

  const getLoanApplicationData = async () => {
    const application = await getLoanApplicationById(applicationId);
    setApplicationData(application);
  };
  console.log('manual upload sucess', manualUploadSuccess);
  console.log('digilocker upload sucess', digilockerUploadSuccess);

  useEffect(() => {
    if (form?.value?.pan_card_id && form?.value?.address_proof_id) {
      console.log('manual upload success true');
      setManualUploadSuccess(true);
    }
  }, [form?.value?.pan_card_id, form?.value?.address_proof_id]);

  const handleSubmit = async () => {
    if (
      form.value.proofs_Upload_via === 'digilocker' &&
      digilockerUploadSuccess
    ) {
      setStep(currentStep + 1);
    } else if (
      form?.value?.pan_card_id?.length > 0 &&
      form?.value?.address_proof_id?.length > 0
    ) {
      form.setField('proofs_Upload_via', 'manually');
      form.setField('proof_upload_status', 'success');
      const uploadData = {
        ...applicationData?.loan_application_data,
        ...form.value,
      };
      const loanPayload = {
        loan_application_data: uploadData,
        loan_application_step: applicationData?.loan_application_step,
      };
      loanPayload.loan_application_step = 'upload_proof';
      await updateApplication(applicationId, loanPayload);
      setStep(currentStep + 1);
    } else {
      showToast('Please upload your identity and address proof');
    }
  };
  return (
    <>
      <Loader loading={loading} text="" />
      <Loader
        loading={redirectingToDigilockerStatus}
        text="You are being redirected to Digilocker screen"
      />

      <View style={{paddingTop: 8}}>
        <Heading
          style={{
            color: theme.colors.text,
            fontFamily: theme.fonts.regular,
            ...theme.fontSizes.heading5,
            fontWeight: theme.fontWeights.veryBold,
          }}>
          Identity and Address Proof
        </Heading>
        <View style={{paddingTop: 24}}>
          <GradientCard
            gradientColors={['#FFE500', '#FFE580']}
            style={{
              backgroundColor: theme.colors.primaryYellow,
              borderRadius: 12,
            }}>
            <View
              style={{
                paddingTop: 12,
                paddingLeft: 16,
                position: 'relative',
              }}>
              <View style={{zIndex: 2, width: '50%'}}>
                <Heading
                  style={{
                    ...theme.fontSizes.xlarge,
                    color: theme.colors.text,
                    fontWeight: theme.fontWeights.veryBold,
                  }}>
                  Fetch Aadhar and PAN card from Digilocker
                </Heading>
                <View
                  style={{
                    paddingTop: 8,
                    paddingBottom: 12,
                  }}>
                  <OutlinedButton
                    extraStyles={{
                      backgroundColor: theme.colors.black,
                      paddingHorizontal: 19.85,
                      paddingVertical: 5,
                    }}
                    onPress={() => {
                      if (!manualUploadSuccess) {
                        createDigilockerLink();
                      }
                    }}
                    style={{borderWidth: 2}}
                    outlineColor="black"
                    textColor={theme.colors.primary}
                    textStyles={{
                      color: theme.colors.primary,
                      ...theme.fontSizes.medium,
                    }}>
                    Click Here
                  </OutlinedButton>
                </View>
              </View>
              <View
                style={{
                  position: 'absolute',
                  right: 9,
                  bottom: 0,
                  zIndex: 0,
                }}>
                <Digilocker />
              </View>
            </View>
          </GradientCard>
        </View>

        <View style={{paddingTop: 16, paddingRight: 24}}>
          <Heading
            style={{
              color: theme.colors.text,
              ...theme.fontSizes.small,
              fontWeight: theme.fontWeights.lightBold,
            }}>
            You may fetch the documents if your mobile is linked to Aadhar.{' '}
          </Heading>
        </View>
        {digilockerUploadSuccess && !manualUploadSuccess && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 21.19,
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
              Uploaded Successfully
            </Heading>
          </View>
        )}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop: 8,
            height: 49,
            overflow: 'hidden',
          }}>
          <LineIcon width={80} />
          <Heading
            style={{
              color: theme.colors.greyscale400,
              fontWeight: theme.fontWeights.moreBold,
              fontFamily: theme.fonts.regular,
              paddingHorizontal: 10,
            }}>
            Or else, please upload
          </Heading>
          <LineIcon width={80} />
        </View>
        <View style={{paddingTop: 16}}>
          <Heading
            style={{
              ...theme.fontSizes.medium,
              fontFamily: theme.fonts.regular,
              fontWeight: theme.fontWeights.semiBold,
              color: theme.colors.text,
            }}>
            Acceptable formats are jpeg, Jpg, png or pdf format
          </Heading>
        </View>
        <View style={{paddingTop: 26}}>
          <Heading
            style={{
              color: theme.colors.primaryBlue,
              ...theme.fontSizes.small,
              fontWeight: theme.fontWeights.lightBold,
            }}>
            PAN CARD
          </Heading>
          <View
            style={{
              paddingTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flex: 1 / 2}}>
              <SingleImageUpload
                disable={manualUploadSuccess || digilockerUploadSuccess}
                type="local"
                title={'Add Logo / profile picuture'}
                fileUuid={form?.value?.pan_card_id}
                onFileUploadDone={files => {
                  if (Platform.OS === 'ios') {
                    if (files.length > 0) {
                      form.setField('pan_card_id', files[0]?.uuid);
                    } else {
                      console.log('Something went wrong, no uploaded files');
                    }
                  } else {
                    if (files.length > 0) {
                      form.setField('pan_card_id', files[1]?.uuid);
                    } else {
                      console.log('Something went wrong, no uploaded files');
                    }
                  }
                }}>
                <Card style={{backgroundColor: theme.colors.backgroundYellow}}>
                  <View
                    style={{
                      paddingVertical: 32,
                      alignItems: 'center',
                    }}>
                    <FileIcon />
                    <Heading style={{color: theme.colors.text, paddingTop: 8}}>
                      From Files
                    </Heading>
                  </View>
                </Card>
              </SingleImageUpload>
            </View>
            <View style={{flex: 1 / 2, paddingLeft: 16}}>
              <SingleImageUpload
                disable={manualUploadSuccess || digilockerUploadSuccess}
                type="camera"
                title={'Add Logo / profile picuture'}
                fileUuid={form?.value?.pan_card_id}
                onFileUploadDone={files => {
                  if (files && files[0] && files[0]?.uuid) {
                    form.setField('pan_card_id', files[0]?.uuid);
                  } else {
                    console.log('Something went wrong, no uploaded files');
                  }
                }}>
                <Card style={{backgroundColor: theme.colors.backgroundYellow}}>
                  <View
                    style={{
                      paddingVertical: 32,
                      alignItems: 'center',
                    }}>
                    <CameraIcon />
                    <Heading style={{color: theme.colors.text, paddingTop: 8}}>
                      Camera
                    </Heading>
                  </View>
                </Card>
              </SingleImageUpload>
            </View>
          </View>
        </View>
        {form.value && form?.value?.pan_card_id?.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
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
              Uploaded Successfully
            </Heading>
          </View>
        )}
        <View style={{marginTop: 20}}>
          <Heading
            style={{
              color: theme.colors.primaryBlue,
              ...theme.fontSizes.small,
              fontWeight: theme.fontWeights.lightBold,
            }}>
            ADDRESS PROOF
          </Heading>
          <View style={{paddingTop: 8}}>
            <Heading
              style={{color: theme.colors.text, ...theme.fontSizes.small}}>
              Please upload any one of the documents - Aadhar, Driving License,
              Passport, Voter's ID.
            </Heading>
          </View>
          <View
            style={{
              paddingTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flex: 1 / 2}}>
              <SingleImageUpload
                disable={manualUploadSuccess || digilockerUploadSuccess}
                type="local"
                title={'Add Logo / profile picuture'}
                fileUuid={form?.value?.address_proof_id}
                onFileUploadDone={files => {
                  if (Platform.OS === 'ios') {
                    if (files.length > 0) {
                      form.setField('address_proof_id', files[0]?.uuid);
                    } else {
                      console.log('Something went wrong, no uploaded files');
                    }
                  } else {
                    if (files.length > 0) {
                      form.setField('address_proof_id', files[1]?.uuid);
                    } else {
                      console.log('Something went wrong, no uploaded files');
                    }
                  }
                }}>
                <Card style={{backgroundColor: theme.colors.backgroundYellow}}>
                  <View
                    style={{
                      paddingVertical: 32,
                      alignItems: 'center',
                    }}>
                    <FileIcon />
                    <Heading style={{color: theme.colors.text, paddingTop: 8}}>
                      From Files
                    </Heading>
                  </View>
                </Card>
              </SingleImageUpload>
            </View>
            <View style={{flex: 1 / 2, paddingLeft: 16}}>
              <SingleImageUpload
                disable={manualUploadSuccess || digilockerUploadSuccess}
                type="camera"
                title={'Add Logo / profile picuture'}
                fileUuid={form?.value?.address_proof_id}
                onFileUploadDone={files => {
                  if (files[0] && files[0]?.uuid) {
                    form.setField('address_proof_id', files[0]?.uuid);
                  } else {
                    console.log('Something went wrong, no uploaded files');
                  }
                }}>
                <Card style={{backgroundColor: theme.colors.backgroundYellow}}>
                  <View
                    style={{
                      paddingVertical: 32,
                      alignItems: 'center',
                    }}>
                    <CameraIcon />
                    <Heading style={{color: theme.colors.text, paddingTop: 8}}>
                      Camera
                    </Heading>
                  </View>
                </Card>
              </SingleImageUpload>
            </View>
          </View>
          {form.value && form?.value?.address_proof_id?.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
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
                Uploaded Successfully
              </Heading>
            </View>
          )}
        </View>
        <View style={{paddingTop: 39, paddingBottom: 24}}>
          <BaseButton
            disable={!digilockerUploadSuccess && !manualUploadSuccess}
            onPress={() => {
              handleSubmit();
            }}>
            Continue To Next Step
          </BaseButton>
        </View>
      </View>
    </>
  );
};

export default UploadProof;
