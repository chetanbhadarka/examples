import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import CustomCircularSlider from '../components/CustomCircularSlider';

export default function CircularSlider({route, navigation}) {
  const params = route.params;

  const [startAngle, setStartAngle] = useState(0);
  const [angleLength, setAngleLength] = useState(0);
  const [currency, setCurrency] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: params.title || '',
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Circular Slider */}
      <CustomCircularSlider
        startAngle={startAngle}
        angleLength={angleLength}
        onUpdate={({startAngle, angleLength}) => {
          setStartAngle(startAngle);
          setAngleLength(angleLength);
          let val = 1000 / (6.28 / angleLength);
          setCurrency(Math.round(val));
        }}
        segments={2}
        strokeWidth={26}
        radius={120}
        showClockFace={false}>
        <View style={styles.subContainer}>
          <Text style={styles.labelText}>{'Minimum'}</Text>
          <Text style={styles.itemText}>{`$${currency}K`}</Text>
        </View>
      </CustomCircularSlider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10
  },
  subContainer: {
    alignItems: 'center',
  },
  labelText: {
    fontSize: 24,
    fontFamily: 'roboto',
    color: '#484C4F',
    textAlign: 'center',
  },
  itemText: {
    fontSize: 46,
    fontFamily: 'roboto-bold',
    color: '#54478E',
    textAlign: 'center',
  },
});
