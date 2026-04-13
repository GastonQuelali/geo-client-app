import React, { useRef, useEffect } from 'react';
import { WebView, WebViewProps } from 'react-native-webview';
import { StyleSheet } from 'react-native';

interface MapaWebViewProps {
  htmlContent: string | null;
  token: string | null;
  onMessage?: (event: any) => void;
}

export const MapaWebView: React.FC<MapaWebViewProps> = ({
  htmlContent,
  token,
  onMessage,
}) => {
  const webViewRef = useRef<WebView>(null);

  const injectedJavaScript = `
    (function() {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.postMessage = function(data) {
          window.ReactNativeWebView.postMessage(data);
        };
      }
    })();
    true;
  `;

  useEffect(() => {
    if (webViewRef.current && htmlContent) {
      const htmlWithToken = htmlContent.replace(
        '{{SESSION_TOKEN}}',
        token || ''
      );
      webViewRef.current.injectJavaScript(`
        (function() {
          window.sessionToken = "${token || ''}";
          window.postMessage(JSON.stringify({ type: 'TOKEN_SET', token: "${token || ''}" }));
        })();
        true;
      `);
    }
  }, [htmlContent, token]);

  if (!htmlContent) {
    return null;
  }

  return (
    <WebView
      ref={webViewRef}
      style={styles.webView}
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      mixedContentMode="always"
      onMessage={onMessage}
      injectedJavaScript={injectedJavaScript}
      startInLoadingState={true}
      scalesPageToFit={true}
    />
  );
};

const styles = StyleSheet.create({
  webView: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});