(function () {
    'use strict';
    angular.module('mytodoApp').controller('referenciaCtrl', referenciaCtrl);
    referenciaCtrl.$inject = ['$scope', 'entidadesBancariasService', 'ValidationService', 'localStorageService', 'appConstant', 'appGenericConstant'];
    function referenciaCtrl($scope, entidadesBancariasService, ValidationService, localStorageService, appConstant, appGenericConstant) {

        var referenciaCtrl = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        referenciaCtrl.tipoArchivoValido = true;
        referenciaCtrl.listadoEstudianteArchivo = [];

        referenciaCtrl.onGuardar = function () {

            if (referenciaCtrl.listadoEstudianteArchivo.length === 0) {
                appConstant.MSG_GROWL_ADVERTENCIA("No hay filas por procesar");
                return;
            }

            entidadesBancariasService.onPostAgregarArchivoBanco(referenciaCtrl.listadoEstudianteArchivo).then(function (data) {
                appConstant.MSG_GROWL_OK("Archivo Procesado");
                referenciaCtrl.listadoEstudianteArchivo = [];
            }).catch(function (e) {
                appConstant.MSG_GROWL_ERROR();
                throw e;
            });

        };

        function buildTable(results) {
            if (referenciaCtrl.tipoArchivoValido) {
                referenciaCtrl.listadoEstudianteArchivo = [];
                appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
                appConstant.CARGANDO();
                var data = results.data;

                for (var i = 1; i < data.length; i++) {
                    var row = data[i][0];
                    var array = row.split(";");

                    var dto = {
                        codigoBanco: array[0],
                        tipoDocumento: array[1],
                        documento: array[2],
                        referencia: array[3],
                        valorPagado: array[4],
                        fechaPago: array[5],
                        procesado: 0
                    };

                    if (dto.referencia !== undefined) {
                        referenciaCtrl.listadoEstudianteArchivo.push(dto);
                    }
                    // codigoBanco, tipoDocumento, documento, referencia, valorPagado, fechaPago
                }
            }
        }

        referenciaCtrl.onCargarArchivo = function () {
            var fileExiste = false;
            var input = $("#files");
            $('#files').parse({
                config: {
                    delimiter: "auto",
                    complete: buildTable
                },
                before: function (file, inputElem){
                    var file3 = file.name.split(".");
                    referenciaCtrl.tipoArchivoValido = file3[1] === 'csv';
                    fileExiste = true;
                },
                error: function (err, file){
                    appConstant.MSG_GROWL_ERROR();
                },
                complete: function (){
                    if (!fileExiste) {
                        appConstant.MSG_GROWL_ADVERTENCIA('Seleccione por lo menos un archivo');
                        return;
                    }

                    if (!referenciaCtrl.tipoArchivoValido) {
                        appConstant.MSG_GROWL_ADVERTENCIA('Tipo de archivo no valido');
                        return;
                    }

                    for (var i = 0; i < referenciaCtrl.listadoEstudianteArchivo.length; i++) {

                    }
                    appConstant.CERRAR_SWAL();
                    input = input.val('').clone(true);
                    $scope.$apply();
                }
            });
        };
    }
})();