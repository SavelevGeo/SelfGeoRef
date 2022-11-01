import slfgrMap from './slfgr/map';

const map = new slfgrMap(); 

function currentExtent(map) {
    return map.getView().calculateExtent()
}

const extentBtn = document.querySelector('.extent-btn');
extentBtn.addEventListener('click', () => {
    const curExt = currentExtent(map);
    console.log(curExt)
});
