import GeoTIFF from 'ol/source/GeoTIFF';
import TileLayer from 'ol/layer/WebGLTile';

class slfgrGeoRaster {
    static fromPath(path) {
        return new Promise((resolve, reject) => {
            fetch(path)
                .then(response => response.blob())
                .then(blob => {
                    resolve(this.fromBlob(blob, path));
                })
        })
    }

    static fromBlob(blob, layerName) {
        return new TileLayer({
            title: layerName,
            source: new GeoTIFF({
                sources: [{ blob: blob}]
            })
        })
    }
}


export default slfgrGeoRaster