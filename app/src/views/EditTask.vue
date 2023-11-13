<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="task.name" label="Nombre"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="task.price" label="Precio"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn :disabled="task.price === task.prices.at(-1).price" color="primary" @click="updateTask">Guardar Cambios</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table :headers="headers" :items="task.prices">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Historial de precios</v-toolbar-title>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <Alerts v-if="showAlert" title="Guardado Exitoso" message="El cambio se realizó exitosamente" @quit="redirectToList"></Alerts>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import Alerts from '@/components/Alerts.vue'

  export default {
    name: 'EditTask',
    components: {
      Alerts
    },
    data() {
      return {
        task: {
          id: this.$route.params.id,
          name: '',
          price: null,
          prices: []
        },
        headers: [
          { text: 'Monto', value: 'price' },
          { text: 'Fecha', value: 'createdAt' }
        ],
        showAlert: false
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_URL}api/tasks/${this.task.id}`)
          this.task.name = response.data.name
          this.task.price = response.data.prices.at(-1).price
          this.task.prices = response.data.prices.map(price => ({
            price: price.price,
            createdAt: new Date(price.createdAt).toLocaleString()
          }))
        } catch (error) {
          console.error(error)
        }
      },
      async updateTask() {
        const data = {
          id: this.task.id,
          name: this.task.name,
          price: this.task.price
        }
        try {
          const token = localStorage.getItem('token')
          await axios.put(`${process.env.VUE_APP_API_URL}api/tasks/${this.task.id}`, data, {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token
            }
          })
          this.task.prices.push({
            price: this.task.price,
            createdAt: new Date().toLocaleString()
          })
          this.showAlert = true
        } catch (error) {
          console.error(error)
        }
      },
      redirectToList() {
        this.$router.push({ name: 'ListTasks' }).catch(() => {})
      }
    }
  }
</script>
