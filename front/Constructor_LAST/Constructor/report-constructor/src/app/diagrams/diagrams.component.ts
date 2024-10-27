import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import HistogramModule from 'highcharts/modules/histogram-bellcurve';
import { DiagramsService } from 'src/services/diagrams.service';
import Accessibility from 'highcharts/modules/accessibility';
import ExportingModule from 'highcharts/modules/exporting';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import { DragndropService } from 'src/services/dragndrop.service';


Accessibility(Highcharts); // Инициализация модуля доступности
HistogramModule(Highcharts);
ExportingModule(Highcharts)
OfflineExporting(Highcharts);

@Component({
  selector: 'app-diagrams',
  templateUrl: './diagrams.component.html',
  styleUrls: ['./diagrams.component.css']
})
export class DiagramsComponent implements OnInit, AfterViewInit {

  public categories: any = [];
  public selectedOption: any;

  @ViewChild('pieChart') pieChart: any;
  @ViewChild('columnChart') columnChart: any;
  @ViewChild('histogramChart') histogramChart: any;

  constructor(private diagramService: DiagramsService, private cdf: ChangeDetectorRef, public dragndropService: DragndropService) {
    diagramService.columnsName.subscribe((data: any) => {
      if (data) {
        this.onSelectChange(null, 0, data);
      }
    })
  }
  Highcharts: typeof Highcharts = Highcharts;

  ngOnInit(): void {
    this.categories = this.diagramService.columnsNames;
  }

  ngAfterViewInit(): void {
    this.diagramService.getPieData.subscribe((data) => {
      if (data) {
        this.cdf.detectChanges()
      }
    })
  }

  chartInstances: { [key: string]: Highcharts.Chart } = {};
  saveInstance(chart: Highcharts.Chart, name: string) {
    this.chartInstances[name] = chart;
  }

//   public createSnapshot(element: any) {
//     const svgElement: any = document.querySelector('.highcharts-container svg');

//     if (svgElement) {
//         const canvas = document.createElement("canvas");
//         canvas.height = this.pieChart.el.nativeElement.clientHeight;
//         canvas.width = this.pieChart.el.nativeElement.clientWidth;
//         const ctx = canvas.getContext('2d');

//         if (ctx) {
//             const svgData = new XMLSerializer().serializeToString(svgElement);
//             const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
//             const url = URL.createObjectURL(svgBlob);

//             const img = new Image();
//             img.onload = () => {
//                 ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//                 const href = canvas.toDataURL('image/jpeg', 1.0);
//                 const link = document.createElement('a');
//                 link.href = href;
//                 link.download = `${this.pieChart}-${new Date().getTime()}-snapshot.jpeg`;
//                 link.click();

//                 // Освобождаем ресурсы
//                 URL.revokeObjectURL(url);
//             };

//             // Важно: устанавливаем src только после определения onload
//             img.src = url;
//         }

//         canvas.remove();
//     } else {
//         console.error("SVG element not found");
//     }
// }
  public savedImageData: any;
  public createSnapshot(element: any) {
    let svgElement: any = document.querySelectorAll('.highcharts-container svg');
    if (element == 1) {
      svgElement = svgElement[0];
    } else if (element == 2) {
      svgElement = svgElement[1]
    } else {
      svgElement = svgElement[2]
    }
    if (svgElement) {
      const canvas = document.createElement("canvas");
      let activeEl;
      if (element == 1) {
        activeEl = this.pieChart;
      } else if (element == 2) {
        activeEl = this.columnChart;
      } else if (element == 3) {
        activeEl = this.histogramChart;
      }
      canvas.height = activeEl.el.nativeElement.clientHeight;
      canvas.width = activeEl.el.nativeElement.clientWidth;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const img = new Image();
        img.onload = () => {
          // Когда изображение загружено, рисуем его на canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Получаем Data URL и сохраняем его в переменной
          const imageData = canvas.toDataURL('image/jpeg', 1.0);
          console.log(imageData); // Здесь вы можете использовать переменную imageData

          // Если нужно, можно сохранять imageData в классовое свойство
          this.savedImageData = imageData; // Например, если вы хотите хранить его в классе

          // Освобождаем ресурсы
          URL.revokeObjectURL(url);
        };

        // Устанавливаем источник изображения
        img.src = url;
        this.copyImageToClipboard(img.src);
      }

      // Удаляем canvas из документа
      canvas.remove();
    } else {
      console.error("SVG element not found");
    }
  }

  public async copyImageToClipboard(blobUrl: any) {
    // try {
    //   // 1. Получаем Blob объект по его URL
    //   const response = await fetch(blobUrl);
    //   const blob = await response.blob();

    //   // 2. Преобразуем Blob в Base64 строку
    //   const reader = new FileReader();
    //   reader.onloadend = function() {
    //     const base64data: any = reader.result;

    //     // 3. Копируем Base64 строку в буфер обмена
    //     navigator.clipboard.writeText(base64data)
    //       .then(() => {
    //         console.log('Изображение скопировано в буфер обмена в формате Base64!');
    //       })
    //       .catch(err => {
    //         console.error('Ошибка при копировании:', err);
    //       });
    //   };
    //   reader.readAsDataURL(blob); // Конвертируем Blob в Data URL (Base64)
    // } catch (err) {
    //   console.error('Ошибка при обработке изображения:', err);
    // }
    try {
      // Проверяем, активен ли документ и поддерживает ли браузер Clipboard API
      if (document) {
        // document.onfocus()
      }
      if (document.hasFocus() && navigator.clipboard) {
        const response = await fetch(blobUrl);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.onloadend = function() {
          const base64data: any = reader.result;
          navigator.clipboard.writeText(base64data)
            .then(() => console.log('Изображение скопировано в буфер обмена!'))
            .catch(err => console.error('Ошибка при копировании:', err));
        };
        reader.readAsDataURL(blob);
      } else {
        console.warn('Документ не активен или Clipboard API не поддерживается.');
      }
    } catch (err) {
      console.error('Ошибка при обработке изображения:', err);
    }
  }

  // exportChart(chartName: string) {
  //   const chart = this.chartInstances[chartName];
  //   if (chart) {
  //     try {
  //       chart.exportChartLocal({ type: 'image/png', filename: 'my-pie-chart'}, {});
  //     } catch (err) {
  //       console.error('Export error:', err);
  //     }
  //   }
  // }

  exportChart(chartName: string) {
//     const chart = this.chartInstances[chartName];
//     if (chart) {
//         chart.exportChartLocal({
//             type: 'image/png',
//             filename: 'my-pie-chart',
//         });
//     } else {
//         console.error('Диаграмма не найдена');
//     }
  }


  // private createSnapshot(diagram: any){
  //   if (this.video){
  //     const canvas = document.createElement("canvas")
  //     canvas.height = this.video.nativeElement.clientHeight
  //     canvas.width = this.video.nativeElement.clientWidth
  //     const ctx = canvas.getContext('2d')
  //     if (ctx){
  //       ctx.drawImage(this.video.nativeElement, 0, 0, canvas.width, canvas.height)
  //       const href = canvas.toDataURL('image/jpeg', 1.0)
  //       const link = document.createElement('a')
  //       link.href = href
  //       link.download = `${this.camName}-${new Date().getTime()}-snapshot.jpeg`
  //       link.click()
  //     }
  //     canvas.remove();
  //   }
  // }

  // if (chart: any) {
  //   chart.exportChart(
  //     { type: 'image/png' }, // Задаём тип экспортируемого файла
  //     {} // Дополнительные параметры диаграммы (пустой объект, если не нужно)
  //   );
  // }

  public onSelectChange(event: any, number: number, category?: any) {
    let selectedValue;
    if (event) {
      selectedValue = (event.target as HTMLSelectElement).value;
    }
    if (!category) {
      this.selectedOption = selectedValue;
    } else {
      this.selectedOption = category[2];
    }
    if (number === 1 || category) {
      this.pieChartOptions = {
        chart: { type: 'pie' },
        title: { text: 'Круговая диаграмма' },
        series: [{
          name: 'Доля',
          type: 'pie',
          data: this.diagramService.setPieOptions(category ? category[2] : this.selectedOption)
        }]
      };
    }
    if (number === 2 || category) {
      this.columnChartOptions = this.diagramService.setColumnOptions(category ? category[1] : this.selectedOption);
    }
    if (number === 3 || category) {
      this.histogramOptions = this.diagramService.setHistogramOptions(category ? category[0] : this.selectedOption);
    }
  }

  pieChartOptions: Highcharts.Options = {
    chart: { type: 'pie' },
    title: { text: 'Круговая диаграмма' },
    series: [{
      name: 'Доля',
      type: 'pie',
      data: this.diagramService.setPieOptions(this.categories[0])
    }]
  };

  // columnChartOptions: Highcharts.Options = {
  //   chart: { type: 'column' },
  //   title: { text: 'Столбчатая диаграмма' },
  //   xAxis: { categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май'] },
  //   yAxis: { title: { text: 'Значение' } },
  //   series: [{
  //     name: 'Серия 1',
  //     type: 'column',
  //     data: [10, 15, 20, 25, 30]
  //   }, {
  //     name: 'Серия 2',
  //     type: 'column',
  //     data: [20, 25, 15, 30, 40]
  //   }]
  // };

  columnChartOptions: Highcharts.Options = this.diagramService.setColumnOptions('new_value');

  // histogramOptions: Highcharts.Options = {
  //   title: { text: 'Гистограмма' },
  //   xAxis: [{
  //     title: { text: 'Интервалы' },
  //     alignTicks: false
  //   }, {
  //     title: { text: 'Частота' },
  //     alignTicks: false,
  //     opposite: true
  //   }],
  //   yAxis: [{ title: { text: 'Частота' } }],
  //   series: [{
  //     name: 'Гистограмма',
  //     type: 'histogram',
  //     baseSeries: 's1',
  //     zIndex: -1
  //   }, {
  //     name: 'Данные',
  //     type: 'scatter',
  //     id: 's1',
  //     data: [1.2, 2.3, 2.8, 3.1, 3.6, 4.0, 4.2, 4.5, 5.1, 5.4, 6.0, 6.2, 6.5, 7.1],
  //     marker: { radius: 1.5 }
  //   }]
  // };
  histogramOptions: Highcharts.Options = this.diagramService.setHistogramOptions('entity_id');
  // Дата обновления
}
