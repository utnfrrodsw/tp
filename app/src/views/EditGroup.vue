<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <h2>Editar Grupo {{ numGrupo }}</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="(tecnico, index) in tecnicos" :key="index" cols="12">
        <v-card outlined>
          <v-card-text>
            <h3>{{ tecnico.nombre }}</h3>
            <p>ID: {{ tecnico.id }}</p>
            <v-btn color="error" @click="eliminarTecnico(tecnico.id)">
              Eliminar Técnico
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-alert v-if="mensajeEliminado" type="success" dismissible>
      Técnico eliminado correctamente.
    </v-alert>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="mostrarAgregarTecnico = true">
          Agregar Técnico
        </v-btn>
        <v-dialog v-model="mostrarAgregarTecnico" max-width="500px">
          <template v-slot:activator="{ on }"></template>
          <v-card>
            <v-card-title>Agregar Técnico al Grupo</v-card-title>
            <v-card-text>
              <v-select
                v-model="tecnicoSeleccionado"
                :items="tecnicosDisponibles"
                label="Técnico"
                item-text="nombre"
                item-value="id"
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="agregarTecnico" :disabled="!tecnicoSeleccionado">
                Agregar
              </v-btn>
              <v-btn color="error" @click="mostrarAgregarTecnico = false">
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import axios from 'axios'

export default {
  name: "EditGroup",
  data() {
    return {
      numGrupo: null,
      tecnicos: [],
      mensajeEliminado: false,
      mostrarAgregarTecnico: false,
      tecnicosDisponibles: [],
      tecnicoSeleccionado: null,
    }
  },
  mounted() {
    this.numGrupo = this.$route.params.idGrupo
    const tecnicosIds = this.$route.params.tecnicosIds
    this.fetchTecnicos(tecnicosIds)
    this.fetchTecnicosDisponibles()
  },
  methods: {
    mostrarMensajeEliminado() {
      this.mensajeEliminado = true
      // Actualizar la vista para mostrar los técnicos actuales en el grupo
      this.fetchTecnicos()
    },
    async fetchTecnicos(tecnicosIds) {
      try {
        const requests = tecnicosIds.map((idTecnico) =>
          axios.get(`http://localhost:4000/api/technicians/${idTecnico}`)
        )
        const responses = await axios.all(requests)
        this.tecnicos = responses.map((response) => response.data.body[0])
      } catch (error) {
        console.error(error)
      }
    },
    async fetchTecnicosDisponibles() {
      try {
        const apiUrl = process.env.VUE_APP_API_URL
        const url = `${apiUrl}api/group_technicians/`
        const response = await axios.get(
          url
        )
        this.tecnicosDisponibles = response.data.body
      } catch (error) {
        console.error(error)
      }
    },
    eliminarTecnico(idTecnico) {
  const data = {
    idGupo: this.numGrupo,
    idTecnico: idTecnico,
  }
  axios
    .put("http://localhost:4000/api/grupos/editarGrupo", data)
    .then((response) => {
      console.log(response.data)
      // Eliminar el técnico de la lista tecnicos
      this.tecnicos = this.tecnicos.filter((tecnico) => tecnico.id !== idTecnico)
      this.mostrarMensajeEliminado()
    })
    .catch((error) => {
      console.error(error)
      // Manejar errores en caso de que la solicitud PUT falle
    })
},

agregarTecnico() {
  // Obtener el técnico seleccionado por su ID
  const tecnicoSeleccionado = this.tecnicosDisponibles.find(
    (tecnico) => tecnico.id === this.tecnicoSeleccionado
  )
  if (tecnicoSeleccionado) {
    const data = {
      idGupo: this.numGrupo,
      idTecnico: tecnicoSeleccionado.id,
    }
    axios
      .post("http://localhost:4000/api/grupos/agregarGrupo", data)
      .then((response) => {
        console.log(response.data)
        this.mostrarMensajeEliminado()
        // Agregar el nuevo técnico a la lista tecnicos
        this.tecnicos.push(tecnicoSeleccionado)
        this.tecnicoSeleccionado = null // Restablecer el valor seleccionado en la lista desplegable
        this.mostrarAgregarTecnico = false // Cerrar el diálogo
      })
      .catch((error) => {
        console.error(error)
        // Manejar errores en caso de que la solicitud PUT falle
      })
  }
},

  },
}
</script>
