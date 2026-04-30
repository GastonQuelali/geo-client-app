import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, TextInput, TouchableOpacity } from 'react-native';
import { useServerConfig } from '../src/hooks/useServerConfig';
import { useRouter } from 'expo-router';

export default function Settings() {
  const { dynamicPageEnabled, serverIP, toggleDynamicPage, saveServerIP } = useServerConfig();
  const [tempIP, setTempIP] = useState(serverIP);
  const router = useRouter();

  useEffect(() => {
    setTempIP(serverIP);
  }, [serverIP]);

  const handleSave = useCallback(async () => {
    await saveServerIP(tempIP);
    router.back();
  }, [tempIP, saveServerIP, router]);

  const handleToggle = useCallback(async () => {
    await toggleDynamicPage();
  }, [toggleDynamicPage]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Página dinámica</Text>
          <Switch
            value={dynamicPageEnabled}
            onValueChange={handleToggle}
          />
        </View>

        {dynamicPageEnabled && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>IP del servidor:</Text>
            <TextInput
              style={styles.textInput}
              value={tempIP}
              onChangeText={setTempIP}
              placeholder="Ej: 200.58.81.12"
              autoCapitalize="none"
              keyboardType="numeric"
            />
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 16,
    color: '#2E7D32',
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
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
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
