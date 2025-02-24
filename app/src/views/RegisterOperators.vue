<template>
  <v-container class="my-10">
    <h1>Registro de Operador</h1>
    <v-form ref="form" class="mx-2">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="user.name" label="Nombre" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="user.last_name" label="Apellido" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="user.email" label="Correo" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="user.password" label="Contraseña" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" :loading="loading" @click="submitForm">
            <v-icon left>mdi-account-plus</v-icon>
            Agregar operador
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-row v-if="alert.show">
      <v-col>
        <alerts :type="alert.type" :message="alert.message" @quit="alert.show = false"></alerts>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Alerts from '@/components/Alerts.vue'
  import AuthService from '../services/AuthService'

  export default {
    name: 'RegisterOperators',
    components: {
      Alerts,
    },
    data() {
      return {
        user: {
          name: '',
          last_name: '',
          email: '',
          password: ''
        },
        loading: false,
        alert: {
          show: false,
          message: '',
          type: ''
        },
      }
    },
    methods: {
      async submitForm() {
        if (await this.$refs.form.validate()) {
          this.loading = true
          try {
            const data = {
              ...this.user,
              role: 'operator'
            }
            const response = await AuthService.register(data)
            console.log(response)
            this.alert.message = 'Operador creado correctamente'
            this.alert.type = 'success'
            this.alert.show = true
            this.reset()
          } catch (error) {
            this.alert.message = 'Error al agregar Operador'
            this.alert.type = 'error'
            this.alert.show = true
            console.error('Error al registrar el operador:', error)
          }
          this.loading = false
        }
      },
      reset() {
        this.$refs.form.reset()
      }
    }
  }
</script>
