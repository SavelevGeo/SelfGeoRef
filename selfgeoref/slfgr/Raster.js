import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';
import imgExtForMapExt from './image-extent';

class slgrfRaster {
    constructor (img, crs = 'EPSG:3857') {
        this.img = img;
        this.crs = crs;
    }

    fitToExtent(mapExtent) {
        return new ImageLayer({
            title: "Diamante_1_map_area",
            source: new Static({
                url: this.img.src,
                projection: this.crs,
                imageExtent: imgExtForMapExt(
                    [this.img.width, this.img.height],
                    mapExtent
                )
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