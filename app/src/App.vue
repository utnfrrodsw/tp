<template>
  <v-app>
    <v-app-bar v-if="!isMobile" app color="primary" dark>
      <div class="d-flex align-center">
        <router-link to="/">
          <v-img alt="SPM Logo" class="shrink mr-2" contain src="@/assets/SPM.png" transition="scale-transition" width="40" cursor-pointer />
        </router-link>
        <router-link to="/">
          <v-img alt="SPM letters Logo" class="shrink mt-1 hidden-sm-and-down" contain min-width="100" src="@/assets/SPM2.png" width="100" />
        </router-link>
      </div>
      <v-spacer></v-spacer>
      <v-menu v-for="(item, index) in routes" :key="index" :close-on-content-click="false" transition="scale-transition" offset-y v-model="item.menu">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
            {{ item.name }}            
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(subItem, subIndex) in item.subitems" :key="subIndex" @click="insertRoute(subItem.route, item); closeMenu(subItem)">
            <v-list-item-title v-bind:style="activeRoute(subItem.route) ? 'font-weight: bold;' : '' ">
              <v-icon v-if="subItem.icon">{{ subItem.icon }}</v-icon>
              {{ subItem.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-bottom-navigation v-if="isMobile" app color="primary">
      <v-btn
        v-for="(item, index) in routes"
        :key="index"
        :to="item.subitems ? undefined : item.route"
        :replace="true"
        :class="{ 'v-btn--active': activeRoute(item.route) }"
        @click="toggleSubMenu(item)"
      >
        <v-icon>{{ item.icon }}</v-icon>
        <v-span>{{ item.name }}</v-span>
      </v-btn>
    </v-bottom-navigation>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    routes: [
      {
        name: 'Grupos',
        icon: 'mdi-account-group',
        menu: false,
        subitems: [
          {
            name: 'Crear Grupo',
            route: '/add-group',
            icon: 'mdi-account-multiple-plus'
          },
          {
            name: 'Listar Grupos',
            route: '/list-groups',
            icon: 'mdi-list-box'
          }
        ]
      },
      {
        name: 'Tecnicos',
        icon: 'mdi-account-group',
        menu: false,
        subitems: [
          {
            name: 'Crear Tecnico',
            route: '/add-technician',
            icon: 'mdi-account-multiple-plus'
          },
          {
            name: 'Listar Tecnicos',
            route: '/list-technicians',
            icon: 'mdi-list-box'
          }
        ]
      },
      {
        name: "Tareas",
        icon: "mdi-format-list-checkbox",
        menu:false,
        subitems: [
          {
            name: "Agregar Tarea",
            route: "/add-task", icon:
            "mdi-plus"
          },
          {
            name: "Listar Tareas",
            route: "/list-tasks",
            icon: "mdi-list-box"
          }
        ]
      },
      {
        name: "Certificar",
        icon: "mdi-cash",
        menu:false,
        subitems: [
          {
            name: "Nueva Certificacion",
            route: "/add-certification",
            icon: "mdi-cash-plus"
          },
          {
            name: "Consultar Certifiacion por Tecnico",
            route: "/list-certifications",
            icon: "mdi-pencil"
          },
          {
            name: "Consultar Certificacion",
            route: "/query-certification",
            icon: "mdi-view-list"
          }
        ]
      },
      {
        name: 'Cuenta',
        icon: 'mdi-account',
        menu: false,
        subitems: [
          {
            name: 'Editar cuenta',
            route: '/edit-account',
            icon: 'mdi-account-edit'
          },
          {
            name: 'Cerrar sesión',
            route: '/logout',
            icon: 'mdi-logout'
          }
        ]
      }
      ],
    isMobile: false,
  }),
  computed: {
    isMobileScreen() {
      return this.$vuetify.breakpoint.smAndDown;
    },
  },
  watch: {
    isMobileScreen(newValue) {
      this.isMobile = newValue;
    },
  },
  methods: {
    toggleSubMenu(item) {
      if (item.subitems) {
        item.menu = !item.menu;
      } else {
        // Si no hay submenú, navega a la ruta principal
        this.$router.push(item.route).catch(error => {
          if (error.name !== 'NavigationDuplicated') {
            throw error;
          }
        });
      }
    },
    insertRoute(route, item) {
      this.$router.push(route).catch(error => {
        if (error.name !== 'NavigationDuplicated') {
          throw error;
        }
      });
      this.closeMenu(item);
    },
    closeMenu(item) {
      item.menu = false;
    },
    activeRoute(route) {
      return this.$route.path === route;
    },
  },
  mounted() {
    this.isMobile = this.isMobileScreen;
  },
};
</script>

<style>
  /* Estilos adicionales según sea necesario */
  .v-btn--active {
    background-color: #1976D2; /* Color activo de los botones en la parte inferior */
  }
</style>