<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date"
              label="Fecha"
              append-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
              dense
              class="mt-2"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" @input="dateMenu = false"></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-menu
          v-model="hourMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="hour"
              label="Hora"
              append-icon="mdi-clock"
              readonly
              v-bind="attrs"
              v-on="on"
              dense
              class="mt-2"
            ></v-text-field>
          </template>
          <v-time-picker v-model="hour" @input="hourMenu = false"></v-time-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <v-select
          v-model="selectedGroup"
          :items="groupOptions"
          label="Grupo"
          item-text="description"
          item-value="id"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-text-field label="Conexión" v-model="conection"></v-text-field>
      </v-col>
      <v-col cols="12" sm="6" md="9">
        <v-textarea label="Observaciones" v-model="observation"></v-textarea>
      </v-col>
      <v-col cols="12">
        <v-btn color="primary" @click="addTask">Agregar tarea</v-btn>
      </v-col>
      <v-col cols="12" v-for="(task, index) in tasks" :key="index">
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-select :items="availableTasks" label="Tarea" v-model="task.id"></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-text-field label="Cantidad" v-model.number="task.quantity"></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn color="error" @click="deleteTask(index)">Eliminar tarea</v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-btn color="primary" @click="submitForm">Enviar formulario</v-btn>
      </v-col>
      <v-row v-if="alert.show">
        <v-col>
          <alerts :type="alert.type" :message="alert.message" @quit="alert.show = false"></alerts>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
import Alerts from '@/components/Alerts.vue'
import GroupTechnicianService from '../services/GroupTechnicianService'
import GroupService from '../services/GroupService'
import TaskService from '../services/TaskService'
import GroupTaskService from '../services/GroupTaskService'

export default {
  name: 'AddCertification',
  data() {
    return {
      date: '',
      dateMenu: '',
      hour: '',
      hourMenu: '',
      selectedGroup: null,
      conection: '',
      observation: '',
      tasks: [{ id: '', name: '', quantity: '' }],
      availableTasks: [],
      groupOptions: [],
      url: process.env.VUE_APP_API_URL,
      alert: {
        show: false,
        message: '',
        type: ''
      }
    }
  },
  async mounted() {
    try {
      const responseTasks = await TaskService.getAll({ size: 999 })
      this.availableTasks = responseTasks.data.items.map((task) => ({
        value: task.id,
        text: task.name
      }))
      const responseGroups = await GroupTechnicianService.bussyGroups({ size: 999 })
      console.log(responseGroups.data)
      this.groupOptions = responseGroups.data
      this.groupOptions.forEach(async (g) => {
        g.technicians = (await GroupTechnicianService.getTechnicians(g.id)).data
      })
    } catch (error) {
      console.error(error)
    }
  },
  components: {
    Alerts
  },
  methods: {
    addTask() {
      this.tasks.push({
        id: '',
        name: '',
        quantity: ''
      })
    },
    deleteTask(index) {
      this.tasks.splice(index, 1)
    },
    async submitForm() {
      try {
        const data = {
          groupId: this.selectedGroup,
          conection: this.conection,
          tasks: this.tasks,
          dateCompleted: this.date,
          hour: this.hour,
          observation: this.observation
        }
        const response = await GroupTaskService.create(data)
        this.alert.message = 'Tarea agregada correctamente'
        this.alert.type = 'success'
        this.alert.show = true

        // Restablecer todos los valores del formulario
        this.date = ''
        this.dateMenu = false
        this.hour = ''
        this.hourMenu = false
        this.selectedGroup = null
        this.conection = ''
        this.observation = ''
        this.tasks = [{ id: '', name: '', quantity: '' }]
      } catch (error) {
        this.alert.message = 'No se pudo agregar la tarea'
        this.alert.type = 'error'
        this.alert.show = true
        console.error(error)
      }
    }
  }
}
</script>
