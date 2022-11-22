import workerUrl from 'gdal3.js/dist/package/gdal3.js?url'
import dataUrl from 'gdal3.js/dist/package/gdal3WebAssembly.data?url'
import wasmUrl from 'gdal3.js/dist/package/gdal3WebAssembly.wasm?url'
import initGdalJs from 'gdal3.js';

class slfgrGeoRef {
    constructor(gdal) {
        this.Gdal = gdal;
    }

    async byTable(raster,  gcps) {
        const img_gdal = (await this.Gdal.open(raster.img.file)).datasets[0];
        const options = gcps.concat(['-of', 'GTiff', '-a_srs', raster.crs]);

        const translated = (await this.Gdal.gdal_translate(
            img_gdal, options
        ))['local'];

        const warped = (await this.Gdal.gdalwarp(
            ((await this.Gdal.open(translated)).datasets[0]),
            ['-tps', '-of', 'COG']
        ))['local'];

        return warped
    }

    static init() {
        const paths = {
            wasm: wasmUrl,
            data: dataUrl,
            js: workerUrl,
        };

        return new Promise ((resolve, reject) => {
            initGdalJs({paths})
                .then((Gdal) => resolve(new this(Gdal)));
        })
    }
}

export default slfgrGeoRef
