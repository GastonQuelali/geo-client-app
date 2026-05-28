# Overview

**geo-client-app** is a mobile GIS viewer built with Expo/React Native. It displays an interactive map of cadastral and urban planning data for **Cochabamba, Bolivia**, served by the Direccion de Administracion Geografica y Catastro.

The app renders an [ArcGIS JavaScript API](https://js.arcgis.com) map inside a React Native `WebView`, connecting to a local ArcGIS Server that hosts geospatial layers (property boundaries, blocks, streets, land use, zoning, satellite imagery, etc.).

## Features

- **Interactive map** with dozens of operational layers (predios, manzanas, vias, uso de suelo, limites, etc.)
- **Satellite basemaps** from 7 different years (2015–2023)
- **Search** for properties by cadastral code, block number, or street name
- **Popup details** showing area, perimeter, cadastral code, district, and more
- **Layer visibility** toggles via the LayerList widget
- **Legend** widget for active layers
- **Dual map loading mode**: static bundled HTML or dynamic server-generated HTML
- **Configurable server** IP, port, and protocol from the settings screen
- **Dark/light theme** toggle

## Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Map | `/` | Main screen with WebView map + settings FAB |
| Settings | `/settings` | Server configuration, theme toggle |

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 54 / React Native 0.81 |
| Routing | expo-router (file-based) |
| Map rendering | ArcGIS JavaScript API 4.18 in WebView |
| HTTP client | Axios |
| Local storage | expo-secure-store |
| OTA updates | expo-updates / EAS |
| Icons | Ionicons via react-native-svg |
