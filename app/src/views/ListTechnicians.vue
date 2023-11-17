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
          <v-data-table :headers="headers" :items="items" disable-pagination :hide-default-footer="true">
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small class="mr-2" @click="editTechnician(item.id)">
                mdi-pencil
              </v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      
      <v-col cols="4" sm="3">
        <v-select v-model="pageSize" :items="pageSizes" label="Items por pagina" @change="handlePageSizeChange"></v-select>
      </v-col>

      <v-col cols="12" sm="9">
        <v-pagination 
          v-model="page" 
          :length="totalPages" 
          total-visible="7" 
          next-icon="mdi-menu-right"
          prev-icon="mdi-menu-left" 
          @input="handlePageChange">
        </v-pagination>
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
      totalPages: 0,
      pageSize: 3,
      pageSizes: [3, 6, 9],
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
  methods: {
    getRequestParams(searchName, page, pageSize) {
      let params = {};

      if (searchName) {
        params["name"] = searchName;
      }

      if (page) {
        params["page"] = page - 1;
      }

      if (pageSize) {
        params["size"] = pageSize;
      }

      return params;
    },
    retrieveTechnician() {
      const params = this.getRequestParams(
        this.searchName,
        this.page,
        this.pageSize
      );

      TechnicianDataService.getAll(params)
        .then((response) => {
          const { technicians, totalPages } = response.data;
          this.items = technicians.map(this.getDisplayTechnician);
          this.totalPages = totalPages;

          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    editTechnician(id) {
      this.$router.push({ name: 'EditTechnician', params: { id } })
    },
    handlePageChange(value) {
      this.page = value;
      this.retrieveTechnician();
    },
    handlePageSizeChange(size) {
      this.pageSize = size;
      this.page = 1;
      this.retrieveTechnician();
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
