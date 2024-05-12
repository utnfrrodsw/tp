

const Persona = {
    init(nombre, apel, email, edad, password, estado) {
        this.nombre = nombre;
        this.apel = apel;
        this.email = email;
        this.edad = edad;
        this.password = password;
        this.estado = estado; // 1 = de alta, 0 = dado de baja
    }
};


const Paciente = {
    __proto__: Persona,
    init(nombre, apel, email, edad, password, estado, dni) {
        Persona.init.call(this, nombre, apel, email, edad, password, estado); //this hace referencia a que se hace sobre el paciente
        this.dni = dni;
    }
};

function menuPaciente() {
    let op = -1;
    while (op !== 0) {
        console.log('Bienvenido al sistema de gestion de pacientes \n');
        console.log('1-Crear Paciente \n');
        console.log('2-Modificar Paciente \n');
        console.log('3-Eliminar Paciente \n');
        console.log('4-Ver Datos Paciente \n');
        console.log('0-Salir \n');
        op = prompt('Ingrese la opcion que desea: ');
        op = parseInt(op);
        while (op < 0 || op > 4) {
            console.log('La opcion ingresada es invalida, seleccione una opcion correcta');
            op = prompt('Ingrese la opcion que desea: ');    
        }
        switch (op) {
            case 1:
                CrearPaciente();
                break;
        
            case 2:
                ModificarPaciente();
                break;
    
            case 3:
                EliminarPaciente();
                break;
    
            case 4:
                DatosPaciente();
                break;
                
            case 0:
                break;
        }
    }
}

function CrearPaciente() {
    console.log('Ingrese los datos del paciente: \n');
    let dni = prompt('Ingrese el DNI del paciente: ');    

    while (dni === '') {
        console.log('DNI invalido \n');
        dni = prompt('Ingrese el DNI del paciente ');
        
    }
    dni = parseInt(dni);
    let aux = buscarPaciente(dni);
    if (aux !== undefined) {
        alert('Ya existe un paciente con el DNI ingresado');
    }
    else {
        let nombre = prompt('Ingrese el nombre del paciente: ');
        
        while (nombre === '') {
            console.log('Nombre invalido \n');
            nombre = prompt('Ingrese el nombre del paciente: ');
        }
        
        let apel = prompt('Ingrese el apellido del paciente: ');
        
        while (apel === '') {
           
            console.log('Apellido invalido \n');
            apel = prompt('Ingrese el apellido del paciente: ');
        }
        
        let email = prompt('Ingrese el email del paciente:');  
            
        while (email ==='') {
            console.log('Email invalido\n');
            email = prompt('Ingrese email el del paciente:');
        }
    
        let edad = prompt('Ingrese la edad del paciente: ');
        while (edad === '') {
            console.log('Edad invalida \n');
            edad = prompt('Ingrese la edad del paciente: ');
        }
        edad = parseInt(edad);
        
    
        let password = prompt('Ingrese la contraseña del paciente: ');
        while (password === '' || password.length < 8) {
            console.log('Contraseña invalida \n');
            password = prompt('Ingrese la contraseña del paciente: ');
        }
        
        const paciente = Object.create(Paciente);
        
        paciente.init(nombre, apel, email, edad, password, 1, dni);
        alert('El paciente ' + nombre + ' ' + apel +  ' con DNI '  + dni + ' ha sido creado exitosamente');
        console.log(paciente.estado);
        coleccionPaciente.push(paciente);
    }
}
    

function EliminarPaciente() {
    let paciente = buscarPaciente();
    if (paciente === undefined) {
        alert('No existe un paciente con el DNI ingresado');
    }
    else {
        let op = prompt('¿Desea que el paciente ' + paciente.nombre + ' ' + paciente.apel +  ' con DNI '  + paciente.dni +  ' sea dado de baja? S/N: ');
        if (op === 's' ||  op==='S'){
            paciente.estado = 0;
            alert('El paciente ' + paciente.nombre + ' ' + paciente.apel +  ' con DNI '  + paciente.dni +  ' ha sido dado de baja.');
        }
    }
}


function ModificarPaciente() {
    let paciente = buscarPaciente();
    if (paciente === undefined) {
        alert('No existe un paciente con el DNI ingresado');
    }
    else {
        if (paciente.estado === 0) {
            alert('Este paciente esta dado de baja.');
        }
        else {
            let opModificar = -1;
            while (opModificar !== 0) {
                console.log('1-Nombre');
                console.log('2-Apellido');
                console.log('3-Email');
                console.log('4-Contraseña');
                console.log('0-Salir');
                opModificar = prompt('Seleccione el dato que desea modificar.');
                opModificar = parseInt(opModificar);
                
                switch (opModificar) {
                    case 1:
                        let nombreModif= prompt('Ingrese el nuevo nombre del paciente: ');
                        while (nombreModif === "") {
                                alert('Nombre invalido');
                                nombreModif= prompt('Ingrese el nuevo nombre del paciente: ');
                        }
                        paciente.nombre = nombreModif;
                        alert('El nombre del paciente con DNI '+ paciente.dni +' ahora es: ' + paciente.nombre);
                        break;
                
                    case 2:
                        let apelModif = prompt('Ingrese el nuevo apellido del paciente:');
                        while (apelModif === "") {
                            alert('Apellido invalido');
                            apelModif = prompt("Ingrese el nuevo apellido del paciente:");
                        }
                        paciente.apel = apelModif;
                        alert('El apellido del paciente con el DNI'  + paciente.dni + 'ahora es: ' + paciente.apel);
                        break;
            
                    case 3:
                        let emailModif = prompt('Ingrese el nuevo mail del paciente: ');
                        while (emailModif === "") {
                            alert('Email invalido');
                            emailModif = prompt('Ingrese el nuevo mail del paciente: ');
                        }
                        paciente.email = emailModif;
                        alert('El email del paciente con DNI ' + paciente.dni + ' ahora es: ' + paciente.email);
                        break;
            
                    case 4:
                        let contModif = prompt('Ingrese la nueva contraseña del paciente: ');
                        while (contModif === "") {
                            alert('Contraseña invalida');
                            contModif = prompt('Ingrese la nueva contraseña del paciente: ');
                        }
                        paciente.password = contModif;
                        alert('La contraseña del paciente del paciente con DNI: ' + paciente.dni + ' ahora es: ' + paciente.password);
                        break;
                        
                    case 0:
                        break;
                }
            }
        }
    }
}





function DatosPaciente() {
    let paciente = buscarPaciente();
    if (paciente === undefined) {
        alert('No existe un paciente con el DNI ingresado');
    }
    else {
        if (paciente.estado === 0){
            alert('Este paciente esta dado de baja.'); 
        }
        else {
            console.log('DNI: ' + paciente.dni + '\n');
            console.log('Nombre: ' + paciente.nombre + '\n');
            console.log('Apellido: ' + paciente.apel + '\n');
            console.log('Edad: ' + paciente.edad + '\n');
            console.log('Email: ' + paciente.email + '\n');
            
        }
    }
}

function buscarPaciente(dni = undefined) {
    if (dni === undefined) {
        dni = prompt('Ingrese el dni del paciente: ');
        while (dni === "") {
            console.log('DNI invalido \n');
            dni = prompt('Ingrese el DNI del paciente ');
        }
        dni = parseInt(dni);
    }
    let pacienteBuscado = coleccionPaciente.find((element) => {
    if (element.dni === dni) {
        return element;
    }    
    });
    return pacienteBuscado;
}


let coleccionPaciente = [];

window.addEventListener('load', () => {
    const aux = Object.create(Paciente);
    aux.init('Jorge', 'Perez', 'hola@gmail.com', 26, 'abcd1234', 1, 12345678);
    coleccionPaciente.push(aux);
    menuPaciente()
});

