let contenedor;
let buscador;
let contadorPaginas = 2;
let ultimaBusqueda;
let tipoBusqueda;

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

function detallesPeticion(id){
    fetch("https://www.omdbapi.com/?i="+id+"&apikey=ea005db6").then(response => response.json())
        .then(data => {
            console.log(data.imdbID);
            let contenedor = document.getElementById("detalles");
            let contenido = document.getElementById("contenidoDetalles");
            contenido.innerHTML = '<span id="cerrar"><button id="cerrar">X</button></span>'
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

            estrella.addEventListener("click",(e)=>{
                if(e.target.src = "./src/img/estrellanofav.png"){
                    estrella.src = "./src/img/pngegg.png";
                }else if(e.target.src = "./src/img/pngegg.png")
                    estrella.src="./src/img/estrellanofav.png";
            })

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
    let temporizador;

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


    
    buscador.addEventListener("keyup",()=>{
        let texto = buscador.value.trim();
        if(texto.length<3){
            contenedor.innerHTML = "";
            return;
        }
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
    )}