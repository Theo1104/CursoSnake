//Constantes

let DIRECCIONES = {
    ARRIBA:1,
    ABAJO:2,
    IZQUIERDA:3,
    DERECHA:4,    
}

const juegoCanvas = document.getElementById("borde1");
const puntosTexto = document.getElementById("Ptos");
const ctx = juegoCanvas.getContext("2d");
const cNintendo = document.getElementById("Nintendo");
const rotacion = document.getElementById("Rotar");
const boton = document.getElementById("cerrarB");


let musicaF = new Audio ("../CSS/Sounds/Musica_de_snake.mp3");
let sonidoPunto = new Audio ("../CSS/Sounds/ganaste_un_punto.wav");
let gameO = new Audio ("../CSS/Sounds/GameOver.mp3");

//Estados

let Musica1 = false;

let serpientePos;

let direccionActual;
let nuevadireccion;

let comida;

let FPS = 70;

let ciclo;

let puntos;

//Dibujar Juego

function rellenarCuadro(context, posX, posY, ){
    ctx.beginPath();
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(posX, posY, 20, 20);
    ctx.stroke();
}

function rellenarComida(context, posX, posY, ){
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.fillRect(posX, posY, 20, 20);
    ctx.stroke();
}

function serpiente(contextS,serpientePos){
    for(let i = 0; i < serpientePos.length; i++){
    rellenarCuadro(contextS, serpientePos[i].posX, serpientePos[i].posY)
    }
}

function dibujarComida(context, comida){
    rellenarComida(context, comida.posX, comida.posY, 20, 20);
}

function dibujarParedes(context){
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = "white";
    context.rect(20,20,560,560);
    context.stroke();
}

function dibujarTexto(context, texto, x, y){
    context.font = "30px Arial";
    context.textAlign = "center";
    context.fillStyle = "white";
    context.fillText (texto, x, y);
}


//Movimiento Serpiente

function moverSerpiente(direccion,serpientePos){
    let cabezaPosX = serpientePos[0].posX;
    let cabezaPosY = serpientePos[0].posY;

    if(direccion === DIRECCIONES.DERECHA){
        cabezaPosX += 20;
    } else if(direccion === DIRECCIONES.IZQUIERDA){
        cabezaPosX -= 20;
    } else if(direccion === DIRECCIONES.ARRIBA){
        cabezaPosY -= 20;
    } else if(direccion === DIRECCIONES.ABAJO){
        cabezaPosY += 20;
    }

    serpientePos.unshift( {posX: cabezaPosX, posY: cabezaPosY } );
    return serpientePos.pop();
}

function serpientecomio(serpientePos, comida){
    return serpientePos[0].posX === comida.posX && serpientePos[0].posY === comida.posY;
}

//Comida

function generarcomida(serpiente){
    while(true){
        let columnaX = Math.max(Math.floor(Math.random() * 29), 1);
        let columnaY = Math.max(Math.floor(Math.random() * 29), 1);

        let posX = columnaX * 20;
        let posY = columnaY * 20;
    
        let choqueS = false;
        for(let i =0; i < serpiente.length; i++){
            if(serpiente[i].posX === posX && serpiente[i].posY === posY){
                choqueS = true;
                break;
            }
        }

        if(choqueS === true){
            continue;
        }

        return{posX: posX, posY: posY};
    }
}

//ocurrio una colision

function Chocaste(serpientePos){
    let cabeza = serpientePos[0];

    if(cabeza.posX < 20 || cabeza.posY < 20 || cabeza.posX > 560 || cabeza.posY > 560){
        console.log ("Perdiste");
        return true;
    }

    if(serpientePos.length < 5){
        return false;
    }

    for(let i = 1; i < serpientePos.length; i++){
        if(cabeza.posX === serpientePos[i].posX && cabeza.posY === serpientePos[i].posY){
            return true;
        }
    }

    return false;

}

//Musicas

function MusicaFondo(){
    if(Musica1 === false){
        musicaF.loop = true;
        musicaF.play();
    }
}

//Resoluciones

window.addEventListener("orientationchange",function(){
    rotacion.classList.remove("esconder");
});

boton.addEventListener("click",function(){
    rotacion.classList.add("esconder");
});

//Ciclo del juego

document.addEventListener("keydown",function(e){

 if(e.code === "ArrowUp" && direccionActual !== DIRECCIONES.ABAJO){
    nuevadireccion = DIRECCIONES.ARRIBA;
 } else if(e.code === "ArrowDown" && direccionActual !== DIRECCIONES.ARRIBA){
    nuevadireccion = DIRECCIONES.ABAJO;
 } else if(e.code === "ArrowLeft" && direccionActual !== DIRECCIONES.DERECHA){
    nuevadireccion = DIRECCIONES.IZQUIERDA;
 }else if(e.code === "ArrowRight" && direccionActual !== DIRECCIONES.IZQUIERDA){
    nuevadireccion = DIRECCIONES.DERECHA;
 }
});

function ciclodejuego(){
    let cola = moverSerpiente(nuevadireccion, serpientePos);
    direccionActual = nuevadireccion;

    if(serpientecomio(serpientePos, comida)){
        serpientePos.push(cola);
        comida = generarcomida(serpientePos);
        puntos++;
        puntosTexto.innerText = "PUNTOS: " + puntos;
        sonidoPunto.play();
    }

    if(Chocaste(serpientePos)){
        gameOver()
        return;
    }

    ctx.clearRect(0,0,600,600);
    dibujarParedes(ctx);
    serpiente(ctx,serpientePos);
    dibujarComida(ctx, comida);
}

function gameOver(){
    ciclo = clearInterval(ciclo);
    musicaF.pause();
    musicaF.loop = false;
    gameO.play();
    dibujarTexto(ctx, "¡Has perdido!", 300, 260);
    dibujarTexto(ctx, "¡Pulsa click para volver a empezar!", 300, 310);
    cNintendo.classList.add("shake-horizontal");
}

function Reinicio(){
    serpientePos = [
        { posX: 60, posY: 40},
        { posX: 60, posY: 20},
        { posX: 40, posY: 20},
        { posX: 20, posY: 20},
       ];
       puntos = 0;
       direccionActual = DIRECCIONES.ABAJO;
       nuevadireccion = DIRECCIONES.ABAJO;
       puntosTexto.innerText = "PUNTOS: " + puntos; 
       MusicaFondo();
       cNintendo.classList.remove("shake-horizontal");

       comida = generarcomida(serpientePos);
       
       ciclo = setInterval(ciclodejuego, FPS);
}

dibujarTexto(ctx, "¡Pulsa click izquierdo para empezar!", 300, 260);
dibujarTexto(ctx, "Desktop: ¡Muevete con ↑ ↓ → ←!", 300, 310);
dibujarTexto(ctx, "Mobil: ¡Pulsa con Tab para girar!", 300, 360);
dibujarParedes(ctx);

juegoCanvas.addEventListener("click", function(){
    if(ciclo === undefined){
    Reinicio();
    return;
    }

    if(direccionActual === DIRECCIONES.ABAJO){
        nuevadireccion = DIRECCIONES.IZQUIERDA;
    }else if(direccionActual === DIRECCIONES.IZQUIERDA){
        nuevadireccion = DIRECCIONES.ARRIBA;
    }else if(direccionActual === DIRECCIONES.ARRIBA){
        nuevadireccion = DIRECCIONES.DERECHA;
    }else if(direccionActual === DIRECCIONES.DERECHA){
        nuevadireccion = DIRECCIONES.ABAJO;
    }
});