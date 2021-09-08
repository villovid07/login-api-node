
const archiver = require('archiver');
const fs = require("fs");


var darNombreCompleto = (persona, apellidos_primero="N")=>{
    let cadena ="";
    if(apellidos_primero=="S"){
        cadena = `${persona.primer_apellido} ${persona.segundo_apellido?persona.segundo_apellido:''} ${persona.primer_nombre} ${persona.segundo_nombre?persona.segundo_nombre:''}`;
    } else {
        cadena = `${persona.primer_nombre} ${persona.segundo_nombre?persona.segundo_nombre:''} ${persona.primer_apellido} ${persona.segundo_apellido?persona.segundo_apellido:''}`;
    }

    return cadena;
}

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

    let cadena = `${horas}:${minutos}`
    return cadena 
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


/**
 * @param {String} source
 * @param {String} out
 * @returns {Promise}
 */
function zipDirectory(source, out) {
	const archive = archiver('zip', { zlib: { level: 9 } });
	const stream = fs.createWriteStream(out);

	return new Promise((resolve, reject) => {
		archive
			.directory(source, false)
			.on('error', err => reject(err))
			.pipe(stream)
			;

		stream.on('close', () => resolve());
		archive.finalize();
	});
}

/**
* Metodo que elimina un archivo
* @param {*} ruta ubicación del archivo
*/
function eliminarArchivo(ruta) {
	return new Promise((resolve, reject) => {
		try {
			if (ruta != null && ruta != '') {
				let existe = fs.existsSync(ruta);

				if (existe) {
					fs.unlinkSync(ruta);
				}
			} else {
				resolve(false);
			}

			resolve(true);
		} catch (error) {
			console.log('Error al tratar de eliminar el archivo.');
			resolve(false);
		}
	});
}


module.exports={
    darNombreCompleto,
    setearFecha,
    addZeros,
    darHora,
    formatearFecha,
    zipDirectory,
    eliminarArchivo
}