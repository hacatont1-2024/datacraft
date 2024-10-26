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

  constructor(private diagramService: DiagramsService, private cdf: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.diagramService.getPieData.subscribe((data) => {
      if (data) {
        this.cdf.detectChanges()
      }
    })
  }

  Highcharts: typeof Highcharts = Highcharts;

  pieChartOptions: Highcharts.Options = {
    chart: { type: 'pie' },
    title: { text: 'Круговая диаграмма' },
    series: [{
      name: 'Доля',
      type: 'pie',
      data: this.diagramService.setPieOptions('Пространство')
    }]
  };

  columnChartOptions: Highcharts.Options = {
    chart: { type: 'column' },
    title: { text: 'Столбчатая диаграмма' },
    xAxis: { categories: ['Янв', 'Фев', 'Мар', 'Апр', 'Май'] },
    yAxis: { title: { text: 'Значение' } },
    series: [{
      name: 'Серия 1',
      type: 'column',
      data: [10, 15, 20, 25, 30]
    }, {
      name: 'Серия 2',
      type: 'column',
      data: [20, 25, 15, 30, 40]
    }]
  };

  // columnChartOptions: Highcharts.Options = this.diagramService.setColumnOptions();

  histogramOptions: Highcharts.Options = {
    title: { text: 'Гистограмма' },
    xAxis: [{
      title: { text: 'Интервалы' },
      alignTicks: false
    }, {
      title: { text: 'Частота' },
      alignTicks: false,
      opposite: true
    }],
    yAxis: [{ title: { text: 'Частота' } }],
    series: [{
      name: 'Гистограмма',
      type: 'histogram',
      baseSeries: 's1',
      zIndex: -1
    }, {
      name: 'Данные',
      type: 'scatter',
      id: 's1',
      data: [1.2, 2.3, 2.8, 3.1, 3.6, 4.0, 4.2, 4.5, 5.1, 5.4, 6.0, 6.2, 6.5, 7.1],
      marker: { radius: 1.5 }
    }]
  };
}
