<template>
  <v-container>
    <v-layout align-center justify-center>
      <v-card>
        <v-card-title class="headline">Iniciar Sesión</v-card-title>
        <v-card-text>
          <v-form @submit="login">
            <v-text-field
              v-model="username"
              label="Nombre de usuario"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Contraseña"
              type="password"
              outlined
            ></v-text-field>
            <v-btn type="submit" color="primary">Iniciar Sesión</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      // Aquí puedes agregar la lógica para autenticar al usuario
      // Por ejemplo, puedes hacer una solicitud a tu API de autenticación
      // y redirigir al usuario si las credenciales son válidas.
      // En este ejemplo, simplemente mostraremos un mensaje en la consola.
      console.log('Iniciando sesión con:', this.username, this.password);
    },
  },
};
</script>

<style scoped>
/* Estilos opcionales */
</style>