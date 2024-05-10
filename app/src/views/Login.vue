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
                data-cy="input-correo"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Contraseña"
                type="password"
                outlined
                solo
                prepend-icon="mdi-lock"
                data-cy="input-contrasena"
              ></v-text-field>
              <v-btn
                block
                type="submit"
                color="primary"
                data-cy="login-button"
              >
                Iniciar Sesión
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
        <v-row v-if="alert.show">
      <v-col>
        <alerts :type="alert.type" :message="alert.message" @quit="alert.show = false"></alerts>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import AuthService from '../services/AuthService'
  import Alerts from '@/components/Alerts.vue'
  export default {
    components:{
      Alerts,
    },
    data() {
      return {
        email: '',
        password: '',
        alert:{
          show:false,
          message:'',
          type:''
        }
      }
    },
    methods: {
      async login() {
        try {
          const redirectPath = this.$route.query.redirect || '/'
          const response = await AuthService.login({
            email: this.email,
            password: this.password
          })
          const data = await response.data
          localStorage.setItem('token', data.token)
          this.$router.push(redirectPath)
        } catch (error) {
          this.alert.message = 'Usuario o contraseña incorrecto'
          this.alert.type = 'error'
          this.alert.show = true
          console.error(error)
        }
      },
            reset() {
        this.$refs.form.reset()
      }
    }
  }
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
