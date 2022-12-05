import {Map, View} from 'ol';

import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import LayerSwitcher from 'ol-layerswitcher';

class slfgrMap extends Map {
    constructor(elementId) {
        super({
            target: elementId,
            view: new View({center: [5000000, 6000000], zoom: 5})
        });
        
        this.addControl(new LayerSwitcher());
    }
}

export default slfgrMap
