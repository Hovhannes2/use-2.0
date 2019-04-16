import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import Chart from 'chart.js';
import {Group, Row} from './model/row.model';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss']
})
export class ToolComponent implements OnInit {
  tableDataOld: any = [];
  tableData: Array<Group> = [];
  rowID: number;
  usability = 0;

  usabilityGroup: any = [];
  usabilityTotal: any;

  showUsability = false;
  showPlots = false;
  private id = 1;

  constructor() {
    this.tableDataOld = [
      [
        {id: 1, desc: 'Search', steps: 1, importance: 1, time: 0},
        {id: 2, desc: 'Team change', steps: 2, importance: 3, time: 0},
        {id: 3, desc: 'Settings', steps: 2, importance: 2, time: 0},
        {id: 4, desc: 'Privacy', steps: 2, importance: 2, time: 0},
        {id: 5, desc: 'Mail', steps: 2, importance: 4, time: 0}
      ],
      [
        {id: 6, desc: 'Maps', steps: 2, importance: 4, time: 0},
        {id: 7, desc: 'Search image', steps: 3, importance: 3, time: 0},
        {id: 8, desc: 'Change lang', steps: 5, importance: 3, time: 0},
        {id: 9, desc: 'Search history', steps: 2, importance: 5, time: 0},
        {id: 10, desc: 'Clear history', steps: 4, importance: 6, time: 0}
      ],
      [
        {id: 11, desc: 'Country change', steps: 5, importance: 7, time: 0},
        {id: 12, desc: 'Images', steps: 1, importance: 2, time: 0},
        {id: 13, desc: 'Videos', steps: 1, importance: 2, time: 0},
        {id: 14, desc: 'News', steps: 1, importance: 1, time: 0}
      ]
    ];
    this.tableData.push(
      new Group([new Row(this.getUniqueId(), 'Search', 1, 1, 2)]),
      );
  }

  addRow(id, oldRowId) {
    id.push(new Row(this.getUniqueId()));
    this.rowID = oldRowId + 1;
  }

  addGroup() {
    this.tableData.push(new Group([new Row(this.getUniqueId())]));
    // this.rowID = oldRowId + 1;
  }
  // addGroup this.datatable1 in petqa push ani datark group
  // addrow stanuma groupy u et groupi meji row erum petqa push ani nor sarqc rown

  editRow(value) {
    this.rowID = value;
  }

  validation(value) {
    if (value <= 0) {
      value = null;
    }
  }

  deleteRow(value, origin) {
    origin.rows.splice( origin.rows.findIndex(x => x.id === value.id), 1);
  }

  saveRow() {
    this.rowID = 0;
  }

  calculateDataLength() {
    let count = 0;
    for (let i = 0; i < this.tableData.length; i++) {
      for (let j = 0; j < this.tableData[i].rows.length; j++) {
        count++;
      }
    }
    return count;
  }

  doCalculation(i, j) {
    this.usability += this.tableData[i].rows[j].importance / (this.tableData[i].rows[j].steps);
  }

  calculateUsability() {
    this.usability = 0;
    for (let i = 0; i < this.tableData.length; i++) {
      for (let j = 0; j < this.tableData[i].rows.length; j++) {
        if (this.tableData[i].rows[j].importance <= this.tableData[i].rows[j].steps) {
          this.doCalculation(i, j);
        } else {
          this.tableData[i].rows[j].importance = this.tableData[i].rows[j].steps;
          this.doCalculation(i, j);
        }
      }
      this.usabilityGroup.push(this.usability / this.tableData[i].rows.length);
      this.usability = 0;
    }
    this.usabilityTotal = this.usabilityGroup.reduce((partial_sum, a) => partial_sum + a) / this.tableData.length;
    this.usabilityTotal = this.usabilityTotal.toFixed(4);
    this.showUsability = true;
  }

  getData() {
    const stepsData = [];
    const importanceData = [];
    for (let i = 0; i < this.tableData.length; i++) {
      for (let j = 0; j < this.tableData[i].rows.length; j++) {
        stepsData.push(this.tableData[i].rows[j].steps);
        importanceData.push(this.tableData[i].rows[j].importance);
      }
    }
    return {stepsData, importanceData};
  }

  extractingData(data) {
    const dataFirst = [], dataSecond = [];
    let previous = null;

    data.sort(function(x, y) {return x - y; } );
    for ( let i = 0; i < data.length; i++ ) {
      if ( data[i] !== previous ) {
        dataFirst.push(data[i]);
        dataSecond.push(1);
      } else {
        dataSecond[dataSecond.length - 1]++;
      }
      previous = data[i];
    }

    return [dataFirst, dataSecond];
  }

  drawPlots() {
    this.showPlots = true;
    const mainData: any = this.getData();

    const steps = this.extractingData(mainData.stepsData);
    const importance  = this.extractingData(mainData.importanceData);

    const firstPlotContainer = document.getElementById('firstChart');
    const firstChart = new Chart(firstPlotContainer, {
      type: 'line',
      data: {
        labels: steps[0],
        datasets: [{
          label: 'Frequency of Step',
          data: steps[1],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        tooltips: {
          callbacks: {
            title: function(tooltipItems, data) {
              const title = tooltipItems[0] || '';

              if (title) {
                return 'Step with length ' + data.labels[title.index];
              }
            }
          }
        }
      }
    });

    const secondPlotContainer = document.getElementById('secondChart');
    const secondChart = new Chart(secondPlotContainer, {
      type: 'line',
      data: {
        labels: importance[0],
        datasets: [{
          label: 'Frequency of Importance',
          data: importance[1],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        tooltips: {
          callbacks: {
            title: function(tooltipItems, data) {
              const title = tooltipItems[0] || '';

              if (title) {
                return 'Importance value ' + data.labels[title.index];
              }
            }
          }
        }
      }
    });
  }

  ngOnInit() {

  }

  private getUniqueId(): number {
    return this.id++;
  }

}
