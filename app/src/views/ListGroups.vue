<template>
  <v-container fluid>
    <v-row>
      <v-col v-for="(group, index) in groups" :key="index" cols="12" sm="6" md="4" lg="3">
        <v-card outlined>
          <v-card-title>
            Grupo: {{ group.id }}
          </v-card-title>
          <v-card-subtitle>
            Descripción: {{ group.description ? group.description : '' }}
          </v-card-subtitle>
          <v-card-text>
            <v-row>
              <v-col v-if="group.technicians.length > 0" cols="12">Técnicos:</v-col>
            </v-row>
            <v-row v-for="(technician, index) in group.technicians" :key="index">
              <v-col cols="6">{{ technician.name }}</v-col>
              <v-col cols="3">ID: {{ technician.id }}</v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="editGroup(group.id)">Modificar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ListGroups',
  data() {
    return {
      groups: [],
    };
  },
  async mounted() {
    try {
      const response = await fetch(`${process.env.VUE_APP_API_URL}api/groups`);
      const data = await response.json();
      this.groups = data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    editGroup(id) {
      this.$router.push({ name: 'EditGroup', params: { id } });
    },
  },
};
</script>
