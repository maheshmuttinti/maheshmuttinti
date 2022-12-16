import React from 'react';
import {DigioRNComponent} from 'digio-sdk-rn';
import Config from 'react-native-config';
import {showNativeAlert} from 'utils';

const DigioSDK = ({route, navigation}) => {
  const options = {
    environment: Config.DIGIO_ENVIRONMENT,
    // environment: 'sandbox', // possible values: sandbox or production
    logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPYAAACBCAMAAADE67eDAAAAhFBMVEX///8AcuEAbeAAcOEAa+AAaN+Ote5Af+Pn7vvi7fsAYd7p8/0rdOEAZN+Tsu4AZt/2+v4AXt7b5/mDsO3D1/bS3vcAWd2Iq+zw9v1bjeZsn+qsxvK50PSxyvLQ4fhllehpmulEieaat+6kwfF0pesqfOQAVd1MheWWu+9Ukuc0g+WBpeuRY0KjAAAF9klEQVR4nO2b65qqOgyGpQcRFEHAAQURRLan+7+/jQptAHVYs106def9sQ5jeKafTdM0DYMBgiAIgiAIgiAIgiAIgiAIgiAI8mIcx3n3EF5LmKyCTGMW07JlNB+9ezg/xp9Kwu+MjXxNLU6opmmUlNoPG/cVY/wLeBavMb+bvI3OmAYhXA/UdPchESLYY9lJwanWhjLqv2ikT6W37IiQjuiL8Fmu4IT3lZ3T26rPz23U091Ttm91HVw6evS68T6JfrKNyX3VJTPlAnov2c6SPRBdRvTjK4f8DHrJ9jU42dw0zZndmH6+euWYn0Af2U7ApUJmbn13NN9PLDjdC8WiWh/ZBnBxtqwFRgROePyqAT+HPrJXprQBWdkKuD6fvma4z6KP7FTMNi2gM2+k77P024T+V9FHtvRms5GJjhbiYXpUaw/rI/sfIU5rfjCVi54kf32oz6SHbOdLunLzk5Vc3Nb8rw/1mfSQHQrZ3Gt+4k/Ew+bHyZazzYPmJ0D25822XNts2fwgkk7OPk+2/X1Io8XnRfJMqGuu4PFBPMwOapUT+8jORfpNCvjzSLjBR2Zprjx1sK1M02ImlzZV7AgGZJPE6DIubcI1SEu2xvVBZwXKTHSnlo9D2Zp+g8XZCHhz6edb3xgn+wU8gDHvu9/zy4CyaRein43gdGuUWaZpcVhRpJN3y/hThncLoldBF9kD/2EpTbMUO233lT3Yzx4Y2dv3avgBPWUPUvOujb1W66x9pq/sMiO77ejUXqqnur9sJyrsGwZMUyxRudJb9mCQpGa7XE7Mg5I3f38ie+DMD+fbbXrxdnq+4T76ihWKazyLMX4TdoYXTfPxPt3pRXnMLvTdem+8Z8xPwD+dTsGFaXBpadgILv/s3uqFrh/HsZ+M3zDa5+H87/pv2jihG0f5KnYffQ+O48arPIqT8CO+LcMPiq+ZaVmWObMP+W3p4/kwMyujr6PnK3bu6uBuMni6YNYk6FaJwnzNbXBQta0sVzeqlex11trIKCvylpG/I519m+3U62SoCY/2jcSTWo06qePdMiqtDu8a9n9kPrnTqwCz7XF6KzU9wzMlHd3V73ZoME8EtoV1z0hjmYqR7figL4XXGXdwb64vVuk7x/8zllAQPSekILgR+zrd0eOWndn+zSL+mASopnaxPgWnhThZE65ftjFwkX35MWvHfaZappqCfZjnSRnDHGOlXSaXWsdqW25MNjOP6TJjjf48Fnzza34ZSSFGzybiZj4p1zu1ragK5OFByqZmaoSOE45y2G1Md2pFc9l+QnWQlrkF14fyf7J+SAtZVshgA1M7t/nVhLK9sHmdE23Aah3K9c9AMSUEurlSfeVGVi9tWvVPhuMr9d8lYFpZozTsgyin1I1nIm507GoP8sikhRbKTGXWEOekit5vz0X1u24S9tp5CdVk7wrJmo/vgZer1M0QC9lfVdT2eFv20ZC9K63rj1iaKdW7AmRXIakjmyzGQrb9IZ1KvnTyauPtyGZp+HGdSnMh0qwuLTuy7elAtuO11nYuch2qqRTSXJGk1Q2GXdnRQHYS283rrpMIaeSoUpo2kmnn5DpdnUiu+YOl+CqsxlELZrZqdRhPhaKqP/66b+ti0ZLFCAQ+jQNfDlPpGXzzLgU/Igad8NdSyuWPcFlnb+ez1Uh6Ocjcw0B+GzBVV4EwA7qXtaRY9tmVPj5wQG2F6ftLtu74KSgzkYNKKXnJEL79UqSrxE3ygyZUX/My+GYQIfp66y13jbqjrVzzSgELJcQ2TRMWhqvtfAo1UsJYs7WBq1c09h8VB60qLRvvHl2Dk4lKu1fF8H4pmC/qbcl9+I6nYp2XF5ztvflmoODi2/fmm3KlKiuS4e1Xs3mjQJbcqaeziXLhrCbadSecsWWzCuye7K5wwtdqvRLUwBjy5sUeMY+r9lbsxFmrVYnMjpFSSWmH0KOckSuM8WN8K/9w5geb1VaE8eymlWIk+3RxZh3E96fQ8Yfrq5X3wEo1+vXv/O+7fBAEQRAEQRAEQRAEQRAEQRAEQRDkx/wLuEhWCYbuvvwAAAAASUVORK5CYII=',
    theme: {
      primaryColor: '	#FF0000',
      secondaryColor: '#FFFF00',
    },
    // redirect_url: 'finezzy://signzy/video',
    redirect_url: Config.DIGIO_VIDEO_REDIRECT_URL,
  };

  const onSuccess = t => {
    console.log(t);
    showNativeAlert('Done');
    navigation.goBack();
  };

  const onCancel = () => {
    console.log('Cancel Response from Digio SDk ');
  };

  return (
    <DigioRNComponent
      onSuccess={onSuccess}
      onCancel={onCancel}
      options={options}
      digioDocumentId={route.params.digioDocumentId}
      identifier={route.params.digioUserIdentifier}
    />
  );
};

export default DigioSDK;
