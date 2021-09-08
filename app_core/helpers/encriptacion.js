/**
* @file archivo que contiene el modulo de encriptacion
* @name encriptacion.js
* @author David Villota <david.villlota@udenar.edu.co>
* @license UDENAR
* @copyright 2016 Udenar
**/
var Crypto = require('crypto')
var cryptojs = require('crypto-js')

/**
* Modulo de encriptado permite realizar la encriptación y desencriptacion de los datos que vienen en el token.
* @module Encriptacion
*
**/
/**
* encriptacion de la información
* @param {string} text - Texto a encriptar.
* @returns {string} crypted- texto encriptado
**/
var encriptar = function (text) {
  var cipher = Crypto.createCipher('aes-256-cbc', process.env.JWT_SECRET)
  var crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}
/**
* desencriptacion de la información
* @param {string} text - Texto a desencriptar.
* @returns {string} crypted- texto desencriptado
**/
var desencriptar = function (text) {
  var decipher = Crypto.createDecipher('aes-256-cbc', process.env.JWT_SECRET)
  var dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}


/**
* desencriptacion de la información hoja de vida
* @param {string} datos - objeto a encriptar.
* @returns {string} crypted- texto encriptado
**/
var decrypt = function (datos, clave, token) {
  if (token) {
    clave = getClave(clave, token)
  }

  var datos = cryptojs.AES.decrypt(datos, clave).toString(cryptojs.enc.Utf8);
  return JSON.parse(datos)
}

/**
* encriptacion de la información hoja de vida
* @param {string} datos - objeto a encriptar.
* @returns {string} crypted- texto encriptado
**/
var encrypt = (datos, clave, token) => {
  var obj = { thu: '', aws: '' }
  if (token) {
    clave = getClave(clave, token)
    obj.aws = encryptText(true)
  }
  obj.thu = cryptojs.AES.encrypt(JSON.stringify(datos), clave).toString()
  return obj
}

/**
* permite obtener la clave de desencriptar cuando es usuario activo
* @param {string} datos - objeto a encriptar.
* @returns {string} crypted- texto encriptado
**/
var getClave = (clave, token) => {
  var clavet1 = clave.substring(0, 10)
  var clavet2 = clave.substring(10, 20)
  var tokent1 = token.substring(0, 5)
  var tokent2 = token.substring(5, 10)
  return tokent1 + clavet2 + tokent2 + clavet1
}

var generarTokenByEmail = (correo) =>{
  var aleatorio = Crypto.randomBytes(16).toString("hex");
  var token = Crypto.pbkdf2Sync(correo, aleatorio, 1000, 16, 'sha512').toString("hex");
  return token;
}


/**
* Método que permite encriptar texto
* @param text
*/
encryptText = (text) => {
  return cryptojs.AES.encrypt(text.toString(), process.env.KEY_TEXT).toString();
}

/**
 * Método que permite encriptar texto
 * @param text
 */
decryptText = (text) => {
  return cryptojs.AES.decrypt(text.toString(), process.env.KEY_TEXT).toString(cryptojs.enc.Utf8);
}

module.exports.encriptar = encriptar
module.exports.desencriptar = desencriptar
module.exports.generarTokenByEmail = generarTokenByEmail
module.exports.decrypt = decrypt
module.exports.encrypt = encrypt
module.exports.decryptText = decryptText
module.exports.encryptText = encryptText
