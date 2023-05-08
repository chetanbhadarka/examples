import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import CustomReactionButton from '../components/CustomReactionButton';

export default function ReactionButtonScreen({navigation, route}) {
  const params = route.params;
  const [selectedReaction, setSelectedReaction] = useState('none');

  useEffect(() => {
    navigation.setOptions({
      headerTitle: params.title || '',
    });
  }, []);

  return (
    <View style={styles.container}>
      <CustomReactionButton
        textStyle={{marginLeft: 10}}
        onButtonSelected={type => setSelectedReaction(type)}
        defaultVal={'none'}
      />

      <Text style={styles.text}>Reaction Button Example</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    marginTop: 20,
    textAlign: 'center',
  },
});
