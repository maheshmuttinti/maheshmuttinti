import React, {useState, useRef, useEffect, useMemo, useCallback} from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Dimensions,
  Pressable,
} from 'react-native';
import {useTheme} from 'theme';
import ScreenWrapper from '../../hocs/screen_wrapper';
import {
  DownArrow,
  DangerIcon,
  NBFCIcon,
  ArrowRight,
  TickCircleSmall,
  Arrow,
  BackArrow,
  InfoIcon,
} from 'assets';
import {
  Card,
  Heading,
  LabelValue,
  BaseTextInput,
  GradientCard,
  CustomCheckBox,
  CustomizedSkeleton,
  Select,
  RoundedFilledButton,
} from 'uin';
import Carousel from 'react-native-snap-carousel-v4';
import Slider from '@react-native-community/slider';
import Config from 'react-native-config';

export default function Index({route, navigation}) {
  const theme = useTheme();
  // const ref = useRef(null);
  // const {width} = Dimensions.get('window');
  const [active, setActive] = useState(0);
  // const {nbfc_code, user} = route?.params;

  const [headerType, setHeaderType] = useState('normal');
  // const [selectedPan, setSelectedPan] = useState(user);
  const [selectedPan, setSelectedPan] = useState({});
  const [showSelectableList, setShowSelectableList] = useState(false);
  const [allNbfcs, setAllNbfcs] = useState([1, 2]);
  const [total, setTotal] = useState(
    route?.params?.total ? route?.params?.total : 0,
  );

  return (
    <ScreenWrapper
      backgroundColor={theme.colors.primaryBlue}
      scrollView={false}
      footer={true}>
      <View
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          alignItems: 'center',
        }}>
        {headerType === 'normal' && <NormalHeader navigation={navigation} />}

        {headerType === 'loan' && <LoanHeader navigation={navigation} />}

        <ScrollView
          nestedScrollEnabled={true}
          contentInsetAdjustmentBehavior="automatic"
          onScroll={e => {
            if (e.nativeEvent.contentOffset.y > 235) {
              setHeaderType('loan');
            } else {
              setHeaderType('normal');
            }
          }}
          style={{
            backgroundColor: theme.colors.primaryBlue,
            width: '100%',
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              paddingTop: 32,
              width: '100%',
              zIndex: 100,
            }}>
            <View
              style={{
                alignItems: 'center',
                marginBottom: 125,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <CurrentUserSection />

              {allNbfcs?.length > 1 && (
                <CarouselButtons allNbfcs={allNbfcs} active={active} />
              )}
            </View>

            <NbfcCardSection
              allNbfcs={allNbfcs}
              total={total}
              showSelectableList={showSelectableList}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}

const NbfcCardSection = ({
  allNbfcs = [],
  active,
  total,
  showSelectableList,
}) => {
  const theme = useTheme();
  const ref = useRef(null);
  const {width} = Dimensions.get('window');

  const myRenderItem = ({item, index}) => (
    <React.Fragment key={index}>
      <LoanAmountForm
        item={item}
        index={index}
        total={total}
        showSelectableList={showSelectableList}
      />
    </React.Fragment>
  );

  return (
    <Card
      style={{
        marginTop: 30,
        width: '100%',
        height: '100%',
        zIndex: -1,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}>
      <View
        style={{
          paddingVertical: 16,
          marginTop: -140,
        }}>
        {allNbfcs.length > 0 ? (
          <>
            <Carousel
              layout="default"
              ref={ref}
              data={allNbfcs}
              sliderWidth={width}
              itemWidth={width * 0.838}
              // renderItem={renderItem}
              renderItem={myRenderItem}
              onSnapToItem={index => {
                onChangeNbfc(index);
              }}
              slideStyle={{zIndex: 1}}
              firstItem={active}
              inactiveSlideScale={1}
              inactiveSlideOpacity={1}
              loop={true}
              scrollEnabled={false}
            />
          </>
        ) : !loading && allNbfcs.length === 0 ? (
          <View
            style={{
              marginTop: 12,
              alignItems: 'center',
              flex: 1,
              height: 500,
              paddingHorizontal: 16,
            }}>
            <Heading
              style={{
                color: theme.colors.background,
                fontWeight: theme.fontWeights.normal,
                ...theme.fontSizes.large,
                fontFamily: theme.fonts.regular,
              }}>
              None of your schemes eligible for getting the loan
            </Heading>
          </View>
        ) : (
          <View style={{flexDirection: 'row', marginLeft: 16}}>
            {'.'
              .repeat(4)
              .split('')
              .map((__, index) => (
                <CustomizedSkeleton
                  key={index}
                  containerStyle={{
                    marginRight: 8,
                    width: width * 0.81,
                  }}
                  logo={true}
                  lines={8}
                  logoRadius={50}
                />
              ))}
          </View>
        )}
      </View>
    </Card>
  );
};

const LoanAmountForm = ({
  item,
  index,
  editableTotal,
  active,
  nbfc,
  total,
  showSelectableList,
}) => {
  const theme = useTheme();
  const {width} = Dimensions.get('window');
  const minLoanAmount =
    Config.MOCK_ENVIRONMENT === 'STAGING' ? 100 : +nbfc?.min_loan_amount;

  const [selectComponentWrapperHeight, setSelectComponentWrapperHeight] =
    useState('auto');

  const [refreshEMIPlansOptions, setRefreshEMIPlansOptions] = useState([]);
  const [tempInput, setTempInput] = useState(editableTotal ? editableTotal : 0);
  const [apiCallStatus, setApiCallStatus] = useState(null);

  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    // setTempInput(editableTotal);
    console.log('editableTotal====<<', editableTotal);
  }, [editableTotal]);

  return (
    <React.Fragment>
      <Card
        key={index}
        style={{
          borderColor: theme.colors.greyscale200,
          borderWidth: theme.borderWidth.thin,
          backgroundColor:
            index === active
              ? theme.colors.backgroundBlue
              : theme.colors.primary,
          width: width * 0.8,
          padding: 16,
          zIndex: 10,
        }}>
        <View style={{paddingBottom: 8}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingHorizontal: 15,
            }}>
            <View style={{height: 35, paddingRight: 15}}>
              <NBFCIcon />
            </View>
            <Heading
              style={{
                color: theme.colors.text,
                fontWeight: theme.fontWeights.bold,
                ...theme.fontSizes.medium,
              }}>
              {item?.nbfc?.nbfc_name}
            </Heading>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Heading
              style={{
                color: theme.colors.text,
                fontWeight: theme.fontWeights.bold,
              }}>
              Loan Amount
            </Heading>

            <View style={{width: '40%'}}>
              <BaseTextInput
                keyboardType="numeric"
                prefixValue={'₹'}
                onChangeText={text => {
                  setTempInput(text);
                }}
                onBlur={e => {
                  handleChangeText(tempInput);
                  setSelectedSchemes([]);
                }}
                value={`${tempInput}`}
                extraTextStyles={{
                  color: theme.colors.primaryBlue,
                  fontWeight: theme.fontWeights.Bold,
                }}
              />
            </View>
          </View>
          <Slider
            style={{
              marginTop: 30,
              transform:
                Platform.OS === 'android' ? [{scaleX: 1.1}, {scaleY: 2}] : [],
              height: 50,
            }}
            minimumValue={minLoanAmount}
            maximumValue={total}
            minimumTrackTintColor={theme.colors.primaryYellow}
            maximumTrackTintColor={theme.colors.primary}
            onSlidingComplete={v => {
              handleChangeText(`₹ ${v ? parseFloat(v).toFixed(2) : v}`);
              setSelectedSchemes([]);
              setRefreshEMIPlansOptions(new Date().getTime());
            }}
            thumbTintColor={theme.colors.primaryBlue}
            value={total}
          />

          <View style={{marginTop: 16}}>
            <Heading
              style={{
                marginBottom: 4,
                color: theme.colors.text,
                fontWeight: theme.fontWeights.veryBold,
              }}>
              EMI Plans
            </Heading>

            <View style={{zIndex: 20, height: selectComponentWrapperHeight}}>
              <Select
                dataSource={async () => {
                  console.log('emiPlans-123', emiPlans);
                  return emiPlans;
                }}
                onChange={v => {
                  setEmiPlan(v);
                }}
                onOpen={() => {
                  setSelectComponentWrapperHeight(250);
                }}
                refresh={refreshEMIPlansOptions}
                onClose={() => {
                  setSelectComponentWrapperHeight('auto');
                }}
                placeholder="Select EMI Plan"
                multiple={false}
              />
            </View>
          </View>
        </View>
      </Card>

      <View
        style={{
          paddingTop: 24,
          zIndex: 3,
          right: 14,
          width: '110%',
        }}>
        <Heading
          style={{
            color: theme.colors.text,
            fontWeight: theme.fontWeights.veryBold,
          }}>
          EXPLORE SCHEMES
        </Heading>
        <Heading
          style={{
            color: theme.colors.primaryOrange,
            fontWeight: theme.fontWeights.moreBold,
            ...theme.fontSizes.small,
            paddingTop: 8,
          }}>
          <Text
            style={{
              fontWeight: theme.fontWeights.semiBold,
              color: theme.colors.greyscale750,
            }}>
            Under
          </Text>{' '}
          {nbfc?.nbfc_name}
        </Heading>
      </View>

      {apiCallStatus === 'schemes_list_loading' ? (
        '.'
          .repeat(4)
          .split('')
          .map((__, schemesSkeletonListItemIndex) => (
            <SkeletonListCard
              containerStyle={
                schemesSkeletonListItemIndex === 0
                  ? {marginTop: 25, right: 34, width: '120%'}
                  : {right: 34, width: '120%'}
              }
              key={schemesSkeletonListItemIndex}
            />
          ))
      ) : (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            paddingTop: showSelectableList ? 0 : 24,
            marginBottom: 180,
            right: 14,
            width: '110%',
          }}>
          {showSelectableList ? (
            <>
              {remainingTotal > 0 && (
                <Card
                  style={{
                    backgroundColor: theme.colors.backgroundYellow,
                    paddingLeft: 16,
                    marginTop: 24,
                    marginHorizontal: 1,
                    borderRadius: 8,
                    paddingVertical: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: '100%',
                  }}>
                  <View>
                    <DangerIcon fill={theme.colors.error} />
                  </View>
                  <Text
                    style={{
                      ...theme.fontSizes.small,
                      fontWeight: theme.fontWeights.moreBold,
                      color: theme.colors.text,
                      fontFamily: theme.fonts.regular,
                      paddingLeft: 16,
                    }}>
                    Please select schemes for Lien Marking
                  </Text>
                </Card>
              )}
              <View
                style={{
                  paddingTop: showSelectableList ? 24 : 0,
                  width: '100%',
                }}>
                {schemes.map((scheme, schemeIndex) => (
                  <View key={schemeIndex} style={{width: '100%'}}>
                    <CustomCheckBox
                      disable={false}
                      onCheck={val => {
                        if (remainingTotal > 0) {
                          filterSchemes(val, scheme);
                        } else if (remainingTotal === 0 && !val) {
                          filterSchemes(val, scheme);
                        } else {
                          Toast.show({
                            type: 'schemeWarning',
                            position: 'bottom',
                            visibilityTime: 5000,
                          });
                        }
                      }}
                      value={selectedSchemes.includes(scheme) ? true : false}
                      data={scheme}
                      selectedStatus={
                        selectedSchemes.includes(scheme) ? true : false
                      }
                    />
                  </View>
                ))}
              </View>
            </>
          ) : (
            schemes?.map((scheme, schmeIndex) => (
              <View key={schmeIndex} style={{width: '100%'}}>
                <SchemeCard item={scheme} />
              </View>
            ))
          )}
        </View>
      )}
    </React.Fragment>
  );
};

const CarouselButtons = ({allNbfcs, active}) => {
  const theme = useTheme();

  const ref = useRef(null);

  return (
    <View style={{flexDirection: 'row', paddingHorizontal: 5}}>
      <RoundedFilledButton
        onPress={() => {
          if (active !== 0) {
            ref.current.snapToPrev();
            onChangeNbfc(ref.current._activeItem);
          }
        }}
        bgColor={active !== 0 ? '#FF5500' : theme.colors.greyscale300}
        textColor="#ffffff"
        buttonStyles={{width: 40, height: 40, marginLeft: 10}}>
        <BackArrow fill="#fff" />
      </RoundedFilledButton>
      <RoundedFilledButton
        onPress={() => {
          if (allNbfcs.length > 0 && active !== allNbfcs.length - 1) {
            ref.current.snapToNext();
            onChangeNbfc(ref.current._activeItem);
          }
        }}
        bgColor={
          allNbfcs.length > 0 && active !== allNbfcs.length - 1
            ? '#FF5500'
            : theme.colors.greyscale300
        }
        textColor="#ffffff"
        buttonStyles={{width: 40, height: 40, marginLeft: 10}}>
        <Arrow stroke="#fff" />
      </RoundedFilledButton>
    </View>
  );
};

const CurrentUserSection = ({}) => {
  const theme = useTheme();

  return (
    <View>
      <Heading
        style={{
          fontSize: theme.fontSizes.heading4.fontSize,
          lineHeight: 24,
          fontWeight: theme.fontWeights.veryBold,
        }}>
        {'selectedPan.label'}
      </Heading>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingTop: 8,
          paddingLeft: 0,
          zIndex: 100,
          justifyContent:
            // allNbfcs?.length > 1 ? 'flex-start' : 'center',
            [].length > 1 ? 'flex-start' : 'center',
          marginLeft: 20,
        }}>
        <Select
          dataSource={async () => allPANs}
          onChange={v => {
            setSelectedPan(v);
          }}
          listWrapperStyles={{
            minWidth: 152,
            top: 30,
            left: 35,
          }}
          label={
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Heading
                style={{
                  ...theme.fontSizes.large,
                  fontWeight: theme.fontWeights.veryBold,
                }}>
                {'selectedPan.value'}
              </Heading>
              <View style={{paddingLeft: 2}}>
                <DownArrow stroke={theme.colors.background} />
              </View>
            </View>
          }
          labelStyles={{
            color: theme.colors.primaryBlue,
            ...theme.fontSizes.large,
          }}
          multiple={false}
          searchable={false}
          showHeader={false}
        />
      </View>
    </View>
  );
};

const NormalHeader = ({navigation}) => {
  const theme = useTheme();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: theme.colors.primaryBlue,
        width: '100%',
        paddingBottom: 13,
        paddingTop: Platform.OS === 'ios' ? 42 : 24,
      }}>
      <Pressable
        hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
        onPress={() => {
          navigation.canGoBack() && navigation.pop();
        }}
        style={{width: 50, marginLeft: 16}}>
        <BackArrow fill={theme.colors.primary} />
      </Pressable>
      <Heading
        style={{
          fontWeight: 'bold',
          fontFamily: theme.fonts.regular,
          marginLeft: 16,
          ...theme.fontSizes.large,
        }}>
        Loans Against Mutual Funds
      </Heading>
    </View>
  );
};

const LoanHeader = ({}) => {
  const theme = useTheme();

  return (
    <View
      style={{
        marginTop: Platform.OS === 'ios' ? 0 : -13,
        width: '100%',
        paddingTop: 13,
      }}>
      <Card style={{borderRadius: 0}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 10,
          }}>
          <LabelValue
            title="Loan Amount"
            titleStyle={{
              fontWeight: theme.fontWeights.lightBold,
            }}
            value={`₹ ${
              showSelectableList ? editableTotal.split('₹')[1] : total
            }`}
            valueStyle={{
              ...theme.fontSizes.largeMedium,
              fontFamily: theme.fonts.bold,
            }}
          />
          <LabelValue
            title="EMI Plan"
            titleStyle={{
              fontWeight: theme.fontWeights.lightBold,
              textAlign: 'right',
            }}
            value={emiPlan?.label}
            valueStyle={{
              ...theme.fontSizes.largeMedium,
              fontFamily: theme.fonts.bold,
            }}
          />
        </View>
      </Card>
    </View>
  );
};
