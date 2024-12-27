(function () {
  "use strict";
  angular.module("mytodoApp.service").service("loginService", loginService);

  loginService.$inject = ["$http", "$q"];
  function loginService($http, $q) {
    var loginServicio = this;
    loginServicio.usuario = {};
    loginServicio.visible = {};
    loginServicio.usuarioSesion = {};
    loginServicio.visible.estadologin = true;
    loginServicio.visible.estadoindex = false;
    loginServicio.login = postLogin;
    loginServicio.accesoAutorzacion = postAccesoAutorzacion;
    loginServicio.accesoAutorzacionCaja = postAccesoAutorzacionaCaja;
    loginServicio.updateCredencial = postUpdateCredencial;
    loginServicio.getFuncionario = getFuncionario;
    loginServicio.getFoto = getFoto;
    loginServicio.recuperarContrasena = recuperarContrasena;
    loginServicio.getEstudiante = getEstudiante;
    var url = "/api/auth/login";

    function ejecutarServicePost(urlrequest, rs) {
      var defered = $q.defer();
      $http
        .post(urlrequest, rs)
        .success(function (response) {
          defered.resolve(response);
        })
        .error(function (error) {
          defered.reject(error);
        });
      return defered.promise;
    }
    function getFuncionario(documento) {
      var urlrequest = "/api/auth/foto/" + documento;
      return ejecutarServiceGet(urlrequest);
    }
    function getEstudiante(documento) {
      var urlrequest = "/api/auth/foto/student/" + documento;
      return ejecutarServiceGet(urlrequest);
    }
    function getFoto(url) {
      var urlrequest = url;
      return ejecutarServiceGet(urlrequest);
    }

    function ejecutarServicePostC(urlrequest, dto) {
      var defered = $q.defer();
      $http
        .put(urlrequest, dto)
        .success(function (response) {
          defered.resolve(response);
        })
        .error(function (error) {
          defered.reject(error);
        });
      return defered.promise;
    }
    function ejecutarServiceGet(urlrequest) {
      var defered = $q.defer();
      $http
        .get(urlrequest)
        .success(function (response) {
          defered.resolve(response);
        })
        .error(function (error) {
          defered.reject(error);
        });
      return defered.promise;
    }

    function postLogin(rs) {
      var urlrequest = url;
      return ejecutarServicePost(urlrequest, rs);
    }
    function recuperarContrasena(rs) {
      var urlrequest = url + "/rememberAccount";
      return ejecutarServicePostC(urlrequest, rs);
    }

    function postUpdateCredencial(dto) {
      var urlrequest = url + "/updateCredencial";
      return ejecutarServicePostC(urlrequest, dto);
    }

    function postAccesoAutorzacion(rs) {
      var urlrequest = url + "/acceso";
      return ejecutarServicePost(urlrequest, rs);
    }

    function postAccesoAutorzacionaCaja(rs) {
      var urlrequest = url + "/accesoCaja";
      return ejecutarServicePost(urlrequest, rs);
    }

    /* Carga de Módulos en el menú */

    function consultarModulos(rs) {
      var urlrequest = url + "Rol";
      return ejecutarServicePost(urlrequest, rs);
    }
  }
})();
