<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="task.name" label="Nombre" data-cy="task-name"></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="task.price" label="Precio" data-cy="task-price"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn
          :disabled="task.price === task.prices?.at(-1)?.price"
          color="primary"
          @click="updateTask"
          data-cy="save-task"
        >
          Guardar Cambios
        </v-btn>
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
  import Alerts from '@/components/Alerts.vue'
  import TaskService from "../services/TaskService"
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
          const responseTask = await TaskService.get(this.task.id)
          this.task.name = responseTask.data.name
          this.task.price = responseTask.data.prices?.at(-1)?.price ?? null
          this.task.prices = responseTask.data.prices.map(price => ({
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
          await TaskService.update(this.task.id, data)
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
