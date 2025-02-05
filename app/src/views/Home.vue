<template>
  <div class="chart-container">
    <highcharts :options="chartOptions" class="chart"></highcharts>
    <highcharts :options="chartOptions2" class="chart"></highcharts>
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
            text: 'Tareas realizadas en los últimos 30 días'
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
            text: 'Relación de precios por tarea'
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
      this.fetchData()
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

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap; /* Permite que los gráficos pasen a una nueva fila automáticamente */
}

.chart {
  flex: 1 1 37%; /* Base del tamaño: 37% del contenedor */
  max-width: 500px; /* Tamaño máximo para gráficos grandes */
  min-width: 300px; /* Tamaño mínimo para gráficos pequeños */
  margin: 10px 0; /* Espaciado entre filas en pantallas pequeñas */
}

/* Estilo para pantallas pequeñas */
@media (max-width: 768px) {
  .chart {
    flex: 1 1 100%; /* Ocupa toda la fila cuando el ancho es pequeño */
    max-width: none; /* Elimina restricciones de tamaño máximo */
  }
}
</style>
