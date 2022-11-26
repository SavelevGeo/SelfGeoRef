
import {Map, View} from 'ol';
import {Tile as TileLayer} from 'ol/layer';
import {OSM} from 'ol/source';

import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import LayerSwitcher from 'ol-layerswitcher';

import 'tabulator-tables/dist/css/tabulator.min.css';
import {TabulatorFull as Tabulator} from 'tabulator-tables';

import addGcpActions from './GCPActions';

class slfgrMap extends Map {
    gcpTable = new Tabulator('#gcp-table', {
        layout: 'fitDataTable',
        columns: [
            {title: 'mapX', field: 'mapX'}
        ]
    });

    constructor() {
        super({
            target: 'map',
            layers: [new TileLayer({ title: 'OSM', source: new OSM() })],
            view: new View({center: [0, 0], zoom: 2})
        });
        
        this.addControl(new LayerSwitcher());
        addGcpActions(this);
    }
}

export default slfgrMap
