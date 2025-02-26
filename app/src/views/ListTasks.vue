<template>
  <v-container fluid>
    <v-row align="center" class="list px-3 mx-auto">
      <v-col cols="12" sm="8">
        <v-text-field v-model="searchName" label="Buscar por nombre"></v-text-field>
      </v-col>

      <v-col cols="12" sm="4">
        <v-btn small @click="page = 1; retrieveTask();">
          Search
        </v-btn>
      </v-col>

      <v-col cols="12" sm="12">
        <v-card class="mx-auto" tile>
          <v-card-title>Tareas</v-card-title>
          <v-data-table :headers="headers" :items="items"
            @pagination="handlePageChange" :server-items-length="totalItems"
            :currentPage="page"
          >
            <template v-if="$isAdmin" v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="showTask(item.id)">
                mdi-search-web
              </v-icon>
              <v-icon id="editTask" small class="mr-2" @click="editTask(item.id)">
                mdi-pencil
              </v-icon>
              <v-icon small class="mr-2" @click="deleteTask(item.id)">
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
  import TaskService from '../services/TaskService'

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
          { text: 'Precio', value: 'price', sortable: false },
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
      this.retrieveTask()
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
      retrieveTask() {
        TaskService.getAll(this.requestParams)
          .then((response) => {
            const { items: tasks, totalItems } = response.data
            this.items = tasks.map(this.getDisplayTask)
            this.totalItems = totalItems
          })
          .catch((e) => {
            console.log(e)
          })
      },
      showTask(id) {
        this.$router.push({ name: 'ShowTask', params: { id } })
      },
      editTask(id) {
        this.$router.push({ name: 'EditTask', params: { id } })
      },
      deleteTask(id) {
        TaskService.delete(id)
          .then(() => {
            this.alert.message = 'Tarea eliminada correctamente'
            this.alert.type = 'success'
            this.alert.show = true
            this.retrieveTask()
          })
          .catch((e) => {
            this.alert.message = 'No se pudo elimnar la tarea porque tiene certificaciones asociadas'
            this.alert.type = 'error'
            this.alert.show = true
            console.log(e)
          })
      },
      handlePageChange({ page, itemsPerPage }) {
        if (this.pageSize !== itemsPerPage || page !== this.page) {
          this.pageSize = itemsPerPage
          this.page = page
          this.retrieveTask()
        }
      },
      getDisplayTask(task) {
        return {
          id: task.id,
          name: task.name,
          price: task.prices.length > 0 ? task.prices.at(0).price : 0
        }
      }
    }
  }
</script>
