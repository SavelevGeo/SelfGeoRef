
import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Draw, Modify, Snap, Select} from 'ol/interaction';
import {Fill, Style, Stroke} from 'ol/style';

import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import LayerSwitcher from 'ol-layerswitcher';

class slfgrMap extends Map {
    gcpSource = new VectorSource();
    gcpStyle = {
        'circle-stroke-color': '#484848',
        'circle-stroke-width': 2,
        'circle-radius': 5,
        'circle-fill-color': 'transparent'
    };

    gcpLayer = new VectorLayer({
        title: 'GCPs',
        source: this.gcpSource,
        style: this.gcpStyleSelected
    });
    
    gcpDraw = new Draw ({
        source: this.gcpSource,
        type: 'Point',
        style: this.gcpStyle,
        //adding only with left mouse button click
        condition: (e) => e.originalEvent.buttons === 1
    });

    gcpSnap = new Snap({ source: this.gcpSource });
    gcpModify = new Modify({ source: this.gcpSource});

    gcpStyleSelected = new Style({
        fill: new Fill({ color: '#eeeeee' }),
        stroke: new Stroke({
            color: 'transparent',
            width: 2,
        })
    });
    gcpSelect = new Select({ hitTolerance: 10 });

    constructor() {
        super({
            target: 'map',
            layers: [
                new TileLayer({
                    title: 'OSM',
                    source: new OSM()
                })
            ],
            view: new View({center: [0, 0], zoom: 2})
        });
        
        this.addControl(new LayerSwitcher());

        //adding points on click
        this.addLayer(this.gcpLayer);
        this.addInteraction(this.gcpDraw);
        
        //snapping and moving
        this.addInteraction(this.gcpModify);
        this.addInteraction(this.gcpSnap);

        this.addInteraction(this.gcpSelect);

        //remove gcp point on right click
        this.on('dblclick', (e) => {
            this.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
                if (layer === this.gcpLayer) {
                    this.gcpSource.removeFeature(feature);
                }
            })
        });
    }
}

export default slfgrMap
