import React, { useState, useRef, useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, Modal, Switch, TextInput, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useServerConfig } from './src/hooks/useServerConfig';
import { getMapHTML } from './src/assets/mapTemplate';

export default function App() {
  const { dynamicPageEnabled, serverIP, isLoading, toggleDynamicPage, saveServerIP } = useServerConfig();
  const [showSettings, setShowSettings] = useState(false);
  const [tempIP, setTempIP] = useState(serverIP);
  const [webViewKey, setWebViewKey] = useState(1);
  const webViewRef = useRef(null);

  const handleSaveSettings = useCallback(async () => {
    await saveServerIP(tempIP);
    setShowSettings(false);
    setWebViewKey(prev => prev + 1);
  }, [tempIP, saveServerIP]);

  const handleToggleDynamic = useCallback(async () => {
    await toggleDynamicPage();
    setWebViewKey(prev => prev + 1);
  }, [toggleDynamicPage]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.webviewContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </SafeAreaView>
    );
  }

  const webViewSource = dynamicPageEnabled
    ? { html: getMapHTML(serverIP) }
    : require('./src/assets/mobile4.html');

  return (
    <SafeAreaView style={styles.webviewContainer}>
      <WebView
        key={webViewKey}
        ref={webViewRef}
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
        onPress={() => {
          setTempIP(serverIP);
          setShowSettings(true);
        }}
      >
        <Text style={styles.settingsIcon}>⚙</Text>
      </TouchableOpacity>

      <Modal
        visible={showSettings}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Configuración</Text>

            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Página dinámica</Text>
              <Switch
                value={dynamicPageEnabled}
                onValueChange={handleToggleDynamic}
              />
            </View>

            {dynamicPageEnabled && (
              <>
                <Text style={styles.inputLabel}>IP del servidor:</Text>
                <TextInput
                  style={styles.textInput}
                  value={tempIP}
                  onChangeText={setTempIP}
                  placeholder="Ej: 200.58.81.12"
                  autoCapitalize="none"
                  keyboardType="numeric"
                />
              </>
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowSettings(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveSettings}
              >
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});