import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';

class slfgrRaster {
    constructor (img, crs = 'EPSG:3857') {
        this.img = img;
        this.crs = crs;

        this.extent = [0, -this.img.height, this.img.width, 0];
        this.layer = new ImageLayer({
            title: "Diamante_1_map_area",
            source: new Static({
                url: this.img.src,
                projection: this.crs,
                imageExtent: this.extent
            })
        })
    }

    static fromPath(path) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(new this(img));
            img.onerror = () => reject();
            img.src = path;
        })
    }
}

export default slfgrRaster