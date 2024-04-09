
const persona = {
    usuario : "Juan",
    contraseña:"Juan",
    sexo:"Juan",
    email:"Juan",
    celular:"Juan"
}
function guardarRegister(){
    let usuario = document.getElementById("usuarioIngresado").value;
    let contraseña = document.getElementById("contraseñaIngresado").value;
    let sexo = document.getElementById("sexoIngresado").value;
    let email = document.getElementById("emailIngresado").value;
    let celular = document.getElementById("celularIngresado").value;
}
let nuevaPersona ={
    usuario,
    contraseña,
    sexo,
    email,
    celular
}
console.log(persona);