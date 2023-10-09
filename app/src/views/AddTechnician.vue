<template>
  <v-container class="my-10">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="tecnico.name" label="Nombre" required></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="tecnico.date_born"
              label="Fecha de nacimiento"
              prepend-icon="mdi-calendar"
              readonly
              required
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="tecnico.date_born" @input="menu = false"></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" :loading="loading" @click="postTecnico">
          <v-icon left>mdi-account-plus</v-icon>
          Agregar técnico
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="alert.show">
      <v-col>
        <alerts :type="alert.type" :message="alert.message" @salir="alert.show = false"></alerts>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Alerts from "@/components/Alerts.vue";
import axios from 'axios';

export default {
  name: "AddTechnician",
  components: {
    Alerts,
  },
  data() {
    return {
      tecnico: {
        name: "",
        date_born: "",
      },
      loading: false,
      alert: {
        show: false,
        message: "",
        type: "",
      },
      menu: false,
    };
  },
  methods: {
    async postTecnico() {
      this.loading = true;

      try {
        const body = {
          name: this.tecnico.name,
          date_born: this.tecnico.date_born,
        };
        const response = await axios.post(`http://localhost:4000/api/technicians`, body)
        const data = await response.data;

        this.alert.show = true;
        this.alert.message = "Tecnico creado correctamente";
        this.alert.type = "success";

        this.tecnico.name = "";
        this.tecnico.date_born = "";
      } catch (e) {
        this.alert.show = true;
        this.alert.message = "Error al agregar técnico";
        this.alert.type = "error";
      }
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.v-menu__content {
  z-index: 9999;
}
</style>