<template>
  <v-container class="my-10">
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

    <v-row v-if="alert.show">
      <v-col>
        <alerts :type="alert.type" :mensaje="alert.message" @salir="alert.show = false"></alerts>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import Alerts from '@/components/Alerts.vue'

  export default {
    name: 'AddGroup',
    components: {
      Alerts,
    },
    data() {
      return {
        group: {
          id: '0',
          description: '',
        },
        loading: false,
        alert: {
          show: false,
          message: '',
          type: '',
        },
        menu: false,
      };
    },
    methods: {
      async submitForm() {
        this.loading = true;

        try {
          const response = await fetch('http://localhost:4000/api/groups', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.group)
          })

          const data = await response.json()
          this.alert.show = true
          this.alert.message = data.body
          this.alert.type = 'success'

          this.group.description = ''
        } catch (error) {
          this.alert.show = true
          this.alert.message = 'Error al agregar técnico'
          this.alert.type = 'error'
        }

        this.loading = false
      }
    }
  }
</script>

<style scoped>
  .v-menu__content {
    z-index: 9999;
  }
</style>