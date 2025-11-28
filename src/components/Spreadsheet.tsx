import { useEffect, useRef } from 'react';
import Handsontable from 'handsontable';
import { HyperFormula } from 'hyperformula';
import 'handsontable/dist/handsontable.full.min.css';

export default function Spreadsheet() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hotInstanceRef = useRef<Handsontable | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize HyperFormula engine
    const hyperformulaInstance = HyperFormula.buildEmpty({
      licenseKey: 'gpl-v3',
    });

    // Create initial data (10 rows x 10 columns)
    const initialData: string[][] = [];
    for (let i = 0; i < 20; i++) {
      initialData.push(new Array(10).fill(''));
    }

    // Initialize Handsontable
    const hot = new Handsontable(containerRef.current, {
      data: initialData,
      rowHeaders: true,
      colHeaders: true,
      width: '100%',
      height: '100vh',
      licenseKey: 'non-commercial-and-evaluation',
      stretchH: 'all',
      contextMenu: [
        'row_above',
        'row_below',
        'remove_row',
        'col_left',
        'col_right',
        'remove_col',
        '---------',
        'copy',
        'cut',
        '---------',
        'undo',
        'redo',
      ],
      manualColumnResize: true,
      manualRowResize: true,
      filters: true,
      dropdownMenu: true,
      columnSorting: true,
      mergeCells: true,
      formulas: {
        engine: hyperformulaInstance,
        sheetName: 'Sheet1',
      },
      cells: function(row, col) {
        const cellProperties: any = {};
        return cellProperties;
      },
      afterChange: function(changes, source) {
        if (source !== 'loadData') {
          // Handle cell changes
        }
      },
    });

    hotInstanceRef.current = hot;

    return () => {
      if (hotInstanceRef.current) {
        hotInstanceRef.current.destroy();
      }
    };
  }, []);

  return (
    <div id="spreadsheet-container" ref={containerRef}></div>
  );
}

