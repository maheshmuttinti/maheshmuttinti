/* eslint-disable react-native/no-inline-styles */
import React, {useEffect} from 'react';
import {Text, Pressable, View, Dimensions} from 'react-native';
import ScreenWrapper from '../../hocs/screenWrapperWithoutBackButton';
import {useTheme} from 'theme';
import {BaseButton} from 'uin';
import {useState} from 'react';
import {BackArrow, FileIcon, TickCircle} from 'assets';
import {Heading, Card, SinglePdfUpload, GrayBodyText, SubText} from 'uin';
import {uploadCAS} from 'services';
import useBetaForm from '@reusejs/react-form-hook';
import {showToast} from 'utils';

export default function ({navigation, route}) {
  const theme = useTheme();
  const {height} = Dimensions.get('window');
  const [fileName, setFileName] = useState(null);
  const [apiCallStatus, setApiCallStatus] = useState(null);
  const routeEmailId = route?.params?.emailId;
  const routeRequestId = route?.params?.requestId;

  const form = useBetaForm({
    request_tracking_id: null,
    file_id: null,
  });

  useEffect(() => {
    if (routeRequestId) {
      form.setField('request_tracking_id', routeRequestId);
    }
  }, [routeRequestId]);

  const handleUploadCAS = async () => {
    try {
      setApiCallStatus('loading');
      const payload = {
        ...form.value,
      };
      console.log('uploadCAS payload', payload);

      const uploadCASResponse = await uploadCAS(payload);
      if (
        uploadCASResponse.status === 'reading_failed' ||
        uploadCASResponse.status === 'processing_failed' ||
        uploadCASResponse.status === 'portfolio_generation_failed'
      ) {
        // showToast('Something went wrong, Please upload pdf again!');
        await uploadCAS(payload);
        setApiCallStatus('success');
        navigation.replace('Protected');
      } else {
        setApiCallStatus('success');
        navigation.replace('Protected');
      }
    } catch (error) {
      setApiCallStatus('failed');
      showToast('Something went wrong, Please upload pdf again!');
      console.log('error', error);
    }
  };

  return (
    <ScreenWrapper backgroundColor={theme.colors.background}>
      <View style={{padding: 24}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 16,
          }}>
          <Pressable
            hitSlop={{top: 30, left: 30, right: 30, bottom: 30}}
            onPress={() => navigation.canGoBack() && navigation.pop()}
            style={{flex: 0.3 / 4}}>
            <BackArrow />
          </Pressable>
          <View
            style={{
              flex: 3.6 / 4,
            }}>
            <Text
              style={{
                textAlign: 'center',
                ...theme.fontSizes.medium,
                fontFamily: theme.fonts.bold,
                color: theme.colors.text,
              }}>
              Portfolio
            </Text>
          </View>
        </View>

        <View style={{marginTop: 61}}>
          <Text
            style={{
              ...theme.fontSizes.heading4,
              fontFamily: theme.fonts.bold,
              color: theme.colors.text,
            }}>
            Select Portfolio
          </Text>
          <GrayBodyText style={{paddingTop: 16}}>
            Upload your latest consolidated statement sent by CAMS to{' '}
            <Text style={{fontWeight: 'bold'}}>{routeEmailId}</Text> This will
            be .pdf file
          </GrayBodyText>

          <View
            style={{
              paddingTop: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View style={{flex: 1}}>
              <SinglePdfUpload
                disable={form?.value?.file_id}
                type="local"
                title={'Add Logo / profile picuture'}
                fileUuid={''}
                onFileUploadDone={files => {
                  console.log(files, files[1]?.uuid, 'fileData');
                  if (files.length > 0) {
                    setFileName(files[0]?.name);
                    form.setField('file_id', files[1]?.uuid);
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
                    <FileIcon />
                    <Heading style={{color: theme.colors.text, paddingTop: 8}}>
                      {fileName ? `${fileName}` : 'Select File'}
                    </Heading>
                  </View>
                </Card>
              </SinglePdfUpload>
            </View>
          </View>

          <>
            {form?.value?.file_id && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 16,
                }}>
                <TickCircle />
                <SubText
                  style={{
                    color: theme.colors.success,
                    paddingLeft: 6,
                  }}>
                  Uploaded Successfully
                </SubText>
              </View>
            )}
          </>

          <View style={{paddingTop: height >= 640 ? 226 : 126, width: '100%'}}>
            <BaseButton
              loading={apiCallStatus === 'loading'}
              wrapperStyles={{marginBottom: 16, height: 48}}
              textStyles={{}}
              onPress={async () => await handleUploadCAS()}
              disable={!form?.value?.file_id}
              bgColor={theme.colors.primaryOrange}
              textColor={theme.colors.primary}>
              Get Started
            </BaseButton>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
