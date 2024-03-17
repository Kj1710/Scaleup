import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React , {useEffect} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import data from '../Data/Data';
import CustomButton from '../components/CustomButton';
import Page from '../components/Page';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

const Welcome = () => {
  const router = useRouter();
  useEffect(() => {
    const checkWelcomeScreen = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          router.push("/(tabs)/home");
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkWelcomeScreen();
  },[]);


  
    const {width: SCREEN_WIDTH} = useWindowDimensions();
    const flatListRef = useAnimatedRef(null);
    const x = useSharedValue(0);
    const flatListIndex = useSharedValue(0);
  
    const onViewableItemsChanged = ({viewableItems}) => {
      flatListIndex.value = viewableItems[0].index;
    };
  
    const onScroll = useAnimatedScrollHandler({
      onScroll: event => {
        x.value = event.contentOffset.x;
      },
    });
    const RenderItem = ({item, index}) => {
      const imageAnimationStyle = useAnimatedStyle(() => {
        const opacityAnimation = interpolate(
          x.value,
          [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          [0, 1, 0],
          Extrapolation.CLAMP,
        );
        const translateYAnimation = interpolate(
          x.value,
          [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          [100, 0, 100],
          Extrapolation.CLAMP,
        );
        return {
          opacity: opacityAnimation,
          width: SCREEN_WIDTH * 0.8,
          height: SCREEN_WIDTH * 0.8,
          transform: [{translateY: translateYAnimation}],
        };
      });
      const textAnimationStyle = useAnimatedStyle(() => {
        const opacityAnimation = interpolate(
          x.value,
          [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          [0, 1, 0],
          Extrapolation.CLAMP,
        );
        const translateYAnimation = interpolate(
          x.value,
          [
            (index - 1) * SCREEN_WIDTH,
            index * SCREEN_WIDTH,
            (index + 1) * SCREEN_WIDTH,
          ],
          [100, 0, 100],
          Extrapolation.CLAMP,
        );
  
        return {
          opacity: opacityAnimation,
          transform: [{translateY: translateYAnimation}],
        };
      });
      return (
        <View style={[styles.itemContainer, {width: SCREEN_WIDTH}]}>
          <Animated.Image source={item.image} style={imageAnimationStyle} />
          <Animated.View style={textAnimationStyle}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemText}>{item.text}</Text>
          </Animated.View>
        </View>
      );
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Animated.FlatList
          ref={flatListRef}
          onScroll={onScroll}
          data={data}
          renderItem={({item, index}) => {
            return <RenderItem item={item} index={index} />;
          }}
          keyExtractor={item => item.id}
          scrollEventThrottle={16}
          horizontal={true}
          bounces={false}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            minimumViewTime: 300,
            viewAreaCoveragePercentThreshold: 10,
          }}
        />
        <View style={styles.bottomContainer}>
          <Page data={data} x={x} screenWidth={SCREEN_WIDTH} />
          <CustomButton
            flatListRef={flatListRef}
            flatListIndex={flatListIndex}
            dataLength={data.length}
          />
        </View>
      </SafeAreaView>
    );
  };
  
  export default Welcome;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#8DDFFF',
    },
    itemContainer: {
      flex: 1,
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#8DDFFF',
    },
    itemTitle: {
      textAlign: 'center',
      fontSize: 25,
      fontWeight: 'bold',
      marginBottom: 30,
      color: 'black',
    },
    itemText: {
      fontSize: 17,
      textAlign: 'center',
      marginHorizontal: 35,
      color: 'black',
      lineHeight: 20,
    },
    bottomContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 20,
      paddingVertical: 20,
    },
  });
 