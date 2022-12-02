/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {SkiaD3LineGraph} from 'uin';
import {getSingleLineGraphData} from 'services';
import {useWindowDimensions} from 'react-native';

export default function () {
  const singleLineGraphData = getSingleLineGraphData();

  const window = useWindowDimensions();
  const {width} = window;

  const graphWidth = width * 0.8;
  const graphHeight = Math.min(graphWidth, window.height) / 2;
  const canvasHeight = graphHeight * 2 + 40;
  const canvasWidth = width;

  return (
    <ScrollView style={{paddingTop: 55}}>
      <View style={{flex: 1, paddingBottom: 100, paddingHorizontal: 24}}>
        <View style={{paddingVertical: 12}}>
          <Heading title="Single Line Graph" />
        </View>
        <View>
          <SkiaD3LineGraph
            data={singleLineGraphData}
            yAxisLine={false}
            xAxisLine={true}
            enablePointsGrid={false}
            enableWholeCanvasGrid={false}
            defaultPosition={0}
            graphHeight={graphHeight}
            graphWidth={graphWidth}
            canvasHeight={canvasHeight}
            canvasWidth={canvasWidth}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const Heading = ({title}) => {
  return (
    <View style={styles.headingWrapperStyle}>
      <Text style={styles.textStyle}>{title}</Text>
      <View style={styles.lineStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  headingWrapperStyle: {
    marginBottom: 12,
  },
  textStyle: {
    fontSize: 32,
    fontWeight: '800',
    paddingVertical: 8,
  },
  lineStyle: {
    // borderBottomWidth: 1,
    // borderColor: 'black',
  },
});
