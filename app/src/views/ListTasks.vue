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
          <v-card-title>Técnicos</v-card-title>
          <v-data-table :headers="headers" :items="items"
            @pagination="handlePageChange" :server-items-length="totalItems"
            :currentPage="page"
          >
            <template v-if="$isAdmin" v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="editTask(item.id)">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import TaskService from '../services/TaskService'

  export default {
    name: 'ListTechnicians',
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
            console.log(response.data)
            this.items = tasks.map(this.getDisplayTask)
            this.totalItems = totalItems
          })
          .catch((e) => {
            console.log(e)
          })
      },
      editTask(id) {
        this.$router.push({ name: 'EditTask', params: { id } })
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
          price: task.prices.length > 0 ? task.prices[task.prices.length - 1].price : 0
        }
      }
    }
  }
</script>
