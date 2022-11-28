/* eslint-disable react-native/no-inline-styles */
import {TickCircleMedium} from 'assets';
import * as React from 'react';
import {useState} from 'react';
import {View} from 'react-native';
import {useTheme} from 'theme';
import {BaseButton, Card, Heading, RadioInput} from 'uin';
import Modal from 'react-native-modal';

const EMIDueDatesModal = ({
  emiSchemes,
  defaultEMIScheme,
  visible,
  setVisible,
  onSelectEMIDueDate = () => {},
}) => {
  const [value, setValue] = useState('');
  const [textStyle, setTextStyle] = useState({});
  const [defaultSelected, setDefaultSelected] = useState();

  React.useEffect(() => {
    const foundedScheme = emiSchemes?.find(
      item => item?.label === defaultEMIScheme?.label,
    );
    setDefaultSelected([foundedScheme]);
  }, [defaultEMIScheme, emiSchemes]);

  const theme = useTheme();
  return (
    <Modal
      isVisible={visible}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      animationType="fade"
      onBackdropPress={() => {
        setVisible(false);
        setTextStyle(theme.fontSizes.small);
      }}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
        marginBottom: 24,
        borderRadius: 12,
      }}>
      <Card style={{width: '100%', borderRadius: 12}}>
        <View style={{paddingHorizontal: 24, paddingTop: 32}}>
          <Heading
            style={{
              color: theme.colors.text,
              ...theme.fontSizes.heading4,
              fontWeight: theme.fontWeights.veryBold,
              lineHeight: 24,
              paddingBottom: 16,
            }}>
            EMI Due Date
          </Heading>

          <View>
            {defaultSelected && (
              <RadioInput
                dataSource={() => emiSchemes}
                selectedIcon={
                  <TickCircleMedium fill={theme.colors.primaryBlue} />
                }
                selectedTextColor={theme.colors.text}
                textStyles={{
                  ...theme.fontSizes.small,
                  fontFamily: 'Open Sans',
                  ...textStyle,
                }}
                isWrap={true}
                pressableStyle={{paddingHorizontal: 10}}
                defaultSelected={defaultSelected}
                wrapperStyle={{alignItems: 'center'}}
                onChange={v => {
                  setValue(v);
                }}
                multiple={false}
              />
            )}
          </View>

          <View style={{paddingVertical: 10, paddingTop: 8, paddingBottom: 40}}>
            <BaseButton
              onPress={() => {
                onSelectEMIDueDate(value);
                setVisible(false);
              }}
              gradientColors={['#003AC9', '#3F76FF']}>
              Save
            </BaseButton>
          </View>
        </View>
      </Card>
    </Modal>
  );
};

export default EMIDueDatesModal;
