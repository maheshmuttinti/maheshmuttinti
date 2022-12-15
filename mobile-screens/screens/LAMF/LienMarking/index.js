/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useEffect, useRef, useCallback} from 'react';
import ScreenWrapper from '../../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import {Heading, Card, BaseButton, LabelValue} from 'uin';
import {Linking, Platform, Text, TouchableOpacity, View} from 'react-native';
import {
  lienMarkingRequest,
  createLoanApplication,
  getLoanApplicationById,
  lienMarkingStatus,
  getDefaultEMIStartDate,
  getEMIStartDate,
  updateApplication,
} from 'services';
import Loader from '../../../reusables/loader';
import useLayoutBackButtonAction from '../../../reusables/useLayoutBackButtonAction';
import {useState} from 'react';
import {EditPencil, InfoIcon} from 'assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUser from '../../../reusables/useUser';
import Config from 'react-native-config';
import {formatDate, openBrowser, prettifyJSON, showToast, sleep} from 'utils';
import EMIDueDatesModal from './EMIDueDatesModal';
import {useFocusEffect} from '@react-navigation/native';

export default function ({navigation, route}) {
  const theme = useTheme();
  const data = route?.params?.data;

  const [loading, setLoading] = useState(false);
  const [EMIScheme, setEMIScheme] = useState(null);
  const [firstEMIDate, setFirstEMIDate] = useState(null);
  const [EMISchemes, setEMISchemes] = useState([]);
  const [lienMarkingStatusCheck, setLienMarkingStatusCheck] = useState(null);
  const [openEMIDueDatesModal, setOpenEMIDueDatesModal] = useState(false);
  const getDefaultEMIDate = useRef(() => {});
  const getFirstEMIDate = useRef(() => {});
  const nbfcCode = data?.nbfc?.nbfc_code;

  const user = useUser();

  useLayoutBackButtonAction();

  getDefaultEMIDate.current = async () => {
    try {
      const emiSchemes = Object.values(data?.nbfc?.emi_schemes?.options).map(
        item => ({...item, label: item?.label?.split('_')?.join(' ')}),
      );
      setEMISchemes(emiSchemes);
      console.log('nbfcCode--', nbfcCode);
      const emiResponse = await getDefaultEMIStartDate(nbfcCode);
      console.log('emiResponse----', emiResponse);
      const emiStartDate = emiResponse?.emi_start_date;
      const emiSchemeLabel = emiResponse?.emi_scheme?.split('_')?.join(' ');
      const emiSchemeValue = emiResponse?.emi_scheme;
      const formattedDate = formatDate(
        new Date(emiStartDate),
        'dM',
        Platform.OS,
      );
      console.log('sdfdfdfgd', {label: emiSchemeLabel, value: emiSchemeValue});
      setEMIScheme({label: emiSchemeLabel, value: emiSchemeValue});
      setFirstEMIDate({formattedDate, emiStartDate});
    } catch (error) {
      console.log('error while getting the default emi start date', error);
      return error;
    }
  };

  getFirstEMIDate.current = async () => {
    try {
      console.log('EMIScheme----', EMIScheme);
      const emiScheme = EMIScheme?.label?.split(' ')?.join('_');
      const payload = {
        emi_scheme: emiScheme,
      };
      const emiStartDateResponse = await getEMIStartDate(nbfcCode, payload);
      const emiStartDate = emiStartDateResponse?.emi_start_date;

      const formattedDate = formatDate(
        new Date(emiStartDate),
        'dM',
        Platform.OS,
      );
      setFirstEMIDate({formattedDate, emiStartDate});
    } catch (error) {
      console.log('error while getting the default emi start date', error);
      return error;
    }
  };

  // ApplicationId is needed in the next step so not clearing it here.
  useFocusEffect(
    useCallback(() => {
      getDefaultEMIDate.current();
      // return () => {
      //   console.log('lien marking screen is dead!');
      //   (async () => {
      //     /* we are doing this so that the value is deleted before we go out of this screen */
      //     await clearApplicationId();
      //   })();
      // };
    }, []),
  );

  useEffect(() => {
    (async () => {
      /* We are calling it here to handle the clearing of applicationId, if the user closes the app in the current screen */
      await clearApplicationId();
    })();
  }, []);

  useEffect(() => {
    getFirstEMIDate.current();
  }, [EMIScheme]);

  const clearApplicationId = async () => {
    try {
      await AsyncStorage.removeItem('applicationId');
      console.log('unset application id completed!');
    } catch (error) {
      throw error;
    }
  };

  const titleStyles = {
    color: theme.colors.text,
    fontFamily: theme.fonts.regular,
    fontWeight: theme.fontWeights.semiBold,
    fontSize: theme.fontSizes.large.fontSize,
    lineHeight: 24,
    flex: 1 / 2,
  };

  const valueStyles = {
    flex: 1 / 2,
    color: theme.colors.text,
    fontWeight: theme.fontWeights.veryBold,
    lineHeight: 24,
    fontSize: theme.fontSizes.large.fontSize,
    textAlign: 'right',
    letterSpacing: 0.15,
  };

  const structurePayload = () => {
    let payload = {
      clientid: data.nbfc.nbfc_code,
      clientname: data.nbfc.nbfc_name,
      pan: data.user.pan_number,
      modeofcomm: 'SHORTURL',
      mobile: user?.attributes
        ?.find(item => item.type === 'mobile_number')
        ?.value?.slice(3),
      emailid: data.email,
    };
    payload.schemedetails = data.schemes.map(item => {
      return {
        amccode: item.amc_code,
        amcname: item.amc_name,
        folio: item.folio,
        isinno: item.isin,
        schemecode: item.scheme_code,
        schemename: item.scheme_name,
        schemetype: '',
        schemecategory: '',
        lienunit: Config?.LIEN_REVOC_MOCK_UNIT
          ? +item.unit_balance > 1
            ? Config?.LIEN_REVOC_MOCK_UNIT
            : item.unit_balance
          : item.unit_balance,
      };
    });
    return payload;
  };

  const getLienMarkingStatus = async applicationId => {
    try {
      const loanApplicationData = await getLoanApplicationById(applicationId);

      console.log(
        'loan application data',
        prettifyJSON(
          loanApplicationData.loan_application_data.lien_marking_data,
        ),
      );

      const lienMarkingData =
        loanApplicationData?.loan_application_data?.lien_marking_data;
      const lienMarkStatusPayload = {
        lienstatus: {
          clientid: lienMarkingData?.clientid,
          clientname: lienMarkingData?.clientname,
          lienrefno: lienMarkingData?.lienrefno,
          pan: lienMarkingData?.pan,
          emailid: lienMarkingData?.emailid,
        },
      };
      console.log(
        'lien marking status payload',
        prettifyJSON(lienMarkStatusPayload),
      );
      const lienMarkStatusResponse = await lienMarkingStatus(
        lienMarkStatusPayload,
      );

      console.log('lienMarkingResponse', prettifyJSON(lienMarkStatusResponse));
      setLienMarkingStatusCheck('status_found');

      const isAllSchemesLienMarked =
        lienMarkStatusResponse?.lienstatus?.schemedetails?.every(scheme => {
          return scheme?.LIEN_STATUS.toUpperCase() === 'SUCCESS';
        });

      console.log('isAllSchemesLienMarked outside', isAllSchemesLienMarked);
      return {isAllSchemesLienMarked, loanApplicationData};
    } catch (error) {
      console.log('lien marking status error', error);
    }
  };

  const handleRedirection = async () => {
    console.log('handleRedirection-called', handleRedirection);
    try {
      setLienMarkingStatusCheck('status_checking');
      const applicationId = await AsyncStorage.getItem('applicationId');

      if (!applicationId) {
        showToast('Application ID not found');
        setLoading(false);
      } else {
        const {isAllSchemesLienMarked, loanApplicationData} =
          await getLienMarkingStatus(applicationId);
        console.log('isAllSchemesLienMarked outside', isAllSchemesLienMarked);

        if (isAllSchemesLienMarked) {
          setLienMarkingStatusCheck('status_success');
          console.log(
            'isAllSchemesLienMarked inside if',
            isAllSchemesLienMarked,
          );

          const loan_application_payload = {
            ...loanApplicationData,
            lien_marking_status: 'success',
            loan_application_data: {
              ...loanApplicationData.loan_application_data,
              lien_marked_date: new Date().toISOString(),
            },
          };

          console.log(
            'loan_application_payload=====>',
            JSON.stringify(loan_application_payload),
          );

          const lienMarkedDataWithLoanApplicationDataResponse =
            await updateApplication(applicationId, loan_application_payload);

          if (lienMarkedDataWithLoanApplicationDataResponse) {
            await sleep(1000);
            setLoading(false);
            navigation.navigate('Protected', {
              screen: 'CAMSSuccess',
            });
          } else {
            setLoading(false);
            showToast('Lien Marking Success Data Saving Failed.');
          }
        } else {
          setLienMarkingStatusCheck('status_failed');
          console.log(
            'isAllSchemesLienMarked inside else',
            isAllSchemesLienMarked,
          );
          const loan_application_payload = {
            ...loanApplicationData,
            lien_marking_status: 'failed',
            loan_application_data: {
              ...loanApplicationData.loan_application_data,
              lien_marked_date: new Date().toISOString(),
            },
          };

          console.log(
            'loan_application_payload success lien payload',
            prettifyJSON(loan_application_payload),
          );

          const lienMarkedDataWithLoanApplicationDataResponse =
            await updateApplication(applicationId, loan_application_payload);

          console.log(
            'final loan Application response after lien marking success',
            prettifyJSON(lienMarkedDataWithLoanApplicationDataResponse),
          );
          setLoading(false);

          showToast('Lien Marking Failed');
        }
      }
    } catch (error) {
      console.log(
        'error in redirecting to correct screen in lien marking step',
        error,
      );
      setLienMarkingStatusCheck('status_failed');
      showToast(`${error.response.data}` || 'Something went wrong');
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const payload = {hybridlieninitiate: structurePayload()};

      const response = await lienMarkingRequest(payload);

      const existingApplicationId = await AsyncStorage.getItem('applicationId');
      console.log('existingApplicationId found', existingApplicationId);

      const emiScheme = EMIScheme?.label?.split(' ')?.join('_');
      console.log('emiScheme on submittttt', emiScheme);
      if (response?.hybridlieninitiate?.status === 'SUCCESS') {
        if (!existingApplicationId) {
          const loan_application_payload = {
            pan: data?.user?.pan_number,
            lien_ref_number: response?.hybridlieninitiate?.lienrefno,
            lien_marking_status: 'pending',
            loan_application_step: 'pending',
            disbursement_status: 'pending',
            schemes: {data: data?.schemes},
            nbfc_data: data?.nbfc,
            loan_application_data: {
              emi_scheme: emiScheme,
              first_emi_date: firstEMIDate?.emiStartDate,
              loan_tenure: +data?.nbfc?.tenure?.trim()?.split(' ')[0] || 6,
              loan_details: {
                amount: data?.pre_approved_loan_amount,
              },
              lien_marking_data: response?.hybridlieninitiate,
            },
          };

          console.log(
            'loan_application_payload====>CREATE',
            JSON.stringify(loan_application_payload),
          );

          const application = await createLoanApplication(
            loan_application_payload,
          );
          await AsyncStorage.setItem('applicationId', application?.uuid);
          const lienMarkingUrl = response?.hybridlieninitiate?.shorturl;
          console.log('lienMarkingURL----', lienMarkingUrl);
          setLoading(false);

          await openBrowser(
            lienMarkingUrl,
            'finezzy://cams/lien-marking?source=mobile',
            handleRedirection,
          );

          setLoading(false);
        } else {
          // when you click on submit again.
          console.log('if else condition', existingApplicationId);
          const loanApplicationData = await getLoanApplicationById(
            existingApplicationId,
          );
          console.log('loanApplicationData', prettifyJSON(loanApplicationData));

          console.log('updating the loan application inside else');
          // if loan agreement number is not present, then create one here.
          const loan_application_payload = {
            ...loanApplicationData,
            lien_marking_status: 'failed',
            loan_application_data: {
              ...loanApplicationData.loan_application_data,
              lien_marked_date: new Date().toISOString(),
            },
            generate_loan_agreement_number: loanApplicationData.agreement_number
              ? false
              : true,
          };

          console.log(
            'loan_application_payload failed lien response',
            prettifyJSON(loan_application_payload),
          );

          const lienMarkedDataWithLoanApplicationDataResponse =
            await updateApplication(
              existingApplicationId,
              loan_application_payload,
            );

          console.log(
            'final loan Application response after lien marking failed-111',
            prettifyJSON(lienMarkedDataWithLoanApplicationDataResponse),
          );
          const lienMarkingUrl =
            lienMarkedDataWithLoanApplicationDataResponse?.loan_application_data
              ?.lien_marking_data?.shorturl;

          console.log('lienMarkUrl in else', lienMarkingUrl);
          await openBrowser(
            lienMarkingUrl,
            'finezzy://cams/lien-marking?source=mobile',
            handleRedirection,
          );
          setLoading(false);
        }
      } else {
        showToast('Lien Marking Failed');
        setLoading(false);
      }
    } catch (error) {
      console.log('error in onsubmit', error);
      showToast('Lien Marking Failed. Please try again');
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Loader
        loading={loading}
        text={
          Platform.OS === 'ios'
            ? 'You are being redirected to official CAMS Page. Please do not refresh the page. Once you have completed all steps, Please click on the close icon to come back to the app'
            : 'You are being redirected to official CAMS Page. Please do not refresh the page.'
        }
      />

      <Loader
        loading={lienMarkingStatusCheck === 'status_checking'}
        text={'Checking the lien marking status...'}
      />

      <EMIDueDatesModal
        visible={openEMIDueDatesModal}
        setVisible={setOpenEMIDueDatesModal}
        onSelectEMIDueDate={v => {
          console.log('selected value', v);
          setEMIScheme(v);
        }}
        defaultEMIScheme={EMIScheme}
        emiSchemes={EMISchemes}
        firstEMIDate={firstEMIDate?.formattedDate}
      />

      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 32,
        }}>
        <Card
          style={{
            backgroundColor: theme.colors.backgroundYellow,
            padding: 16,
          }}>
          <Heading
            style={{
              color: theme.colors.primaryBlue,
              ...theme.fontSizes.largeMedium,
              fontWeight: theme.fontWeights.veryBold,
            }}>
            DETAILS
          </Heading>

          <View style={{paddingTop: 8}}>
            <LabelValue
              style={{
                paddingBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              titleStyle={{...titleStyles}}
              valueStyle={{
                flex: 1 / 2,
                color: theme.colors.text,
                fontWeight: theme.fontWeights.lightBold,
                lineHeight: 18.3,
                fontSize: theme.fontSizes.medium.fontSize,
                textAlign: 'right',
              }}
              title="NBFC"
              value={`${
                data?.nbfc?.nbfc_name
                  ? data?.nbfc?.nbfc_name
                  : 'Eclear Leasing & Finance Private Limited'
              }`}
            />

            <LabelValue
              style={{
                paddingBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              titleStyle={{...titleStyles}}
              valueStyle={{
                ...valueStyles,
              }}
              title="Loan Approved"
              value={`₹${
                data?.pre_approved_loan_amount
                  ? data?.pre_approved_loan_amount
                  : '0'
              }`}
            />

            <LabelValue
              style={{
                paddingBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              titleStyle={{...titleStyles}}
              valueStyle={{
                ...valueStyles,
              }}
              title="Loan Type"
              value={'EMI Loan'}
            />

            <LabelValue
              style={{
                paddingBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              titleStyle={{...titleStyles}}
              valueStyle={{
                ...valueStyles,
              }}
              title="Tenure"
              value={`${
                data?.nbfc?.tenure ? data?.nbfc?.tenure : ' 36 Months'
              }`}
            />

            <LabelValue
              style={{
                paddingBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              titleStyle={{...titleStyles}}
              valueStyle={{
                ...valueStyles,
              }}
              title="ROI"
              value={`${data?.nbfc?.roi ? data?.nbfc?.roi : '10'}%`}
            />

            <LabelValue
              style={{
                paddingBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              titleStyle={{...titleStyles}}
              valueStyle={{
                ...valueStyles,
              }}
              title="Processing Fee"
              value={
                <>
                  <Text
                    style={{
                      textDecorationLine: 'line-through',
                      color: theme.colors.greyscale750,
                      fontWeight: theme.fontWeights.lightBold,
                    }}>
                    {'₹1699'}
                  </Text>
                  <Text>
                    {`   ₹${
                      data?.nbfc?.processing_fee
                        ? data?.nbfc?.processing_fee
                        : '1499'
                    }`}
                  </Text>
                </>
              }
            />

            <LabelValue
              style={{
                paddingBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              titleStyle={{...titleStyles}}
              valueStyle={{
                ...valueStyles,
              }}
              title="1st EMI Date"
              value={firstEMIDate?.formattedDate}
            />

            <LabelValue
              style={{
                paddingBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginRight: 12,
              }}
              titleStyle={{...titleStyles}}
              valueStyle={{
                flex: 1 / 2,
              }}
              title="EMI Due Date"
              value={
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <TouchableOpacity
                    onPress={() => setOpenEMIDueDatesModal(true)}>
                    <EditPencil />
                  </TouchableOpacity>
                  <Heading
                    style={{
                      marginLeft: 4,
                      color: theme.colors.text,
                      fontWeight: theme.fontWeights.veryBold,
                      ...theme.fontSizes.large,
                    }}>
                    {EMIScheme?.label}
                  </Heading>
                </View>
              }
            />

            <LabelValue
              style={{
                paddingBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              titleStyle={{...titleStyles}}
              valueStyle={{
                ...valueStyles,
              }}
              title="Tentative EMI Amount"
              value={`${
                data?.nbfc?.tentative_emi_amount
                  ? data?.nbfc?.tentative_emi_amount
                  : '₹0'
              }`}
            />
          </View>
        </Card>

        <View
          style={{
            paddingTop: 24,
            paddingBottom: 60,
          }}>
          <Text
            style={{
              color: theme.colors.text,
              ...theme.fontSizes.medium,
            }}>
            Please note that for KYC, you will be required to perform an e-sign
            for which your mobile should be linked with Aadhaar. In it’s
            absence, we will not be able to complete the KYC and Loan Process.
          </Text>
        </View>
        <View style={{paddingTop: 16, paddingHorizontal: 1}}>
          <Card
            style={{
              backgroundColor: theme.colors.primaryBlue100,
              paddingRight: 34,
              paddingLeft: 18.25,
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View>
              <InfoIcon fill={theme.colors.background} />
            </View>
            <Heading
              style={{
                ...theme.fontSizes.small,
                fontFamily: theme.fonts.regular,
                paddingLeft: 17.25,
              }}>
              Please Note that you will be redirected to CAMS Page
            </Heading>
          </Card>
        </View>
        <View
          style={{
            paddingTop: 16,
            paddingHorizontal: 8,
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <View>
            <Text
              style={{
                color: theme.colors.greyscale600,
                ...theme.fontSizes.small,
                fontFamily: theme.fonts.regular,
              }}>
              By clicking the agree to all the{' '}
              <Text style={{color: theme.colors.primaryOrange}}>Submit</Text>{' '}
              button, you{' '}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              Linking.openURL(`${Config.FINEZZY_TERMS_AND_CONDITIONS_URL}`);
            }}>
            <Text
              style={{
                color: theme.colors.primaryBlue,
                textDecorationLine: 'underline',
                fontFamily: theme.fonts.regular,
                lineHeight: 64,
                ...theme.fontSizes.small,
              }}>
              terms and conditions
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{paddingTop: 16, paddingHorizontal: 8}}>
          <BaseButton
            onPress={async () => {
              await onSubmit();
            }}>
            Submit
          </BaseButton>
        </View>
      </View>
    </ScreenWrapper>
  );
}
