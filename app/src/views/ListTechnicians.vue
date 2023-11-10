<template>
  <v-container fluid>
    <v-row >
      <v-col v-for="(item, index) in items" :key="index" cols="3">
        <v-card outlined>
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">Codigo:</v-col>
              <v-col cols="6">{{ item.id }}</v-col>
            </v-row>
            <v-row>
              <v-col cols="6">Fecha de Nacimiento:</v-col>
              <v-col cols="6">{{ item.date_born.substring(0,10) }}</v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="editTechnician(item.id)">Modificar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'ListTechnicians',
    data() {
      return {
        items: []
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      async fetchData() {
        const apiUrl = process.env.VUE_APP_API_URL
        const url = `${apiUrl}api/technicians`
        const response = await fetch(url)
        const data = await response.json()
        this.items = data
      },
      editTechnician(id) {
        this.$router.push({ name: 'EditTechnician', params: { id } })
      }
    }
  }
</script>
