import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import imgExtForMapExt from './image-extent';

class slgrfRaster {
    constructor (path, crs = 'EPSG:3857') {
        this.path = path;
        this.crs = crs;
    }

    fitToExtent(imgSize, mapExtent) {
        return new ImageLayer({
            title: "Diamante_1_map_area",
            source: new Static({
                url: this.path,
                projection: this.crs,
                imageExtent: imgExtForMapExt(imgSize, mapExtent)
            })
        })
    }

    static HTMLImage(path) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject();
            img.src = path;
        })
    }
}

export default slgrfRaster