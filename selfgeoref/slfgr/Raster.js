import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';

class slgrfRaster {
    constructor (path, crs = 'EPSG:3857') {
        this.path = path;
        this.crs = crs;
        this.size = this.imageSize();
    }

    getDimensions() {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject();
            img.src = this.path;
        })
    }

    async imageSize() {
        let img = await this.getDimensions();
        return [img.width, img.height]
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