<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6">
        <v-text-field v-model="precio" label="Nuevo Precio"></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="guardarCambios">Guardar Cambios</v-btn>
      </v-col>
    </v-row>
    <Alertas v-if="mostrarAlerta" titulo="Guardado Exitoso" mensaje="El cambio se realizó exitosamente" @salir="redirigirAListarTareas"></Alertas>
  </v-container>
</template>

<script>
import axios from 'axios';
import Alertas from '@/components/Alerts.vue';

export default {
  name: 'EditarTecnicos',
  components: {
    Alertas,
  },
  data() {
    return {
      id: this.$route.params.id,
      precio: null,
      mostrarAlerta: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get(`http://localhost:4000/api/tareas/${this.id}`);
        const tarea = response.data.body;
        this.precio = tarea.precio;
      } catch (error) {
        console.error(error);
      }
    },
    async guardarCambios() {
      const data = {
        id: this.id,
        precio: this.precio,
      };

      try {
        await axios.post('http://localhost:4000/api/tareas/agregarPrecio', data);
        this.mostrarAlerta = true;
      } catch (error) {
        console.error(error);
      }
    },
    redirigirAListarTareas() {
      this.$router.push({ path: '/ListarTareas' }).catch(() => {});
    },
  },
};
</script>