import workerUrl from 'gdal3.js/dist/package/gdal3.js?url'
import dataUrl from 'gdal3.js/dist/package/gdal3WebAssembly.data?url'
import wasmUrl from 'gdal3.js/dist/package/gdal3WebAssembly.wasm?url'
import initGdalJs from 'gdal3.js';

class slfgrGeoRef {
    constructor(gdal) {
        this.Gdal = gdal;
    }

    async byTable(file) {
        return (await this.Gdal.open(file)).datasets[0]
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
