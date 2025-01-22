<template>
  <v-container class="my-10">
    <v-form ref="form" class="mx-2" lazy-validation>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="technician.name" label="Nombre" :rules="validationRules.name" required>
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y
            min-width="auto">
            <template v-slot:activator="{ on }">
              <v-text-field v-model="formattedDate" label="Fecha de nacimiento" prepend-icon="mdi-calendar"
                :rules="validationRules.date_born" readonly required v-on="on"></v-text-field>
            </template>
            <v-date-picker v-model="technician.date_born" @input="menu = false"></v-date-picker>
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
  import TechnicianService from '../services/TechnicianService'
  import { esMayorDe18 } from '@/utilities/utilities.js'

  export default {
    name: 'AddTechnician',
    components: {
      Alerts,
    },
    data() {
      return {
        technician: {
          name: '',
          date_born: '',
        },
        validationRules: {
          name: [
            v => !!v || 'Nombre is required',
            v => (v && v.length <= 10) || 'Nombre must be less than 10 characters',
          ],
          date_born: [
            value => {
              if (value) return true
              return 'Fecha Nacimiento is required'
            },
            value => {
              if (esMayorDe18(value)) return true
              return 'Fecha Nacimiento invalida: edad minima 18'
            },
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
            const data = {
              name: this.technician.name,
              date_born: this.technician.date_born
            }
            const response = await TechnicianService.create(data)
            this.alert.show = true
            this.alert.message = 'Tecnico creado correctamente'
            this.alert.type = 'success'
            this.reset()
          } catch (e) {
            this.alert.show = true
            this.alert.message = e
            this.alert.type = 'error'
          }
          this.loading = false
        }
      },
      reset() {
        this.$refs.form.reset()
      },
    },
    computed: {
      formattedDate: {
        // getter
        get: function () {
          if (this.technician.date_born) {
            const date = new Date(this.technician.date_born)
            const [year, month, day] = date.toISOString().substring(0, 10).split('-')
            return `${day}/${month}/${year}`
          }
          return ''
        },
        // setter
        set: function (newValue) {
          this.technician.date_born = newValue
        }
      },
    }
  }
</script>

<style scoped>
  .v-menu__content {
    z-index: 9999;
  }
</style>