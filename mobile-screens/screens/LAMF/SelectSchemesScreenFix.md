### Select Schemes Fix

1. Figured out the issue that `<Slider />` component props such as minimumValue, maximumValue, value props values are going as `NaN` values which causing the UI issues or application crashing in the mobile

Slider Documentation: https://github.com/callstack/react-native-slider
- Went through the documentation and found these props and how to use them


| Property | Description | Type | Required | Platform |
| -------- | ----------- | ---- | -------- | -------- |
| `style` | Used to style and layout the `Slider`. See `StyleSheet.js` and `ViewStylePropTypes.js` for more info. | View.style | No | |
| `disabled`| If true the user won't be able to move the slider.<br/>Default value is false. | bool | No | |
| `maximumValue` | Initial maximum value of the slider.<br/>Default value is 1. | number | No | |
| `minimumTrackTintColor` | The color used for the track to the left of the button.<br/>Overrides the default blue gradient image on iOS. | [color](https://reactnative.dev/docs/colors) | No | |
| `minimumValue` | Initial minimum value of the slider.<br/>Default value is 0. | number | No | |
| `onSlidingStart` | Callback that is called when the user picks up the slider.<br/>The initial value is passed as an argument to the callback handler. | function | No | |
| `onSlidingComplete` | Callback that is called when the user releases the slider, regardless if the value has changed.<br/>The current value is passed as an argument to the callback handler. | function | No | |
| `onValueChange` | Callback continuously called while the user is dragging the slider. | function | No | |
| `step` | Step value of the slider. The value should be between 0 and (maximumValue - minimumValue). Default value is 0.<br/>On Windows OS the default value is 1% of slider's range (from `minimumValue` to `maximumValue`). | number | No | |
| `maximumTrackTintColor` | The color used for the track to the right of the button.<br/>Overrides the default gray gradient image on iOS. | [color](https://reactnative.dev/docs/colors) | No | |
| `testID` | Used to locate this view in UI automation tests. | string | No | |
| `value` | Write-only property representing the value of the slider. Can be used to programmatically control the position of the thumb. Entered once at the beginning still acts as an initial value. The value should be between minimumValue and maximumValue, which default to 0 and 1 respectively. Default value is 0.<br/>_This is not a controlled component_, you don't need to update the value during dragging. | number | No | |
| `tapToSeek` | Permits tapping on the slider track to set the thumb position.<br/>Defaults to false on iOS. No effect on Android or Windows. | bool | No | iOS |
| `inverted` | Reverses the direction of the slider.<br/>Default value is false. | bool | No | |
| `vertical` | Changes the orientation of the slider to vertical, if set to `true`.<br/>Default value is false. | bool | No | Windows |
| `thumbTintColor` | Color of the foreground switch grip. | [color](https://reactnative.dev/docs/colors) | No | Android |
| `maximumTrackImage` | Assigns a maximum track image. Only static images are supported. The leftmost pixel of the image will be stretched to fill the track. | Image<br/>.propTypes<br/>.source | No | iOS |
| `minimumTrackImage` | Assigns a minimum track image. Only static images are supported. The rightmost pixel of the image will be stretched to fill the track. | Image<br/>.propTypes<br/>.source | No | iOS |
| `thumbImage` | Sets an image for the thumb. Only static images are supported. Needs to be a URI of a local or network image; base64-encoded SVG is not supported. | Image<br/>.propTypes<br/>.source | No | |
| `trackImage` | Assigns a single image for the track. Only static images are supported. The center pixel of the image will be stretched to fill the track. | Image<br/>.propTypes<br/>.source | No | iOS | |
| `ref` | Reference object. | MutableRefObject | No | web |
| `View` | [Inherited `View` props...](https://github.com/facebook/react-native-website/blob/master/docs/view.md#props) | | | |

