import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import {Draw, Modify, Snap} from 'ol/interaction';
import {Circle, Fill, Style, Stroke} from 'ol/style';
import { Collection } from "ol";

import slfgrGCPTable from './GCPTable';

export default function addGcpActions (map) {
    map.gcpFeatures = new Collection();
    map.gcpSource = new VectorSource({features: map.gcpFeatures});
    map.gcpStyle = {
        'circle-stroke-color': '#13678A',
        'circle-stroke-width': 1.25,
        'circle-radius': 5,
        'circle-fill-color': 'transparent'
    };
    map.gcpDrawStyle = {
        'circle-stroke-color': '#484848',
        'circle-stroke-width': 1.25,
        'circle-radius': 5,
        'circle-fill-color': 'transparent'
    };
    map.gcpSelectStyle = new Style({
        image: new Circle({
            fill: new Fill({ color: 'rgb(30, 144, 255)' }),
            stroke: new Stroke({ color: 'white', width: 1.25 }),
            radius: 5,
        })
    })

    map.gcpLayer = new VectorLayer({
        title: 'GCPs',
        source: map.gcpSource,
        style: map.gcpStyle
    });
    
    map.gcpDraw = new Draw ({
        source: map.gcpSource,
        type: 'Point',
        style: map.gcpDrawStyle,
        //adding only with left mouse button click
        condition: (e) => e.originalEvent.buttons === 1
    });

    map.gcpSnap = new Snap({ source: map.gcpSource });
    map.gcpModify = new Modify({ source: map.gcpSource });

    //adding points on click
    map.addLayer(map.gcpLayer);
    map.addInteraction(map.gcpDraw);
    
    //snapping and moving
    map.addInteraction(map.gcpModify);
    map.addInteraction(map.gcpSnap);

    // remove gcp point on right click
    map.on('dblclick', (e) => {
        map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
            if (layer === map.gcpLayer) {
                map.gcpSource.removeFeature(feature);
            }
        }, { hitTolerance: 5 });
    });

    map.toggleGcpSelection = function (feature) {
        if (!feature.selected) {
            feature.selected = true;
            feature.setStyle(map.gcpSelectStyle);
        } else {
            feature.selected = false;
            feature.setStyle(null);
        }
    };

    map.gcpTable = new slfgrGCPTable(map);

    map.on('click', (e) => {
        map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
            if (layer === map.gcpLayer) map.toggleGcpSelection(feature);
        }, { hitTolerance: 5 });
    });    
}