(function () {
  "use strict";
  angular
    .module("mytodoApp")
    .controller("TurnoPantallaCtrl", TurnoPantallaCtrl);

  TurnoPantallaCtrl.$inject = [
    "turnoService",
    "appConstant",
    "localStorageService",
    "$interval",
    "appGenericConstant",
  ];
  function TurnoPantallaCtrl(
    turnoService,
    appConstant,
    localStorageService,
    $interval,
    appGenericConstant
  ) {
    var gestionTurno = this;
    gestionTurno.turno = { nombre: "" };
    gestionTurno.disabledCampos = true;
    gestionTurno.showUbicacionTurno = false;

    gestionTurno.onChangeNombre = function () {
      gestionTurno.showUbicacionTurno = gestionTurno.turno.nombre !== "";
    };

    gestionTurno.onCambiarEstadoTurno = function (item, estado) {
      if (
        gestionTurno.usuarioTurno.numeroModuloText !== null &&
        gestionTurno.usuarioTurno.numeroModuloText !== undefined &&
        gestionTurno.usuarioTurno.numeroModuloText !== ""
      ) {
        gestionTurno.usuarioTurno.numeroModulo =
          gestionTurno.usuarioTurno.numeroModuloText;
      } else {
        gestionTurno.usuarioTurno.numeroModuloText =
          gestionTurno.usuarioTurno.numeroModulo;
      }

      item.activo = estado;
      item.modulo = gestionTurno.usuarioTurno.numeroModulo;
      item.usuarioAtencion = gestionTurno.usuario.username;
      turnoService
        .postTurno(item)
        .then(function (data) {})
        .catch(function (e) {
          appConstant.MSG_GROWL_ERROR();
          return;
        });
    };

    gestionTurno.listTurnosPorAtender = [];
    gestionTurno.onConsultarListadoTurnosActivo = function () {
      if (!onCheckLocalStorage()) {
        swal({
          title: appGenericConstant.HUBO_PROBLEMA,
          text: "NO TIENE PERMISOS PARA GESTIONAR TURNOS",
          type: "error",
          showCancelButton: false,
          confirmButtonText: appGenericConstant.ACEPTAR,
          allowOutsideClick: false,
        });
        return;
      }

      var activo = "ESPERANDO";
      turnoService
        .turnoByUbicacionAndActivo(gestionTurno.usuarioTurno.ubicacion, activo)
        .then(function (data) {
          gestionTurno.listTurnosPorAtender = data;
          $("#ConsultarTurno").modal({ backdrop: "static", keyboard: false });
          $("#ConsultarTurno").modal("show");
        })
        .catch(function (e) {
          appConstant.MSG_GROWL_ERROR();
          return;
        });
    };

    gestionTurno.quantityOfTurn = 1000000;
    gestionTurno.listEstudianteLLamado = [];
    gestionTurno.listEstudianteLLamadoAux = [];
    gestionTurno.startSound = function () {
      const audioTag = document.getElementById("sound");
      audioTag.click();
      audioTag.play();
    };
    gestionTurno.onConsultarListadoTurnosPantalla = function () {
      var activo = "EN_ATENCION";
      turnoService
        .turnoByActivo(activo)
        .then(function (data) {
          const quantityOfRows = data.length;
          gestionTurno.listEstudianteLLamado = data;

          if (quantityOfRows > gestionTurno.quantityOfTurn)
            gestionTurno.startSound();

          gestionTurno.quantityOfTurn = quantityOfRows;
          gestionTurno.listEstudianteLLamadoAux = data;
          appConstant.CERRAR_SWAL();
        })
        .catch(function (e) {
          appConstant.MSG_GROWL_ERROR();
          return;
        });
    };

    gestionTurno.counter = 0;
    var refreshGraficas = function counter() {
      gestionTurno.counter = gestionTurno.counter + 1;
      if (gestionTurno.counter === 5) {
        gestionTurno.onConsultarListadoTurnosPantalla();
        gestionTurno.counter = 0;
      }
    };
    var promise = $interval(refreshGraficas, 1000);
    localStorageService.set("intervalPantalla", promise);
    //        gestionTurno.onConsultarListadoTurnosActivo();
  }
})();
