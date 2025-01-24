<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="task.name"
          label="Nombre"
          data-cy="task-name"
          readonly
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="task.price"
          label="Precio"
          data-cy="task-price"
          readonly
        ></v-text-field>
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
  </v-container>
</template>

<script>
  import TaskService from "../services/TaskService"

  export default {
    name: 'ShowTask',
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
      }
    }
  }
</script>
