import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes=[
  /* 
  {
    path:''
    loadComponent:()=>
      import('./foo/foo.component').then(m=>m.FooComponent)
  }
  */
];

@NgModule({
  imports:[RouterModule.forRoot(routes)],
  exports:[RouterModule]
})
export class AppRoutingModule {}
