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


module.exports.encriptar = encriptar
module.exports.desencriptar = desencriptar
