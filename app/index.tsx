import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useServerConfig } from '../src/hooks/useServerConfig';
import { getMapHTML } from '../src/assets/mapTemplate';
import { useRouter } from 'expo-router';

export default function Index() {
  const { dynamicPageEnabled, serverIP, isLoading } = useServerConfig();
  const [webViewKey, setWebViewKey] = useState(1);
  const router = useRouter();

  const openSettings = useCallback(() => {
    router.push('/settings');
  }, [router]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.webviewContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </SafeAreaView>
    );
  }

  const webViewSource = dynamicPageEnabled
    ? { html: getMapHTML(serverIP) }
    : require('../src/assets/mobile4.html');

  return (
    <SafeAreaView style={styles.webviewContainer}>
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
      >
        <Text style={styles.settingsIcon}>CFG</Text>
      </TouchableOpacity>
    </SafeAreaView>
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
    top: 50,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  settingsIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
