(function () {
  "use strict";
  angular
    .module("mytodoApp.service")
    .service(
      "estadoFinancieroEstudianteServices",
      estadoFinancieroEstudianteServices
    );
  estadoFinancieroEstudianteServices.$inject = [
    "$http",
    "$q",
    "appGenericConstant",
  ];

  function estadoFinancieroEstudianteServices($http, $q, appGenericConstant) {
    var servicioHistorialCreditos = this;

    servicioHistorialCreditos.buscarEstudianteByCodigo = getEstudianteByCodigo;
    servicioHistorialCreditos.getSecretKey = getSecretKey;
    servicioHistorialCreditos.buscarEstudianteByCodigoAndEstado =
      getEstudianteByCodigoAndEstado;
    servicioHistorialCreditos.estudiante = {};
    servicioHistorialCreditos.liquidacion = {};

    var url = "/api/financiero";
    const urlWompi = "/api/integrationwompi/datawompi/generate-secret";

    function ejecutarServicesGet(urlRequest) {
      var defered = $q.defer();
      $http
        .get(urlRequest)
        .success(function (response) {
          defered.resolve(response);
        })
        .error(function (error) {
          defered.reject(error);
        });
      return defered.promise;
    }

    function getSecretKey(body) {
      var defered = $q.defer();
      $http
        .post(urlWompi, body)
        .success(function (response) {
          defered.resolve(response);
        })
        .error(function (error) {
          defered.reject(error);
        });
      return defered.promise;
    }

    function getEstudianteByCodigo(identificacion) {
      var urlRequest =
        url +
        "/EstadoFinanciero/buscarEstudianteByCodigo/" +
        identificacion +
        "/estudiante";
      return ejecutarServicesGet(urlRequest);
    }

    //        function getEstudianteByCodigoAndEstado(identificacion) {
    //            var urlRequest = url + '/EstadoFinanciero/byCodigoAndEstado/' + identificacion + '/' + appGenericConstant.ABIERTA;
    //            return ejecutarServicesGet(urlRequest);
    //        }

    function getEstudianteByCodigoAndEstado(identificacion) {
      var urlRequest =
        url + "/EstadoFinanciero/byCodigoAndEstado/" + identificacion;
      return ejecutarServicesGet(urlRequest);
    }
  }
})();
