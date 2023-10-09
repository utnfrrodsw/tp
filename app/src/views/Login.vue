<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-card>
        <v-card-title class="headline">Iniciar Sesión</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="email"
              label="Email"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Contraseña"
              type="password"
              outlined
            ></v-text-field>
            <v-btn type="submit" color="primary">Iniciar Sesión</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        email: '',
        password: '',
      }
    },
    methods: {
      async login() {
        try {
          const body = {
            email: this.email,
            password: this.password
          }
          const response = await axios.post('http://localhost:4000/api/auth/login', body)
          const data = await response.data
          localStorage.setItem('token', data.token)
          this.$router.push('/')
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
</script>
