(function () {
    'use strict';
    angular.module('mytodoApp.service').service('cargaDocenteServices', cargaDocenteServices);
    cargaDocenteServices.$inject = ['$http', '$q', 'appGenericConstant'];

    function cargaDocenteServices($http, $q, appGenericConstant) {
        var servicio = this;
        servicio.buscarDocente = Buscar;
        servicio.agregarDocente = Agregar;
        servicio.eliminarDocente = Eliminar;
        servicio.eliminarDocenteMasivo = EliminarMasivo;
        servicio.consultarPais = getPais;
        servicio.consultarBarrios = getBarrios;
        servicio.consultarDepartamentoPais = getDepartamentoPais;
        servicio.consultarMunicipioPorDepartamento = getMunicipioPorDepartamento;
        servicio.actualizarDocente = Actualizar;
        servicio.cargarListaNivelFormacion = ListaNivelFormacion;
        servicio.cargarListaFacultades = ListaFacultades;
        servicio.buscarMaximoNivel = BuscarMaxNivel;
        servicio.paisDep = buscarPaisDep;
        servicio.descargaHv = onDownloadArchivosHv;
        servicio.docente = {};
        servicio.docenteAux = {};
        servicio.visible = {};
        servicio.visible.validaJornada = false;
        servicio.subirarchivos = onSubirfoto;
        servicio.subirSoporte = onSubirSoportesAcademico;
        servicio.subirHvDocente = onSubirHojaVida;
        servicio.downloadArchivo = onDownloadSoporte;
        servicio.downloadFoto = onDownloadfoto;
        var url ='/api/docente/';

        function getBarrios(item) {
            var urlrequest = url + 'Barrio/byMunicipio/' + item.id;
            return ejecutarServiceGet(urlrequest);
        }

        function getPais() {
            var urlrequest = url + 'Pais';
            return ejecutarServiceGet(urlrequest);
        }

        function getDepartamentoPais(item) {
            var urlrequest = url + 'Departamento/pais/' + item.id;
            return ejecutarServiceGet(urlrequest);
        }

        function getMunicipioPorDepartamento(item) {
            var urlrequest = url + 'Municipio/departamento/' + item.id;
            return ejecutarServiceGet(urlrequest);
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

        function buscarPaisDep(id) {
            var urlrequest = url + 'Barrio/byMunicipio/' + id;
            return ejecutarServiceGet(urlrequest);
        }

        function Buscar() {
            var defered = $q.defer();
            var urlRequest = url + 'Docente';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function BuscarMaxNivel() {
            var defered = $q.defer();
            var urlRequest = url + 'Universidad/all';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ListaNivelFormacion() {
            var defered = $q.defer();
            var urlRequest = url + 'NivelFormacion';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function ListaFacultades() {
            var defered = $q.defer();
            var urlRequest = url + 'Facultad';
            $http.get(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }


        function Agregar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'Docente';
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        function Eliminar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'Docente/' + rs;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function Actualizar(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'Docente';
            $http.put(urlRequest, rs
            ).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }

        function EliminarMasivo(rs) {
            var defered = $q.defer();
            var urlRequest = url + 'Docente/masivo/' + rs;
            $http.delete(urlRequest).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }


        function onSubirfoto() {
            var urlRequest = url + 'fileupload/subir';
            return urlRequest;
        }

        function onSubirSoportesAcademico() {
            var urlRequest = url + 'fileupload/soporteAcademico';
            return urlRequest;
        }
        function onSubirHojaVida() {
            var urlRequest = url + 'fileupload/hvDocente';
            return urlRequest;
        }

        function onDownloadSoporte(file) {
            var urlRequest = url + 'Download/downloadSoporte/' + file;
            return urlRequest;
        }

        function onDownloadArchivosHv(file) {
            var urlRequest = url + 'Download/downloadHv/' + file;
            return urlRequest;
        }
        function onDownloadfoto(file) {
            var urlRequest = url + 'fileupload/download/' + file;
            return urlRequest;
        }

    }
})();








