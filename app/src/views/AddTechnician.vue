<template>
  <v-container class="my-10">
    <v-form ref="form" class="mx-2" lazy-validation>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="tecnico.name" 
            label="Nombre" 
            :rules="validationRules.name"
            required
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="tecnico.date_born"
                label="Fecha de nacimiento"
                prepend-icon="mdi-calendar"
                :rules="validationRules.date_born"
                readonly
                required
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="tecnico.date_born" @input="menu = false"></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" :loading="loading" @click="submitForm">
            <v-icon left>mdi-account-plus</v-icon>
            Agregar técnico
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

  export default {
    name: 'AddTechnician',
    components: {
      Alerts,
    },
    data() {
      return {
        tecnico: {
          name: '',
          date_born: '',
        },
        validationRules: {
          name: [
            v => !!v || 'Nombre is required',
            v => (v && v.length <= 10) || 'Nombre must be less than 10 characters',
          ],
          date_born: [
            v => !!v || 'Fecha de nacimiento is required',
          ],
        },
        loading: false,
        alert: {
          show: false,
          message: '',
          type: ''
        },
        menu: false
      }
    },
    methods: {
      async submitForm() {
        if (this.$refs.form.validate()) {
          this.loading = true
          try {
            const apiUrl = process.env.VUE_APP_API_URL;
            const url = `${apiUrl}api/technicians`
            const token = localStorage.getItem('token')
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
              },
              body: {
                name: this.tecnico.name,
                date_born: this.tecnico.date_born,
              }
            })
            const data = await response.data
    
            this.alert.show = true
            this.alert.message = 'Tecnico creado correctamente'
            this.alert.type = 'success'

            this.reset()
            this.resetValidation()
            this
          } catch (e) {
            this.alert.show = true
            this.alert.message = 'Error al agregar técnico'
            this.alert.type = 'error'
          }
          this.loading = false
        }
      },
      reset () {
        this.$refs.form.reset()
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      }
    }
  }
</script>

<style scoped>
  .v-menu__content {
    z-index: 9999;
  }
</style>