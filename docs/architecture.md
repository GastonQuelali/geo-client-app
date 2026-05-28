# Architecture

## Overview

```
┌──────────────────────────────────────────────────────────┐
│                    Mobile Device                          │
│                                                           │
│  ┌────────────────────────────────────────────────────┐   │
│  │              Expo / React Native                    │   │
│  │                                                      │   │
│  │  ┌──────────┐   ┌────────────┐   ┌──────────────┐   │   │
│  │  │  Map      │   │  Settings  │   │  Theme        │   │   │
│  │  │  Screen   │──▶│  Screen   │   │  Context      │   │   │
│  │  └─────┬────┘   └────────────┘   └──────────────┘   │   │
│  │        │                                              │   │
│  │  ┌─────▼──────────────────────────────────────┐      │   │
│  │  │           WebView (WKWebView)               │      │   │
│  │  │  ┌────────────────────────────────────────┐ │      │   │
│  │  │  │  ArcGIS JavaScript API 4.18            │ │      │   │
│  │  │  │   - MapImageLayer (operational layers)  │ │      │   │
│  │  │  │   - TileLayer (satellite basemaps)      │ │      │   │
│  │  │  │   - FeatureLayer (search)               │ │      │   │
│  │  │  │   - Widgets: Search, LayerList, Legend  │ │      │   │
│  │  │  └────────────────────────────────────────┘ │      │   │
│  │  └─────────────────────────────────────────────┘      │   │
│  └────────────────────────────────────────────────────┘   │
│                                                           │
└──────────────────────────┬────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                        ▼
┌─────────────────────┐   ┌──────────────────────────┐
│   ArcGIS Server     │   │  Custom Backend (FastAPI) │
│   192.168.105.219   │   │   172.16.65.33:8000       │
│   :6080             │   │                           │
│                     │   │  POST /api/v1/auth/       │
│   MapImageLayers    │   │    guest-token            │
│   TileLayers        │   │  GET /api/v1/map/         │
│                     │   │    public-map/{slug}      │
└─────────────────────┘   └──────────────────────────┘
```

## Two map loading modes

### Static mode (default)

Uses the bundled `src/assets/mobile4.html` file. The ArcGIS server URL is hardcoded to `http://192.168.105.219:6080`. No network request to the custom backend is needed for the map itself.

### Dynamic mode

Generates the map HTML on the fly via `getMapHTML(protocol, serverIP, port)` from `src/assets/mapTemplate.ts`. The user can configure the server IP, port, and protocol in the Settings screen. Settings are persisted in `expo-secure-store`.

## Theme system

The app uses React Context (`useTheme.tsx`) to manage dark/light themes. Theme preference is stored in `expo-secure-store` and restored on app launch.

## Data flow

1. App launches → `useAppInit` hook attempts to load map HTML from the custom backend API
2. If the API responds, the HTML content is set as the WebView source
3. If the API fails or static mode is active, the bundled `mobile4.html` is used
4. The WebView loads the HTML, which bootstraps the ArcGIS JavaScript API
5. The ArcGIS API connects to the configured ArcGIS Server to render map layers
6. User interactions (tap, search, layer toggle) happen entirely inside the WebView
7. Settings changes are persisted via `expo-secure-store` and trigger a WebView reload

## Key modules

| Module | Path | Responsibility |
|--------|------|----------------|
| Root layout | `app/_layout.tsx` | Stack navigator + theme provider + status bar |
| Map screen | `app/index.tsx` | WebView render + loading state + settings FAB |
| Settings screen | `app/settings.tsx` | Server config form + theme toggle |
| Map template | `src/assets/mapTemplate.ts` | Generates ArcGIS JS API HTML dynamically |
| Server config | `src/hooks/useServerConfig.ts` | Read/write server settings from secure storage |
| Theme hook | `src/hooks/useTheme.tsx` | Context + provider for dark/light mode |
| API service | `src/services/api.ts` | Axios client for backend API |
| App init | `src/hooks/useAppInit.ts` | Loads map content from backend on startup |
| FabButton | `src/components/FabButton.tsx` | Reusable floating action button |
| Types | `src/types/index.ts` | TypeScript type definitions |
| Theme constants | `src/constants/theme.ts` | Light and dark theme color palettes |
