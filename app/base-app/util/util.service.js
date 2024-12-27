(function () {
    'use strict';
    angular.module('mytodoApp.service').service('utilServices', utilServices);
    utilServices.$inject = ['$http', '$q', 'localStorageService'];
    function utilServices($http, $q, localStorageService) {
        var utilService = this;
        var url = '';
        utilService.buscarListaValorByCategoria = getListaValorByCategoria;
        utilService.buscarListaValor = getListaValor;
        utilService.downloadArchivo = onDownloadArchivos;
        utilService.downloadReporte = onDownloadReport;
        utilService.getSedes = getSedes;
        utilService.getSeccional = getSeccional;
        utilService.getCursos = getCursos;
        utilService.getListaValorByCategoriaSede = getListaValorByCategoriaSede;

        function ejecutarservice(urlRequest) {
            var deferred = $q.defer();
            $http.get(urlRequest, {
                headers: {
                    Authorization: localStorageService.get('autorizacion').token,
                    Campus: localStorageService.get('autorizacion').objectResponse.idUniversidad
                }
            }).success(function (response) {
                deferred.resolve(response);
            }).error(function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        function getListaValor() {
            var urlRequest = url + 'api/listavalor/ListaValor';
            return ejecutarservice(urlRequest);
        }
        function getSedes() {
            var urlRequest = url + '/api/admisiones/Universidad/all';
            return ejecutarservice(urlRequest);
        }

        function getSeccional() {
            var urlrequest = '/api/admisiones/Seccional';
            return ejecutarservice(urlrequest);
        }

        function getCursos (sede, periodo) {
            let urlRequest = `/api/admisiones/Programa/nivelformProgramabyPlaneacionSede/${sede}/${periodo}`;
            return ejecutarservice(urlRequest);
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
                var urlRequest = url + '/api/' + microservicio + '/ListaValor/' + categoria;
                return ejecutarservice(urlRequest);
            }
        }

      function getListaValorByCategoriaSede(categoria, microservicio) {

          var urlRequest = url + '/api/' + microservicio + '/ListaValor/' + categoria;
          return ejecutarservice(urlRequest);

      }

        function onDownloadArchivos(file, microservicio) {
            var urlRequest = url + '/api/' + microservicio + '/report/' + file;
            return urlRequest;
        }

        function onDownloadReport(urlRequest, itemArc) {
            $http({
                method: 'GET',
                url: urlRequest,
                header: {
                    Authorization: localStorageService.get('autorizacion').token,
                    Campus: localStorageService.get('autorizacion').objectResponse.idUniversidad,
                    responseType: 'arraybuffer'
                }
            }).success(function (data, status, headers) {
                headers = headers();
                var filename = itemArc + '.pdf';
                var contentType = headers['content-type'];
                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([data], {type: contentType});
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);
                    var clickEvent = new MouseEvent("click", {
                        view: window,
                        bubbles: true,
                        cancelable: false
                    });
                    linkElement.dispatchEvent(clickEvent);
                } catch (ex) {
                }
            }).error(function (data) {
            });
        }

        function ejecutarServiceGet(urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest, {
                headers: {
                    Authorization: localStorageService.get('autorizacion').token,
                    Campus: localStorageService.get('autorizacion').objectResponse.idUniversidad
                }
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ejecutarServicePost(urlRequest, rs) {
            var defered = $q.defer();
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ejecutarServicePut(urlRequest, rs) {
            var defered = $q.defer();
            $http.put(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ejecutarServiceDelete(urlRequest, rs) {
            var defered = $q.defer();
            $http.delete(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        this.EJECUTAR_SERVICE_GET = function (urlRequest) {
            return ejecutarServiceGet(urlRequest);
        };

        this.EJECUTAR_SERVICE_POST = function (urlRequest, rs) {
            return ejecutarServicePost(urlRequest, rs);
        };

        this.EJECUTAR_SERVICE_PUT = function (urlRequest, rs) {
            return ejecutarServicePut(urlRequest, rs);
        };

        this.EJECUTAR_SERVICE_DELETE = function (urlRequest, rs) {
            return ejecutarServiceDelete(urlRequest, rs);
        };
    }
})();


