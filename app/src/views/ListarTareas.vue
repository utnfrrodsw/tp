<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="(item, index) in items" :key="index" cols="3">
        <v-card outlined>
          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">Código:</v-col>
              <v-col cols="6">{{ item.id }}</v-col>
            </v-row>
            <v-row>
              <v-col cols="6">Precio:</v-col>
              <v-col cols="6">{{ item.prices[item.prices.length - 1]?.price }}</v-col>
            </v-row>
            <v-row>
              <v-col cols="6">Última fecha de modificación:</v-col>
              <v-col cols="6">{{ item.prices[item.prices.length - 1]?.date_from.substring(0, 10) }}</v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="editarTarea(item.id)">Modificar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Tareas",
  data() {
    return {
      items: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const url = "http://localhost:4000/api/tasks";
      const response = await fetch(url);
      const data = await response.json();
      this.items = data;
    },
    editarTarea(id) {
      this.$router.push({ name: "EditarTarea", params: { id } });
    },
  },
};
</script>