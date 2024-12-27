(function () {
    'use strict';
    angular.module('mytodoApp').service('validar',  function () {
//cifrado 
            this.validarPassw = function (pass) {
                return onStringCambiar(onCambiarString(pass));
            };
            function onCambiarString(valor) {
                var letras = valor.split("");
                var value = letras.reverse();
                return cadena(btoa(value));
            }
            function cadena(valor) {
                var text = "";
                var caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@";
                for (var i = 0; i < 10; i++) {
                    text += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
                }
                return cadena2(text.concat(valor));
            }
            function cadena2(valor) {
                var text2 = "";
                var caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@";
                for (var i = 0; i < 12; i++) {
                    text2 += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
                }
                return btoa(valor.concat(text2));
            }
            function onStringCambiar(valor) {
                var value = "";
                for (var i = 0; i < valor.length; i++) {
                    value += '*';
                }
                var cadena = valor.concat('###').concat(value);
                var text = "";
                var caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@";
                for (var i = 0; i < cadena.length; i++) {
                    text += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
                }
                var final = cadena.concat(text);
                return btoa(final);
            }

        });
})();