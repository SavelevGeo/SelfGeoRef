import ImageLayer from 'ol/layer/Image';

const rasterLayer = new ImageLayer({
    url: './selfgeoref/data/Diamante_1_map_area.jpg',
    projection: 'EPSG:3857'
});

export default rasterLayer