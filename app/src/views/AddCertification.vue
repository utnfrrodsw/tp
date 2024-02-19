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
          <v-date-picker v-model="date" @input="dateMenu = false" ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-menu
          v-model="timeMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="time"
              label="Hora"
              append-icon="mdi-clock"
              readonly
              v-bind="attrs"
              v-on="on"
              dense
              class="mt-2"
            ></v-text-field>
          </template>
          <v-time-picker v-model="time" @input="timeMenu = false"></v-time-picker>
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
        <v-textarea label="Observaciones" v-model="observations"></v-textarea>
      </v-col>
      <v-col cols="12">
        <v-btn color="primary" @click="addTask">Agregar tarea</v-btn>
      </v-col>
      <v-col cols="12" v-for="(task, index) in tasks" :key="index">
        <v-row>
          <v-col cols="12" sm="6" md="6">
            <v-select :items="availableTasks" label="Tarea" v-model="task.name"></v-select>
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
        hour: '',
        selectedGroup: null,
        conection: '',
        observations: '',
        tasks: [{ name: '', quantity: '' }],
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
        const responseTasks = await TaskService.getAll()
        this.availableTasks = responseTasks.data.items.map((task) => ({
          value: task.id,
          text: task.name
        }))
        const responseGroups = await GroupService.getAll()
        console.log(responseGroups.data.items)
        this.groupOptions = responseGroups.data.items
        this.groupOptions.forEach(async g => {
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
          description: '',
          quantity: ''
        })
      },
      deleteTask(index) {
        this.tasks.splice(index, 1)
      },
      async submitForm() {
        try {
          const data = {
            groupId: this.description,
            conection: this.conection,
            tasks: this.tasks,
            date: this.date,
            time: this.time,
            observations: this.observations
          }

          const response = await GroupTaskService.create(data)
          this.alert.message = 'Tarea agregada correctamente'
          this.alert.type = 'success'
          this.alert.show = true
          this.date = ''
          this.dateMenu = ''
          this.timeMenu = ''
          this.time = ''
          this.description = ''
          this.conection = ''
          this.observaciones = ''

          this.task = [{ name: '', quantity: '' }]
        } catch (error) {
          this.alert.message = 'No se pudo agregar la tarea'
          this.alert.type = 'Error'
          this.alert.show = true
          console.error(error)
        }
      }
    }
  }
</script>