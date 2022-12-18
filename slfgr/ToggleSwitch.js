class toggleSwitch {
    constructor(element, map1, map2) {
        this.switchCbx = element.querySelector('.switch__checkbox');
        this.switchSld = element.querySelector('.switch__slider');
        this.map1 = map1.getTargetElement();
        this.map2 = map2.getTargetElement();

        //we need the map not to be hidden on start up, so the layers would render
        //if add this property in html, no layers would be visible
        this.map2.hidden = true; 

        this.switchCbx.addEventListener('change', () => this.toggle());
    }

    toggle() {
        if (this.switchCbx.checked) {
            this.map1.hidden = true;
            this.map2.hidden = false;
        } else {
            this.map1.hidden = false;
            this.map2.hidden = true;
        }
    }

    init() {
        this.switchCbx.disabled = false;
        this.switchCbx.click();
        this.switchSld.classList.remove('switch__slider_disabled');
    }
}

export default toggleSwitch
