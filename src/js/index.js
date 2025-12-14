let contenedor;
let buscador;
let contadorPaginas = 2;
let ultimaBusqueda;
let tipoBusqueda;
let peliculas_fav = JSON.parse(localStorage.getItem("peliculasfavs")) || [];
miStorage = window.localStorage;

function maquetarPeliculas(contenedor,listaPeliculas){
    for(const peli of listaPeliculas){
        miDiv = document.createElement("div");
        miDiv.addEventListener("click",()=>detallesPeticion(peli.imdbID));
        poster = document.createElement("img");
        poster.onerror = (e) => e.target.src = "./src/img/error.png";
        texto = document.createElement("h2");
        poster.src = peli.Poster;
        texto.innerHTML = peli.Title;
        miDiv.appendChild(poster);
        miDiv.appendChild(texto);
        contenedor.appendChild(miDiv);
    }
}

function maquetarFavoritas(contenedor, peliculas_fav) {
    if (!peliculas_fav || peliculas_fav.length === 0) {
        contenedor.innerHTML = "<h2>No hay películas favoritas</h2>";
    }else{
        for (let id of peliculas_fav) {
            fetch("https://www.omdbapi.com/?i=" + id + "&apikey=ea005db6")
                .then(response => response.json())
                .then(data => {
                    maquetarPeliculas(contenedor, [data]);
                });
        }
    }
}


function detallesPeticion(id){
    fetch("https://www.omdbapi.com/?i="+id+"&apikey=ea005db6").then(response => response.json())
        .then(data => {
            let contenedor = document.getElementById("detalles");
            let contenido = document.getElementById("contenidoDetalles");
            contenido.innerHTML = '<button id="cerrar">X</button>'
            let botonCerrar = document.getElementById("cerrar");
            let imagen = document.createElement("img");
            let titulo = document.createElement("h2");
            let plot = document.createElement("p");
            let fecha = document.createElement("p");
            let director = document.createElement("p");
            let actores = document.createElement("p");
            let estrella = document.createElement("img");

            imagen.src = data.Poster;
            fecha.innerHTML = "Fecha de estreno: "+data.Released;
            plot.innerHTML = "Sinopsis: "+data.Plot;
            titulo.innerHTML = data.Title;
            director.innerHTML = "Director: "+data.Director;
            actores.innerHTML = "Actores: "+data.Actors;
            estrella.src = "./src/img/estrellanofav.png";

            contenido.appendChild(botonCerrar);
            contenido.appendChild(imagen);
            contenido.appendChild(titulo);
            contenido.appendChild(director);
            contenido.appendChild(actores);
            contenido.appendChild(fecha);
            contenido.appendChild(plot);
            contenido.appendChild(estrella);

            contenedor.appendChild(contenido);

            let esFavorita = peliculas_fav.includes(data.imdbID);

            estrella.src = esFavorita
                ? "./src/img/pngegg.png"
                : "./src/img/estrellanofav.png";

            estrella.addEventListener("click", () => {
                let index = peliculas_fav.indexOf(data.imdbID);

                if (index === -1) {
                    peliculas_fav.push(data.imdbID);
                    estrella.src = "./src/img/pngegg.png";
                } else {
                    peliculas_fav.splice(index, 1);
                    estrella.src = "./src/img/estrellanofav.png";
                }

                miStorage.setItem("peliculasfavs", JSON.stringify(peliculas_fav));
            });

            contenedor.style.display = "grid";
            

            document.getElementById("cerrar").onclick = () => {
                contenedor.style.display = "none";
            };

            contenedor.onclick = (e) => {
                if (e.target === contenedor)
                    contenedor.style.display = "none";
            };
        })
}


window.onscroll = () => {
    let final = (window.innerHeight + window.scrollY >= document.body.offsetHeight-250);
    if(final){
        let url = "https://www.omdbapi.com/?s="+ultimaBusqueda+tipoBusqueda+"&apikey=ea005db6&page="+contadorPaginas;
        lanzarPeticion(url);
    }
}

let peticion = false;
function lanzarPeticion(url){
    if(!peticion){
        peticion = true;
        fetch(url).then(response => response.json())
        .then(data => {
        maquetarPeliculas(contenedor,data.Search);
        contadorPaginas++;
        peticion = false;
    })
}}

window.onload = () => {
    
    peticion = false;
    let landing = document.getElementById("landing");
    let caja = document.getElementById("box");
    let acceso = document.getElementById("acceder");
    contenedor = document.getElementById("contenedor");
    buscador = document.getElementById("buscador");
    let buscar = document.getElementById("busca");
    tipo = document.getElementById("tipo");
    boton_fav = document.getElementById("fav");


    acceso.addEventListener("click",()=>{
        landing.style.display = "none";
        caja.style.visibility = "visible";
    })

    buscar.addEventListener("click",()=>{
        
            contenedor.innerHTML = "";
            ultimaBusqueda = buscador.value;

            if(tipo.value=="cualquiera"){
                tipoBusqueda = "";
            }else if(tipo.value == "peliculas"){
                tipoBusqueda = "&type=movie";
            }else if(tipo.value == "series"){
                tipoBusqueda = "&type=series";
            }
            
            let url = "https://www.omdbapi.com/?s="+ultimaBusqueda+tipoBusqueda+"&apikey=ea005db6&page=1";
            lanzarPeticion(url);
            buscador.value="";
        
    })

    boton_fav.addEventListener("click",()=>{
        contenedor.innerHTML = "";
        maquetarFavoritas(contenedor,peliculas_fav);
    })


    
    buscador.addEventListener("keyup",()=>{
        let texto = buscador.value.trim();
        if(texto.length<3){
            contenedor.innerHTML = "";  
        }else{
            contenedor.innerHTML = "";
            ultimaBusqueda = texto;
            if(tipo.value=="cualquiera"){
                tipoBusqueda = "";
            }else if(tipo.value == "peliculas"){
                tipoBusqueda = "&type=movie";
            }else if(tipo.value == "series"){
                tipoBusqueda = "&type=series";
            }
            let url = "https://www.omdbapi.com/?s="+ultimaBusqueda+tipoBusqueda+"&apikey=ea005db6&page=1";
            lanzarPeticion(url);
        }
    }
    )
}