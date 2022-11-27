
import {Map, View} from 'ol';
import {Tile as TileLayer} from 'ol/layer';
import {OSM} from 'ol/source';

import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import LayerSwitcher from 'ol-layerswitcher';

import addGcpActions from './GCPActions';
import slfgrGCPTable from './GCPTable';

class slfgrMap extends Map {
    constructor() {
        super({
            target: 'map',
            layers: [new TileLayer({ title: 'OSM', source: new OSM() })],
            view: new View({center: [5000000, 6000000], zoom: 5})
        });
        
        this.addControl(new LayerSwitcher());
        addGcpActions(this); 
        this.addControl(new slfgrGCPTable(this.gcpFeatures.getArray()));
    }
}

export default slfgrMap
