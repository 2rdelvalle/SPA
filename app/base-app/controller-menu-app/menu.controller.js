(function () {
    'use strict';
    angular.module('mytodoApp').controller('menuCtrl', menuCtrl);
    menuCtrl.$inject = ['$scope', '$location', 'localStorageService', 'appGenericConstant'];
    function menuCtrl($scope, $location, localStorageService, appGenericConstant) {

        var ctrlMenu = this;

        ctrlMenu.ListMenu = [];
        if (localStorageService.get('ListMenu') !== null) {
            ctrlMenu.ListMenu = localStorageService.get('ListMenu');
        }

        if (localStorageService.get('intervalPantalla') !== null) {
            clearInterval(localStorageService.get('intervalPantalla'));
        }

        if (localStorageService.get('intervalPantallaPopup') !== null) {
            clearInterval(localStorageService.get('intervalPantallaPopup'));
        }

        /*ctrlMenu.onListarOPciones = function (ruta) {
            var aux = localStorageService.get("modulo");

            let menu = aux.find(element => element.id === '15');
            let menuMedellin = {
              label:  'Inscripción v2',
              ruta: '/#/form-inscripcion-V2',
              clase: 'glyph-icon icon-cogs',
              selected: true,
              tipo: 'menu',
              id: 0,
              value: 0,
              children: [

              ],
              __ivhTreeviewExpanded: true,
              __ivhTreeviewIndeterminate: false
            };
          menu.children.push(menuMedellin);

            for (var i = appGenericConstant.CERO; i < aux.length; i++) {
                if (aux[i].ruta === ruta && aux[i].selected === true) {
                    ctrlMenu.ListMenu = aux[i].children;
                    localStorageService.set('ListMenu', ctrlMenu.ListMenu);
                    $location.path(ruta.substr(appGenericConstant.DOS));
                    break;
                }
                for (var j = appGenericConstant.CERO; j < aux[i].children.length; j++) {
                    if (aux[i].children[j].ruta === ruta && aux[i].children[j].selected === true) {
                        ctrlMenu.ListMenu = aux[i].children[j].children;
                        localStorageService.set('ListMenu', ctrlMenu.ListMenu);
                        $location.path(ruta.substr(appGenericConstant.DOS));
                        break;
                    }
                    for (var k = appGenericConstant.CERO; k < aux[i].children[j].children.length; k++) {
                        if (aux[i].children[j].children[k].selected === true) {
                            $location.path(ruta.substr(appGenericConstant.DOS));
                        }
                    }
                }
            }
        };*/
        ctrlMenu.onListarOPciones = function (ruta) {
            var aux = localStorageService.get("modulo");

            for (var i = appGenericConstant.CERO; i < aux.length; i++) {
                if (aux[i].ruta === ruta && aux[i].selected === true) {
                    ctrlMenu.ListMenu = aux[i].children;
                    localStorageService.set('ListMenu', ctrlMenu.ListMenu);
                    $location.path(ruta.substr(appGenericConstant.DOS));
                    break;
                }
                for (var j = appGenericConstant.CERO; j < aux[i].children.length; j++) {
                    if (aux[i].children[j].ruta === ruta && aux[i].children[j].selected === true) {
                        ctrlMenu.ListMenu = aux[i].children[j].children;
                        localStorageService.set('ListMenu', ctrlMenu.ListMenu);
                        $location.path(ruta.substr(appGenericConstant.DOS));
                        break;
                    }
                    for (var k = appGenericConstant.CERO; k < aux[i].children[j].children.length; k++) {
                        if (aux[i].children[j].children[k].selected === true) {
                            $location.path(ruta.substr(appGenericConstant.DOS));
                        }
                    }
                }
            }
        };
    }
})();
