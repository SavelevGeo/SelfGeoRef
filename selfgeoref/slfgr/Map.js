
import {Map, View} from 'ol';
import {Tile as TileLayer} from 'ol/layer';
import {OSM} from 'ol/source';

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

import addGcpActions from './GCPActions';

class slfgrMap extends Map {
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
