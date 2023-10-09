<template>
  <div>
    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>

<script>
  import { Chart } from 'highcharts-vue'
  import axios from 'axios'

  export default {
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
        }
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        axios
          .get('http://localhost:4000/api/tasks/sum-tasks')
          .then(response => {
            const data = response.data[0]
            this.chartOptions.series = [{
              name: 'Porcentaje',
              data: data.map(item => ({
                name: item.name,
                y: item.count
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