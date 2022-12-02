/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {useState, useCallback} from 'react';
import ScreenWrapper from '../../hocs/screen_wrapper';
import {useTheme} from 'theme';
import {Heading, Card, LabelValue, OutlinedButton, TextButton} from 'uin';
import {View, Text, TouchableOpacity, Pressable} from 'react-native';
import {BackArrow, InfoIcon} from 'assets';
import {getUsersLoanApplication} from 'services';
import {useFocusEffect} from '@react-navigation/native';

export default function ({navigation}) {
  const theme = useTheme();
  const [applications, setApplications] = useState([]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Pressable
          hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
          onPress={() => {
            navigation.canGoBack() && navigation.pop();
          }}
          style={{width: 50, marginLeft: 16}}>
          <BackArrow />
        </Pressable>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        await loanApplications();
      })();
    }, []),
  );

  const loanApplications = async () => {
    try {
      const loanApplicationsResponse = await getUsersLoanApplication();
      let lienMarkingSuccessLoanApplications = loanApplicationsResponse?.filter(
        item => item?.lien_marking_status === 'success',
      );

      console.log(
        'lienMarkingSuccessLoanApplications',
        lienMarkingSuccessLoanApplications?.length,
      );

      setApplications(lienMarkingSuccessLoanApplications);
    } catch (error) {
      console.log('error while applications', error);
      return error;
    }
  };

  return (
    <ScreenWrapper>
      <View
        style={{
          paddingHorizontal: 17,
        }}>
        <View style={{paddingTop: 40}}>
          <Heading
            style={{
              color: theme.colors.text,
              ...theme.fontSizes.heading5,
              fontWeight: theme.fontWeights.veryBold,
            }}>
            Your Loans
          </Heading>
        </View>

        {applications?.length > 0 &&
          applications?.map((item, index) => (
            <View key={index}>
              <Card
                style={{
                  borderColor: theme.colors.greyscale200,
                  borderWidth: theme.borderWidth.thin,
                  marginTop: 16,
                }}>
                <View>
                  <View style={{paddingTop: 16, paddingHorizontal: 16}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Heading
                        style={{
                          color: theme.colors.primaryBlue,
                          fontWeight: theme.fontWeights.veryBold,
                          ...theme.fontSizes.small,
                        }}>
                        PERSONAL LOAN
                      </Heading>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('LoanInfo', {
                            loanId: item.uuid,
                          });
                        }}>
                        <Heading
                          style={{
                            color: theme.colors.primaryOrange,
                            fontWeight: theme.fontWeights.moreBold,
                            ...theme.fontSizes.small,
                            textDecorationLine: 'underline',
                          }}>
                          View details
                        </Heading>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        paddingTop: 16,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <LabelValue
                          title="Amount"
                          value={`₹${parseInt(
                            item?.loan_application_data?.loan_details?.amount,
                            10,
                          )}`}
                          titleStyle={{fontWeight: theme.fontWeights.lightBold}}
                          valueStyle={{
                            fontFamily: theme.fonts.bold,
                            ...theme.fontSizes.large,
                          }}
                          style={{
                            width: '50%',
                            textAlign: 'center',
                          }}
                        />
                        <View
                          style={{
                            width: '50%',
                            flexDirection: 'row',
                          }}>
                          <LabelValue
                            title="ROI"
                            value={`${item?.nbfc_data?.roi}%`}
                            titleStyle={{
                              fontWeight: theme.fontWeights.lightBold,
                            }}
                            valueStyle={{
                              fontFamily: theme.fonts.bold,
                              ...theme.fontSizes.large,
                            }}
                            style={{
                              width: '50%',
                              paddingBottom: 8,
                            }}
                          />
                          <LabelValue
                            title="Tenure"
                            value="36"
                            titleStyle={{
                              fontWeight: theme.fontWeights.lightBold,
                            }}
                            valueStyle={{
                              fontFamily: theme.fonts.bold,
                              ...theme.fontSizes.large,
                            }}
                            style={{
                              width: '50%',
                              paddingBottom: 8,
                            }}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <LabelValue
                          title="Pan Card"
                          value={item?.pan}
                          titleStyle={{fontWeight: theme.fontWeights.lightBold}}
                          valueStyle={{
                            fontFamily: theme.fonts.bold,
                            ...theme.fontSizes.large,
                          }}
                          style={{
                            width: '50%',
                            paddingBottom: 8,
                          }}
                        />
                        <LabelValue
                          title="Name"
                          value={item?.loan_application_data?.name}
                          titleStyle={{fontWeight: theme.fontWeights.lightBold}}
                          valueStyle={{
                            fontFamily: theme.fonts.bold,
                            ...theme.fontSizes.large,
                          }}
                          style={{
                            width: '50%',
                            paddingBottom: 8,
                          }}
                        />
                      </View>
                    </View>
                  </View>

                  {/* <View
                    style={{
                      marginTop: 24,
                      backgroundColor: theme.colors.success,
                    }}>
                    <Heading
                      style={{
                        textAlign: 'center',
                        paddingVertical: 5,
                        fontFamily: theme.fonts.italic,
                        ...theme.fontSizes.small,
                        fontWeight: theme.fontWeights.moreBold,
                      }}>
                      {`${item?.loan_application_step}`}
                    </Heading>
                  </View> */}
                  <View
                    style={{
                      marginTop: 24,
                      backgroundColor: theme.colors.primaryBlue,
                      borderBottomLeftRadius: 12,
                      borderBottomRightRadius: 12,
                    }}>
                    <Heading
                      style={{
                        textAlign: 'center',
                        paddingVertical: 10,
                        fontFamily: theme.fonts.italic,
                        ...theme.fontSizes.small,
                        fontWeight: theme.fontWeights.moreBold,
                      }}>
                      Documents are being Verified
                    </Heading>
                  </View>
                </View>
              </Card>
            </View>
          ))}
        <View style={{paddingTop: 16}}>
          <Card
            style={{
              backgroundColor: theme.colors.backgroundYellow,
              paddingHorizontal: 17,
              paddingVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View>
              <InfoIcon fill={theme.colors.error} />
            </View>

            <Heading
              style={{
                ...theme.fontSizes.small,
                fontFamily: theme.fonts.regular,
                color: theme.colors.text,
                paddingLeft: 17.25,
                marginRight: 17,
              }}>
              Please complete your loan application in{' '}
              <Text style={{color: theme.colors.error}}>10 days</Text>.
              Processing fee is to be paid if you fail to do so.
            </Heading>
          </Card>
        </View>
        <View style={{paddingTop: 45}}>
          <OutlinedButton
            onPress={() => {
              navigation.replace('Protected');
            }}
            outlineColor="#003AC9"
            textStyles={{color: '#003AC9'}}>
            Apply for another Loan
          </OutlinedButton>
        </View>
        <View
          style={{
            paddingTop: 16,
            paddingBottom: 32,
            alignItems: 'center',
          }}>
          <TextButton onPress={() => navigation.replace('Protected')}>
            Go to Dashboard
          </TextButton>
        </View>
      </View>
    </ScreenWrapper>
  );
}
