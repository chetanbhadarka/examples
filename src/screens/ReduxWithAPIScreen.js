import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {getMoreImage, loadImage} from '../redux/actions/LoadImagesAction';

export default function ReduxWithAPIScreen({navigation, route}) {
  const params = route.params;
  const dispatch = useDispatch();
  const ImageReducerState = useSelector(state => state.ImageReducer);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    onRefresh();
    navigation.setOptions({
      headerTitle: params.title || '',
    });
  }, []);

  useEffect(() => {
    setIsRefreshing(ImageReducerState.loading);
  }, [ImageReducerState.loading]);

  const onRefresh = () => {
    setIsRefreshing(true);
    dispatch(loadImage());
  };

  const onEndReached = d => {
    if (d.distanceFromEnd > 0) {
      dispatch(getMoreImage(ImageReducerState.pageNo + 1));
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
          paddingVertical: 5,
        }}
        data={ImageReducerState.data}
        extraData={ImageReducerState.data}
        keyExtractor={(item, index) => index}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        numColumns={2}
        key={2}
        renderItem={({item, index}) => {
          return (
            <View
              key={index}
              style={[
                styles.itemContainer,
                {
                  marginRight: index % 2 == 0 ? 5 : 7.5,
                  marginLeft: index % 2 == 0 ? 7.5 : 5,
                },
              ]}>
              <Image
                source={{uri: item.download_url}}
                style={styles.itemImage}
              />
            </View>
          );
        }}
        ListEmptyComponent={() => {
          return (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {'No Data Found.\n\nPull Down to Refresh.'}
              </Text>
            </View>
          );
        }}
        onEndReached={onEndReached}
        onEndReachedThreshold={1}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get('window').height,
  },
  itemContainer: {
    flex: 1,
    borderRadius: 4,
    marginVertical: 5,
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  itemImage: {
    height: 100,
    width: 'auto',
    resizeMode: 'cover',
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontFamily: 'Ubuntu-Bold',
    textAlign: 'center',
  },
});
