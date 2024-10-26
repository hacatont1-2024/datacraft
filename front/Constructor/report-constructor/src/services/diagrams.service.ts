import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiagramsService {

  public columnsDiagram: any;
  public columnsNames: any = [];
  public rowsDiagram: any;
  public filterResult: any = [];
  public counts: any;
  private columnChartOptions: any;

  public getPieData = new BehaviorSubject<any>(undefined);
  // public pieOptions: any;

  constructor() { }

  setData(result: any) {
    this.columnsDiagram = result.columns;
    this.rowsDiagram = result.rows;
    for (let column of this.columnsDiagram) {
      this.columnsNames.push(column.name);
    }
    let resData = this.columnsNames.map((col: any) => ({ [col]: [] }));
    for (let row of this.rowsDiagram) {
      row.forEach((cell: any, index: any) => {
        const columnKey = Object.keys(resData[index])[0];
        resData[index][columnKey].push(cell);
      });
    }
    console.log(resData)

    this.counts = resData.map((item: any) => {
      const key = Object.keys(item)[0];
      const values = item[key];
    
      const countMap: any = {};
    
      values.forEach((value: any) => {
        countMap[value] = (countMap[value] || 0) + 1;
      });
  
      // Возвращаем объект вида { имя: { значение1: 3, следующее значение1: 2, ... } }
      return { [key]: countMap };
    });
    this.setPieOptions('Пространство');
    // this.setColumnOptions()
    console.log(this.counts);
  }

  setPieOptions(name: any) {
    const pieData: any = [];

    this.counts.forEach((item: any) => {
      const key = Object.keys(item)[0]; 
      const values = item[key]; 
      if (key === name) {
        for (let [name, count] of Object.entries(values)) {
          pieData.push({ name, y: count });
        }
      }
    });
    console.log(pieData)
    this.getPieData.next(pieData);
    return pieData;
  }

  setColumnOptions(selectedCategories?: any) {
    const categories = new Set();
    const seriesData: any = [];

    this.counts.forEach((item: any) => {
      const key = Object.keys(item)[0]; 
      const values = item[key];

      // Собираем все уникальные категории
      Object.keys(values).forEach(value => categories.add(value));

      // Формируем серию данных для каждого ключа
      const data = Array.from(categories).map((category: any) => values[category] || 0);
      seriesData.push({ name: key, type: 'column', data });
    });

    const categoriesArray = Array.from(categories); // Преобразуем Set в массив

    // Устанавливаем полученные категории и данные в диаграмму Highcharts
    this.columnChartOptions = {
      chart: { type: 'column' },
      title: { text: 'Столбчатая диаграмма' },
      xAxis: { categories: categoriesArray }, // Устанавливаем уникальные категории
      yAxis: { title: { text: 'Значение' } },
      series: seriesData // Устанавливаем данные для серий
    };
    // this.pieOptions = this.columnChartOptions;
    return this.columnChartOptions;
    console.log(this.columnChartOptions);


    // const seriesData: any = [];
    // const categories = new Set(selectedCategories); // Создаем Set из переданных категорий

    // this.counts.forEach((item: any) => {
    //     const key = Object.keys(item)[0]; 
    //     const values = item[key];

    //     // Формируем серию данных для каждого ключа
    //     const data = Array.from(categories).map((category: any) => values[category] || 0);
    //     seriesData.push({ name: key, type: 'column', data });
    // });

    // // Преобразуем Set в массив
    // const categoriesArray = Array.from(categories); 

    // // Устанавливаем полученные категории и данные в диаграмму Highcharts
    // this.columnChartOptions = {
    //     chart: { type: 'column' },
    //     title: { text: 'Столбчатая диаграмма' },
    //     xAxis: { categories: categoriesArray }, // Устанавливаем уникальные категории
    //     yAxis: { title: { text: 'Значение' } },
    //     series: seriesData // Устанавливаем данные для серий
    // };

    // console.log(this.columnChartOptions);
    // return this.columnChartOptions;
  }

  setHistogramOptions() {
    
  }
}
