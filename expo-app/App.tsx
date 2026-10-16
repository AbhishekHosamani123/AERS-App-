import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
// @ts-ignore react-native-webview ships RN-only types; Expo Go runtime works fine
import { WebView } from 'react-native-webview';
import { LOAD_TIMEOUT_MS, WEB_URL } from './config';

/**
 * Expo Go wrapper for the AERS Vite web app.
 *
 * Loads the running Vite dev server (or a deployed URL) inside a full-screen
 * WebView. This is the idiomatic way to run a Vite React web app inside
 * Expo Go without rewriting it to React Native — no native code needed.
 *
 * Before scanning the QR code:
 *   1. `cd "D:/ASV/RedBus Clone" && npm run dev -- --host --port 5173`
 *   2. Or set EXPO_PUBLIC_WEB_URL=https://<your-vercel>.vercel.app
 *      then this wrapper works without a local Vite server.
 */

const AERS_BLUE = '#0066F5';
const AERS_BLUE_DARK = '#004EC4';

export default function App() {
  const { height: winH } = useWindowDimensions();
  const webViewRef = useRef<WebView>(null);

  const [webUrl] = useState(() => WEB_URL);
  const [canGoBack, setCanGoBack] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const [webError, setWebError] = useState<string | null>(null);

  const injectedJS = useMemo(
    () => `
(function() {
  // Make sure viewport + theme-color are set correctly
  try {
    var v = document.querySelector('meta[name="viewport"]');
    if (!v) {
      v = document.createElement('meta');
      v.name = 'viewport';
      v.content = 'width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content';
      document.head.appendChild(v);
    }
    // Nudge Vite HMR websocket hint off-screen if present
  } catch(e) {}
})();
true;
`,
    []
  );

  // Load timeout: if WebView hasn't finished in LOAD_TIMEOUT_MS, show help overlay
  useEffect(() => {
    if (!loading) {
      setLoadTimedOut(false);
      return;
    }
    const t = setTimeout(() => setLoadTimedOut(true), LOAD_TIMEOUT_MS);
    return () => clearTimeout(t);
  }, [loading]);

  const handleNavStateChange = useCallback(
    (nav: { canGoBack?: boolean }) => {
      setCanGoBack(!!nav.canGoBack);
    },
    []
  );

  // Android hardware back -> WebView history, then exit
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [canGoBack]);

  const openExternal = useCallback(async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch {}
  }, []);

  const handleShouldStartLoad = useCallback(
    (request: { url: string; navigationType: string }) => {
      const url = request.url;
      // Let the WebView handle all http(s) navigation to the same host + Vite HMR
      if (url.startsWith(webUrl) || url.startsWith('http://10.') || url.startsWith('http://192.168.') || url.startsWith('http://172.')) {
        return true;
      }
      // about:blank, data:, file: etc — allow
      if (url.startsWith('about:') || url.startsWith('data:')) return true;

      // External links (tel:, mailto:, https to other domains) -> OS handler
      if (url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('https://')) {
        // Internal SPA navigations will have already been caught by webUrl check above
        // if the URL is actually the same deployed host; for local dev, anything https is external
        if (webUrl.startsWith('https://') && url.startsWith(webUrl)) return true;
        // Otherwise open externally
        if (url.startsWith('https://') && !url.startsWith(webUrl) && !webUrl.startsWith('http://10.') && !webUrl.startsWith('http://192.168.')) {
          // Only intercept truly external https (e.g. support links) — don't break internal routing
          // For local dev, internal is http://<LAN>:5173; for prod, it's the vercel host
          // So we allow any url that starts with webUrl origin
          try {
            const targetOrigin = new URL(url).origin;
            const allowedOrigin = new URL(webUrl).origin;
            if (targetOrigin === allowedOrigin) return true;
          } catch {}
          openExternal(url);
          return false;
        }
      }
      return true;
    },
    [webUrl, openExternal]
  );

  const reload = useCallback(() => {
    setWebError(null);
    setLoadTimedOut(false);
    setLoading(true);
    webViewRef.current?.reload();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* AERS top bar — shows while content loads and as a brand header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoDot} />
          <Text style={styles.headerTitle}>AERS</Text>
          <Text style={styles.headerSub}>Learn · Prepare · Succeed</Text>
        </View>
        {canGoBack ? (
          <TouchableOpacity
            onPress={() => webViewRef.current?.goBack()}
            hitSlop={12}
            style={styles.backBtn}
            accessibilityLabel="Go back"
          >
            <Text style={styles.backBtnText}>‹ Back</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={[styles.webWrap, { height: winH }]}>
        {/* @ts-ignore react-native-webview works at runtime, types incomplete */}
        <WebView
          ref={webViewRef}
          source={{ uri: webUrl }}
          style={styles.webview}
          originWhitelist={['*']}
          javaScriptEnabled
          domStorageEnabled
          allowFileAccess
          allowFileAccessFromFileURLs
          mixedContentMode="always"
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          startInLoadingState={false}
          injectedJavaScriptBeforeContentLoaded={injectedJS}
          onNavigationStateChange={handleNavStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          onLoadStart={() => {
            setLoading(true);
            setWebError(null);
          }}
          onLoadEnd={() => setLoading(false)}
          onLoadProgress={({ nativeEvent }: any) => {
            if (nativeEvent.progress >= 1) setLoading(false);
          }}
          onError={(e: any) => {
            const msg = e.nativeEvent.description || 'Failed to load the web app.';
            setWebError(msg);
            setLoading(false);
          }}
          onHttpError={(e: any) => {
            // 404/500 from dev server — still surface as error if page blank
            if (e.nativeEvent.statusCode >= 400) {
              setWebError(`HTTP ${e.nativeEvent.statusCode} — ${e.nativeEvent.description || 'server error'}`);
            }
          }}
          renderError={(name: any, code: any, desc: any) => (
            <CenterMessage
              title="WebView error"
              body={`${name} (${code}): ${desc}`}
              url={webUrl}
              onRetry={reload}
            />
          )}
        />

        {/* Centered spinner over WebView while first load is in flight */}
        {loading && !webError ? (
          <View pointerEvents="none" style={styles.loadingOverlay}>
            <View style={styles.loadingCard}>
              <ActivityIndicator size="large" color={AERS_BLUE} />
              <Text style={styles.loadingTitle}>Loading AERS…</Text>
              <Text style={styles.loadingUrl} numberOfLines={1}>
                {webUrl}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Connection help — shown after LOAD_TIMEOUT_MS or on error */}
        {(loadTimedOut || webError) && !loading ? (
          <View style={styles.helpOverlay}>
            <View style={styles.helpCard}>
              <View style={styles.helpBadge}>
                <Text style={styles.helpBadgeText}>{webError ? 'CONNECTION FAILED' : 'TAKING A WHILE'}</Text>
              </View>
              <Text style={styles.helpTitle}>
                {webError ? 'Could not reach the AERS web app' : 'Still connecting…'}
              </Text>
              <Text style={styles.helpBody}>
                {webError
                  ? webError
                  : `The app is trying to load:\n${webUrl}\n\nThis usually means the Vite dev server is not running.`}
              </Text>

              <View style={styles.stepsBox}>
                <Text style={styles.stepsTitle}>Fix in 30 seconds</Text>
                <Text style={styles.stepText}>1. On your laptop, run:</Text>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>cd "D:/ASV/RedBus Clone"</Text>
                  <Text style={styles.codeText}>npm run dev -- --host --port 5173</Text>
                </View>
                <Text style={styles.stepText}>2. Confirm you see a Network URL like:</Text>
                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>Network: http://10.173.14.173:5173/</Text>
                </View>
                <Text style={styles.stepText}>3. If your IP changed, update expo-app/config.ts → DEFAULT_DEV_URL</Text>
                <Text style={styles.stepText}>4. Phone + laptop must be on the same Wi-Fi</Text>
                <Text style={styles.stepText}>5. Allow Node.js through Windows Firewall (Private network)</Text>
              </View>

              <View style={styles.helpActions}>
                <TouchableOpacity style={styles.primaryBtn} onPress={reload}>
                  <Text style={styles.primaryBtnText}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => {
                    setLoadTimedOut(false);
                    setWebError(null);
                  }}
                >
                  <Text style={styles.secondaryBtnText}>Dismiss</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.helpHint}>
                Tip: For a permanent link, deploy to Vercel and set EXPO_PUBLIC_WEB_URL. Then this wrapper works without a local server.
              </Text>
            </View>
          </View>
        ) : null}
      </View>

      {/* Bottom URL hint (tiny) — useful when debugging which host is loaded */}
      <View style={styles.footer}>
        <Text style={styles.footerText} numberOfLines={1}>
          {webUrl}
        </Text>
      </View>
    </View>
  );
}

function CenterMessage({
  title,
  body,
  url,
  onRetry,
}: {
  title: string;
  body: string;
  url: string;
  onRetry: () => void;
}) {
  return (
    <View style={styles.centerMsgWrap}>
      <Text style={styles.centerMsgTitle}>{title}</Text>
      <Text style={styles.centerMsgBody}>{body}</Text>
      <Text style={styles.centerMsgUrl}>{url}</Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={onRetry}>
        <Text style={styles.primaryBtnText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  header: {
    backgroundColor: AERS_BLUE,
    paddingTop: Platform.OS === 'android' ? 36 : 48,
    paddingBottom: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  logoDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    opacity: 0.95,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  headerSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  backBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  webWrap: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
  loadingCard: {
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    minWidth: 220,
  },
  loadingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 4,
  },
  loadingUrl: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  helpOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,23,42,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  helpCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
    gap: 10,
  },
  helpBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  helpBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: '#DC2626',
  },
  helpTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },
  helpBody: {
    fontSize: 13,
    lineHeight: 18,
    color: '#334155',
  },
  stepsBox: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
  stepsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  stepText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#334155',
  },
  codeBox: {
    backgroundColor: '#0F172A',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 2,
  },
  codeText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  helpActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: AERS_BLUE,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  secondaryBtnText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 14,
  },
  helpHint: {
    fontSize: 11,
    lineHeight: 15,
    color: '#64748b',
    fontStyle: 'italic',
  },
  footer: {
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  centerMsgWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  centerMsgTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  centerMsgBody: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
  },
  centerMsgUrl: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});
