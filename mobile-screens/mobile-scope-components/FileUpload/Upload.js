import React from 'react';
import NativeUploady from '@rpldy/native-uploady';
import MobileContext from './mobileContext';

export default function Chooser({
  destinationConfig,
  enableFileUpload,
  onClose,
  type = 'local',
  onFileUploadDone,
  multiple = false,
  mode = 'all',
  disable,
  ...props
}) {
  return (
    <NativeUploady destination={destinationConfig}>
      <MobileContext
        disable={disable}
        mode={mode}
        onDone={files => {
          onFileUploadDone(files);
        }}
        multiple={multiple}
        type={type}
        child={props.children}
      />
    </NativeUploady>
  );
}
