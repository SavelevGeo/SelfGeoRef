import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';

class slgrfRaster {
    constructor (path, crs = 'EPSG:3857') {
        this.path = path;
        this.crs = crs;
        this.HTMLImage().then(img =>
            this.size = [img.width, img.height]
        );
        
    }

    HTMLImage() {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject();
            img.src = this.path;
        })
    }

    fitToExtent(extent) {
        return new ImageLayer({
            title: "Diamante_1_map_area",
            source: new Static({
                url: this.path,
                projection: this.crs,
                imageExtent: extent
            })
        })
    }
}

export default slgrfRaster