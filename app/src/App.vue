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
      <template v-if="$isLogged">
        <v-menu v-for="(item, index) in routes" :key="index" close-on-content-click transition="scale-transition" offset-y v-model="item.menu">
          <template v-slot:activator="{ on }" >
            <v-btn text v-on="on" >
              <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
              {{ item.name }}            
            </v-btn>
          </template>
          <v-list >
            <v-list-item v-for="(subItem, subIndex) in filteredSubitems(item.subitems)" :key="subIndex" @click="insertRoute(subItem.route, item)" >
              <v-list-item-title  v-bind:style="activeRoute(subItem.route) ? 'font-weight: bold;' : '' " >
                <v-icon v-if="subItem.icon">{{ subItem.icon }}</v-icon>
                {{ subItem.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <!-- Nueva sección para el logotipo en la vista móvil -->
    <v-app-bar v-if="isMobile" app color="primary" dark>
      <v-container class="d-flex justify-center">
      <router-link to="/">
      <v-img alt="SPM Logo" class="shrink mr-2" contain src="@/assets/SPM.png" transition="scale-transition" width="40" cursor-pointer />
      </router-link>
    </v-container>

    </v-app-bar>

    <v-bottom-navigation v-if="isMobile" app color="primary">
      <template v-if="$isLogged">
      <v-btn 
        v-for="(item, index) in routes"
        :key="index"
        :to="item.subitems ? undefined : item.route"
        :replace="true"
        :class="{ 'v-btn--active': activeRoute(item.route) }"
        @click="toggleSubMenu(item)"
      >
        <v-icon>{{ item.icon }}</v-icon>
        {{ item.name }}
      </v-btn>
    </template>
    </v-bottom-navigation>

    <v-main>
      <router-view />
      <v-bottom-sheet v-model="bottomSheet" max-width="600">
        <v-list>
          <v-list-item v-for="(subItem, subIndex) in filteredSubitems(activeSubItems)" :key="subIndex" @click="insertRoute(subItem.route, activeItem); closeBottomSheet()">
            <v-list-item-title v-bind:style="activeRoute(subItem.route) ? 'font-weight: bold;' : '' ">
              <v-icon v-if="subItem.icon">{{ subItem.icon }}</v-icon>
              {{ subItem.name }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-bottom-sheet>
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
              icon: 'mdi-account-multiple-plus',
              grant: 'admin'
            },
            {
              name: 'Listar Grupos',
              route: '/list-groups',
              icon: 'mdi-list-box',
              grant: [
                'admin',
                'operator'
              ]
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
              icon: 'mdi-account-multiple-plus',
              grant: 'admin'
            },
            {
              name: 'Listar Tecnicos',
              route: '/list-technicians',
              icon: 'mdi-list-box',
              grant: [
                'admin',
                'operator'
              ]
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
              route: "/add-task",
              icon: "mdi-plus",
              grant: 'admin'
            },
            {
              name: "Listar Tareas",
              route: "/list-tasks",
              icon: "mdi-list-box",
              grant: [
                'admin',
                'operator'
              ]
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
              icon: "mdi-cash-plus",
              grant: [
                'admin',
                'operator'
              ]
            },
            {
              name: "Consultar Certificacion",
              route: "/list-certifications",
              icon: "mdi-view-list",
              grant: [
                'admin',
                'operator'
              ]
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
              icon: 'mdi-account-edit',
              grant: [
                'admin',
                'operator'
              ]
            },
            {
              name: 'Cerrar sesión',
              route: '/logout',
              icon: 'mdi-logout',
              grant: [
                'admin',
                'operator'
              ]
            }
          ]
        }
      ],
      isMobile: false,
      bottomSheet: false,
      activeItem: {},
      activeSubItems: [],
    }),
    computed: {
      isMobileScreen() {
        return this.$vuetify.breakpoint.smAndDown
      }
    },
    watch: {
      isMobileScreen(newValue) {
        this.isMobile = newValue
      },
    },
    methods: {
      filteredSubitems(subitems) {
        const allowedGrant = this.$isAdmin ? 'admin' : 'operator'
        return subitems.filter(subItem => subItem.grant.includes(allowedGrant))
    },
      toggleSubMenu(item) {
        if (item.subitems) {
          this.activeItem = item
          this.activeSubItems = item.subitems
          this.bottomSheet = true
        } else {
          this.$router.push(item.route).catch(error => {
            if (error.name !== 'NavigationDuplicated') {
              throw error
            }
          });
        }
      },
      insertRoute(route, item) {
        this.$router.push(route).catch(error => {
          if (error.name !== 'NavigationDuplicated') {
            throw error
          }
        });
        this.closeBottomSheet()
      },
      closeBottomSheet() {
        this.bottomSheet = false
      },
      activeRoute(route) {
        return this.$route.path === route
      },
    },
    created() {
      this.routes.forEach(item => {
        this.$set(item, 'menu', false)
      })

      this.isMobile = this.isMobileScreen
    }
  }
</script>

<style>
  .v-btn--active {
    background-color: #1976D2;
  }
</style>
