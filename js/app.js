//Elementos HTML
const carrito = document.querySelector("#carrito");
const listadoCursos = document.querySelector("#lista-cursos");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const btnVaciarCarrito = document.querySelector("#vaciar-carrito");
const btnsAgregarCarrito = document.querySelectorAll(".agregar-carrito");

//Variables de clase
let articulosCarrito = [];
let elementAdded = false;

document.addEventListener('DOMContentLoaded', () => {
    //Cargamos los datos que hayan en el local storage y en caso que no hayan generamos un array vacío
    articulosCarrito = JSON.parse(localStorage.getItem('carrito') || []);
    generaHTML();
});


btnsAgregarCarrito.forEach(boton => {
    boton.addEventListener("click", (e) => {
        e.preventDefault();
        const cursoSeleccinado = e.target.parentElement.parentElement;
        //Crear un objeto con el contenido del curso actual
        const infoCurso = {
            id: cursoSeleccinado.querySelector("a").getAttribute("data-id"),
            imagen: cursoSeleccinado.querySelector("img").src,
            titulo: cursoSeleccinado.querySelector("h4").textContent,
            autor: cursoSeleccinado.querySelector("p").textContent,
            precio: cursoSeleccinado.querySelector("p.precio span").textContent,
            cantidad: 1

        }
        //Revisa si un elemento ya existe dentro del carrito(some verifica si un elemento dentro de sí mismo existe)
        const exist = articulosCarrito.some(curso => curso.id === infoCurso.id);
        if (exist) {
            //Actualizamos la cantidad del curso
            const cursos = articulosCarrito.map(curso => {
                if (curso.id === infoCurso.id) {
                    curso.cantidad++;
                    return curso; //Retorna el curso con la cantidad actualizada
                } else {
                    return curso; //retornamos el curso sin modificar la cantidad modificada
                }
            });
            articulosCarrito = [...cursos];
        } else {
            //Agregamos elementos al arreglo usando spread operator [le ingresamos una copia del array vacío]        
            articulosCarrito = [...articulosCarrito, infoCurso];
            //console.log(articulosCarrito);
        }

        generaHTML();

        //Eliminar cursos
        /*botonesEliminar = carrito.querySelectorAll("a.borrar-curso");
        console.log(botonesEliminar);
        botonesEliminar.forEach(botonEliminar => {
            botonEliminar.addEventListener("click", (e) => {
                console.log(e.target);
                e.preventDefault();
                const cursoId = e.target.getAttribute("data-id");
                articulosCarrito = articulosCarrito.filter(curso => {
                    return curso.id !== cursoId
                });
                console.log(articulosCarrito);
                generaHTML();
            });
        });*/
    }); //botonEventListener





}); //ForEach

//Eliminar cursos
contenedorCarrito.addEventListener("click", (e) => {
    if (e.target.classList.contains("borrar-curso")) {
        const cursoId = e.target.getAttribute("data-id");
        articulosCarrito = articulosCarrito.filter((curso) => {
            return curso.id !== cursoId;
        });
        generaHTML();
    }
});

//Vaciar carrito
btnVaciarCarrito.addEventListener("click", () => {
    if (articulosCarrito.length > 0) {
        articulosCarrito = [];
        //Limpiamos lo elementos en  la tabla(body)
        while (contenedorCarrito.firstChild) {
            contenedorCarrito.removeChild(contenedorCarrito.firstChild);
        }
    }
});




//Genera elementos HTML para cada item del carrito
function generaHTML() {
    //limpiar los elementos en el tbody previo a agregar elementos
    // contenedorCarrito.innerHTML = "";
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
    articulosCarrito.forEach((item) => {
        const {
            id,
            imagen,
            titulo,
            precio,
            cantidad
        } = item;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
                <img src='${imagen}'>
            </td>
            <td>${titulo}</td>
            <td>${precio}</td>
            <td>${cantidad}</td>
            <td>
                <a href='#' class='borrar-curso' data-id='${id}'> X </a>
            </td>
        `;
        //Agregamos el elemento creado al <tbody></tbody>
        contenedorCarrito.appendChild(row);
    });
    //Guardarmos los datos que contenga el carrito en el localStorage
    persisOnLocalStorage();
}

function persisOnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}