<template>
  <v-container class="my-10">
    <v-form ref="form" class="mx-2" lazy-validation>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="group.description" label="Nombre" required></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn color="primary" :loading="loading" @click="submitForm">
            <v-icon left>mdi-account-plus</v-icon>
            Agregar Grupo
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-row v-if="alert.show">
      <v-col>
        <alerts :type="alert.type" :message="alert.message" @quit="alert.show = false"></alerts>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Alerts from '@/components/Alerts.vue'
  import GroupService from '../services/GroupService'

  export default {
    name: 'AddGroup',
    components: {
      Alerts,
    },
    data() {
      return {
        group: {
          description: ''
        },
        loading: false,
        alert: {
          show: false,
          message: '',
          type: ''
        },
        menu: false
      }
    },
    methods: {
      async submitForm() {
        if (this.$refs.form.validate()) {
          this.loading = true
          try {
            const data = {
              description: this.group.description
            }
            const response = await GroupService.create(data)
            this.alert.message = 'Grupo creado correctamente'
            this.alert.type = 'success'
            this.alert.show = true
            this.reset()
          } catch (error) {
            this.alert.message = 'Error al crear el grupo'
            this.alert.type = 'error'
            this.alert.show = true
          }
          this.loading = false
        }
      },
      reset() {
        this.$refs.form.reset()
      }
    }
  }
</script>
