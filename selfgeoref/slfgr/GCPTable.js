import 'tabulator-tables/dist/css/tabulator.min.css';
import {TabulatorFull as Tabulator} from "tabulator-tables";
import Control from 'ol/control/Control';

export default class slfgrGCPTable extends Tabulator {
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
        map.addControl(new Control({element: this.element}));

        this.on('rowDeleted', (row) => 
            map.gcpSource.removeFeature(row.getData()));

        ['rowSelected', 'rowDeselected'].forEach(event => this.on(event,
            (row) => map.toggleGcpSelection(row.getData())
        ))
    }
};
    
