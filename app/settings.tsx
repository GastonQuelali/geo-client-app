import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useServerConfig } from "../src/hooks/useServerConfig";
import { useTheme } from "../src/hooks/useTheme";
import { useRouter } from "expo-router";

export default function Settings() {
  const { theme, isDark, toggleTheme } = useTheme();
  const {
    dynamicPageEnabled,
    serverIP,
    protocol,
    port,
    toggleDynamicPage,
    saveServerIP,
    saveProtocol,
    savePort,
  } = useServerConfig();

  const [tempIP, setTempIP] = useState(serverIP);
  const [tempProtocol, setTempProtocol] = useState(protocol);
  const [tempPort, setTempPort] = useState(port);
  const router = useRouter();

  useEffect(() => {
    setTempIP(serverIP);
    setTempProtocol(protocol);
    setTempPort(port);
  }, [serverIP, protocol, port]);

  const handleSave = useCallback(async () => {
    await saveProtocol(tempProtocol);
    await saveServerIP(tempIP);
    await savePort(tempPort);
    router.back();
  }, [
    tempProtocol,
    tempIP,
    tempPort,
    saveProtocol,
    saveServerIP,
    savePort,
    router,
  ]);

  const handleToggleDynamic = useCallback(async () => {
    await toggleDynamicPage();
  }, [toggleDynamicPage]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background.primary }]}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
            Apariencia
          </Text>

          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.border.default,
              },
            ]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name={isDark ? "moon" : "sunny"}
                  size={24}
                  color={theme.accent.blue}
                />
                <Text
                  style={[styles.settingLabel, { color: theme.text.primary }]}
                >
                  Modo Oscuro
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{
                  false: theme.border.subtle,
                  true: theme.accent.blue,
                }}
                thumbColor={isDark ? theme.accent.green : "#f4f3f4"}
              />
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text.secondary }]}>
            Configuración del servidor
          </Text>

          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.background.secondary,
                borderColor: theme.border.default,
              },
            ]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Ionicons
                  name="globe-outline"
                  size={24}
                  color={theme.accent.blue}
                />
                <Text
                  style={[styles.settingLabel, { color: theme.text.primary }]}
                >
                  Página dinámica
                </Text>
              </View>
              <Switch
                value={dynamicPageEnabled}
                onValueChange={handleToggleDynamic}
                trackColor={{
                  false: theme.border.subtle,
                  true: theme.accent.blue,
                }}
                thumbColor={dynamicPageEnabled ? theme.accent.green : "#f4f3f4"}
              />
            </View>
          </View>
        </View>

        {dynamicPageEnabled && (
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: theme.text.secondary }]}
            >
              Conexión
            </Text>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.background.secondary,
                  borderColor: theme.border.default,
                },
              ]}
            >
              <View style={styles.inputContainer}>
                <Text
                  style={[styles.inputLabel, { color: theme.text.secondary }]}
                >
                  Protocolo
                </Text>
                <View style={styles.protocolRow}>
                  <TouchableOpacity
                    style={[
                      styles.protocolButton,
                      {
                        backgroundColor:
                          tempProtocol === "http"
                            ? theme.accent.blue
                            : theme.background.tertiary,
                      },
                    ]}
                    onPress={() => setTempProtocol("http")}
                  >
                    <Text
                      style={[
                        styles.protocolButtonText,
                        {
                          color:
                            tempProtocol === "http"
                              ? "#fff"
                              : theme.text.secondary,
                        },
                      ]}
                    >
                      HTTP
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.protocolButton,
                      {
                        backgroundColor:
                          tempProtocol === "https"
                            ? theme.accent.blue
                            : theme.background.tertiary,
                      },
                    ]}
                    onPress={() => setTempProtocol("https")}
                  >
                    <Text
                      style={[
                        styles.protocolButtonText,
                        {
                          color:
                            tempProtocol === "https"
                              ? "#fff"
                              : theme.text.secondary,
                        },
                      ]}
                    >
                      HTTPS
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.border.default },
                ]}
              />

              <View style={styles.inputContainer}>
                <Text
                  style={[styles.inputLabel, { color: theme.text.secondary }]}
                >
                  IP del servidor
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      borderColor: theme.border.default,
                      backgroundColor: theme.background.tertiary,
                      color: theme.text.primary,
                    },
                  ]}
                  value={tempIP}
                  onChangeText={setTempIP}
                  placeholder="Ej: 200.58.81.12"
                  placeholderTextColor={theme.text.muted}
                  autoCapitalize="none"
                />
              </View>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.border.default },
                ]}
              />

              <View style={styles.inputContainer}>
                <Text
                  style={[styles.inputLabel, { color: theme.text.secondary }]}
                >
                  Puerto (vacío = sin puerto)
                </Text>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      borderColor: theme.border.default,
                      backgroundColor: theme.background.tertiary,
                      color: theme.text.primary,
                    },
                  ]}
                  value={tempPort}
                  onChangeText={setTempPort}
                  placeholder="6080"
                  placeholderTextColor={theme.text.muted}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.border.subtle },
                ]}
                onPress={() => router.back()}
              >
                <Text
                  style={[styles.buttonText, { color: theme.text.primary }]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.accent.blue }]}
                onPress={handleSave}
              >
                <Text style={[styles.buttonText, { color: "#fff" }]}>
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  section: { paddingHorizontal: 16, marginBottom: 24, paddingTop: 20 },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  card: { borderRadius: 12, borderWidth: 1, overflow: "hidden" },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  settingInfo: { flexDirection: "row", alignItems: "center" },
  settingLabel: { fontSize: 16, marginLeft: 12 },
  divider: { height: 1, marginHorizontal: 16 },
  inputContainer: { padding: 16 },
  inputLabel: { fontSize: 14, marginBottom: 8 },
  protocolRow: { flexDirection: "row", gap: 12 },
  protocolButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  protocolButtonText: { fontSize: 16, fontWeight: "600" },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 16,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 6,
  },
  buttonText: { fontSize: 16, fontWeight: "600" },
});
