import 'tabulator-tables/dist/css/tabulator.min.css';
import {TabulatorFull as Tabulator} from "tabulator-tables";
import Control from 'ol/control/Control';

class slfgrGCPTabulator extends Tabulator {
    constructor(features) {
        super('#gcp-table', {
                layout: 'fitDataTable',
                reactiveData: true,
                data: features,
                columns: [
                    {title: 'mapX', field: 'mapX'},
                    {title: 'mapY', field: 'mapY'}
                ]
        });
    }
}

export default class slfgrGCPTable extends Control {
    constructor(features) {
        super({element: (new slfgrGCPTabulator(features)).element})
    }
}
