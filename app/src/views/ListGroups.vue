<template>
  <v-container fluid>
    <v-row align="center" class="list px-3 mx-auto">
      <v-col cols="12" sm="8">
        <v-text-field v-model="searchDescription" label="Buscar por nombre"></v-text-field>
      </v-col>

      <v-col cols="12" sm="4">
        <v-btn small @click="page = 1; retrieveGroup();">
          Search
        </v-btn>
      </v-col>

      <v-col cols="12" sm="12">
        <v-card class="mx-auto" tile>
          <v-card-title>Grupos</v-card-title>
          <v-data-table
            :items="items"
            :headers="headers"
            :currentPage="page"
            @pagination="handlePageChange"
            :server-items-length="totalItems"
          >
            <template v-if="$isAdmin" v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="editGroup(item.id)">
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
  import GroupService from '../services/GroupService'

  export default {
    name: 'ListGroups',
    data() {
      return {
        items: [],
        page: 1,
        pageSize: 10,
        totalItems: 0,
        searchDescription: '',
        headers: [
          { text: 'Código', align: 'start', sortable: false, value: 'id' },
          { text: 'Nombre', value: 'description', sortable: false },
          { text: 'Técnicos', value: 'technicians', sortable: false },
          { text: 'Opciones', value: 'actions', sortable: false },
        ],
      }
    },
    async mounted() {
      this.retrieveGroup()
      this.headers = this.$isAdmin ? this.headers : this.headers.filter((header) => header.value !== 'actions')
    },
    computed: {
      requestParams() {
        return {
          description: this.searchDescription ? this.searchDescription : undefined,
          page: this.page ? (this.page - 1) : undefined,
          size: this.pageSize ? this.pageSize === -1 ? this.totalItems + 1 : this.pageSize : undefined
        }
      }
    },
    methods: {
      retrieveGroup() {
        GroupService.getAll(this.requestParams)
          .then((response) => {
            const { items: groups, totalItems } = response.data
            console.log(response.data)
            this.items = groups.map(this.getDisplayGroup)
            this.totalItems = totalItems
          })
          .catch((e) => {
            console.log(e)
          })
      },
      editGroup(id) {
        this.$router.push({ name: 'EditGroup', params: { id } })
      },
      handlePageChange({ page, itemsPerPage }) {
        if (this.pageSize !== itemsPerPage || page !== this.page) {
          this.pageSize = itemsPerPage
          this.page = page
          this.retrieveGroup()
        }
      },
      getDisplayGroup(group) {
        return {
          id: group.id,
          description: group.description,
          technicians: group.technicians.map((technician) => technician.name).join(', ')
        }
      }
    }
  }
</script>
