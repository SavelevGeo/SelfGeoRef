
import {Map, View} from 'ol';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Draw, Modify, Snap} from 'ol/interaction';

import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import LayerSwitcher from 'ol-layerswitcher';

class slfgrMap extends Map {
    gcpSource = new VectorSource();
    gcpLayer = new VectorLayer({
        title: 'GCPs',
        source: this.gcpSource,
        style: {
          'circle-stroke-color': '#484848',
          'circle-stroke-width': 2,
          'circle-radius': 5,
          'circle-fill-color': 'transparent',
        },
    });
    gcpDraw = new Draw ({
        source: this.gcpSource,
        type: 'Point',
        condition: (e) => e.originalEvent.buttons === 1
    });
    gcpModify = new Modify({ source: this.gcpSource});
    gcpSnap = new Snap({ source: this.gcpSource });

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
        this.addLayer(this.gcpLayer);
        this.addInteraction(this.gcpDraw);
        this.addInteraction(this.gcpModify);
        this.addInteraction(this.gcpSnap);
    }
}

export default slfgrMap
