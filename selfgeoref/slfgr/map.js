
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

const layers = [
    new TileLayer({
      source: new OSM()
    })
]

class slfgrMap extends Map {
    constructor() {
        super({
                target: 'map',
                layers: layers,
                view: new View({
                  center: [0, 0],
                  zoom: 2
            })
        });
    }
}

export default slfgrMap