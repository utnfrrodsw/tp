<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md6>
        <v-card class="custom-card" elevation="12">
          <v-card-title class="headline text-center">
            Iniciar Sesión
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="email"
                label="Email"
                outlined
                solo
                prepend-icon="mdi-account"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Contraseña"
                type="password"
                outlined
                solo
                prepend-icon="mdi-lock"
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
    };
  },
  methods: {
    async login() {
      try {
        const body = {
          email: this.email,
          password: this.password,
        };
        const redirectPath = this.$route.query.redirect || '/'
        const apiUrl = process.env.VUE_APP_API_URL
        const url = `${apiUrl}api/auth/login`
        const response = await axios.post(url, body)
        const data = await response.data
        localStorage.setItem('token', data.token)
        this.$router.push(redirectPath)
      } catch (error) {
        console.error(error)
      }
    },
  },
};
</script>

<style scoped>
.custom-card {
  border-radius: 12px; 
  overflow: hidden; 
  border: 1px solid lightgrey; 
  max-width: 400px; 
  margin: auto; 
}

.elevation-12 {
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.14), 0 1px 18px rgba(0, 0, 0, 0.12), 0 3px 5px rgba(0, 0, 0, 0.2);
}
</style>
