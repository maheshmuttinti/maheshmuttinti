/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useTheme} from 'theme';
import _ from 'lodash';
import {Heading, GradientCard} from 'uin';
import {ArrowRight, TickCircleSmall} from 'assets';

export const LoanAmountGradientCard = ({
  selectedSchemes = [],
  approvedLoanAmount = 0,
  onNext = () => {},
}) => {
  const theme = useTheme();
  return (
    <View style={{alignItems: 'center', marginHorizontal: 16}}>
      <GradientCard
        gradientColors={[
          theme.colors.primaryOrange800,
          theme.colors.primaryOrange,
        ]}
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 24,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            justifyContent: 'space-between',
          }}>
          <View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TickCircleSmall fill={theme.colors.background} />
              <Heading
                style={{
                  fontFamily: theme.fonts.regular,
                  fontWeight: theme.fontWeights.moreBold,
                  ...theme.fontSizes.small,
                  paddingLeft: 8,
                }}>
                Loan Approved |{' '}
                {selectedSchemes?.length === 1
                  ? `${selectedSchemes.length} Scheme`
                  : selectedSchemes?.length > 1
                  ? `${selectedSchemes.length} Schemes`
                  : ''}
              </Heading>
            </View>

            <View style={{paddingTop: 8}}>
              <Heading
                style={{
                  fontFamily: theme.fonts.regular,
                  fontWeight: theme.fontWeights.veryBold,
                  ...theme.fontSizes.xlarge,
                }}>{`₹ ${approvedLoanAmount}`}</Heading>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              onNext();
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Heading
              style={{
                ...theme.fontSizes.largeMedium,
                fontWeight: theme.fontWeights.veryBold,
              }}>
              Next
            </Heading>
            <View style={{paddingRight: 2}}>
              <ArrowRight />
            </View>
          </TouchableOpacity>
        </View>
      </GradientCard>
    </View>
  );
};
