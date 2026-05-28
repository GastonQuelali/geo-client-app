# Map Layers

The app connects to an ArcGIS Server that hosts multiple map services. All URLs are relative to `{protocol}://{serverIP}:{port}/arcgis/rest/services`.

## Operational layers (MapImageLayer)

These layers are rendered as dynamic map images from the ArcGIS Server.

| Layer | Service path | Description |
|-------|-------------|-------------|
| Predios | `/catastro/predios_cba/MapServer` | Cadastral property boundaries |
| Manzanas | `/catastro/manzanasdb/MapServer` | City blocks |
| Vias | `/planificacion/vias/MapServer` | Streets and roads |
| Uso de Suelo | `/planificacion/usoSuelodb/MapServer` | Land use zones |
| Limites | `/planificacion/limites/MapServer` | Administrative boundaries (districts, subdistricts, comunas) |
| OTBS | `/planificacion/OTBS/MapServer` | Ordenamiento Territorial (territorial planning) |
| Sectoriales | `/planificacion/sectorialesUsoSuelo/MapServer` | Sectorial land use |
| Registros Catastrales | `/catastro/RegistrosCatastrales/MapServer` | Cadastral records |
| Matrices | `/catastro/matrices_predios/MapServer` | Property matrices |
| Red Geodesica | `/catastro/redGeodesica/MapServer` | Geodetic network control points |

## Satellite basemaps (TileLayer)

Historical satellite imagery served as cached tile layers.

| Year | Service path |
|------|-------------|
| 2015 | `/imagenes/imagen2015/MapServer` |
| 2016 | `/imagenes/imagen2016/MapServer` |
| 2017 | `/imagenes/imagen2017/MapServer` |
| 2018 | `/imagenes/imagen2018/MapServer` |
| 2019 | `/imagenes/imagen2019/MapServer` |
| 2022 | `/imagenes/imagen2022/MapServer` |
| 2023 | `/imagenes/imagen2023/MapServer` |

Users can switch between satellite years via a dropdown button overlay on the map.

## Search layers (FeatureLayer)

| Feature | Service URL (full) | Search field |
|---------|-------------------|--------------|
| Predios | `.../catastro/predios_cba/MapServer/0` | `CodCat` (cadastral code) |
| Manzanas | `.../catastro/manzanasdb/MapServer/0` | `Manzana` (block number) |
| Vias | `.../planificacion/vias/MapServer/0` | `Nombre` (street name) |

The Search widget uses a `suggestionEnabled` true `FeatureLayer` source with `minSuggestCharacters: 3`.

## Popups

Each operational layer has popup templates configured in Spanish:

| Layer | Popup fields |
|-------|-------------|
| Predios | CodCat, Distrito, Zona, UV, Rod, Manzan, Frac, Lado, Area, Perimetro, Propietario, Direccion, Uso |
| Manzanas | Manzana, Distrito, Zona, UV, Area, Perimetro, Sector |
| Vias | Nombre, Tipo, Longitud, Ancho |
| Uso de Suelo | Nombre, Descripcion, Area |
| Limites | Nombre, Tipo, Area |

## Spatial reference

All layers use **WKID 32719** (Universal Transverse Mercator zone 19S).

## Initial extent

The map centers on Cochabamba, Bolivia:

```
xmin: 809535.2499991105
ymin: 8051190.592912175
xmax: 829216.3886370367
ymax: 8062082.735942396
```
