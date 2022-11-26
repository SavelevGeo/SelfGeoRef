
import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Draw, Modify, Snap} from 'ol/interaction';
import {Circle, Fill, Style, Stroke} from 'ol/style';

import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import LayerSwitcher from 'ol-layerswitcher';

class slfgrMap extends Map {
    gcpSource = new VectorSource();
    gcpStyle = {
        'circle-stroke-color': '#1E90FF',
        'circle-stroke-width': 1.25,
        'circle-radius': 5,
        'circle-fill-color': 'transparent'
    };
    gcpDrawStyle = {
        'circle-stroke-color': '#484848',
        'circle-stroke-width': 1.25,
        'circle-radius': 5,
        'circle-fill-color': 'transparent'
    };
    gcpSelectStyle = new Style({
        image: new Circle({
            fill: new Fill({ color: 'rgb(30, 144, 255)' }),
            stroke: new Stroke({ color: 'white', width: 1.25 }),
            radius: 5,
        })
    })

    gcpLayer = new VectorLayer({
        title: 'GCPs',
        source: this.gcpSource,
        style: this.gcpStyle
    });
    
    gcpDraw = new Draw ({
        source: this.gcpSource,
        type: 'Point',
        style: this.gcpDrawStyle,
        //adding only with left mouse button click
        condition: (e) => e.originalEvent.buttons === 1
    });

    gcpSnap = new Snap({ source: this.gcpSource });
    gcpModify = new Modify({ source: this.gcpSource });

    constructor() {
        super({
            target: 'map',
            layers: [new TileLayer({ title: 'OSM', source: new OSM() })],
            view: new View({center: [0, 0], zoom: 2})
        });
        
        this.addControl(new LayerSwitcher());

        //adding points on click
        this.addLayer(this.gcpLayer);
        this.addInteraction(this.gcpDraw);
        
        //snapping and moving
        this.addInteraction(this.gcpModify);
        this.addInteraction(this.gcpSnap);

        // remove gcp point on right click
        this.on('dblclick', (e) => {
            this.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
                if (layer === this.gcpLayer) {
                    this.gcpSource.removeFeature(feature);
                }
            }, { hitTolerance: 5 });
        });

        this.on('click', (e) => {
            this.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
                if (layer === this.gcpLayer) {
                    if (!feature.selected) {
                        feature.selected = true;
                        feature.setStyle(this.gcpSelectStyle);
                    } else {
                        feature.selected = false;
                        feature.setStyle(null);
                    }
                }
            }, { hitTolerance: 5 });
        });
    }
}

export default slfgrMap
