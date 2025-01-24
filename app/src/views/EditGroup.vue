<template>
  <v-container fluid>
    <v-form ref="form" class="mx-2" lazy-validation>
      <v-row>
        <v-col cols="12">
          <h2>Editar Grupo {{ group.id }}</h2>
        </v-col>
        <v-col cols="12" md="6">
            <v-text-field 
              v-model="group.description"
              label="Descripcion"
            >
          </v-text-field>
        </v-col>
      </v-row>
      <v-row v-if="group.technicians.length>0">
        <v-col v-for="(technician, index) in group.technicians" :key="index" cols="12">
          <v-card outlined>
            <v-card-text>
              <h3>{{ technician.name }}</h3>
              <p>ID: {{ technician.id }}</p>
              <v-btn color="error" @click="deleteTechnician(technician.id)">
                Eliminar Técnico
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" @click="showAddTechnician = true">
            Agregar Técnico
          </v-btn>
          <v-dialog v-model="showAddTechnician" max-width="500px">
            <template v-slot:activator="{ on }"></template>
            <v-card>
              <v-card-title>Agregar Técnico al Grupo</v-card-title>
              <v-card-text>
                <v-select
                  v-model="selectedTechnician"
                  :items="availableTechnicians"
                  label="Técnico"
                  item-text="name"
                  item-value="id"
                ></v-select>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="addTechnician" :disabled="!selectedTechnician">
                  Agregar
                </v-btn>
                <v-btn color="error" @click="showAddTechnician = false">
                  Cancelar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
  import GroupService from '../services/GroupService'
  import GroupTechnicianService from '../services/GroupTechnicianService'
  import Alerts from '@/components/Alerts.vue'

  export default {
    name: 'EditGroup',
    components: {
      Alerts,
    },
    data() {
      return {
        group: {
          id: this.$route.params.id,
          description: '',
          technicians: []
        },
        alert: {
          show: false,
          title: "",
          message: "",
          type: "",
        },
        showAddTechnician: false,
        availableTechnicians: [],
        selectedTechnician: null,
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      updateData() {
        // Actualizar la vista para mostrar los técnicos actuales en el grupo
        this.fetchData()
        this.showAddTechnician = false // Cerrar el diálogo
      },
      async fetchData() {
        this.loading = true
        try {
          const responseGroups = await GroupService.get(this.group.id)
          this.group.description = responseGroups.data.description
          this.group.technicians = (await GroupTechnicianService.getTechnicians(this.group.id)).data

          const responseTechnicians = await GroupTechnicianService.freeTechnicians()
          this.availableTechnicians = responseTechnicians.data
          if (this.group.technicians.length > 0) {
            let userTechnicianIds = this.group.technicians.map((t) => t.id) // IDs de los técnicos actuales del grupo
            this.availableTechnicians = response.data.filter((t) => !userTechnicianIds.includes(t.id)) // Filtrar los técnicos disponibles
          }
        } catch (error) {
          console.error(error)
        }
        this.loading = false
      },
      async deleteTechnician(technicianId) {
        try {
          const data = {
            groupId: this.group.id,
            technicianId: technicianId
          }
          await GroupTechnicianService.deleteTechnician(data)
          this.updateData()
          this.alert.show = true
          this.alert.title = 'Eliminacion exitosa'
          this.alert.message = 'El tecnico se elimino exitosamente'
          this.alert.type = 'success'
        } catch (error) {
          console.error(error)
          this.alert.show = true
          this.alert.title = 'Error'
          this.alert.message = error
          this.alert.type = 'error'
        }
      },
      addTechnician() {
        // Obtener el técnico seleccionado por su ID
        const selectedTechnician = this.availableTechnicians.find(
          (technician) => technician.id === this.selectedTechnician
        )
        if (selectedTechnician) {
          const data = {
            groupId: this.group.id,
            technicianId: selectedTechnician.id
          }

          GroupTechnicianService.create(data)
          .then(async (response) => {
            this.alert.show = true
            this.alert.title = 'Guardado exitoso'
            this.alert.message = 'El tecnico se agrego exitosamente'
            this.alert.type = 'success'
            this.updateData() // traigo grupo y technician actualizado
            this.selectedTechnician = null // Restablecer el valor seleccionado en la lista desplegable
          })
          .catch((error) => {
            console.error(error)
            this.alert.show = true
            this.alert.title = 'Error'
            this.alert.message = error
            this.alert.type = 'error'
          })
        }
      }
    }
  }
</script>
