<template>
  <v-container class="my-10">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="task.name" label="Nombre" required></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="task.price" label="Precio" required></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" :loading="loading" @click="submitForm">
          <v-icon left>mdi-plus</v-icon>
          Agregar Tarea
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="alert.show">
      <v-col>
        <alerts :type="alert.type" :message="alert.message" @salir="alert.show = false"></alerts>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import TaskService from "../services/TaskService"
  import Alerts from "@/components/Alerts.vue"

  export default {
    name: "AddTask",
    components: {
      Alerts
    },
    data() {
      return {
        task: {
          name: "",
          price: ""
        },
        loading: false,
        alert: {
          show: false,
          message: "",
          type: ""
        },
        menu: false
      }
    },
    methods: {
      async submitForm() {
        this.loading = true
        try {
          const response = await TaskService.create(this.task)
          this.alert.message = 'Tarea creada correctamente'
          this.alert.type = 'success'
          this.alert.show = true
          this.task.name = ''
          this.task.price = ''
        } catch (error) {
          this.alert.message = 'Error al agregar técnico'
          this.alert.type = 'error'
          this.alert.show = true
        }
        this.loading = false
      }
    }
  }
</script>

<style scoped>
  .v-menu__content {
    z-index: 9999;
  }
</style>