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
gcpMap.addControl(new Control({element: georefBtn}));
georefBtn.addEventListener('click', () => console.log(gcpMap.gcpTable.gcps))

const switchCbx = document.querySelector('.switch__checkbox');
const switchSld = document.querySelector('.switch__slider');
const mapSwitch = new toggleSwitch(switchCbx, gcpMap, worldMap);

const geoRef = await slfgrGeoRef.init();

uploadBtn.addEventListener('input', function() {
    console.time('image')
    console.timeLog('image', 'image loading...');

    uploadBtn.parentElement.classList.add('upload-btn_disabled');
    const img = new Image();
    img.file = this.files[0];

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

            georefBtn.disabled = false;
            georefBtn.addEventListener('click', async () => {
                console.time('georef');
                console.timeLog('georef', 'georef started');
                
                //testing purposes
                const gcps = (await (await fetch('./data/gcps.txt'))
                    .text()).split(' ');
                const geoRaster = await geoRef.byTable(raster, gcps);
                
                // const geoRaster = await geoRef.byTable(
                //     raster, gcpMap.gcpTable.gcps
                // );
                worldMap.addGeoRaster(geoRaster);

                switchCbx.disabled = false;
                switchCbx.click();
                switchSld.classList.remove('switch__slider_disabled');

                console.timeLog('georef', 'georef finished');
                console.timeEnd('georef');
            });
        };
    };
}, {once: true});
