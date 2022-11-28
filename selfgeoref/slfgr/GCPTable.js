import 'tabulator-tables/dist/css/tabulator.min.css';
import {TabulatorFull as Tabulator} from "tabulator-tables";
import Control from 'ol/control/Control';

class slfgrGCPTabulator extends Tabulator {
    constructor(map) {
        super('#gcp-table', {
            layout: 'fitDataTable', reactiveData: true,
            data: map.gcpFeatures.getArray(),
            columns: [
                {formatter: 'rowSelection', titleFormatter: 'rowSelection',
                hozAlign: 'center', headerSort: false,
                cellClick: (e, cell) => cell.getRow().toggleSelect()},
                {title: 'mapX', field: 'mapX'},
                {title: 'mapY', field: 'mapY'}
            ],
            rowDblClickMenu: [
                {label: 'Delete point', action: (e, row) => row.delete()},
                {label: 'Delete selected', action: (e, row) => 
                        row.getTable().getSelectedRows()
                        .forEach(row => row.delete())}
            ]
        });

        this.on('rowDeleted', (row) => {
            map.gcpSource.removeFeature(row.getData());
        });
    }
};

export default class slfgrGCPTable extends Control {
    constructor(map) {
        super({element: (new slfgrGCPTabulator(map)).element})
    }
}
