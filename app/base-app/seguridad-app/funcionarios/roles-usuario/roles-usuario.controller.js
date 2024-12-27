(function () {
    'use strict';
    angular.module('mytodoApp').controller('UsuarioRolCtrller', UsuarioRolCtrller);
    UsuarioRolCtrller.$inject = ['$scope', 'usuarioRolesService', 'appConstant', '$location', 'ValidationService', 'localStorageService', 'utilServices', 'appGenericConstant'];
    function UsuarioRolCtrller($scope, usuarioRolesService, appConstant, $location, ValidationService, localStorageService, utilServices, appGenericConstant) {
        var gestionUsuarioRol = this;
        gestionUsuarioRol.Rol = [];
        gestionUsuarioRol.RolesActivos = [];
        gestionUsuarioRol.usuarioRol = [];
        gestionUsuarioRol.usuarioRolEntity = usuarioRolesService.rol;
        gestionUsuarioRol.usaurioRolAuxiliar = usuarioRolesService.rolAuxiliar;
        gestionUsuarioRol.config = { globalTimeToLive: 3000, disableCountDown: true };
        gestionUsuarioRol.options = appConstant.FILTRO_TABLAS;
        gestionUsuarioRol.report = {
            selected: null
        };

        if (localStorageService.get('usuariorol') !== null) {
            var usuariorol = localStorageService.get('usuariorol');
            gestionUsuarioRol.usuarioRolEntity = usuariorol;
        }

        if (localStorageService.get('usuariorolAuxiliar') !== null) {
            var usuariorolAuxiliar = localStorageService.get('usuariorolAuxiliar');
            gestionUsuarioRol.usaurioRolAuxiliar = usuariorolAuxiliar;
        }

        gestionUsuarioRol.selectedOption = gestionUsuarioRol.options[0];
        function onBuscarUsuarioRoles() {
            usuarioRolesService.buscarUsuarioRoles().then(function (data) {
                gestionUsuarioRol.usuarioRol = data;
            });
        }

        function onBuscarRoles() {
            usuarioRolesService.onBuscarRoles().then(function (data) {
                gestionUsuarioRol.Rol = data;
            });
        }

        function onBuscarRolesActivos() {
            usuarioRolesService.onBuscarRolesActivos().then(function (data) {
                  if (data !== null && data.tipo !== 500) {
                    angular.forEach(data, function (value) {
                        var rol = {
                            id: value.id,
                            nombre: value.nombre,
                            estado: value.estado,
                            codigo: value.codigo,
                            modulos: value.modulos
                        };
                         gestionUsuarioRol.RolesActivos.push(rol);
                    });
                }
            });
        }

        gestionUsuarioRol.onLimpiar = function () {
            usuarioRolesService.rol = {};
            gestionUsuarioRol.usuarioRolEntity.codigoRol = null;
            gestionUsuarioRol.usuarioRolEntity.nombreRol = null;
            localStorageService.remove('usuariorol');
        };
        gestionUsuarioRol.onClickToAddRol = function () {
            gestionUsuarioRol.onLimpiar();
            gestionUsuarioRol.usaurioRolAuxiliar.disableVerDetalle = false;
            gestionUsuarioRol.usaurioRolAuxiliar.disableCodigo = false;
            gestionUsuarioRol.usaurioRolAuxiliar.onDeshabilitarCampoEstado = true;
            gestionUsuarioRol.usaurioRolAuxiliar.titulo = appGenericConstant.ASIGNAR_ROLES_USUARIO;
            localStorageService.set('usuariorol', null);
            localStorageService.set('usuariorolAuxiliar', gestionUsuarioRol.usaurioRolAuxiliar);
        };
        //voy por aqui queda pendiente carga la lista de estados
        function onConsultarListaEstados() {
            utilServices.buscarListaValorByCategoria('ESTADO', 'auth').then(function (data) {
                gestionUsuarioRol.listaEstados = data;
            });
        }
        gestionUsuarioRol.onSubmitForm = function () {
            if (new ValidationService().checkFormValidity($scope.formRegistrarRol)) {
                if (gestionUsuarioRol.usuarioRolEntity.id === null || gestionUsuarioRol.usuarioRolEntity.id === undefined) {
                    gestionUsuarioRol.onRegistrarRol();

                    new ValidationService().resetForm($scope.formRegistrarRol);
                } else {

                    gestionUsuarioRol.onActulizarRol();
                }
            }
        };
        gestionUsuarioRol.onRegistrarRol = function () {
            var newRol = {
                codigo: gestionUsuarioRol.usuarioRolEntity.codigo,
                nombre: gestionUsuarioRol.usuarioRolEntity.nombre.toUpperCase(),
                estado: "ACTIVO"
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO;
            usuarioRolesService.registrarRol(newRol).then(function (data) {
                if (data.tipo === 409) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.EXISTE_CODIGO_INGRESADO);
                } else if (data.tipo === 200) {
                    gestionUsuarioRol.onLimpiar();
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            });

        };
        gestionUsuarioRol.onEdit = function (item) {
            gestionUsuarioRol.usaurioRolAuxiliar.disableVerDetalle = false;
            gestionUsuarioRol.usaurioRolAuxiliar.disableCodigo = true;
            gestionUsuarioRol.usaurioRolAuxiliar.onDeshabilitarCampoEstado = false;
            gestionUsuarioRol.usaurioRolAuxiliar.titulo = appGenericConstant.MODIFICAR_ROLES_USUARIO;
            gestionUsuarioRol.usuarioRolEntity.funcionario = item.funcionario;
            gestionUsuarioRol.usuarioRolEntity.usuario = item.usuario;
            gestionUsuarioRol.usuarioRolEntity.estado = item.estado;
            gestionUsuarioRol.usuarioRolEntity.rol = item.idRol;
            gestionUsuarioRol.usuarioRolEntity.id = item.id;
            gestionUsuarioRol.usuarioRolEntity.idUsuario = item.idUsuario;
            gestionUsuarioRol.usuarioRolEntity.rolPorDefecto = item.rolPorDefecto;
            $location.path('/cud-roles-usuario');
            localStorageService.set('usuariorol', gestionUsuarioRol.usuarioRolEntity);
            localStorageService.set('usuariorolAuxiliar', gestionUsuarioRol.usaurioRolAuxiliar);
        };

        gestionUsuarioRol.onActulizarRol = function () {
            var newRol = {
                funcionario: gestionUsuarioRol.usuarioRolEntity.funcionario,
                usuario: gestionUsuarioRol.usuarioRolEntity.usuario,
                estado: gestionUsuarioRol.usuarioRolEntity.estado,
                idUsuario: gestionUsuarioRol.usuarioRolEntity.idUsuario,
                id: gestionUsuarioRol.usuarioRolEntity.id,
                idRol: gestionUsuarioRol.usuarioRolEntity.rol,
                rolPorDefecto: gestionUsuarioRol.usuarioRolEntity.rolPorDefecto
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_DATOS_ESPERE);
            appConstant.CARGANDO();
            usuarioRolesService.actulizarRol(newRol).then(function (data) {
                if (data.tipo === 200) {
                    appConstant.CERRAR_SWAL();
                    localStorageService.set('rol', gestionUsuarioRol.usuarioRolEntity);
                    appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            });
        };
        
        onBuscarRoles();
        onBuscarRolesActivos();
        onBuscarUsuarioRoles();
        onConsultarListaEstados();
    }
})();




