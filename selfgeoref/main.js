import {Tile as TileLayer} from 'ol/layer';
import {OSM} from 'ol/source';
import { View } from 'ol';
import { buffer } from 'ol/extent';
import Control from 'ol/control/Control';

import slfgrMap from './slfgr/Map';
import slfgrRaster from './slfgr/Raster';
import slfgrGeoRef from './slfgr/GeoRef';
import addGcpActions from './slfgr/GCPActions';
import toggleSwitch from './slfgr/ToggleSwitch';

const gcpMap = new slfgrMap('gcp-map');
const worldMap = new slfgrMap('world-map');
worldMap.addLayer(new TileLayer({ title: 'OSM', source: new OSM(), visible: true }));

//georef raster from upload
const uploadBtn = document.querySelector('.upload-btn > input');
const georefBtn = document.querySelector('.georef-btn');
gcpMap.addControl(new Control({element: georefBtn}));

const switchCbx = document.querySelector('.switch__checkbox');
const switchSld = document.querySelector('.switch__slider');
const mapSwitch = new toggleSwitch(switchCbx, gcpMap, worldMap);

const geoRef = await slfgrGeoRef.init();

uploadBtn.addEventListener('input', function() {
    console.time('image')
    console.timeLog('image', 'image loading...');

    const img = new Image();
    img.file = this.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(img.file);
    reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = async () => {
            console.timeLog('image', 'image loaded');
            console.timeEnd('image');

            addGcpActions(gcpMap);

            const raster = new slfgrRaster(img);
            gcpMap.addLayer(raster.layer);
            const gcpView = new View({
                extent: buffer(raster.extent, raster.extent[2])
            });
            gcpView.fit(raster.extent, {
                size: gcpMap.getSize(),
                padding: [75, 75, 75, 75]
            });
            gcpMap.setView(gcpView);

            georefBtn.disabled = false;
            georefBtn.addEventListener('click', async () => {
                console.time('georef');
                console.timeLog('georef', 'georef started');
                const gcps = (await (await fetch('./data/gcps.txt'))
                    .text()).split(' ');
            
                const geoRaster = await geoRef.byTable(raster, gcps);
                worldMap.addLayer(geoRaster.layer);
                const geoRasterView = await geoRaster.layer.getSource().getView();
                const notRestrictedView = new View();
                notRestrictedView.fit(geoRasterView.extent, {
                    size: worldMap.getSize(),
                    padding: [75, 75, 75, 75]
                });
                worldMap.setView(notRestrictedView);
                document.body.appendChild(geoRaster.link);
                
                switchCbx.disabled = false;
                switchCbx.click();
                switchSld.classList.remove('switch__slider_disabled');

                console.timeLog('georef', 'georef finished');
                console.timeEnd('georef');
            });
        };
    };
});

