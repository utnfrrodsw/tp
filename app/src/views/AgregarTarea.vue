<template>
  <v-container class="my-10">
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="tarea.nombre" label="Nombre" required></v-text-field>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field v-model="tarea.precio" label="Precio" required></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" :loading="loading" @click="submitForm">
          <v-icon left>mdi-plus</v-icon>
          Agregar Tarea
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="alerta.mostrar">
      <v-col>
        <alertas :type="alerta.type" :mensaje="alerta.mensaje" @salir="alerta.mostrar = false"></alertas>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Alertas from "@/components/Alerts.vue";

export default {
  name: "AgregarTecnicos",
  components: {
    Alertas,
  },
  data() {
    return {
      tarea: {
        id: "0",
        nombre: "",
        precio: "",
      },
      loading: false,
      alerta: {
        mostrar: false,
        mensaje: "",
        type: "",
      },
      menu: false,
    };
  },
  methods: {
    async submitForm() {
      this.loading = true;

      try {
        const response = await fetch("http://localhost:4000/api/tareas/AgregarTarea", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.tarea),
        });

        const data = await response.json();
        console.log(data);
        this.alerta.mostrar = true;
        this.alerta.mensaje = data.body;
        this.alerta.type = "success";
        this.alerta.mostrar = false;
        this.alerta.mostrar = true;

        this.tarea.nombre = "";
        this.tarea.precio = "";
        
      } catch (error) {
        console.log(error);
        this.alerta.mostrar = true;
        this.alerta.mensaje = "Error al agregar técnico";
        this.alerta.type = "error";
        this.alerta.mostrar = false;
        this.alerta.mostrar = true;
      }
      this.loading = false;
    },
  },
};
</script>

<style scoped>
.v-menu__content {
  z-index: 9999;
}
</style>