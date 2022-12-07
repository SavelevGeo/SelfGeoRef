import {Map, View} from 'ol';
import {buffer} from 'ol/extent';

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

    addSlfgrRaster(raster) {
        this.addLayer(raster.layer);
        const gcpView = new View({
            extent: buffer(raster.extent, raster.extent[2])
        });
        gcpView.fit(raster.extent, {
            size: this.getSize(),
            padding: [75, 75, 75, 75]
        });
        this.setView(gcpView);
    }

    async addGeoRaster(geoRaster) {
        this.addLayer(geoRaster.layer);
        const geoRasterView = await geoRaster.layer.getSource().getView();
        const notRestrictedView = new View();
        notRestrictedView.fit(geoRasterView.extent, {
            size: this.getSize(),
            padding: [75, 75, 75, 75]
        });
        this.setView(notRestrictedView);
        document.body.appendChild(geoRaster.link);
    }
}

export default slfgrMap
