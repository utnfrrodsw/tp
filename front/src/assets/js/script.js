document.getElementById("btn_registro").addEventListener("click", registro);
document.getElementById("btn_inicio_sesion").addEventListener("click", login);
window.addEventListener("resize", anchoPagina);


/*Declaración de variables*/

var formulario_login = document.querySelector(".Login");
var formulario_registro = document.querySelector(".Registro");
var contenedor_logueo_registro = document.querySelector(".contenedor_logueo_registro");
var caja_trasera_login = document.querySelector(".caja_trasera-login");
var caja_trasera_registro = document.querySelector(".caja_trasera-registro");

/* Declaración de funciones*/


function anchoPagina(){
    if(window.innerWidth > 850){
        if(formulario_login.style.display == "none"){
            formulario_registro.style.display = "block";
            formulario_login.style.display = "none";
            caja_trasera_login.style.display = "block";
            caja_trasera_registro.style.display = "block";
            caja_trasera_login.style.opacity = "1";
            caja_trasera_registro.style.opacity = "0";
            contenedor_logueo_registro.style.left = "380px";
            contenedor_logueo_registro.style.top = "-120px";
        }else{
            formulario_registro.style.display = "none";
            formulario_login.style.display = "block";
            caja_trasera_login.style.display = "block";
            caja_trasera_registro.style.display = "block";
            caja_trasera_login.style.opacity = "0";
            caja_trasera_registro.style.opacity = "1";
            contenedor_logueo_registro.style.left = "10px";
            contenedor_logueo_registro.style.top = "-175px";
        }
    }else{
        if(formulario_registro.style.display == "block"){
            formulario_registro.style.display = "block";
            formulario_login.style.display = "none";
            caja_trasera_login.style.display = "block";
            caja_trasera_registro.style.display = "block";
            caja_trasera_login.style.opacity = "1";
            caja_trasera_registro.style.opacity = "0";
            contenedor_logueo_registro.style.left = "0px";
            contenedor_logueo_registro.style.top = "-70px";
        }else{
            formulario_registro.style.display = "none";
            formulario_login.style.display = "block";
            caja_trasera_login.style.display = "block";
            caja_trasera_registro.style.display = "block";
            caja_trasera_login.style.opacity = "0";
            caja_trasera_registro.style.opacity = "1";
            contenedor_logueo_registro.style.left = "0px";
            contenedor_logueo_registro.style.top = "-70px";
        }
    }
}

anchoPagina();

function registro(){

    if(window.innerWidth >850){
        formulario_registro.style.display = "block";
        formulario_login.style.display = "none";
        caja_trasera_login.style.display = "block";
        caja_trasera_registro.style.display = "block";
        caja_trasera_login.style.opacity = "1";
        caja_trasera_registro.style.opacity = "0";
        contenedor_logueo_registro.style.left = "380px";
        contenedor_logueo_registro.style.top = "-120px";
    }else{
        formulario_registro.style.display = "block";
        formulario_login.style.display = "none";
        caja_trasera_login.style.display = "block";
        caja_trasera_login.style.opacity = "1";
        caja_trasera_registro.style.display = "none";
        caja_trasera_registro.style.opacity = "0";
        contenedor_logueo_registro.style.left = "0px";
        contenedor_logueo_registro.style.top = "-70px";
        formulario_registro.style.left = "0px";
    }
}


function login(){

    if(window.innerWidth > 850){
        formulario_registro.style.display = "none";
        formulario_login.style.display = "block";
        caja_trasera_login.style.display = "block";
        caja_trasera_registro.style.display = "block";
        caja_trasera_login.style.opacity = "0";
        caja_trasera_registro.style.opacity = "1";
        contenedor_logueo_registro.style.left = "10px";
        contenedor_logueo_registro.style.top = "-175px";
    }else{
        formulario_registro.style.display = "none";
        formulario_login.style.display = "block";
        caja_trasera_login.style.display = "block";
        caja_trasera_registro.style.display = "block";
        caja_trasera_login.style.opacity = "0";
        caja_trasera_registro.style.opacity = "1";
        contenedor_logueo_registro.style.left = "0px";
        contenedor_logueo_registro.style.top = "-70px";
    }
}