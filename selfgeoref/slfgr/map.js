
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import Image from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';

const layers = [
    new TileLayer({
      source: new OSM()
    }),
    new Image({
        title: "Diamante_1_map_area",
        source: new ImageStatic({
            url: "./data/Diamante_1_map_area.jpg",
            projection: 'EPSG:3857',
            imageExtent: [
                -3913009.9765944895,
                771787.351525859,
                -3000376.813142625,
                1442540.1658467501
            ]
        })
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