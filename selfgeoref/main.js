import {Tile as TileLayer} from 'ol/layer';
import {OSM} from 'ol/source';
import Control from 'ol/control/Control';

import slfgrMap from './slfgr/Map';
import slfgrRaster from './slfgr/Raster';
import slfgrGeoRef from './slfgr/GeoRef';
import addGcpActions from './slfgr/GCPActions';
import toggleSwitch from './slfgr/ToggleSwitch';

const gcpMap = new slfgrMap('gcp-map');
const worldMap = new slfgrMap('world-map');
worldMap.addLayer(new TileLayer({ title: 'OSM', source: new OSM() }));

//georef raster from upload
const uploadBtn = document.querySelector('.upload-btn > input');
const georefBtn = document.querySelector('.georef-btn');
const georefBtnSpinner = georefBtn.querySelector('.georef-btn__spinner');
gcpMap.addControl(new Control({element: georefBtn}));

const mapSwitch = new toggleSwitch(
    document.querySelector('.switch'),
    gcpMap, worldMap
);

uploadBtn.addEventListener('input', function() {
    console.time('image')
    console.timeLog('image', 'image loading...');

    //upload button works only once yet
    uploadBtn.parentElement.classList.add('btn_disabled');

    //Image object to hold the uploaded image
    const img = new Image();
    img.file = this.files[0];

    //FileReader to load the image
    const reader = new FileReader();
    reader.readAsDataURL(img.file);
    reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = async () => {
            console.timeLog('image', 'image loaded');
            console.timeEnd('image');

            const raster = new slfgrRaster(img);
            gcpMap.addSlfgrRaster(raster);

            addGcpActions(gcpMap);
        };
    };

    this.disabled = true;
});

slfgrGeoRef.init()
    .then(async (geoRef) => {
        //hide spinner
        georefBtnSpinner.classList.toggle('fa-spinner');
        georefBtn.classList.toggle('btn_disabled');

        // //testing purposes
        // const gcps = (await (await fetch(
        //     './data/diamante_gcp_32612.txt'
        //     )).text()).split(' ');
        // georefBtn.addEventListener('click', async () => console.log(
        //     await geoRef.transformGcps(gcps, 'EPSG:32612')
        // ));

        georefBtn.addEventListener('click', async () => {
            console.time('georef');
            console.timeLog('georef', 'georef started');

            // //testing purposes
            // const gcps = (await (await fetch(
            //     './data/diamante_gcp_32612.txt'
            // )).text()).split(' ');
            
            const gcps = gcpMap.gcpTable.gcps;
            const transformedGcps = await geoRef.transformGcps(gcps, 'EPSG:32612');
            const geoRaster = await geoRef.byTable(
                gcpMap.raster, transformedGcps
            );

            worldMap.addSlfgrGeoRaster(geoRaster);

            mapSwitch.init();

            console.timeLog('georef', 'georef finished');
            console.timeEnd('georef');
        });
})
