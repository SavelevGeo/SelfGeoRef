import GeoTIFF from 'ol/source/GeoTIFF';
import TileLayer from 'ol/layer/WebGLTile';

class slfgrGeoRaster {
    static fromPath(path) {
        return new Promise((resolve, reject) => {
            fetch(path)
                .then(response => response.blob())
                .then(blob => {
                    const source = new GeoTIFF({
                        sources: [{ blob: blob }]
                    });

                    resolve(
                        new TileLayer({
                            title: 'random raster',
                            source: source
                        })
                    );
                })
        })
    }
}


export default slfgrGeoRaster