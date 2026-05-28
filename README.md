# geo-client-app

Mobile GIS viewer for cadastral data of **Cochabamba, Bolivia**. Built with Expo/React Native.

Renders an interactive ArcGIS map inside a WebView, connecting to a local ArcGIS Server with layers for properties, blocks, streets, land use, and satellite imagery (2015–2023).

## Quick start

```bash
npm install
npx expo start
```

## Features

- Interactive map with cadastral layers (predios, manzanas, vias, uso de suelo)
- Satellite basemaps from 7 years (2015–2023)
- Search by cadastral code, block number, or street name
- Configurable ArcGIS server IP, port, and protocol
- Dark/light theme
- Dual map mode: static bundled HTML or dynamic server-generated HTML

## Documentation

| Doc | Description |
|-----|-------------|
| [Overview](docs/overview.md) | Project purpose, features, screens, tech stack |
| [Architecture](docs/architecture.md) | System architecture, data flow, key modules |
| [Map Layers](docs/map-layers.md) | ArcGIS layer catalog, popups, spatial reference |
| [Server Configuration](docs/server-configuration.md) | Server settings, map modes, network config |
| [API](docs/api.md) | Backend API endpoints, authentication |
| [Deployment](docs/deployment.md) | EAS Build, OTA updates, local dev |

## Tech stack

Expo SDK 54 · React Native 0.81 · expo-router · ArcGIS JS API 4.18 · Axios · expo-secure-store

## License

Private — internal use.
