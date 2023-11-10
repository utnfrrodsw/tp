
<template>
  <v-container class="my-10">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="user.name" label="Nombre" required></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="user.lastName" label="Apellido" required></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="user.email" label="Email" required></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="user.password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          :rules="[rules.min]"
          name="input-10-1"
          label="Password"
          hint="Mínimo 8 caracteres"
          counter
          @click:append="showPassword = !showPassword"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="user.passwordConfirm"
          :append-icon="showPasswordConfirm ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPasswordConfirm ? 'text' : 'password'"
          :rules="[rules.min, rules.passwordMatch]"
          name="input-10-1"
          label="Password Confirmation"
          hint="Mínimo 8 caracteres"
          counter
          @click:append="showPasswordConfirm = !showPasswordConfirm"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn color="primary" :loading="loading" @click="submitForm">
          <v-icon left>mdi-account-plus</v-icon>
          Actualizar datos
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="alert.show">
      <v-col>
        <alerts :type="alert.type" :mensaje="alert.message" @quit="alert.show = false"></alerts>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Alerts from '@/components/Alerts.vue'

  export default {
    name: 'EditUser',
    components: {
      Alerts,
    },
    data() {
      return {
        user: {
          id: '',
          name: '',
          lastName: '',
          email: '',
          password: '',
          passwordConfirm: ''
        },
        loading: false,
        showPassword: false,
        showPasswordConfirm: false,
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 8 || 'Min 8 characters',
          passwordMatch: v => v === this.user.password || 'Password does not match'
        },
        alert: {
          show: false,
          message: '',
          type: ''
        }
      }
    },
    async mounted() {
      try {
        const token = localStorage.getItem('token')
        const decoded = JSON.parse(atob(token.split('.')[1]))
        const id = decoded.user.id
        const apiUrl = process.env.VUE_APP_API_URL
        const url = `${apiUrl}api/users/${id}`
        const response = await fetch(url, {
          headers: {
            'x-access-token': token
          }
        })
        const data = await response.json()
        this.user.id = data.id
        this.user.name = data.name
        this.user.lastName = data.last_name
        this.user.email = data.email
      } catch (error) {
        console.error(error)
      }
    },
    methods: {
      async submitForm() {
        this.loading = true

        try {
          const apiUrl = process.env.VUE_APP_API_URL
          const url = `${apiUrl}api/user/${this.user.id}`
          const response = await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.user)
          })

          const data = await response.json()
          this.alert.show = true
          this.alert.message = data.body
          this.alert.type = 'success'
        } catch (error) {
          this.alert.show = true
          this.alert.message = 'Error al actualizar el usuario'
          this.alert.type = 'error'
        }

        this.loading = false
      }
    }
  }
</script>
