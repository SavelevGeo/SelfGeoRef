import slfgrMap from './slfgr/Map';
import slfgrImage from './slfgr/Image';

const map = new slfgrMap(); 

let mapArea = new slfgrImage(
    './data/Diamante_1_map_area.jpg',
    [
        -3913009.9765944895,
        771787.351525859,
        -3000376.813142625,
        1442540.1658467501
    ]
);

map.addLayer(mapArea);

function currentExtent(map) {
    return map.getView().calculateExtent()
}

const extentBtn = document.querySelector('.extent-btn');
extentBtn.addEventListener('click', async () => {
    const curExt = currentExtent(map);
    map.removeLayer(mapArea);
    mapArea = new slfgrImage('./data/Diamante_1_map_area.jpg', curExt);
    map.addLayer(mapArea);
    console.log(await mapArea.size);
});
