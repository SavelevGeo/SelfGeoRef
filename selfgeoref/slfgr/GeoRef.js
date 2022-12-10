import workerUrl from 'gdal3.js/dist/package/gdal3.js?url'
import dataUrl from 'gdal3.js/dist/package/gdal3WebAssembly.data?url'
import wasmUrl from 'gdal3.js/dist/package/gdal3WebAssembly.wasm?url'
import initGdalJs from 'gdal3.js';

import slfgrGeoRaster from './GeoRaster';

class slfgrGeoRef {
    constructor(gdal) {
        this.Gdal = gdal;
    }

    async transformGcps(gcps) {
        const mapXY = 
            //from empty array with element for each gcp
            [...Array(gcps.length / 5)].map((_,i) =>
                //from gcps array get every third and fourth out of every five
                [gcps[i * 5 + 3], gcps[i * 5 + 4]]
                //convert it to integer
                .map(e => +e)
        );

        const pseudoMercCoords = await this.Gdal.gdaltransform(mapXY, [
            '-s_srs', 'EPSG:32612',
            '-t_srs', 'EPSG:3857',
            '-output_xy'
        ])
        
        return pseudoMercCoords
                //for each coords pair take the -gcp and imageX imageY prefix
                .map((e, i) => [gcps.slice(i * 5, i * 5 + 3), e.map(String)])
                .flat(2)
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
        
        const fileBytes = await this.Gdal.getFileBytes(warped);
        const blob = new Blob([fileBytes]);
        const fileName = raster.img.file.name.split('.').at(-2) + '.tif';
        
        const geoRaster = slfgrGeoRaster.fromBlob(blob, fileName);

        geoRaster.link = document.createElement('a');
        geoRaster.link.href = URL.createObjectURL(blob);
        geoRaster.link.download = fileName;            ;
        geoRaster.link.textContent = 'Download raster';
        geoRaster.link.style.position = 'absolute';
        geoRaster.link.style.left = '55px';
        geoRaster.link.style.top = '30px';

        return geoRaster
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
