<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm6 md4>
        <v-card class="elevation-12">
          <v-card-title class="headline text-center">Iniciar Sesión</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="email"
                label="Email"
                outlined
                solo
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Contraseña"
                type="password"
                outlined
                solo
              ></v-text-field>
              <v-btn block type="submit" color="primary">Iniciar Sesión</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
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
          const redirectPath = this.$route.query.redirect || '/'
          const response = await axios.post('http://localhost:4000/api/auth/login', body)
          const data = await response.data
          localStorage.setItem('token', data.token)
          this.$router.push(redirectPath)
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
</script>
<style scoped>
.elevation-12 {
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.14), 0 1px 18px rgba(0, 0, 0, 0.12), 0 3px 5px rgba(0, 0, 0, 0.2);
}
</style>