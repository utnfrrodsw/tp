<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12" v-if="tasks.length==0">
        <v-card outlined>
          <v-card-text>No hay registros de tareas.</v-card-text>
        </v-card>
      </v-col>
      <v-col v-for="(task, index) in tasks" :key="index" cols="12" sm="4">
        <v-card outlined>
          <v-card-title>{{ task.name }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">Código:</v-col>
              <v-col cols="6">{{ task.id }}</v-col>
            </v-row>
            <v-row v-if="task.prices[0]">
              <v-col cols="6">Precio:</v-col>
              <v-col cols="6">{{ task.prices.at(-1).price }}</v-col>
            </v-row>
            <v-row v-if="task.prices[0]">
              <v-col cols="6">Última modificación:</v-col>
              <v-col cols="6">{{ task.prices.at(-1).createdAt.substring(0, 10) }}</v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="editTask(task.id)">Modificar</v-btn>
            <v-btn color="error" @click="deleteTask(task.id)">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'ListGroups',
    data() {
      return {
        tasks: []
      }
    },
    async mounted() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        try {
          const response = await fetch(`${process.env.VUE_APP_API_URL}api/tasks`)
          const data = await response.json()
          this.tasks = data
        } catch (error) {
          console.error(error)
        }
      },
      async deleteTask(id) {
        try {
          const token = localStorage.getItem('token')
          const response = await fetch(`${process.env.VUE_APP_API_URL}api/tasks/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token
            }
          })
          this.fetchData()
        } catch (error) {
          console.error(error)
        }
      },
      editTask(id) {
        this.$router.push({ name: 'EditTask', params: { id } })
      }
    }
  }
</script>