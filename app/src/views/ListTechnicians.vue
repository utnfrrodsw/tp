<template>
  <v-container fluid>
    <v-row align="center" class="list px-3 mx-auto">
      <v-col cols="12" sm="8">
        <v-text-field v-model="searchName" label="Buscar por nombre" data-cy="search-input"></v-text-field>
      </v-col>

      <v-col cols="12" sm="4">
        <v-btn small @click="page = 1; retrieveTechnician();" data-cy="search-button">
          Search
        </v-btn>
      </v-col>

      <v-col cols="12" sm="12">
        <v-card class="mx-auto" tile>
          <v-card-title>Técnicos</v-card-title>
          <v-data-table :headers="headers" :items="items"
            @pagination="handlePageChange" :server-items-length="totalItems"
            :currentPage="page"
          >
            <template v-if="$isAdmin" v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="showTechnician(item.id)">
                mdi-search-web
              </v-icon>
              <v-icon id="editTechnician" small class="mr-2" @click="editTechnician(item.id)">
                mdi-pencil
              </v-icon>
              <v-icon small class="mr-2" @click="deleteTechnician(item.id)">
                mdi-trash-can
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
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

  export default {
    name: 'ListTechnicians',
    components: {
      Alerts
    },
    data() {
      return {
        items: [],
        page: 1,
        pageSize: 10,
        totalItems: 0,
        searchName: '',
        headers: [
          { text: 'Código', align: 'start', sortable: false, value: 'id' },
          { text: 'Nombre', value: 'name', sortable: false },
          { text: 'Fecha de nacimiento', value: 'date_born', sortable: false },
          { text: 'Opciones', value: 'actions', sortable: false },
        ],
        alert: {
          show: false,
          message: '',
          type: ''
        }
      }
    },
    mounted() {
      this.retrieveTechnician()
      this.headers = this.$isAdmin ? this.headers : this.headers.filter((header) => header.value !== 'actions')
    },
    computed: {
      requestParams() {
        return {
          name: this.searchName ? this.searchName : undefined,
          page: this.page ? (this.page - 1) : undefined,
          size: this.pageSize ? this.pageSize === -1 ? this.totalItems + 1 : this.pageSize : undefined
        }
      }
    },
    methods: {
      retrieveTechnician() {
        TechnicianService.getAll(this.requestParams)
          .then((response) => {
            const { items: technicians, totalItems } = response.data
            console.log(response.data)
            this.items = technicians.map(this.getDisplayTechnician)
            this.totalItems = totalItems
          })
          .catch((e) => {
            console.log(e)
          })
      },
      showTechnician(id) {
        this.$router.push({ name: 'ShowTechnician', params: { id } })
      },
      editTechnician(id) {
        this.$router.push({ name: 'EditTechnician', params: { id } })
      },
      deleteTechnician(id) {
        TechnicianService.delete(id)
          .then(() => {
            this.alert.message = 'Técnico eliminado correctamente'
            this.alert.type = 'success'
            this.alert.show = true
            this.retrieveTechnician()
          })
          .catch((e) => {
            this.alert.message = 'No se pudo elimnar el técnico'
            this.alert.type = 'error'
            this.alert.show = true
            console.log(e)
          })
      },
      handlePageChange({ page, itemsPerPage }) {
        if (this.pageSize !== itemsPerPage || page !== this.page) {
          this.pageSize = itemsPerPage
          this.page = page
          this.retrieveTechnician()
        }
      },
      getDisplayTechnician(technician) {
        return {
          id: technician.id,
          name: technician.name,
          date_born: new Date(technician.date_born).toLocaleDateString().substring(0,10)
        }
      }
    }
  }
</script>
