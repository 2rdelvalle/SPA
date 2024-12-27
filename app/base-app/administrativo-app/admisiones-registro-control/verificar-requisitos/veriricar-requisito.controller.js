(function () {
    'use strict';
    angular.module('mytodoApp').controller('VerificarCtrl', VerificarCtrl);

    VerificarCtrl.$inject = ['$scope', 'verificarRequisitoServices',  'Upload', '$timeout','appConstant'];
    function VerificarCtrl($scope, verificarRequisitoServices,  Upload, $timeout,appConstant) {
        var verificarRequisitos = this;
        
        $(document).ready(function () {
          verificarRequisitos.aa =  verificarRequisitoServices.inscrito;
        });
        
        verificarRequisitos.ejemplo = function (){
          alert("la cnadaj") ;
        };
        
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        verificarRequisitos.inscritos = [
            {
                id: 1,
                cumple: "si",
                requisito: "admision",
                tiporequisito: "prueba",
                resultado: 100,
                Observacion: "jajdajda",
                archivo: ""
            },
            {
                id: 2,
                cumple: "no",
                requisito: "admision",
                tiporequisito: "documento",
                resultado: 100,
                Observacion: "jajdajda",
                archivo: ""
            },
            {
                id: 3,
                cumple: "no",
                requisito: "admision",
                tiporequisito: "documento",
                resultado: 100,
                Observacion: "jajdajda",
                archivo: "aaaaaaaaa.pdf"
            }
        ];

        verificarRequisitos.uploadPic = function (file) {
            file.upload = Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload'
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));

                $(".progress-bar").animate({
                    width: '100%'
                }, 1000);

            });
        };

        verificarRequisitos.verificarAuxiliar = {};
        verificarRequisitos.nivelesFormacion = [];
        verificarRequisitos.programasAcademicos = [];
        verificarRequisitos.jornadas = [];
        verificarRequisitos.selectTodos = false;
        verificarRequisitos.filtrados = [];
        verificarRequisitos.admision = verificarRequisitoServices.admision;
        verificarRequisitos.display;
        verificarRequisitos.options = appConstant.FILTRO_TABLAS;
        verificarRequisitos.selectedOption = verificarRequisitos.options[0];
        verificarRequisitos.report = {
            selected: null
        };

        /*Metodo para seleccionar todos los datos de la tabla al checkear*/
        verificarRequisitos.onSelectTodos = function () {
            if (verificarRequisitos.selectTodos === true) {
                verificarRequisitos.report.selected = verificarRequisitos.filtrados.slice();
            } else {
                verificarRequisitos.report.selected.length = null;
            }
        };

        /*Metodo para al presionar un tr se checkee o se descheckee el checkbox */
        verificarRequisitos.onSelectTodosTable = function (clase) {
            if (verificarRequisitos.report.selected.length === verificarRequisitos.filtrados.length
                    && verificarRequisitos.selectTodos === true) {
                verificarRequisitos.selectTodos = false;
            } else {
                if (!clase) {
                    if (verificarRequisitos.report.selected.length + 1 === verificarRequisitos.filtrados.length
                            && gestionAdmision.selectTodos === false) {
                        verificarRequisitos.selectTodos = true;
                    }
                } else {
                    verificarRequisitos.selectTodos = false;
                }

            }

        };


        verificarRequisitos.mostrarCampo = function () {
            $("#inputHid").prop("disabled", false);
            $("#btnComd").hide();
            $("#btnCheck").show();

        };

        verificarRequisitos.ocultarCampo = function () {
            $("#inputHid").prop("disabled", true);
            $("#btnComd").show();
            $("#btnCheck").hide();

        };

        verificarRequisitos.mostrarCampoText = function () {
            $("#textAreaHid").prop("disabled", false);
            $("#btnComd2").hide();
            $("#btnCheck2").show();

        };

        verificarRequisitos.ocultarCampoText = function () {
            $("#textAreaHid").prop("disabled", true);
            $("#btnComd2").show();
            $("#btnCheck2").hide();

        };
        
        verificarRequisitos.eliminarArchivo = function (item){
            item.archivo = "";
        };


    }
})();

