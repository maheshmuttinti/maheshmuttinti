/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef} from 'react';
import {Text, View, Keyboard} from 'react-native';
import {useTheme} from 'theme';
import {Card, Heading, BaseTextInput, BaseButton, Select} from 'uin';
import {getEligiblePANs} from 'services';
import {filterOptions} from 'utils';
import Modal from 'react-native-modal';
import {TickCircle, UserSmall, WarningIcon1} from 'assets';
import {useDispatch} from 'react-redux';
import {setSelectPAN} from 'store';
import Config from 'react-native-config';

export default function ({
  visible,
  setVisible,
  dashboardLoanAmount,
  navigation,
}) {
  const noLoanAmountLimits =
    Config.MOCK_ENVIRONMENT === 'STAGING' ? 'true' : '';
  const dispatch = useDispatch();
  const theme = useTheme();
  const [eligiblePANs, setEligiblePANs] = useState([]);
  const [disableButton, setDisableButton] = useState(false);
  const getEligiblePANsFnRef = useRef(() => {});
  const [selectedPAN, setSelectedPAN] = useState({});
  const [PANSelectError, setPANSelectError] = useState(null);

  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [showGreenCircleIcon, setShowGreenCircleIcon] = useState(false);

  const showGreenTickCircleIcon = useRef(() => {});

  showGreenTickCircleIcon.current = () =>
    /^[0-9]{2}(-)[0-9]{2}(-)[0-9]{4}$/.test(dob)
      ? setShowGreenCircleIcon(true)
      : setShowGreenCircleIcon(false);

  useEffect(() => {
    showGreenTickCircleIcon.current();
  }, [dob]);

  useEffect(() => {
    if (!visible) {
      setDob('');
      setSelectedPAN({});
      setPANSelectError(null);
    }
  }, [visible]);

  const handleChangeText = text => {
    setError(null);
    setDob(text);
  };

  getEligiblePANsFnRef.current = async () => {
    try {
      const eligiblePANsResponse = await getEligiblePANs(noLoanAmountLimits);
      let structuredPANs = eligiblePANsResponse.map(item => {
        return {
          value: item.pan_number,
          label: item.name,
        };
      });
      setEligiblePANs(structuredPANs);
      if (structuredPANs?.length === 1) {
        setSelectedPAN(structuredPANs[0]);
      }
      if (eligiblePANsResponse?.length > 1) {
        setDisableButton(false);
      }
    } catch (err) {
      console.log('error', err);
    }
  };

  const searchEligiblePANs = (q = '') => {
    if (q !== '') {
      return filterOptions(eligiblePANs, q);
    } else {
      return eligiblePANs;
    }
  };

  useEffect(() => {
    getEligiblePANsFnRef.current();
  }, []);

  const handleSubmit = () => {
    if (selectedPAN.label && selectedPAN.value) {
      setVisible(false);
      navigation.navigate('Protected', {
        screen: 'ChooseNBFC',
        params: {user: selectedPAN},
      });
      dispatch(setSelectPAN(true));
    } else {
      setPANSelectError('Please Select Loan Applicant');
    }
  };

  return (
    <Modal
      isVisible={visible}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationType="fade"
      onBackdropPress={() => {
        setVisible(false);
        dispatch(setSelectPAN(false));
      }}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
        borderRadius: 12,
      }}>
      <Card style={{width: '100%', borderRadius: 12}}>
        <View style={{paddingHorizontal: 24, paddingTop: 32}}>
          <View>
            <Heading
              style={{
                color: theme.colors.text,
                fontWeight: theme.fontWeights.veryBold,
                ...theme.fontSizes.heading4,
                fontFamily: theme.fonts.regular,
              }}>
              You have a Pre Approved loan of{' '}
              <Text style={{...theme.fontSizes.heading5}}>₹</Text>
              {`${dashboardLoanAmount}*`}
            </Heading>
          </View>
          <Heading
            style={{
              color: theme.colors.greyscale500,
              ...theme.fontSizes.medium,
              fontFamily: theme.fonts.regular,
              paddingTop: 8,
            }}>
            Please provide the following details
          </Heading>
          {eligiblePANs?.length === 1 && (
            <>
              <Text
                style={{
                  fontFamily: theme.fonts.medium,
                  fontWeight: theme.fontWeights.bold,
                  color: theme.colors.primaryBlue,
                  ...theme.fontSizes.medium,
                  paddingLeft: 0,
                  paddingTop: 24,
                }}>
                LOAN APPLICANT
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 8,
                }}>
                <View style={{paddingRight: 8}}>
                  <UserSmall />
                </View>
                <Heading
                  style={{
                    color: theme.colors.text,
                    fontWeight: theme.fontWeights.veryBold,
                    ...theme.fontSizes.small,
                    fontFamily: theme.fonts.regular,
                  }}>
                  {`${eligiblePANs[0]?.label} - ${eligiblePANs[0]?.value}`}
                </Heading>
              </View>
            </>
          )}
          {eligiblePANs?.length > 1 && (
            <>
              <View style={{paddingTop: 24, zIndex: 10}}>
                <Select
                  dataSource={q => searchEligiblePANs(q)}
                  defaultSelected={[selectedPAN]}
                  onChange={v => {
                    setSelectedPAN(v);
                    setPANSelectError(null);
                  }}
                  error={PANSelectError}
                  placeholder="SELECT LOAN APPLICANT"
                  label="LOAN APPLICANT"
                  labelStyles={{color: theme.colors.primaryBlue}}
                  multiple={false}
                />
              </View>
              {selectedPAN?.value && selectedPAN?.label ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 8,
                  }}>
                  <View style={{paddingRight: 8}}>
                    <UserSmall />
                  </View>
                  <Heading
                    style={{
                      color: theme.colors.text,
                      fontWeight: theme.fontWeights.veryBold,
                      ...theme.fontSizes.small,
                      fontFamily: theme.fonts.regular,
                    }}>
                    PAN CARD - {`${selectedPAN?.value}`}
                  </Heading>
                </View>
              ) : null}
            </>
          )}

          <View
            style={{
              paddingTop: 24,
              width: '100%',
            }}>
            <BaseTextInput
              placeholder="DD-MM-YYYY"
              onChangeText={text => {
                Keyboard.dismiss();
                handleChangeText(text);
              }}
              value={dob}
              calendar={true}
              error={error}
              maximumDate={new Date()}
              noStyle={true}
              overlappingIcon={() =>
                (error && (
                  <View style={{position: 'absolute', right: 13.24}}>
                    <WarningIcon1 />
                  </View>
                )) ||
                (showGreenCircleIcon && (
                  <View style={{position: 'absolute', right: 13.24}}>
                    <TickCircle />
                  </View>
                ))
              }
            />
          </View>
          <View
            style={{
              paddingTop: eligiblePANs?.length > 1 ? 48 : 76,
              paddingRight: 24,
            }}>
            <Heading
              style={{
                color: theme.colors.greyscale600,
                ...theme.fontSizes.small,
                fontFamily: theme.fonts.italic,
              }}>
              *Subject to change based on the value of your investments and the
              last updated portfolio date
            </Heading>
          </View>
          <View style={{paddingVertical: 10, paddingTop: 8, paddingBottom: 40}}>
            <BaseButton
              onPress={() => {
                handleSubmit();
              }}
              disable={disableButton}
              extraStyles={
                disableButton && {
                  backgroundColor: theme.colors.disable,
                }
              }
              textStyles={disableButton && {color: theme.colors.greyscale750}}
              gradientColors={
                disableButton
                  ? ['transparent', 'transparent']
                  : ['#003AC9', '#3F76FF']
              }>
              Get Started
            </BaseButton>
          </View>
        </View>
      </Card>
    </Modal>
  );
}
