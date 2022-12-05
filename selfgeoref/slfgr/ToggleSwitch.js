class toggleSwitch {
    constructor(element, map1, map2) {
        this.element = element;
        this.map1 = map1.getTargetElement();
        this.map2 = map2.getTargetElement();


        this.element.addEventListener('change', () => this.toggle());
    }

    toggle() {
        if (this.element.checked) {
            this.map1.hidden = true;
            this.map2.hidden = false;
        } else {
            this.map1.hidden = false;
            this.map2.hidden = true;
        }
    }
}

export default toggleSwitch
