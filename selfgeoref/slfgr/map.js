
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

class slfgrMap extends Map {
    constructor() {
        super({
                target: 'map',
                layers: [
                    new TileLayer({
                      source: new OSM()
                    })
                ],
                view: new View({
                  center: [0, 0],
                  zoom: 2
            })
        });
    }
}

export default slfgrMap