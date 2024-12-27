(function () {
  "use strict";

  angular.module("mytodoApp").controller("loginCtrl", loginCtrl);
  loginCtrl.$inject = [
    "$scope",
    "$http",
    "loginService",
    "turnoService",
    "localStorageService",
    "ValidationService",
    "$location",
    "$timeout",
    "appConstant",
    "appGenericConstant",
    "vcRecaptchaService",
    "Fullscreen",
    "Idle",
    "ubicacionServices",
    "utilServices",
    "$interval",
  ];
  function loginCtrl(
    $scope,
    $http,
    loginService,
    turnoService,
    localStorageService,
    ValidationService,
    $location,
    $timeout,
    appConstant,
    appGenericConstant,
    vcRecaptchaService,
    Fullscreen,
    Idle,
    ubicacionServices,
    utilServices,
    $interval
  ) {
    var sesionCtrl = this;
    sesionCtrl.intentos = 0;
    sesionCtrl.usuario = loginService.usuario;
    sesionCtrl.visible = loginService.visible;
    sesionCtrl.visible.disabled = false;
    sesionCtrl.usuarioSesion = loginService.usuarioSesion;
    sesionCtrl.modulos = [];
    sesionCtrl.ayudas = [];
    sesionCtrl.atajos = [];
    sesionCtrl.validacion = false;
    sesionCtrl.validarpasswordAcutal = false;
    sesionCtrl.statusModalTurno = false;
    sesionCtrl.categoriaSolucion = null;
    sesionCtrl.foto = null;
    sesionCtrl.listadoCatRecepcion = appConstant.CATEGORIAS_RECEPCION_TURNOS;
    sesionCtrl.listadoCatAdmisiones = appConstant.CATEGORIAS_ADMISIONES_TURNOS;
    sesionCtrl.listadoCatCartera = appConstant.CATEGORIAS_CARTERA_TURNOS;
    sesionCtrl.listadoCatPracticas = appConstant.CATEGORIAS_PRACTICA_TURNOS;
    sesionCtrl.listadoCatCarnets = appConstant.CATEGORIAS_CARNET_TURNOS;
    sesionCtrl.timestamp = new Date().getTime();

    if (localStorageService.get("visible") !== null) {
      sesionCtrl.visible = localStorageService.get("visible");
    }
    if (localStorageService.get("modulo") !== null) {
      sesionCtrl.modulos = localStorageService.get("modulo");
    }
    if (localStorageService.get("ayudas") !== null) {
      sesionCtrl.ayudas = localStorageService.get("ayudas");
    }
    if (localStorageService.get("atajos") !== null) {
      sesionCtrl.atajos = localStorageService.get("atajos");
    }
    if (localStorageService.get("usuario") !== null) {
      sesionCtrl.usuarioSesion = localStorageService.get("usuario");
    } else {
      onReiniciar();
    }
    if (localStorageService.get("autorizacion") !== null) {
      $http.defaults.headers.common.Authorization =
        localStorageService.get("autorizacion").token;
      $http.defaults.headers.common.Campus =
        localStorageService.get("autorizacion").objectResponse.idUniversidad;
      sesionCtrl.foto = null;
      var documneto = localStorageService.get("usuario").identificacion;
      if (sesionCtrl.usuarioSesion.rol.codigo !== "ESTUDIANTE") {
        loginService.getFuncionario(documneto).then(function (data) {
          sesionCtrl.foto = data.idFoto;
        });
      } else {
        loginService.getEstudiante(documneto).then(function (data) {
          sesionCtrl.foto = data.idFoto;
        });
      }
    }

    //        $(window).bind('storage', function (e) {
    //            sesionCtrl.cerrarSesion();
    //            location.reload();
    //        });

    sesionCtrl.onPresionarEnter = function (tecla) {
      if (tecla.keyCode === appGenericConstant.ENTER) {
        sesionCtrl.validarAutenticacion();
      }
    };

    $(document).ready(function () {
      try {
        if (sesionCtrl.usuarioSesion.rol.nombre === "INSCRIPCION") {
          $("#dashnav-btn").remove();
        }
      } catch (e) {
        return;
      }

      $(window).resize(function () {
        if ($(window).width() >= 882) {
          $("#page-sidebar").attr("aria-expanded", false);
          $("#nav-toggle").attr("aria-expanded", false);
          $("#page-sidebar").removeClass("collapse").addClass("collapsed");
          $("#nav-toggle").addClass("collapsed");
        }
      });
    });
    sesionCtrl.setWidgetId = function (id) {
      sesionCtrl.widgetId = id;
    };
    sesionCtrl.recuperarContrasena = function () {
      var texto; // Declarar la variable texto
      var userFound; // Declarar la variable texto

      swal({
        title: "Ingrese usuario",
        type: "warning",
        input: "text",
        inputAttributes: {
          maxlength: 20, // Límite máximo de caracteres
          style: "width: 50%", // Tamaño del input
        },
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Recuperar",
        cancelButtonText: "Cancelar",
        inputValidator: function (value) {
          return new Promise(function (resolve, reject) {
            if (value) {
              texto = value;
              resolve();
              var usuario = {
                userName: texto,
              };
              loginService.recuperarContrasena(usuario).then(function (data) {
                if (data.tipo === 409) {
                  swal("Usuario no encontrado");
                }
              });
            } else {
              reject("El usuario no puede estar vacio");
            }
          });
        },
      }).then(function () {
        swal(
          "Contraseña restablecida, por favor revisa la bandeja de entrada de tu correo electrónico"
        );
      });
    };

    sesionCtrl.validarAutenticacion = function () {
      if (
        !new ValidationService().checkFormValidity($scope.$$childTail.formlogin)
      ) {
        return;
      }
      appConstant.MSG_LOADING(appGenericConstant.INICIANDO_SESION);
      appConstant.CARGANDO();
      var usuario = {
        userName: null,
        email: sesionCtrl.usuario.user,
        password: btoa(validarPassw(sesionCtrl.usuario.password)),
      };
      loginService
        .login(usuario)
        .then(function (data) {
          if (data.tipo === 200) {
            sesionCtrl.intentos = 0;
            appConstant.CERRAR_SWAL();
            Idle.watch();
            sesionCtrl.getIP();
            sesionCtrl.usuarioSesion = data.objectResponse.userDto;
            const ROL_DIGI_TURN = "DIGITURNO PANTALLA";
            let isDigiTurnRole = false;

            sesionCtrl.usuarioSesion.resources = data.objectResponse.resources;
            //angular.forEach(data.objectResponse.resources, function (value, key) {
            //    sesionCtrl.usuarioSesion.resources = value;
            //});
            sesionCtrl.usuarioSesion.accessCode =
              data.objectResponse.accessCode;
            angular.forEach(
              data.objectResponse.lstRolDto,
              function (value, key) {
                isDigiTurnRole = value.nombre === ROL_DIGI_TURN;
                if (value.porDefecto !== null) {
                  sesionCtrl.usuarioSesion.rol = value;
                }
              }
            );
            sesionCtrl.modulos = JSON.parse(
              sesionCtrl.usuarioSesion.rol.modulos
            );
            sesionCtrl.ayudas = JSON.parse(sesionCtrl.usuarioSesion.rol.ayudas);
            sesionCtrl.atajos = JSON.parse(sesionCtrl.usuarioSesion.rol.atajos);
            var ok = false;
            for (var i = 0; i < sesionCtrl.ayudas.length; i++) {
              if (sesionCtrl.ayudas[i].selected === true) {
                ok = true;
              }
            }
            var ok1 = false;
            for (var i = 0; i < sesionCtrl.atajos.length; i++) {
              if (sesionCtrl.atajos[i].selected === true) {
                ok1 = true;
              }
            }
            if (isDigiTurnRole) {
              localStorageService.set("isDigiTurn", true);
            }
            if (ok === true) {
              localStorageService.set("ayudas", sesionCtrl.ayudas);
            } else {
              sesionCtrl.ayudas = [];
              localStorageService.set("ayudas", sesionCtrl.ayudas);
            }
            if (ok1 === true) {
              localStorageService.set("atajos", sesionCtrl.atajos);
            } else {
              sesionCtrl.atajos = [];
              localStorageService.set("atajos", sesionCtrl.atajos);
            }

            sesionCtrl.visible.estadologin = false;
            sesionCtrl.visible.estadoindex = true;
            localStorageService.set("autorizacion", data);
            localStorageService.set("visible", sesionCtrl.visible);
            localStorageService.set("usuario", sesionCtrl.usuarioSesion);
            localStorageService.set("modulo", sesionCtrl.modulos);

            utilServices.buscarListaValor().then(function (data) {
              localStorageService.set("listaValor", data);
            });

            $http.defaults.headers.common.Authorization =
              localStorageService.get("autorizacion").token;
            $http.defaults.headers.common.Campus =
              localStorageService.get(
                "autorizacion"
              ).objectResponse.idUniversidad;
            sesionCtrl.foto = null;
            var documneto = localStorageService.get("usuario").identificacion;
            if (sesionCtrl.usuarioSesion.rol.codigo !== "ESTUDIANTE") {
              loginService.getFuncionario(documneto).then(function (data) {
                sesionCtrl.foto = data.idFoto;
              });
            } else {
              loginService.getEstudiante(documneto).then(function (info) {
                sesionCtrl.foto = info.idFoto;
              });
            }
            $location.path(
              sesionCtrl.usuarioSesion.rol.codigo === "ESTUDIANTE"
                ? "/profile"
                : "/"
            );

            turnoService
              .turnoUsuarioUbicacionS(sesionCtrl.usuarioSesion.id)
              .then(function (data) {
                localStorageService.set("turno", data);
              });

            angular
              .element("body > div.fixed-sidebar.fixed-header")
              .css("background", "#FFFFFF");
            angular
              .element("body > div.fixed-sidebar.fixed-header")
              .css("height", "auto");
            $("body").removeClass("closed-sidebar");
            $(".glyph-icon", this)
              .removeClass("icon-angle-right")
              .addClass("icon-angle-left");

            $timeout(function () {
              if (sesionCtrl.usuarioSesion.rol.nombre === "INSCRIPCION") {
                $("#dashnav-btn").remove();
              }
              angular.element("body").removeClass("pt-page-scaleUpCenter-init");
            }, 300);
          } else if (data.tipo === 401) {
            swal({
              title: appGenericConstant.USUARIO_NO_AUTORIZADO,
              html: data.message,
              type: "error",
              showCancelButton: false,
              confirmButtonText: appGenericConstant.ACEPTAR,
              allowOutsideClick: false,
            });
          } else if (data.tipo === 409) {
            sesionCtrl.usuario.password = null;
            new ValidationService().resetForm($scope.$$childTail.formlogin);
            sesionCtrl.intentos = sesionCtrl.intentos + 1;
            var restantes = 3 - sesionCtrl.intentos;
            switch (restantes) {
              case 2:
                swal({
                  title: appGenericConstant.USUARIO_CONTRASENA_INCORRECTA,
                  html: "Aún tienes " + restantes + " intentos.",
                  type: appGenericConstant.WARNING,
                  showCancelButton: false,
                  confirmButtonText: appGenericConstant.ACEPTAR,
                  allowOutsideClick: false,
                });
                break;
              case 1:
                swal({
                  title: appGenericConstant.USUARIO_CONTRASENA_INCORRECTA,
                  html: appGenericConstant.AUN_UN_INTENTO,
                  type: appGenericConstant.WARNING,
                  showCancelButton: false,
                  confirmButtonText: appGenericConstant.ACEPTAR,
                  allowOutsideClick: false,
                });
                break;
              case 0:
                appConstant.CERRAR_SWAL();
                sesionCtrl.intentos = 0;
                sesionCtrl.visible.disabled = true;
                break;
            }
          }
        })
        .catch(function (e) {
          appConstant.CERRAR_SWAL();
          swal({
            title: appGenericConstant.HUBO_PROBLEMA,
            text: appGenericConstant.ERROR_INTERNO_SISTEMA,
            type: "error",
            showCancelButton: false,
            confirmButtonText: appGenericConstant.ACEPTAR,
            allowOutsideClick: false,
          });
          return;
        });
    };
    sesionCtrl.verifyCallback = function (response) {
      sesionCtrl.visible.disabled = false;
      sesionCtrl.onExpirado();
    };
    sesionCtrl.onExpirado = function () {
      vcRecaptchaService.reload();
    };
    sesionCtrl.onReset = function () {
      sesionCtrl.atributo = null;
      sesionCtrl.atributo1 = null;
      sesionCtrl.atributo2 = null;
      sesionCtrl.validarpasswordAcutal = false;
      sesionCtrl.validarPass = false;
      sesionCtrl.validacion = false;
    };

    sesionCtrl.comparar = function () {
      if (
        sesionCtrl.atributo === undefined ||
        sesionCtrl.atributo === "" ||
        sesionCtrl.atributo === null
      ) {
        sesionCtrl.validarpasswordAcutal = true;
        return;
      }
      sesionCtrl.validarpasswordAcutal = false;
      if (
        sesionCtrl.atributo1 === undefined ||
        sesionCtrl.atributo1 === "" ||
        sesionCtrl.atributo1 === null
      ) {
        sesionCtrl.validarPass = true;
        return;
      }

      if (
        sesionCtrl.validarPass !== true &&
        sesionCtrl.validarPass !== undefined
      ) {
        if (sesionCtrl.atributo1 === sesionCtrl.atributo2) {
          appConstant.MSG_LOADING(appGenericConstant.CAMBIANDO_CONTRASENA);
          appConstant.CARGANDO();
          sesionCtrl.validacion = false;
          var dto = {
            id: sesionCtrl.usuarioSesion.id,
            contrasenaActual: btoa(validarPassw(sesionCtrl.atributo)),
            contrasenaNueva: btoa(validarPassw(sesionCtrl.atributo1)),
          };
          loginService
            .updateCredencial(dto)
            .then(function (data) {
              if (data.tipo === 200) {
                swal({
                  title: appGenericConstant.BIEN_HECHO,
                  html: data.message,
                  type: appGenericConstant.SUCCESS,
                  showCancelButton: false,
                  confirmButtonText: appGenericConstant.ACEPTAR,
                  allowOutsideClick: false,
                });
                sesionCtrl.onReset();
                $("#CambPass").modal("hide");
              } else if (data.tipo === 403) {
                swal({
                  title: appGenericConstant.OOPS,
                  html: data.message,
                  type: "error",
                  showCancelButton: false,
                  confirmButtonText: appGenericConstant.ACEPTAR,
                  allowOutsideClick: false,
                });
                sesionCtrl.onReset();
              } else if (data.tipo === 401 || data.tipo === 402) {
                swal({
                  title: appGenericConstant.ALTO_AHI,
                  html: data.message,
                  type: "error",
                  showCancelButton: false,
                  confirmButtonText: appGenericConstant.ACEPTAR,
                  allowOutsideClick: false,
                });
                sesionCtrl.onReset();
              }
            })
            .catch(function (e) {
              return;
            });
        } else {
          sesionCtrl.validacion = true;
          appConstant.CERRAR_SWAL();
        }
      }
    };

    sesionCtrl.validarLongitud = function () {
      if (sesionCtrl.atributo1 !== null) {
        if (typeof sesionCtrl.atributo1 === "undefined") {
          sesionCtrl.validarPass = true;
        } else if (
          sesionCtrl.atributo1.length > appGenericConstant.SIETE &&
          sesionCtrl.atributo1.length < appGenericConstant.VEINTIUNO
        ) {
          sesionCtrl.validarPass = false;
        } else if (sesionCtrl.atributo1.length === appGenericConstant.CERO) {
          sesionCtrl.validarPass = true;
        } else {
          sesionCtrl.validarPass = true;
        }
      }
    };

    sesionCtrl.accesoModulo = function (item, event) {
      if (event.type === "click") {
        $("#nav-toggle").attr("aria-expanded", "false");
        $("#nav-toggle").addClass("collapsed");
        $("#page-sidebar").attr("aria-expanded", "false");
        $("#page-sidebar").removeClass("collapse in");
        $("#page-sidebar").addClass("collapse");
        $("#page-sidebar").css("height", "0px");
      }
      var acceso = {
        token: localStorageService.get("autorizacion").token,
        usuarioDto: localStorageService.get("autorizacion").objectResponse,
        modulo: item,
      };
      loginService
        .accesoAutorzacion(acceso)
        .then(function (data) {
          if (data.tipo !== 200) {
            $location.path("/error-autorizacion");
            return;
          }
        })
        .catch(function (e) {
          return;
        });
    };

    sesionCtrl.cerrarSesion = function () {
      $location.path("/");
      sesionCtrl.usuario.user = "";
      sesionCtrl.usuario.password = "";
      localStorageService.clearAll();
      sesionCtrl.visible.estadologin = true;
      sesionCtrl.visible.estadoindex = false;
      angular.element("#page-header").addClass("hidden");
      angular.element("#page-sidebar").addClass("hidden");
      angular.element("#page-content").addClass("hidden");
      angular
        .element("body > div.fixed-sidebar.fixed-header")
        .css("height", $(window).height());
      angular
        .element("body > div.fixed-sidebar.fixed-header")
        .css("background", "#0096D4");
      angular
        .element("body > div.fixed-sidebar.fixed-header")
        .css(
          "background-image",
          "url('styles/assets/images/background/Fondo-Login-Yinn.jpg')"
        );
    };

    function onReiniciar() {
      $location.path("/");
      angular.element("#page-header").addClass("hidden");
      angular.element("#page-sidebar").addClass("hidden");
      angular.element("#page-content").addClass("hidden");
      angular
        .element("body > div.fixed-sidebar.fixed-header")
        .css("height", $(window).height());
      angular
        .element("body > div.fixed-sidebar.fixed-header")
        .css("background", "#0096D4");
      angular
        .element("body > div.fixed-sidebar.fixed-header")
        .css(
          "background-image",
          "url('styles/assets/images/background/Fondo-Login-Yinn.jpg')"
        );
    }

    sesionCtrl.goFullscreen = function () {
      if (Fullscreen.isEnabled()) Fullscreen.cancel();
      else Fullscreen.all();
    };

    function validarPassw(pass) {
      return onStringCambiar(onCambiarString(pass));
    }
    function onCambiarString(valor) {
      var letras = valor.split("");
      var value = letras.reverse();
      return cadena(btoa(value));
    }
    function cadena(valor) {
      var text = "";
      var caracteres = appGenericConstant.CARACTERES;
      for (var i = 0; i < 10; i++) {
        text += caracteres.charAt(
          Math.floor(Math.random() * caracteres.length)
        );
      }
      return cadena2(text.concat(valor));
    }
    function cadena2(valor) {
      var text2 = "";
      var caracteres = appGenericConstant.CARACTERES;
      for (var i = 0; i < 12; i++) {
        text2 += caracteres.charAt(
          Math.floor(Math.random() * caracteres.length)
        );
      }
      return btoa(valor.concat(text2));
    }
    function onStringCambiar(valor) {
      var value = "";
      for (var i = 0; i < valor.length; i++) {
        value += "*";
      }
      var cadena = valor.concat("###").concat(value);
      var text = "";
      var caracteres = appGenericConstant.CARACTERES;
      for (var i = 0; i < cadena.length; i++) {
        text += caracteres.charAt(
          Math.floor(Math.random() * caracteres.length)
        );
      }
      var final = cadena.concat(text);
      return btoa(final);
    }

    $scope.$on("IdleTimeout", function () {
      const isDigiTurn = localStorageService.get("isDigiTurn");
      if (!isDigiTurn) {
        localStorageService.clearAll();
        $scope.timedout = swal({
          title: appGenericConstant.SESION_EXPIRADA,
          text: appGenericConstant.INACTIVIDAD,
          type: appGenericConstant.QUESTION,
          showCancelButton: false,
          confirmButtonText: appGenericConstant.ACEPTAR,
          allowOutsideClick: false,
          allowEscapeKey: false,
        }).then(function () {
          sesionCtrl.cerrarSesion();
          location.reload();
        });
      }
    });

    sesionCtrl.getIP = function () {
      ubicacionServices.resolve().then(function (data) {
        sesionCtrl.miIP = data;
      });
      $timeout(function () {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function (position) {
            sesionCtrl.latitud = position.coords.latitude;
            sesionCtrl.longitud = position.coords.longitude;
          });
        }
      });
    };

    //TURNO
    function onCheckLocalStorage() {
      var valid = false;
      if (localStorageService.get("turno") !== null) {
        sesionCtrl.usuarioTurno = localStorageService.get("turno")[0];
        sesionCtrl.usuarioTurno.numeroModuloText =
          sesionCtrl.usuarioTurno.numeroModulo;
        valid = true;
      }
      return valid;
    }

    sesionCtrl.onCambiarEstadoTurno = function (item, estado) {
      if (!onCheckLocalStorage()) {
        onShowSwalDenied();
        return;
      }

      if (
        sesionCtrl.usuarioTurno.numeroModuloText !== null &&
        sesionCtrl.usuarioTurno.numeroModuloText !== undefined &&
        sesionCtrl.usuarioTurno.numeroModuloText !== ""
      ) {
        sesionCtrl.usuarioTurno.numeroModulo =
          sesionCtrl.usuarioTurno.numeroModuloText;
      } else {
        sesionCtrl.usuarioTurno.numeroModuloText =
          sesionCtrl.usuarioTurno.numeroModulo;
      }

      if (estado === "EN_ATENCION") {
        sesionCtrl.list = [];
        sesionCtrl.list = jQuery.map(
          sesionCtrl.listEstudianteLLamado,
          function (obj) {
            if (obj.usuarioAtencion === sesionCtrl.usuarioSesion.username) {
              return obj;
            }
          }
        );

        if (sesionCtrl.list.length > 0) {
          appConstant.MSG_GROWL_ADVERTENCIA("Aún está atendiendo un turno.");
          return;
        }
      }

      item.activo = estado;
      item.modulo = sesionCtrl.usuarioTurno.numeroModulo;
      item.usuarioAtencion = sesionCtrl.usuarioSesion.username;
      if (
        sesionCtrl.categoriaSolucion !== null &&
        sesionCtrl.categoriaSolucion !== undefined &&
        sesionCtrl.categoriaSolucion !== ""
      ) {
        item.categoria = sesionCtrl.categoriaSolucion.value;
      } else {
        item.categoria = null;
      }

      turnoService
        .postTurno(item)
        .then(function (data) {
          sesionCtrl.onConsultarListadoTurnosActivo();
          //                $("#ConsultarTurno").modal("hide");
        })
        .catch(function (e) {
          appConstant.MSG_GROWL_ERROR();
          return;
        });
    };

    function onShowSwalDenied() {
      swal({
        title: appGenericConstant.HUBO_PROBLEMA,
        text: "NO TIENE PERMISOS PARA GESTIONAR TURNOS",
        type: "error",
        showCancelButton: false,
        confirmButtonText: appGenericConstant.ACEPTAR,
        allowOutsideClick: false,
      });
    }

    sesionCtrl.onConsultarListadoTurnosActivo = function () {
      if (!onCheckLocalStorage()) {
        onShowSwalDenied();
        return;
      }

      var activo = "ESPERANDO";
      turnoService
        .turnoByUbicacionAndActivo(sesionCtrl.usuarioTurno.ubicacion, activo)
        .then(function (data) {
          sesionCtrl.listTurnosPorAtender = data;
          $("#ConsultarTurno").modal({ backdrop: "static", keyboard: false });
          $("#ConsultarTurno").modal("show");
          sesionCtrl.statusModalTurno = true;
        })
        .catch(function (e) {
          appConstant.MSG_GROWL_ERROR();
          return;
        });

      var activo = "EN_ATENCION";
      sesionCtrl.listEstudianteLLamado = [];
      turnoService
        .turnoByActivo(activo)
        .then(function (data) {
          sesionCtrl.listResult = [];
          sesionCtrl.listResult = jQuery.map(data, function (obj) {
            if (obj.usuarioAtencion === sesionCtrl.usuarioSesion.username) {
              return obj;
            }
          });

          sesionCtrl.listEstudianteLLamado = sesionCtrl.listResult;
        })
        .catch(function (e) {
          appConstant.MSG_GROWL_ERROR();
          return;
        });
    };

    sesionCtrl.onCloseModal = function () {
      sesionCtrl.statusModalTurno = false;
      sesionCtrl.categoriaSolucion = null;
      $("#ConsultarTurno").modal("hide");
    };

    sesionCtrl.counterPopup = 0;
    var refreshGraficasPopup = function counterPopup() {
      if (sesionCtrl.statusModalTurno) {
        sesionCtrl.counterPopup = sesionCtrl.counterPopup + 1;
        if (sesionCtrl.counterPopup === 5) {
          sesionCtrl.onConsultarListadoTurnosActivo();
          sesionCtrl.counterPopup = 0;
        }
      }
    };

    var promisePopUp = $interval(refreshGraficasPopup, 5000);
    localStorageService.set("intervalPantallaPopup", promisePopUp);

    sesionCtrl.onChangeCategoria = function () {};
  }
})();
