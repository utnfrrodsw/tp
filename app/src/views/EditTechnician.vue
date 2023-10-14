<template>
  <v-container fluid>
    <v-form ref="form" class="mx-2" lazy-validation>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="tecnico.name" 
            :rules="validationRules.name"
            label="Nombre"
          >
        </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="formattedDate" label="Fecha de Nacimiento" readonly v-bind="attrs" v-on="on"></v-text-field>
            </template>
            <v-date-picker 
              v-model="tecnico.date_born" 
              :rules="validationRules.date_born"
              @input="menu = false"
            >
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" @click="submitForm">Guardar Cambios</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <alerts v-if="alert.show" :title="alert.title" :message="alert.message" @quit="redirectList"></alerts>
  </v-container>
</template>

<script>
  import axios from 'axios'
  import Alerts from '@/components/Alerts.vue'

  export default {
    name: 'EditTechnician',
    components: {
      Alerts
    },
    data() {
      return {
        tecnico: {
          id: this.$route.params.id,
          name: '',
          date_born: null
        },
        validationRules: {
          name: [
            v => !!v || 'Nombre is required',
            v => (v && v.length <= 10) || 'Nombre must be less than 10 characters'
          ],
          date_born: [
            v => !!v || 'Fecha de nacimiento is required'
          ]
        },
        menu: false,
        alert: {
          show: false,
          title: '',
          message: '',
          type: ''
        },
        loading: false,
      }
    },
    mounted() {
      this.fetchData()
    },
    computed: {
      formattedDate() {
        if (this.tecnico.date_born) {
          const date = new Date(this.tecnico.date_born)
          return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
        }
        return ''
      }
    },
    methods: {
      async fetchData() {
        this.loading = true
        try {
          const response = await axios.get(`http://localhost:4000/api/technicians/${this.tecnico.id}`)
          const technician = response.data
          this.tecnico.name = technician.name
          this.tecnico.date_born = technician.date_born.substring(0, 10)
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },
      async submitForm() {
        if (this.$refs.form.validate()) {
          this.loading = true
    
          try {
            const body = {
              name: this.tecnico.name,
              date_born: this.tecnico.date_born
            }
            const response = await axios.put(`http://localhost:4000/api/technicians/${this.tecnico.id}`, body)
            const data = await response.data
            this.alert.show = true
            this.alert.title = 'Guardado exitoso'
            this.alert.message = 'El cambio se realizó exitosamente'
            this.alert.type = 'success'
    
            this.reset()
            this.resetValidation()
          } catch (error) {
            this.alerta.show = true
            this.alerta.title = 'Error'
            this.alerta.mensaje = 'Error al agregar técnico'
            this.alerta.type = 'error'
          }
          this.loading = false
        }
      },
      redirectList() {
        this.$router.push({ path: '/list-technicians' }).catch(() => {})
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
