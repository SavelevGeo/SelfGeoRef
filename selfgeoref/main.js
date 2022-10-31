import map from './map';
import rasterLayer from './rasterLayer';

function currentExtent(map) {
    return map.getView().calculateExtent()
}

const extentBtn = document.querySelector('.extent-btn');
extentBtn.addEventListener('click', () => {
    const curExt = currentExtent(map);
    rasterLayer.setExtent(curExt);
    map.addLayer(rasterLayer);
});
