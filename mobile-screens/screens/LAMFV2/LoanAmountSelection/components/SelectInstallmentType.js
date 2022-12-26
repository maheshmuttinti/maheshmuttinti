/* eslint-disable react-native/no-inline-styles */
import {InfoIconBlue, RadioCircleFill, RadioCircleOutline} from 'assets';
import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useTheme} from 'theme';
import {Card, Heading, RadioButton, SubText} from 'uin';

export const SelectInstallmentType = ({
  style = {},
  labelStyle = {},
  optionLabelStyle = {},
  optionSubLabelStyle = {},
  renderUI,
  onSelectedInstallmentType = () => {},
}) => {
  const theme = useTheme();
  const [selectedInstallmentType, setSelectedInstallmentType] =
    React.useState('balloon');
  return (
    <View style={{...style}}>
      <View style={{flexDirection: 'row'}}>
        <Heading
          style={{
            color: theme.colors.text,
            ...theme.fontSizes.medium,
            fontWeight: theme.fontWeights.veryBold,
            lineHeight: 24,
            paddingRight: 5,
            ...labelStyle,
          }}>
          PICK YOUR MONTHLY PLAN
        </Heading>
        <TouchableOpacity onPress={() => {}}>
          <InfoIconBlue />
        </TouchableOpacity>
      </View>

      {renderUI?.type === 'balloonAndEMI' ? (
        <View style={{}}>
          <RadioButton
            selectedOption={selectedInstallmentType}
            iconWidth={26}
            iconHeight={26}
            options={[
              {
                label: (
                  <View style={{paddingLeft: 8}}>
                    <View style={{flexDirection: 'row'}}>
                      <Heading
                        style={{
                          color: theme.colors.text,
                          ...theme.fontSizes.medium,
                          fontWeight: theme.fontWeights.veryBold,
                          lineHeight: 24,
                          ...optionLabelStyle,
                        }}>
                        Balloon -{' '}
                        {renderUI?.data[0]?.label
                          ? `${renderUI?.data[0]?.label}`
                          : ''}
                      </Heading>
                      {renderUI?.recommended === 'balloon' ? (
                        <Heading
                          style={{
                            marginLeft: 6,
                            color: theme.colors.background,
                            paddingHorizontal: 4,
                            borderRadius: 6,
                            ...theme.fontSizes.small,
                            fontWeight: theme.fontWeights.veryBold,
                            lineHeight: 24,
                            backgroundColor: theme.colors.success,

                            ...optionLabelStyle,
                          }}>
                          RECOMMENDED
                        </Heading>
                      ) : null}
                    </View>
                    <SubText
                      style={{
                        color: theme.colors.text,
                        ...theme.fontSizes.xsmall,
                        lineHeight: 24,
                        ...optionSubLabelStyle,
                      }}>
                      Last month's payment will also include the principal
                      amount
                    </SubText>
                  </View>
                ),
                value: 'balloon',
              },
              {
                label: (
                  <View style={{paddingLeft: 8}}>
                    <View style={{flexDirection: 'row'}}>
                      <Heading
                        style={{
                          color: theme.colors.text,
                          ...theme.fontSizes.medium,
                          fontWeight: theme.fontWeights.veryBold,
                          lineHeight: 24,
                          ...optionLabelStyle,
                        }}>
                        EMI -{' '}
                        {renderUI?.data[1]?.label
                          ? `${renderUI?.data[1]?.label}`
                          : ''}
                      </Heading>
                      {renderUI?.recommended === 'emi' ? (
                        <Heading
                          style={{
                            marginLeft: 6,
                            color: theme.colors.background,
                            paddingHorizontal: 4,
                            borderRadius: 6,
                            ...theme.fontSizes.small,
                            fontWeight: theme.fontWeights.veryBold,
                            lineHeight: 24,
                            backgroundColor: theme.colors.success,

                            ...optionLabelStyle,
                          }}>
                          RECOMMENDED
                        </Heading>
                      ) : null}
                    </View>
                  </View>
                ),
                value: 'emi',
              },
            ]}
            onChange={installmentType => {
              setSelectedInstallmentType(installmentType);
              onSelectedInstallmentType(installmentType);
            }}
            onSelect={() => {}}
            selectedRadioComponent={
              <View style={{top: 1}}>
                <RadioCircleFill />
              </View>
            }
            unSelectedRadioComponent={
              <View style={{top: 0}}>
                <RadioCircleOutline />
              </View>
            }
            rbLabelStyles={{backgroundColor: 'red', color: theme.colors.text}}
            rbWrapperStyles={{
              padding: 0,
            }}
          />
        </View>
      ) : null}
      {renderUI?.type === 'onlyBalloon' ? (
        <Card
          style={{
            backgroundColor: theme.colors.backgroundYellow,
            padding: 16,
          }}>
          <Heading
            style={{
              color: theme.colors.text,
              ...theme.fontSizes.medium,
              fontWeight: theme.fontWeights.veryBold,
              lineHeight: 24,
              ...optionLabelStyle,
            }}>
            Easy Pay Plan - ₹2000 - ₹5000
          </Heading>

          <SubText
            style={{
              color: theme.colors.text,
              ...theme.fontSizes.xsmall,
              lineHeight: 24,
              ...optionSubLabelStyle,
            }}>
            Last month's payment will also include the principal amount
          </SubText>
        </Card>
      ) : null}
      {renderUI?.type === 'onlyEMI' ? (
        <Card
          style={{
            backgroundColor: theme.colors.backgroundYellow,
            padding: 16,
          }}>
          <Heading
            style={{
              color: theme.colors.text,
              ...theme.fontSizes.medium,
              fontWeight: theme.fontWeights.veryBold,
              lineHeight: 24,
              ...optionLabelStyle,
            }}>
            EMI Plan - ₹2000 - ₹5000
          </Heading>
        </Card>
      ) : null}
    </View>
  );
};
