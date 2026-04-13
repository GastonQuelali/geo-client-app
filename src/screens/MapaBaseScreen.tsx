import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { MapaWebView } from '../components/MapaWebView';
import { FabButton } from '../components/FabButton';
import { apiService } from '../services/api';
import { useAppInit } from '../hooks/useAppInit';

interface MapaBaseScreenProps {
  route?: {
    params?: {
      mapSlug?: string;
    };
  };
}

export const MapaBaseScreen: React.FC<MapaBaseScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { isLoading: isAppLoading, appSessionToken, maps } = useAppInit();
  
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [isMapLoading, setIsMapLoading] = useState(false);
  const [currentMapSlug, setCurrentMapSlug] = useState<string | null>(null);

  const fetchMapHtml = useCallback(async (slug: string) => {
    try {
      setIsMapLoading(true);
      const response = await apiService.getMapHtml(slug);
      setHtmlContent(response.html_legacy);
      setCurrentMapSlug(slug);
    } catch (error) {
      console.error('Error fetching map:', error);
      Alert.alert('Error', 'No se pudo cargar el mapa');
    } finally {
      setIsMapLoading(false);
    }
  }, []);

  useEffect(() => {
    const mapSlug = route?.params?.mapSlug || (maps.length > 0 ? maps[0].slug : null);
    if (mapSlug && mapSlug !== currentMapSlug) {
      fetchMapHtml(mapSlug);
    }
  }, [route?.params?.mapSlug, maps, currentMapSlug, fetchMapHtml]);

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleMapChange = (slug: string) => {
    fetchMapHtml(slug);
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  if (isAppLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isMapLoading && (
        <View style={styles.mapLoadingOverlay}>
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      )}
      
      <MapaWebView 
        htmlContent={htmlContent} 
        token={appSessionToken}
      />
      
      <FabButton onPress={handleOpenDrawer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1,
  },
});