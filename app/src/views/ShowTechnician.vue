<template>
  <v-container fluid>
    <v-form ref="form" class="mx-2" lazy-validation>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="technician.name"
            label="Nombre"
            data-cy="technician-name"
            readonly
          >
          </v-text-field>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field 
            v-model="formattedDate"
            label="Fecha de Nacimiento"
            data-cy="technician-birthdate"
            readonly
          >
          </v-text-field>
        </v-col>
        <v-row v-if="technician.groups.length > 0">
          <v-col cols="12">
            <h3>Grupos del técnicos</h3>
          </v-col>
          <v-col v-for="(group, index) in technician.groups" :key="index" cols="12">
            <v-card outlined>
              <v-card-text>
                <h3>{{ group.description }}</h3>
                <p>ID: {{ group.id }}</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="technician.groups.length == 0">
          <v-col cols="12">
            <p>El técnico no está asignado en ningun grupo.</p>
          </v-col>
        </v-row>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
  import TechnicianService from '../services/TechnicianService'

  export default {
    name: 'ShowTechnician',
    data() {
      return {
        technician: {
          id: this.$route.params.id,
          name: "",
          date_born: null,
          groups: []
        },
        loading: false
      }
    },
    mounted() {
      this.fetchData()
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
    },
    methods: {
      async fetchData() {
        this.loading = true
        try {
          const response = await TechnicianService.get(this.technician.id)
          console.log(response.data)

          this.technician.name = response.data.name
          this.technician.date_born = response.data.date_born.substring(0, 10)
          this.technician.groups = response.data.groups
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      }
    }
  }
</script>
