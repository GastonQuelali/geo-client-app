import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MapItem } from '../types';

const Drawer = createDrawerNavigator();

const HomeScreen = ({ maps }: { maps: MapItem[] }) => (
  <View style={styles.container}>
    <Text>Mapas: {maps.length}</Text>
  </View>
);

export const AppNavigator = ({ maps }: { maps: MapItem[] }) => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home">
        {() => <HomeScreen maps={maps} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});