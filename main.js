import {Tile as TileLayer} from 'ol/layer';
import {OSM} from 'ol/source';
import Control from 'ol/control/Control';
import { View } from 'ol';

import slfgrMap from './slfgr/Map';
import slfgrRaster from './slfgr/Raster';
import slfgrGeoRef from './slfgr/GeoRef';
import addGcpActions from './slfgr/GCPActions';
import toggleSwitch from './slfgr/ToggleSwitch';
import gcpCrsAddOptions from './gcp-crs/__input/gcp-crs__input';

const gcpMap = new slfgrMap('gcp-map');
const worldMap = new slfgrMap('world-map');
worldMap.addLayer(new TileLayer({ title: 'OSM', source: new OSM() }));

//georef raster from upload
const uploadBtn = document.querySelector('.upload-btn > input');
const uploadBtnSpinner = document.querySelector('.upload-btn > .btn-spinner');
const georefBtn = document.querySelector('.georef-btn');
const georefBtnSpinner = georefBtn.querySelector('.btn-spinner');
gcpMap.addControl(new Control({element: georefBtn}));
const gcpCrs = document.querySelector('.gcp-crs');
const gcpCrsInput = gcpCrs.querySelector('input');
gcpMap.addControl(new Control({element: gcpCrs}));
gcpCrsAddOptions(gcpCrsInput);

const mapSwitch = new toggleSwitch(
    document.querySelector('.switch'),
    gcpMap, worldMap
);

uploadBtn.addEventListener('input', function() {
    console.time('image')
    console.timeLog('image', 'image loading...');

    uploadBtnSpinner.classList.toggle('fa-spinner');

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
            uploadBtn.parentElement.style.opacity = 0;

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

        georefBtn.addEventListener('click', async () => {
            console.time('georef');
            console.timeLog('georef', 'georef started');
            georefBtnSpinner.classList.toggle('fa-spinner');
            georefBtn.classList.toggle('btn_disabled');

            const gcps = gcpMap.gcpTable.gcps;
            const transformedGcps = await geoRef.transformGcps(
                gcps, gcpCrsInput.epsgCode
            );

            console.log(gcps, transformedGcps);

            geoRef.byTable(gcpMap.raster, transformedGcps)
            .then( async geoRaster => {
                console.timeLog('georef', 'georaster ready');
                worldMap.addLayer(geoRaster.layer);
                console.timeLog('georef', 'georaster rendered');
                const geoRasterView = await geoRaster.layer.getSource().getView();
                const notRestrictedView = new View();
                notRestrictedView.fit(geoRasterView.extent, {
                    size: worldMap.getSize(),
                    padding: [75, 75, 75, 75]
                });
                worldMap.setView(notRestrictedView);
                document.body.appendChild(geoRaster.link);

                mapSwitch.init();

                georefBtnSpinner.classList.toggle('fa-spinner');
                georefBtn.classList.toggle('btn_disabled');

                console.timeLog('georef', 'georef finished');
                console.timeEnd('georef');
            })
        });
})
