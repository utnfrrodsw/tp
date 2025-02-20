import { Component } from '@angular/core';

@Component({
  selector: 'app-panel-admin',
  templateUrl: './panel-admin.component.html',
  styleUrls: ['./panel-admin.component.css']
})
export class PanelAdminComponent {

  sections = [
    { title: 'Usuarios', link: '/panel-admin/usuarios', buttonText: 'Gestionar Roles' },
    { title: 'Autores', link: '/panel-admin/autores', buttonText: 'Gestionar Autores' },
    { title: 'Editoriales', link: '/panel-admin/editoriales', buttonText: 'Gestionar Editoriales' },
    { title: 'Libros', link: '/panel-admin/libros', buttonText: 'Gestionar Libros' },
    { title: 'Categorías', link: '/panel-admin/categorias', buttonText: 'Gestionar Categorías' },
    { title: 'Ofertas', link: '/panel-admin/ofertas', buttonText: 'Gestionar Ofertas' },
    { title: 'Provincias', link: '/panel-admin/provincias', buttonText: 'Gestionar Provincias' },
    { title: 'Pedidos', link: '/panel-admin/pedidos', buttonText: 'Gestionar Pedidos' }
  ];

}
