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
  public columnsName = new BehaviorSubject<any>(undefined);
  // public pieOptions: any;

  constructor() { }

  setData(result: any) {
    this.columnsDiagram = result.columns;
    // const splitRes = this.columnsDiagram[0].name.split(',');
    // if (splitRes.length > 1) {
    //   this.columnsNames = splitRes;
    //   // this.rowsDiagram = result.rows.split(',');
    //   this.rowsDiagram = result.rows.map((innerArray: any) =>
    //     innerArray.map((item: any) => item.split(',')) // разбиваем каждую строку по запятой
    //   );
    // } else {
    //   for (let column of this.columnsDiagram) {
    //     this.columnsNames.push(column.name);
    //   }
    //   this.rowsDiagram = result.rows;
    // }
    // let columns = [];
    if (result.columns.length > 1){
      this.columnsNames = result.columns.map((el: any) => el.name);
    } else {
      this.columnsNames = result.columns[0].name.split(',');
    }
    // let rows = [];
    if (result.rows[0].length > 1){
      this.rowsDiagram = result.rows;
    } else {
      this.rowsDiagram = result.rows.map((el: any) => el[0].split(','));
    }
    console.log(this.columnsNames, this.rowsDiagram)
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

      values.forEach((value: any) => {countMap[value] = (countMap[value] || 0) + 1;
      });

      // Возвращаем объект вида { имя: { значение1: 3, следующее значение1: 2, ... } }
      return { [key]: countMap };
    });
    this.columnsName.next(this.columnsNames);
    // this.setPieOptions(this.columnsNames[0]);
    // this.setColumnOptions(this.columnsNames[0]);
    // this.setHistogramOptions(this.columnsNames[0]);
    console.log(this.counts);
  }

  public setPieOptions(name?: any) {
    let pieData: any = [];

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
    if (pieData.length > 10) {
      pieData = pieData.splice(0, 10);
    }
    this.getPieData.next(pieData);
    return pieData;
  }

  setColumnOptions(category?: any): Highcharts.Options {
    console.log(this.counts)
    let categories;
    let objVal: any;
    for (let count of this.counts) {
      console.log(count)
      for (let val in count) {
        if (val === category) {
          console.log(count[val])
          objVal = Object.values(count[val]);
          categories = Object.keys(count[val]);
          if (objVal.length > 25){
            objVal = objVal.splice(0, 25);
          }
          console.log(objVal, categories)
        }
      }
    }

    return {
      chart: { type: 'column' },
      title: { text: 'Столбчатая диаграмма' },
      xAxis: { categories },
      yAxis: { title: { text: 'Значение' } },
      series: [{
        name: 'Серия 1',
        type: 'column',
        data: objVal
      }]
    }

    //  // Извлекаем категории - можно адаптировать по вашим данным (например, месяцы).
    //  const categories = this.columnsNames; // Пример категорий (можно изменить по необходимости)

    //  // Создаем series, обрабатывая каждый объект в `data`
    //  const series = Object.keys(this.counts[0]).map((key, index) => {
    //    // Пробегаем по каждому объекту и суммируем значения
    //    const values = this.counts.map((item: any) => {
    //      const innerObject = item[key];
    //      // Извлекаем числовые значения из вложенного объекта и суммируем их
    //      return innerObject ? Object.values(innerObject).reduce((sum: any, num: any) => sum + num, 0) : 0;
    //    });

    //    // Создаем серию
    //    return {
    //      name: `Серия ${index + 1}`,
    //      type: 'column',
    //      data: values
    //    };
    //  });

    //  // Возвращаем объект настроек для диаграммы
    //  return {
    //    chart: { type: 'column' },
    //    title: { text: 'Столбчатая диаграмма' },
    //    xAxis: { categories },
    //    yAxis: { title: { text: 'Значение' } },
    //    series: series
    //  };

    // const seriesData: any = [];
    // const categories = new Set(selectedCategories); // Создаем Set из переданных категорий

    // this.counts.forEach((item: any) => {
    //     const key = Object.keys(item)[0];
    //     const values = item[key];

    //     // Формируем серию данных для каждого ключа
    //     const data = Array.from(categories).map((category: any) => values[category]  0);
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
  setHistogramOptions(category?: any): Highcharts.Options {
    console.log(this.counts);
    let categories;
    let objVal: number[] = [];

    // Извлекаем значения и категории
    for (let count of this.counts) {
      for (let val in count) {
        if (val === category) {
          console.log(count[val]);
          objVal = Object.values(count[val]);
          categories = Object.keys(count[val]);
          console.log(objVal, categories);
        }
      }
    }

    return {
      chart: { type: 'column' },
      title: { text: 'Гистограмма' },
      xAxis: {
        categories: categories, // Категории по оси X
        title: { text: 'Категории' }
      },
      yAxis: {
        title: { text: 'Значение' }
      },
      series: [{
        name: 'Частота',
        type: 'column',
        data: objVal  // Данные для каждой категории
      }]
    };
  }
}
