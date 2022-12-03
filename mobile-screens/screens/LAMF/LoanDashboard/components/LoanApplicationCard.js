/* eslint-disable react-native/no-inline-styles */
import {TouchableOpacity, View} from 'react-native';
import * as React from 'react';
import {useTheme} from 'theme';
import {Heading, Card, LabelValue} from 'uin';
import {placeholderDecider} from 'utils'

export const LoanApplicationCard = ({navigation, application}) => {
  const theme = useTheme();

  return (
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
                navigation.navigate('LoanApplicationInfo', {
                  loanId: application.uuid,
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
                value={ placeholderDecider(
                  application?.loan_application_data?.loan_details?.amount
                    ? `₹${parseInt(
                      application?.loan_application_data?.loan_details?.amount,
                      10,
                    )}`
                    : null,
                ) }
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
                  value={`${application?.nbfc_data?.roi}%`}
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
                  value={placeholderDecider(
                    application?.loan_application_data?.loan_tenure
                     
                  )}
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
                value={application?.pan}
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
                value={application?.loan_application_data?.name}
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
  );
};
