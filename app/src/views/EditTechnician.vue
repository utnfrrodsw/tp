<template>
  <v-container fluid>
    <v-form ref="form" class="mx-2" lazy-validation>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="technician.name" 
            :rules="validationRules.name"
            label="Nombre"
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
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field 
                v-model="formattedDate" 
                label="Fecha de Nacimiento" 
                readonly 
                :rules="validationRules.date_born"
                v-bind="attrs" 
                v-on="on"
              >
              </v-text-field>
            </template>
            <v-date-picker 
              v-model="technician.date_born" 
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
  import Alerts from '@/components/Alerts.vue'
  import TechnicianService from "../services/TechnicianService";
  import { esMayorDe18 } from '@/utilities/utilities.js';

export default {
  name: 'EditTechnician',
  components: {
    Alerts,
  },
  data() {
    return {
      technician: {
        id: this.$route.params.id,
        name: "",
        date_born: null,
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
      menu: false,
      alert: {
        show: false,
        title: "",
        message: "",
        type: "",
      },
      loading: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    formattedDate: {
      // getter
      get: function () {
        if (this.technician.date_born) {
          const date = new Date(this.technician.date_born);
          const [year, month, day] = date.toISOString().substring(0, 10).split('-')
          return `${day}/${month}/${year}`
        }
        return '';
      },
      // setter
      set: function (newValue) {
        this.technician.date_born = newValue
      }
    },
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const response = await TechnicianService.get(this.technician.id)

        this.technician.name = response.data.name
        this.technician.date_born = response.data.date_born.substring(0, 10)
      } catch (error) {
        console.error(error)
      }
      this.loading = false
    },
    async submitForm() {
      if (this.$refs.form.validate()) {
        this.loading = true
  
        try {
          const data = {
            name: this.technician.name,
            date_born: this.technician.date_born
          }
          const response = await TechnicianService.update(this.technician.id, data)
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
