import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import HistogramModule from 'highcharts/modules/histogram-bellcurve';
import { DiagramsService } from 'src/services/diagrams.service';
import Accessibility from 'highcharts/modules/accessibility';

Accessibility(Highcharts); // Инициализация модуля доступности
HistogramModule(Highcharts);
@Component({
  selector: 'app-diagrams',
  templateUrl: './diagrams.component.html',
  styleUrls: ['./diagrams.component.css']
})
export class DiagramsComponent implements OnInit, AfterViewInit {

  public categories: any = [];
  public selectedOption: any;

  constructor(private diagramService: DiagramsService, private cdf: ChangeDetectorRef) {
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
