
const archiver = require('archiver');
const fs = require("fs");
const moment = require("moment");


var setearFecha =(fecha, horas, minutos)=>{

    fecha= new Date(fecha);
    fecha.setHours(horas);
    fecha.setMinutes(minutos);
    fecha.setSeconds(0);
    fecha.setMilliseconds(0);

    return fecha;

}

/**
 * formatea una fecha dada un objeto de tipo date 
 * @param {*} date fecha
 * @param {*} hora dar hora en formato
 */
var formatearFecha=(date, hora="N")=>{

    let anio= date.getFullYear();
    let mes =  addZeros(Number(date.getMonth()) + 1,2);
    let dia = addZeros(date.getDate(),2);

    var fecha= `${dia}/${mes}/${anio}`;

    if(hora=="S"){
        let horas= addZeros(date.getHours(),2);
        let minutos= addZeros(date.getMinutes(),2);

        fecha= `${fecha} ${horas}:${minutos}`;
    }

    return fecha;

}

/**
 * formatea la hora de un objeto de tipo date
 * @param {*} date - fecha 
 */
var darHora=(date)=>{
    let horas= addZeros(date.getHours(),2);
    let minutos= addZeros(date.getMinutes(),2);

    return `${horas}:${minutos}`
}

/**
 * adiciona ceros a la izquierda
 * @param {*} numero numero a fomatear
 * @param {*} cantidad cantidad de ceros a la izquierda
 */
var addZeros= (numero,cantidad)=>{
    var s = numero + "";
    while (s.length < cantidad) s = "0" + s;
    return s;
}

var validarFechaBloqueo = (fechaBloqueo)=>{

    var ahorita = moment();
    var bloquem = moment(fechaBloqueo);

    if(ahorita.isAfter(bloquem)){
       return true;     
    } 
    return false; 
}



module.exports={
    setearFecha,
    addZeros,
    darHora,
    formatearFecha,
    validarFechaBloqueo
}