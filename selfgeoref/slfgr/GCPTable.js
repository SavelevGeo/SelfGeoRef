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
                {title: 'mapX', field: 'mapX', editor: true},
                {title: 'mapY', field: 'mapY', editor: true}
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

    get gcps() {
        return this.getData().map(row => [
            '-gcp',
            ...row.values_.geometry.flatCoordinates.map(Math.abs).map(String),
            row.mapX, row.mapY
        ]).flat()
    }
};
    
