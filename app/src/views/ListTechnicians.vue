<template>
  <v-container fluid>
    <v-row align="center" class="list px-3 mx-auto">
      <v-col cols="12" sm="8">
        <v-text-field v-model="searchName" label="Buscar por nombre"></v-text-field>
      </v-col>

      <v-col cols="12" sm="4">
        <v-btn small @click="page = 1; retrieveTechnician();">
          Search
        </v-btn>
      </v-col>

      <v-col cols="12" sm="12">
        <v-card class="mx-auto" tile>
          <v-card-title>Tecnicos</v-card-title>
          <v-data-table :headers="headers" :items="items"
            @pagination="handlePageChange" :server-items-length="totalItems"
            :currentPage="page"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon v-if="$isAdmin" small class="mr-2" @click="editTechnician(item.id)">
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
import TechnicianDataService from "../services/TechnicianDataService";
export default {
  name: 'ListTechnicians',
  data() {
    return {
      items: [],
      page: 1,
      pageSize: 5,
      totalItems: 0,
      searchName: "",
      headers: [
        { text: "Codigo", align: "start", sortable: false, value: "id" },
        { text: "Nombre", value: "name", sortable: false },
        { text: "Fecha nacimiento", value: "date_born", sortable: false },
        { text: "Opciones", value: "actions", sortable: false },
      ],
    }
  },
  mounted() {
    this.retrieveTechnician();
  },
  computed: {
    requestParams() {
      return { name: this.searchName ? this.searchName : undefined, page: this.page ? (this.page - 1) : undefined, size: this.pageSize ? this.pageSize : undefined }
    }
  },
  methods: {
    retrieveTechnician() {
      TechnicianDataService.getAll(this.requestParams)
        .then((response) => {
          const { technicians, totalItems } = response.data;
          this.items = technicians.map(this.getDisplayTechnician);
          this.totalItems = totalItems;

          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    editTechnician(id) {
      this.$router.push({ name: 'EditTechnician', params: { id } })
    },
    handlePageChange({ page, itemsPerPage }) {
      if (this.pageSize !== itemsPerPage || page !== this.page) {
        this.pageSize = itemsPerPage;
        this.page = page;
        this.retrieveTechnician();
      }
    },
    getDisplayTechnician(technician) {
      return {
        id: technician.id,
        name: technician.name,
        date_born: new Date(technician.date_born).toLocaleDateString().substring(0,10)
      };
    },
  }
}
</script>
