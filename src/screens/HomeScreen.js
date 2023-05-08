import React, {useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Navigations = [
  {name: 'CircularSlider', title: 'Circular Slider'},
  {name: 'ReactionButton', title: 'Reaction Button'},
  {name: 'ReduxWithAPI', title: 'Redux with API'},
];

export default function HomeScreen({navigation}) {
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Dashboard',
      headerLeft: () => (
        <Icon name="home" size={26} style={{marginRight: 10}} color="#000" />
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      {Navigations.map((item, index) => {
        return (
          <View style={styles.btnContainer} key={index}>
            <Button
              onPress={() =>
                navigation.navigate(item.name, {title: item.title})
              }
              title={item.title}
              color="#841584"
              accessibilityLabel={item.title}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    width: '80%',
    marginTop: 10,
    alignSelf: 'center',
  },
});
