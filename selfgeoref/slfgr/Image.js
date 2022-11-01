import ImageLayer from 'ol/layer/Image';
import Static from 'ol/source/ImageStatic';

class slfgrImage extends ImageLayer {
    constructor(path, extent) {
        super({
            title: "Diamante_1_map_area",
            source: new Static({
                url: path,
                projection: 'EPSG:3857',
                imageExtent: extent
            })
        });
        this.size = this.imageSize(path);
    }

    getDimensions(path) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject();
            img.src = path;
        })
    }

    async imageSize(path) {
        let img = await this.getDimensions(path);
        return [img.width, img.height]
    }
}

export default slfgrImage