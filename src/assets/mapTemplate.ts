export const getMapHTML = (protocol: string, serverIP: string, port: string): string => {
  const portSuffix = port ? `:${port}` : '';
  return `<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <title>Dirección de Administración Geográfica y Catastro</title>
    <style>
      html,
      body {
        padding: 0;
        margin: 0;
        height: 100%;
        width: 100%;
      }

      #appContainer {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
      }

      #viewDiv {
        flex: 1;
        width: 100%;
      }

      .esri-view-height-small .esri-expand .esri-widget--panel-height-only {
        max-height: 100% !important;
      }

      .esri-ui-inner-container {
        inset: 50px 15px 30px !important;
      }

      .esri-attribution {
        display: none !important;
      }

    </style>

    <link
      rel="stylesheet"
      href="https://js.arcgis.com/4.18/esri/themes/dark/main.css"
    />
    <script src="https://js.arcgis.com/4.18/"></script>

    <script>
      require([
        "esri/Map",
        "esri/Basemap",
        "esri/views/MapView",
        "esri/Graphic",
        "esri/geometry/Extent",
        "esri/geometry/Point",
        "esri/layers/FeatureLayer",
        "esri/layers/GroupLayer",
        "esri/layers/MapImageLayer",
        "esri/layers/TileLayer",
        "esri/webmap/Bookmark",
        "esri/widgets/BasemapGallery",
        "esri/widgets/Bookmarks",
        "esri/widgets/Expand",
        "esri/widgets/Fullscreen",
        "esri/widgets/Home",
        "esri/widgets/LayerList",
        "esri/widgets/Legend",
        "esri/widgets/Search",
      ], function (
        Map,
        Basemap,
        MapView,
        Graphic,
        Extent,
        Point,
        FeatureLayer,
        GroupLayer,
        MapImageLayer,
        TileLayer,
        Bookmark,
        BasemapGallery,
        Bookmarks,
        Expand,
        Fullscreen,
        Home,
        LayerList,
        Legend,
        Search,
      ) {
        /* =========================================
         SECCIÓN 1: TEMPLATES DE POPUP
         - templatePredios, templateManzanas, templateVias, etc.
         - Definición de contenido para ventanas emergentes
      =========================================== */
        var templatePredios = {
          title: "PREDIOS",
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "CodCat", label: "Código Catastral" },
                { fieldName: "Sbdistrito", label: "Nombre Subdistrito" },
                { fieldName: "Sbdist_Nro", label: "Subdistrito" },
                { fieldName: "Nro_manzan", label: "Nro. Manzana" },
                { fieldName: "Nro_predio", label: "Nro. Predio" },
                { fieldName: "NoInmueble", label: "Nro. Inmueble" },
                { fieldName: "comuna", label: "Comuna" },
                { fieldName: "ZTributari", label: "Zona Tributaria" },
                {
                  fieldName: "SHAPE.STArea()",
                  label: "Area",
                  format: { digitSeparator: true, places: 2 },
                },
                {
                  fieldName: "SHAPE.STLength()",
                  label: "Perimetro",
                  format: { digitSeparator: true, places: 2 },
                },
              ],
            },
          ],
          outFields: ["*"],
        };

        var templateManzanas = {
          title: "MANZANAS",
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "Manzanas", label: "Nro. Manzana" },
                { fieldName: "Distrito", label: "Distrito" },
                { fieldName: "SubDistrit", label: "Subdistrito" },
                { fieldName: "Nombre_SD", label: "Nombre Subdistrito" },
                { fieldName: "comuna", label: "Comuna" },
                {
                  fieldName: "Shape.STArea()",
                  label: "Area",
                  format: { digitSeparator: true, places: 2 },
                },
                {
                  fieldName: "Shape.STLength()",
                  label: "Perimetro",
                  format: { digitSeparator: true, places: 2 },
                },
              ],
            },
          ],
          outFields: ["*"],
        };

        var templateVias = {
          title: "VIAS",
          content: [
            {
              type: "fields",
              fieldInfos: [
                { fieldName: "Tipo", label: "Tipo" },
                { fieldName: "Nombre", label: "Nombre" },
                {
                  fieldName: "Shape_Leng",
                  label: "Perimetro",
                  format: { digitSeparator: true, places: 2 },
                },
              ],
            },
          ],
          outFields: ["*"],
        };

        /* =========================================
         CONFIGURACIÓN DE SERVICIOS
         - URLs centralizadas para fácil modificación
      ========================================== */
        var ARCGIS_BASE = "${protocol}://${serverIP}${portSuffix}/arcgis/rest/services";

        var SERVICES = {
          PREDIO: ARCGIS_BASE + "/catastro/predios_cba/MapServer",
          MANZANA: ARCGIS_BASE + "/catastro/manzanasdb/MapServer",
          VIAS: ARCGIS_BASE + "/planificacion/vias/MapServer",
          USO_SUELO: ARCGIS_BASE + "/planificacion/usoSuelodb/MapServer",
          LIMITES: ARCGIS_BASE + "/planificacion/limites/MapServer",
          SECTORIALES:
            ARCGIS_BASE + "/planificacion/sectorialesUsoSuelo/MapServer",
          REGISTROS: ARCGIS_BASE + "/catastro/RegistrosCatastrales/MapServer",
          MATRICES: ARCGIS_BASE + "/catastro/matrices_predios/MapServer",
          RED: ARCGIS_BASE + "/catastro/redGeodesica/MapServer",
          OTBS: ARCGIS_BASE + "/planificacion/OTBS/MapServer",
          // Imágenes base (años)
          IMG_2015: ARCGIS_BASE + "/imagenes/imagen2015_500/MapServer",
          IMG_2016: ARCGIS_BASE + "/imagenes/CBBA_2016_500/MapServer",
          IMG_2017: ARCGIS_BASE + "/imagenes/imagen2017_500/MapServer",
          IMG_2018: ARCGIS_BASE + "/imagenes/CBA_2018500/MapServer",
          IMG_2019: ARCGIS_BASE + "/imagenes/imagen2019_500/MapServer",
          IMG_2022: ARCGIS_BASE + "/imagenes/imagen2022/MapServer",
          IMG_2023: ARCGIS_BASE + "/imagenes/imagen_2023_500/MapServer",
        };

        var sCopyright = "GRS 80 - MARGEN SIRGAS(WGS 84)";

        /* =========================================
         SECCIÓN 2: CAPAS OPERACIONALES
         - Capas de catastro, planificación, etc.
         - MapImageLayer para servicios locales
      ========================================== */
        var prediosLayer = new MapImageLayer({
          url: SERVICES.PREDIO,
          visible: true,
          title: "Predios",
          sublayers: [
            {
              id: 0,
              visible: true,
              title: "Predio",
              popupTemplate: templatePredios,
              outFields: ["*"],
            },
          ],
        });

        var manzanasLayer = new MapImageLayer({
          url: SERVICES.MANZANA,
          visible: true,
          title: "Manzanas",
          sublayers: [
            {
              id: 0,
              visible: true,
              title: "Manzanas",
              popupTemplate: templateManzanas,
              outFields: ["*"],
              popupEnabled: true,
            },
          ],
        });

        var viasLayer = new MapImageLayer({
          url: SERVICES.VIAS,
          visible: true,
          title: "Vias",
          sublayers: [
            {
              id: 0,
              visible: true,
              title: "Vias",
              popupTemplate: templateVias,
              outFields: ["*"],
              popupEnabled: true,
            },
          ],
        });

        var usoSueloLayer = new MapImageLayer({
          url: SERVICES.USO_SUELO,
          visible: true,
          title: "Uso de Suelo",
          opacity: 0.5,
          sublayers: [
            {
              id: 0,
              visible: true,
              title: "Uso de suelo",
              sublayers: [
                {
                  id: 2,
                  visible: true,
                  title: "Uso Fuera del Area Urbana",
                },
                { id: 1, visible: true, title: "Uso de suelo" },
              ],
            },
          ],
        });

        var limitesLayer = new MapImageLayer({
          url: SERVICES.LIMITES,
          visible: true,
          sublayers: [
            { id: 4, visible: true, title: "Limites de Cercado" },
            { id: 3, visible: true, title: "Subdistritos" },
            { id: 2, visible: true, title: "Comunas" },
            { id: 1, visible: true, title: "Distritos" },
            { id: 0, visible: true, title: "Area Urbana" },
          ],
          title: "Limites",
        });

        var otbsLayer = new MapImageLayer({
          url: SERVICES.OTBS,
          visible: false,
          title: "OTBS",
        });

        var sCopyright = "GRS 80 - MARGEN SIRGAS(WGS 84)";

        /* ==========================================
         SECCIÓN 3: MAPAS BASE (AÑOS)
         - Configuración de imágenes satelitales
         - Años 2015-2023
      ========================================== */
        var baseMapYears = [
          "2015",
          "2016",
          "2017",
          "2018",
          "2019",
          "2022",
          "2023",
        ];
        var baseMaps = baseMapYears.map(function (year) {
          var url = SERVICES["IMG_" + year];
          var layer = new TileLayer({
            url: url,
            visible: true,
            title: "Imagen " + year,
            copyright: sCopyright,
            opacity: 1.0,
          });
          return new Basemap({
            baseLayers: [layer],
            title: year,
            id: year,
            thumbnailUrl: url + "/info/thumbnail",
          });
        });

        /* ==========================================
         SECCIÓN 4: INICIALIZACIÓN DEL MAPA
         - MapView, extent, eventos
      ========================================== */
        var sectorialesLayer = new MapImageLayer({
          url: SERVICES.SECTORIALES,
          visible: true,
          opacity: 0.5,
          sublayers: [
            { id: 1, visible: true, title: "Sectoriales" },
            { id: 0, visible: true, title: "Sectoriales Uso de suelo" },
          ],
          title: "Sectoriales",
        });

        var registrosCatastralesLayer = new MapImageLayer({
          url: SERVICES.REGISTROS,
          visible: false,
          sublayers: [
            {
              id: 0,
              visible: true,
              title: "Registro Catastrales",
              sublayers: [{ id: 1, visible: true, title: "Consolidados" }],
            },
          ],
          title: "Registros Catastrales",
        });

        var map = new Map({
          layers: [
            sectorialesLayer,
            usoSueloLayer,
            viasLayer,
            registrosCatastralesLayer,
            prediosLayer,
            manzanasLayer,
            limitesLayer,
            otbsLayer,
          ],
        });

        var view = new MapView({
          container: "viewDiv",
          map: map,
          popup: {
            dockEnabled: true,
            collapseEnabled: false,
            dockOptions: {
              buttonEnabled: true,
              breakpoint: false,
              position: "bottom-center",
            },
          },
          constraints: {
            rotationEnabled: false,
          },
        });

        view.on("click", function (event) {
          console.log("the view event", event);
          console.log("the view", view);
        });

        view.when(function () {
          view.ui.move("zoom", "bottom-left");

          view.extent = new Extent({
            xmin: 792623.8393543878,
            ymin: 8059312.670740076,
            xmax: 810149.874406458,
            ymax: 8090334.5994506,
            spatialReference: {
              wkid: 32719,
            },
          });

          /* ==========================================
           SECCIÓN 5: WIDGETS Y UI
           - Search, Legend, LayerList, Bookmarks, etc.
          ========================================== */
          var basemapGallery = new BasemapGallery({
            view: view,
            //activeBasemap: baseMaps[4], // 2019 por defecto (índice 4)
            source: baseMaps,
          });

          const bmExpand = new Expand({
            view: view,
            autoCollapse: true,
            content: basemapGallery,
            expanded: false,
            expandTooltip: "Galeria de Fotos Areas o Imagenes Satelitales",
            mode: "drawer", //"floating"|"drawer"
          });

          /* =========================================
           LIMPIAR MAPA BASE
           - Al hacer clic en #infoDiv, desactiva el basemap activo
           - Esto permite volver a ver las capas operacionales sin basemap
          ========================================== */
          document
            .getElementById("infoDiv")
            .addEventListener("click", clearBasemap);
          function clearBasemap(ev) {
            basemapGallery.activeBasemap = null;
          }

          document
            .getElementById("reloadDiv")
            .addEventListener("click", function (ev) {
              location.reload(true); // true = hard reload (bypass cache)
            });

          var layerList = new LayerList({
            view: view, //,
          });
          const llExpand = new Expand({
            view: view,
            content: layerList,
            autoCollapse: true,
            expanded: false,
          });

          var featureLayerPredios = new FeatureLayer({
            url: SERVICES.PREDIO + "/0",
            outFields: ["*"],
            popupTemplate: templatePredios,
          });

          var featureLayerManzanas = new FeatureLayer({
            url: SERVICES.MANZANA + "/0",
            outFields: ["*"],
            popupTemplate: templateManzanas,
          });

          var featureLayerVias = new FeatureLayer({
            url: SERVICES.VIAS + "/0",
            outFields: ["*"],
            popupTemplate: templateVias,
          });

          /* =========================================
            SECCIÓN 6: BÚSQUEDA Y LEYENDA
            - Search Widget para buscar predios, manzanas y vías
            - Legend para mostrar simbología de capas
          ========================================== */
          var searchWidget = new Search({
            view: view,
            resultGraphicEnabled: true,
            locationEnabled: true,
            autoNavigate: false, //para que no vaya al punto
            includeDefaultSources: false,
            allPlaceholder: "Codigo Catastral o Nro. Manzana",
            sources: [
              {
                layer: featureLayerPredios,
                searchFields: ["CodCat"],
                suggestionTemplate: "{Sbdist_Nro}-{Nro_manzan}-{Nro_predio}",
                exactMatch: false,
                displayField: "CodCat",
                outFields: ["*"],
                placeholder: "00SSMMMPPP",
                minSuggestCharacters: 5,
                zoomScale: 500000,
                name: "Predios",
              },
              {
                layer: featureLayerManzanas,
                searchFields: ["Manzanas"],
                suggestionTemplate: "{SubDistrit} - {Nombre_SD}: {Manzanas}",
                exactMatch: false,
                displayField: "Manzanas",
                outFields: ["*"],
                placeholder: "Nro. Manzana",
                minSuggestCharacters: 3,
                name: "Manzanas",
              },
              {
                layer: featureLayerVias,
                searchFields: ["Nombre_V"],
                exactMatch: false,
                displayField: "Nombre_V",
                outFields: ["*"],
                placeholder: "NOMBRE DE VIA",
                name: "Vias",
              },
            ],
          });

          searchWidget.on("select-result", function (event) {
            console.log("The selected search result: ", event);
            console.log("The selected search result view: ", view);
            console.log(
              "The selected search result feature: ",
              event.result.feature.geometry.extent,
            );
            view.goTo(event.result.feature.geometry.extent);
          });

          const sExpand = new Expand({
            view: view,
            content: searchWidget,
            expanded: false,
          });

          //LEGEND
          const legend = new Expand({
            content: new Legend({
              view: view,
              style: "card",
              layerInfos: [
                {
                  layer: sectorialesLayer,
                },
                {
                  layer: usoSueloLayer,
                },
                {
                  layer: viasLayer,
                },
                {
                  layer: registrosCatastralesLayer,
                },
                {
                  layer: prediosLayer,
                },
                {
                  layer: manzanasLayer,
                },
                {
                  layer: limitesLayer,
                },
              ],
            }),
            view: view,
            autoCollapse: true,
            expanded: false,
          });

          view.ui.add(
            new Home({
              view: view,
            }),
            "top-left",
          );

          view.ui.add(bmExpand, "top-left");
          view.ui.add(sExpand, "top-right");
          view.ui.add(llExpand, "top-right");
          view.ui.add(legend, "bottom-right");
          view.ui.add("infoDiv", "top-left");
          view.ui.add("reloadDiv", "top-left");

        });
      });
    </script>
  </head>

  <body>
    <div id="appContainer">
      <div id="viewDiv"></div>
    </div>
    <div
      id="infoDiv"
      class="esri-component esri-widget--button esri-widget"
      role="button"
      title="Limpiar Mapa base"
    >
      <span aria-hidden="true" class="esri-icon esri-icon-maps"></span>
      <span class="esri-icon-font-fallback-text">Clean</span>
    </div>
    <div
      id="reloadDiv"
      class="esri-component esri-widget--button esri-widget"
      role="button"
      title="Recargar página"
    >
      <span aria-hidden="true" class="esri-icon esri-icon-refresh"></span>
      <span class="esri-icon-font-fallback-text">Reload</span>
    </div>
  </body>
</html>`;
};
