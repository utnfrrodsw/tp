<template>
  <div style="display: flex; justify-content: center; gap: 20px;">
    <highcharts :options="chartOptions" style="width: 37%;"></highcharts>
    <highcharts :options="chartOptions2" style="width: 37%;"></highcharts>
  </div>
</template>


<script>
  import { Chart } from 'highcharts-vue'
  import TaskService from '../services/TaskService'

  export default {
    name: 'Home',
    components: {
      highcharts: Chart
    },
    data() {
      return {
        chartOptions: {
          chart: {
            type: 'pie'
          },
          title: {
            text: 'Tareas realizadas en los ultimos 30 dias'
          },
          series: [],
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
            }
          }
        },
        chartOptions2: {
          chart: {
            type: 'pie'
          },
          title: {
            text: 'Relacion de precios por tarea'
          },
          series: [],
          tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
          },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
              }
            }
          }
        },
      }
    },
    mounted() {
      this.fetchData(),
      this.fetchData2()
    },
    methods: {
      fetchData() {
        TaskService.sumTasks()
          .then(response => {
            const data = response.data[0]
            console.log(data)
            this.chartOptions.series = [{
              name: 'Porcentaje',
              data: data.map(item => ({
                name: item.name,
                y: parseInt(item.total)
              }))
            }]
          })
          .catch(error => {
            console.error(error)
          })
      },
      fetchData2() {
        TaskService.actualTaskPrice()
          .then(response => {
            const data2 = response.data
            this.chartOptions2.series = [{
              name: 'Porcentaje',
              data: data2.map(item => ({
                name: item.name,
                y: parseInt(item.price)
              }))
            }]
          })
          .catch(error => {
            console.error(error)
          })
      }
    }
  }
</script>