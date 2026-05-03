import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, ActivityIndicator, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useServerConfig } from '../src/hooks/useServerConfig';
import { getMapHTML } from '../src/assets/mapTemplate';
import { useRouter } from 'expo-router';

export default function Index() {
  const { dynamicPageEnabled, serverIP, protocol, port, isLoading } = useServerConfig();
  const [webViewKey, setWebViewKey] = useState(1);
  const router = useRouter();

  const openSettings = useCallback(() => {
    router.push('/settings');
  }, [router]);

  if (isLoading) {
    return (
      <View style={styles.webviewContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  const webViewSource = dynamicPageEnabled
    ? { html: getMapHTML(protocol, serverIP, port) }
    : require('../src/assets/mobile4.html');

  return (
    <View style={styles.webviewContainer}>
      <WebView
        key={webViewKey}
        originWhitelist={['*']}
        source={webViewSource}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        mixedContentMode="always"
      />

      <TouchableOpacity
        style={styles.settingsButton}
        onPress={openSettings}
        activeOpacity={0.7}
      >
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  webviewContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  settingsButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 22,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
