(function () {

    'use strict';

    angular.module('mytodoApp.service').service('liquidarCongresoService', liquidarCongresoService);

    liquidarCongresoService.$inject = ['$http', '$q','localStorageService'];

    function liquidarCongresoService($http, $q,localStorageService) {

        var liquidarCongresosSer = this;
        var url = '/api/financiero/';


        liquidarCongresosSer.consultarEstudiante = getEstudianteById;
        liquidarCongresosSer.consultarConceptosALiquidar = getListaConceptosALiquidar;
        liquidarCongresosSer.consultarDetalleConceptoALiquidar = getDetalleConceptoALiquidar;
        liquidarCongresosSer.guardarLiquidacion = postGuardarLiquidacion;
        liquidarCongresosSer.guardarLiquidacionModulo = postGuardarLiquidacionModulo;
        liquidarCongresosSer.consultarPeriodoAcademico = getPeriodoAcademico;
        liquidarCongresosSer.getListaValorByCategoria = getListaValorByCategoria;
        liquidarCongresosSer.getCongresos = getCongresos;
        liquidarCongresosSer.consultarValorCongreso = consultarValorCongreso;
        liquidarCongresosSer.consultarEstudiante =  consultarEstudiante;
        liquidarCongresosSer.postGuardarCongresoLiqui = postGuardarCongresoLiqui;

        liquidarCongresosSer.liquidacionInicial = {};

        liquidarCongresosSer.liquidarConceptosAuxiliar = {};

        liquidarCongresosSer.liquidarConceptosAuxiTotal = {};

        liquidarCongresosSer.datosEstudianteSer = {};
        liquidarCongresosSer.downloadArchivo = onDownloadArchivos;
        function getEstudianteById(rs, tp) {
            var urlRequest = url + "Estudiante/liquidacion/byCodigo/" + rs + "/"+tp;
            return ejectutarServiceId(urlRequest, rs);
        }

        function getListaConceptosALiquidar() {
            var urlRequest = url + "ConceptoFacturacion/concepto/ingreso";
            return ejectutarServiceId(urlRequest);
        }

      function consultarValorCongreso(id) {
        var urlRequest = url + "ConfiguracionPrograma/congresosConfig/"+ id;
        return ejectutarServiceId(urlRequest);
      }

      function postGuardarCongresoLiqui(rs) {
        var urlRequest = "/api/admisiones/Congreso";
        return ejectutarServicePost(urlRequest, rs);
      }

      function consultarEstudiante(documento) {
        var urlRequest =  "/api/admisiones/Estudiante/consultarEstudianteBy?nombre=" + documento;
        return ejectutarServiceId(urlRequest);
      }

        function getDetalleConceptoALiquidar(rs) {
            var urlRequest = url + "LiquidacionConcepto/detalleConceptoLiquidado/" + rs.idEstudiante + "/" + rs.idPrograma + "/" + rs.idPeriodo + "/" + rs.idConcepto;
            return ejectutarServiceId(urlRequest, rs);
        }

        function postGuardarLiquidacion(rs) {
            var urlRequest = url + "LiquidacionConcepto";
            return ejectutarServicePost(urlRequest, rs);
        }

        function postGuardarLiquidacionModulo(rs) {
            var urlRequest = url + "LiquidacionConcepto/guardarLiquidacionModulo";
            return ejectutarServicePost(urlRequest, rs);
        }

        function ejectutarServiceId(urlRequest, rs) {
            var defered = $q.defer();
            $http.get(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (response) {
                defered.reject(response);
            });
            return defered.promise;
        }

        function ejectutarServicePost(urlRequest, rs) {
            var defered = $q.defer();
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function onDownloadArchivos(file) {
            var urlRequest = url + 'report/' + file;
            return urlRequest;
        }

      function ejecutarServiceGet(urlrequest) {
        var defered = $q.defer();
        $http.get(urlrequest).success(function (response) {
          defered.resolve(response);
        }).error(function (error) {
          defered.reject(error);
        });
        return defered.promise;
      }


      function getPeriodoAcademico() {
        var urlrequest = '/api/admisiones/PeriodoAcademico/ByEstadoAbiertoInscripto';
        return ejecutarServiceGet(urlrequest);
      }

     function getCongresos() {
        var urlrequest = '/api/admisiones/Programa/findByIdNivelFormacionAndEstadoAndTipoPrograma/3/CONGRESO';
        return ejecutarServiceGet(urlrequest);
      }

      function getListaValorByCategoria(categoria, microservicio) {
        if (localStorageService.get('listaValor') !== null) {
          var deferred = $q.defer();
          var listaValor = localStorageService.get('listaValor');
          var filterData = [];

          listaValor.filter(function (obj) {
            if (obj.categoria === categoria) {
              filterData.push(obj);
            }
          });
          deferred.resolve(filterData);
          return deferred.promise;
        } else {
          let urlRequest = '/api/' + microservicio + '/ListaValor/' + categoria;
          return ejecutarServiceGet(urlRequest);
        }
      }
    }
})();
