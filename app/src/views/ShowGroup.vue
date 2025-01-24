<template>
  <v-container fluid>
    <v-form ref="form" class="mx-2" lazy-validation>
      <v-row>
        <v-col cols="12">
          <h2>Grupo {{ group.id }}</h2>
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="group.description"
            label="Descripción"
            readonly
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="group.technicians.length > 0">
        <v-col cols="12">
          <h3>Técnicos del grupo</h3>
        </v-col>
        <v-col v-for="(technician, index) in group.technicians" :key="index" cols="12">
          <v-card outlined>
            <v-card-text>
              <h3>{{ technician.name }}</h3>
              <p>ID: {{ technician.id }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="group.technicians.length == 0">
        <v-col cols="12">
          <p>El grupo no tiene técnicos asignados.</p>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
  import GroupService from '../services/GroupService'
  import GroupTechnicianService from '../services/GroupTechnicianService'

  export default {
    name: 'ShowGroup',
    data() {
      return {
        group: {
          id: this.$route.params.id,
          description: '',
          technicians: []
        }
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        this.loading = true
        try {
          const responseGroups = await GroupService.get(this.group.id)
          this.group.description = responseGroups.data.description
          this.group.technicians = (await GroupTechnicianService.getTechnicians(this.group.id)).data
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      }
    }
  }
</script>
