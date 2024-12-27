(function () {
    'use strict';
    angular.module('mytodoApp').controller('publicoobjetivoCtrl', publicoobjetivoCtrl);
    publicoobjetivoCtrl.$inject = ['$scope', 'publiobjetivoService', 'ValidationService', 'eventoService', '$location', 'localStorageService', 'appConstant', 'appGenericConstant'];
    function publicoobjetivoCtrl($scope, publiobjetivoService, ValidationService, eventoService, $location, localStorageService, appConstant, appGenericConstant) {

        var publicoobjetivoControl = this;
        var config = {
            disableCountDown: true,
            ttl: 5000
        };
        publicoobjetivoControl.nuevopublico = publiobjetivoService.publicoobjetivo;
        publicoobjetivoControl.nuevaEvento = eventoService.evento;
        publicoobjetivoControl.esvisible = publiobjetivoService.visible;
        publicoobjetivoControl.esvisibleevento = eventoService.visible;
        publicoobjetivoControl.publicoobjetivos = [];
        publicoobjetivoControl.publicoObjetivosPadres = [];
        publicoobjetivoControl.contactos = [];
        publicoobjetivoControl.contactosauxiliares = [];
        publicoobjetivoControl.contactosseleccionados = [];
        publicoobjetivoControl.lsttipopublicoobjetivos = [];
        publicoobjetivoControl.listavalor = [];
        publicoobjetivoControl.lstpublicosobjetivos = [];
        publicoobjetivoControl.listavaloreventos = [];
        publicoobjetivoControl.esvisible.rendered = true;
        publicoobjetivoControl.mensajeValidacion = true;
        publicoobjetivoControl.options = appConstant.FILTRO_TABLAS;
        publicoobjetivoControl.selectedOption = publicoobjetivoControl.options[appGenericConstant.CERO];
        var objetoSeleccionadoP = {};
        publicoobjetivoControl.report = {
            selected: null
        };
        publicoobjetivoControl.reportes = {
            selected: null
        };
        publicoobjetivoControl.selectTodos = false;
        publicoobjetivoControl.desDelectTodos = false;

        if (localStorageService.get('publicoobjetivo') !== null) {
            publicoobjetivoControl.nuevopublico = localStorageService.get('publicoobjetivo');
        }

        if (localStorageService.get('vistaestados') !== null) {
            publicoobjetivoControl.esvisible = localStorageService.get('vistaestados');
        }

        if (localStorageService.get('contactos') !== null) {
            publicoobjetivoControl.contactos = localStorageService.get('contactos');
        }

        if (localStorageService.get('contactosseleccionados') !== null) {
            publicoobjetivoControl.contactosseleccionados = localStorageService.get('contactosseleccionados');
            if (publicoobjetivoControl.contactosseleccionados !== undefined) {
                onContactosSelecionado();
            }
        }

        /* CONSULTAS */
        publicoobjetivoControl.onIrRegistrar = function () {
            publicoobjetivoControl.esvisible.titulo = appGenericConstant.AGREGAR_PUBLICO_OBJETIVO;
            publicoobjetivoControl.esvisible.titulocontacto = appGenericConstant.CONTACTOS_SELECCIONADOS;
            publicoobjetivoControl.esvisible.titulocontactodisponibles = appGenericConstant.CONTACTOS_DISPONIBLES;
            publicoobjetivoControl.nuevopublico = {};
            publicoobjetivoControl.esvisible.eseditable = false;
            publicoobjetivoControl.esvisible.rendered = true;
            publicoobjetivoControl.esvisible.renderedbutton = true;
            localStorageService.set('publicoobjetivo', null);
            localStorageService.set('contactosseleccionados', null);
            localStorageService.set('vistaestados', publicoobjetivoControl.esvisible);
            publicoobjetivoControl.ejecutarConsultarContactos();

        };
        publicoobjetivoControl.selectContacto = function (item) {
            publicoobjetivoControl.contactosseleccionados.push(item);
            var index = publicoobjetivoControl.contactos.indexOf(item);
            publicoobjetivoControl.contactos.splice(index, appGenericConstant.UNO);
            publicoobjetivoControl.nuevopublico.listaContactos = publicoobjetivoControl.contactosseleccionados;
        };
        publicoobjetivoControl.onEliminarUnContacto = function (item) {
            publicoobjetivoControl.contactos.splice(appGenericConstant.CERO, appGenericConstant.CERO, item);
            var index = publicoobjetivoControl.contactosseleccionados.indexOf(item);
            publicoobjetivoControl.contactosseleccionados.splice(index, appGenericConstant.UNO);
            publicoobjetivoControl.nuevopublico.listaContactos = publicoobjetivoControl.contactosseleccionados;
            localStorageService.set('contactosseleccionados', publicoobjetivoControl.contactosseleccionados);

        };

        publicoobjetivoControl.onIrVerDetalle = function (item) {
//            publiobjetivoService.consultarContactos().then(function (data) {
            publicoobjetivoControl.esvisible.titulo = appGenericConstant.DETALLE_PUBLICO_OBJETIVO;
            publicoobjetivoControl.esvisible.titulocontacto = appGenericConstant.CONTACTOS_ASOCIADOS;
            publiobjetivoService.consultarContactosPublicoObjetivos(item.id).then(function (info) {
                publicoobjetivoControl.nuevopublico = {};
                publicoobjetivoControl.nuevopublico.id = info[0].id;
                publicoobjetivoControl.nuevopublico.codigo = info[0].codigo;
                publicoobjetivoControl.nuevopublico.nombre = info[0].nombre;
                publicoobjetivoControl.nuevopublico.descripcion = info[0].descripcion;
                publicoobjetivoControl.contactos = [];
                publicoobjetivoControl.contactos = info[0].listaContactos;
                publicoobjetivoControl.contactosseleccionados = [];
                var contacto = {};
                angular.forEach(publicoobjetivoControl.contactos, function (value, key) {
                    contacto = {};
                    contacto = {
                        id: value.aspirante.id,
                        tipoDocumento: value.aspirante.idTipoIdentificacion,
                        numeroDocumento: value.aspirante.identificacion,
                        email: value.aspirante.email,
                        nombrecompleto: value.aspirante.nombre + ' ' + value.aspirante.apellido,
                        telefono: value.aspirante.telefono,
                        programa: value.aspirante.nombrePrograma,
                        periodo: value.aspirante.periodoAcademico,
                        estado: value.aspirante.estadoInscripcion === "PRE_INSCRITO" ? "PRE INSCRITO" : value.aspirante.estadoInscripcion,
                        style: labelNotificacion(value.aspirante.estadoInscripcion),
                        celular: value.aspirante.celular
                    };
                    publicoobjetivoControl.contactosseleccionados.push(contacto);
                });
                publicoobjetivoControl.nuevopublico.publicopadre = info[0].idPublicoObjetivo;
                publicoobjetivoControl.esvisible.eseditable = true;
                publicoobjetivoControl.esvisible.rendered = false;
                publicoobjetivoControl.esvisible.renderedbutton = false;
                localStorageService.set('publicoobjetivo', publicoobjetivoControl.nuevopublico);
                localStorageService.set('contactosseleccionados', publicoobjetivoControl.contactosseleccionados);
                localStorageService.set('vistaestados', publicoobjetivoControl.esvisible);
                $location.path('/publico-objtivo-cud');
            }).catch(function (e) {
                return;
            });
//            }).catch(function (e) {
//                return;
//            });
        };
        publicoobjetivoControl.onIrEditar = function (item) {
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_PUBLICO_OBJETIVO);
            appConstant.CARGANDO();
            publiobjetivoService.consultarContactos().then(function (data) {
                publicoobjetivoControl.contactos = [];
                var contacto = {};
                angular.forEach(data, function (value, key) {
                    contacto = {};
                    contacto = {
                        id: value.id,
                        idAspCliente: value.idAspCliente,
                        tipoDocumento: value.idTipoIdentificacion,
                        numeroDocumento: value.identificacion,
                        email: value.email,
                        nombrecompleto: value.nombre + ' ' + value.apellido,
                        telefono: value.telefono,
                        programa: value.nombrePrograma,
                        periodo: value.periodoAcademico,
                        estado: value.estadoInscripcion === "PRE_INSCRITO" ? "PRE INSCRITO" : value.estadoInscripcion,
                        style: labelNotificacion(value.estadoInscripcion),
                        celular: value.celular
                    };
                    publicoobjetivoControl.contactos.push(contacto);
                });
                publiobjetivoService.consultarContactosPublicoObjetivos(item.id).then(function (info) {
                    publicoobjetivoControl.esvisible.titulo = appGenericConstant.MODIFICAR_PUBLICO_OBJETIVO;
                    publicoobjetivoControl.esvisible.titulocontacto = appGenericConstant.CONTACTOS_SELECCIONADOS;
                    publicoobjetivoControl.esvisible.titulocontactodisponibles = appGenericConstant.CONTACTOS_DISPONIBLES;
                    publicoobjetivoControl.nuevopublico = {};
                    publicoobjetivoControl.nuevopublico.id = info[0].id;
                    publicoobjetivoControl.nuevopublico.codigo = info[0].codigo;
                    publicoobjetivoControl.nuevopublico.nombre = info[0].nombre;
                    publicoobjetivoControl.nuevopublico.descripcion = info[0].descripcion;
                    publicoobjetivoControl.nuevopublico.publicopadre = info[0].idPublicoObjetivo;
                    publicoobjetivoControl.nuevopublico.listaContactos = info[0].listaContactos;
                    publicoobjetivoControl.nuevopublico.listaAspirantes = info[0].aspirantes;
                    publicoobjetivoControl.contactosseleccionados = [];
                    var contacto = {};
                    angular.forEach(info[0].listaContactos, function (value, key) {
                        contacto = {
                            id: value.aspirante.id,
                            idAspCliente: value.idAspiranteCliente,
                            tipoDocumento: value.aspirante.idTipoIdentificacion,
                            numeroDocumento: value.aspirante.identificacion,
                            email: value.aspirante.email,
                            nombrecompleto: value.aspirante.nombre + ' ' + value.aspirante.apellido,
                            telefono: value.aspirante.telefono,
                            programa: value.aspirante.nombrePrograma,
                            periodo: value.aspirante.periodoAcademico,
                            estado: value.aspirante.estadoInscripcion === "PRE_INSCRITO" ? "PRE INSCRITO" : value.aspirante.estadoInscripcion,
                            style: labelNotificacion(value.aspirante.estadoInscripcion),
                            celular: value.aspirante.celular
                        };
                        publicoobjetivoControl.contactosseleccionados.push(contacto);
                    });

                    publicoobjetivoControl.esvisible.eseditable = false;
                    publicoobjetivoControl.esvisible.rendered = true;
                    publicoobjetivoControl.esvisible.renderedbutton = true;
                    if (publicoobjetivoControl.nuevopublico.publicopadre === null || publicoobjetivoControl.nuevopublico.publicopadre === undefined) {
                        var contactoaux = {};
                        var contactoaux2 = {};
                        var estado = false;

                        for (var i = appGenericConstant.CERO; i < publicoobjetivoControl.contactos.length; i++) {
                            contactoaux = {};
                            contactoaux2 = {};
                            estado = false;
                            contactoaux = {
                                id: publicoobjetivoControl.contactos[i].id,
                                tipoDocumento: publicoobjetivoControl.contactos[i].idTipoIdentificacion,
                                numeroDocumento: publicoobjetivoControl.contactos[i].identificacion,
                                email: publicoobjetivoControl.contactos[i].email,
                                nombrecompleto: publicoobjetivoControl.contactos[i].nombre + ' ' + publicoobjetivoControl.contactos[i].apellido,
                                telefono: publicoobjetivoControl.contactos[i].telefono,
                                programa: publicoobjetivoControl.contactos[i].nombrePrograma,
                                periodo: publicoobjetivoControl.contactos[i].periodoAcademico,
                                estado: publicoobjetivoControl.contactos[i].estadoInscripcion === "PRE_INSCRITO" ? "PRE INSCRITO" : publicoobjetivoControl.contactos[i].estadoInscripcion,
                                style: labelNotificacion(publicoobjetivoControl.contactos[i].estadoInscripcion),
                                celular: publicoobjetivoControl.contactos[i].celular
                            };
                            for (var j = appGenericConstant.CERO; j < publicoobjetivoControl.contactosseleccionados.length; j++) {
                                contactoaux2 = {
                                    id: publicoobjetivoControl.contactosseleccionados[j].id,
                                    tipoDocumento: publicoobjetivoControl.contactosseleccionados[j].idTipoIdentificacion,
                                    numeroDocumento: publicoobjetivoControl.contactosseleccionados[j].identificacion,
                                    email: publicoobjetivoControl.contactosseleccionados[j].email,
                                    nombrecompleto: publicoobjetivoControl.contactosseleccionados[j].nombre + ' ' + publicoobjetivoControl.contactosseleccionados[j].apellido,
                                    telefono: publicoobjetivoControl.contactosseleccionados[j].telefono,
                                    programa: publicoobjetivoControl.contactosseleccionados[j].nombrePrograma,
                                    periodo: publicoobjetivoControl.contactosseleccionados[j].periodoAcademico,
                                    estado: publicoobjetivoControl.contactosseleccionados[j].estadoInscripcion === "PRE_INSCRITO" ? "PRE INSCRITO" : publicoobjetivoControl.contactosseleccionados[j].estadoInscripcion,
                                    style: labelNotificacion(publicoobjetivoControl.contactosseleccionados[j].estadoInscripcion),
                                    celular: publicoobjetivoControl.contactos[i].celular
                                };

                                if (JSON.stringify(contactoaux) === JSON.stringify(contactoaux2)) {
                                    estado = true;
                                }
                            }
                            if (!estado) {
                                publicoobjetivoControl.contactosauxiliares.push(publicoobjetivoControl.contactos[i]);
                            }
                        }
                        publicoobjetivoControl.contactos = publicoobjetivoControl.contactosauxiliares;
                            appConstant.CERRAR_SWAL();
                            localStorageService.set('publicoobjetivo', publicoobjetivoControl.nuevopublico);
                            localStorageService.set('contactosseleccionados', publicoobjetivoControl.contactosseleccionados);
                            localStorageService.set('contactos', publicoobjetivoControl.contactos);
                            localStorageService.set('vistaestados', publicoobjetivoControl.esvisible);
                            $location.path('/publico-objtivo-cud');
                    } else {
                        publicoobjetivoControl.contactos = [];
                        for (var i = appGenericConstant.CERO; i < publicoobjetivoControl.publicoObjetivosPadres.length; i++) {
                            if (publicoobjetivoControl.publicoObjetivosPadres[i].id === publicoobjetivoControl.nuevopublico.publicopadre) {
                                publiobjetivoService.consultarContactosPublicoObjetivos(publicoobjetivoControl.publicoObjetivosPadres[i].id).then(function (data) {
                                    objetoSeleccionadoP = data[0];

                                    for (var j = appGenericConstant.CERO; j < objetoSeleccionadoP.listaContactos.length; j++) {
                                        var agregado = {
                                            apellido: objetoSeleccionadoP.listaContactos[j].aspirante.apellido,
                                            email: objetoSeleccionadoP.listaContactos[j].aspirante.email,
                                            id: objetoSeleccionadoP.listaContactos[j].aspirante.id,
                                            idAspirante: objetoSeleccionadoP.listaContactos[j].aspirante.idAspirante,
                                            nombre: objetoSeleccionadoP.listaContactos[j].aspirante.nombre,
                                            nombrecompleto: objetoSeleccionadoP.listaContactos[j].aspirante.nombre + ' ' + objetoSeleccionadoP.listaContactos[j].aspirante.apellido,
                                            numeroDocumento: objetoSeleccionadoP.listaContactos[j].aspirante.numeroDocumento,
                                            telefono: objetoSeleccionadoP.listaContactos[j].aspirante.telefono,
                                            tipoDocumento: objetoSeleccionadoP.listaContactos[j].aspirante.tipoDocumento,
                                            programa: objetoSeleccionadoP.listaContactos[j].aspirante.nombrePrograma,
                                            periodo: objetoSeleccionadoP.listaContactos[j].aspirante.periodoAcademico,
                                            estado: objetoSeleccionadoP.listaContactos[j].aspirante.estadoInscripcion === "PRE_INSCRITO" ? "PRE INSCRITO" : objetoSeleccionadoP.listaContactos[j].aspirante.estadoInscripcion,
                                            style: labelNotificacion(objetoSeleccionadoP.listaContactos[j].aspirante.estadoInscripcion),
                                            celular: objetoSeleccionadoP.listaContactos[j].aspirante.celular
                                        };
                                        publicoobjetivoControl.contactos.push(agregado);
                                    }
                                    appConstant.CERRAR_SWAL();
                                    localStorageService.set('publicoobjetivo', publicoobjetivoControl.nuevopublico);
                                    localStorageService.set('contactosseleccionados', publicoobjetivoControl.contactosseleccionados);
                                    localStorageService.set('contactos', publicoobjetivoControl.contactos);
                                    localStorageService.set('vistaestados', publicoobjetivoControl.esvisible);
                                    $location.path('/publico-objtivo-cud');
                                }).catch(function (e) {
                                    return;
                                });

                            }
                        }

                    }
                }).catch(function (e) {
                    return;
                });
            }).catch(function (e) {
                return;
            });
        };

        publicoobjetivoControl.onLimpiarPublicoObjetivo = function () {
            localStorageService.remove('publicoobjetivo');
            localStorageService.remove('contactosseleccionados');
            localStorageService.remove('contactos');
            localStorageService.remove('vistaestados');
        };
        
        
        if($location.path==='/publico-objtivo'){
            localStorageService.remove('publicoobjetivo');
            localStorageService.remove('contactosseleccionados');
            localStorageService.remove('contactos');
            localStorageService.remove('vistaestados');
            
        }
        publicoobjetivoControl.onChangePublicoObjectivoPadre = function (id) {

            if (publicoobjetivoControl.nuevopublico.publicopadre !== null) {
                var objetoSeleccionado = {};
//                for (var i = appGenericConstant.CERO; i < publicoobjetivoControl.publicoObjetivosPadres.length; i++) {
//                    if (publicoobjetivoControl.publicoObjetivosPadres[i].id === publicoobjetivoControl.nuevopublico.publicopadre) {
                publiobjetivoService.consultarContactosPublicoObjetivos(id).then(function (data) {
                    objetoSeleccionado = data[0];

//                        break;
//                    }
//                }
                    publicoobjetivoControl.contactosseleccionados = [];
                    publicoobjetivoControl.contactos = [];
                    if (objetoSeleccionado.listaContactos.length === appGenericConstant.CERO) {
                        appConstant.MSG_GROWL_ADVERTENCIA(appGenericConstant.PUBLICO_OBJETIVO_PADRE);
                        return;
                    }
                    for (var j = appGenericConstant.CERO; j < objetoSeleccionado.listaContactos.length; j++) {
                        var agregado = {
                            apellido: objetoSeleccionado.listaContactos[j].aspirante.apellido,
                            email: objetoSeleccionado.listaContactos[j].aspirante.email,
                            id: objetoSeleccionado.listaContactos[j].aspirante.id,
                            idAspirante: objetoSeleccionado.listaContactos[j].aspirante.idAspirante,
                            nombre: objetoSeleccionado.listaContactos[j].aspirante.nombre,
                            nombrecompleto: objetoSeleccionado.listaContactos[j].aspirante.nombre + ' ' + objetoSeleccionado.listaContactos[j].aspirante.apellido,
                            numeroDocumento: objetoSeleccionado.listaContactos[j].aspirante.numeroDocumento,
                            telefono: objetoSeleccionado.listaContactos[j].aspirante.telefono,
                            tipoDocumento: objetoSeleccionado.listaContactos[j].aspirante.tipoDocumento,
                            programa: objetoSeleccionado.listaContactos[j].aspirante.nombrePrograma,
                            periodo: objetoSeleccionado.listaContactos[j].aspirante.periodoAcademico,
                            estado: objetoSeleccionado.listaContactos[j].aspirante.estadoInscripcion === "PRE_INSCRITO" ? "PRE INSCRITO" : objetoSeleccionado.listaContactos[j].aspirante.estadoInscripcion,
                            style: labelNotificacion(objetoSeleccionado.listaContactos[j].aspirante.estadoInscripcion),
                            celular: objetoSeleccionado.listaContactos[j].aspirante.celular
                        };
                        publicoobjetivoControl.contactos.push(agregado);
                    }

                }).catch(function (e) {
                    return;
                });
            } else {
                publicoobjetivoControl.ejecutarConsultarContactos();
            }
        };

        function onContactosSelecionado() {
            publicoobjetivoControl.contactosauxiliares = [];
            var contactoaux = {};
            var contactoaux2 = {};
            var estado = false;
            for (var i = appGenericConstant.CERO; i < publicoobjetivoControl.contactos.length; i++) {
                contactoaux = {};
                contactoaux2 = {};
                estado = false;
                contactoaux = {
                    apellido: publicoobjetivoControl.contactos[i].apellido,
                    email: publicoobjetivoControl.contactos[i].email,
                    id: publicoobjetivoControl.contactos[i].id,
                    idAspCliente: publicoobjetivoControl.contactos[i].idAspCliente,
                    nombre: publicoobjetivoControl.contactos[i].nombre,
                    nombrecompleto: publicoobjetivoControl.contactos[i].nombrecompleto,
                    numeroDocumento: publicoobjetivoControl.contactos[i].numeroDocumento,
                    tipoDocumento: publicoobjetivoControl.contactos[i].tipoDocumento
                };
                for (var j = appGenericConstant.CERO; j < publicoobjetivoControl.contactosseleccionados.length; j++) {
                    contactoaux2 = {
                        apellido: publicoobjetivoControl.contactosseleccionados[j].apellido,
                        email: publicoobjetivoControl.contactosseleccionados[j].email,
                        id: publicoobjetivoControl.contactosseleccionados[j].id,
                        idAspCliente: publicoobjetivoControl.contactosseleccionados[j].idAspCliente,
                        nombre: publicoobjetivoControl.contactosseleccionados[j].nombre,
                        nombrecompleto: publicoobjetivoControl.contactosseleccionados[j].nombrecompleto,
                        numeroDocumento: publicoobjetivoControl.contactosseleccionados[j].numeroDocumento,
                        tipoDocumento: publicoobjetivoControl.contactosseleccionados[j].tipoDocumento
                    };
                    if (contactoaux.id === contactoaux2.id) {
                        estado = true;
                    }
                }
                if (!estado) {
                    publicoobjetivoControl.contactosauxiliares.push(publicoobjetivoControl.contactos[i]);
                }
            }
            publicoobjetivoControl.contactos = publicoobjetivoControl.contactosauxiliares.slice();
        }

        publicoobjetivoControl.onGuardar = function () {
            var valido = false;
            if (!new ValidationService().checkFormValidity($scope.formgeneralpublico)) {
                valido = true;
            }
            if (!valido) {
                if (publicoobjetivoControl.esvisible.titulo === appGenericConstant.MODIFICAR_PUBLICO_OBJETIVO) {
                    if (localStorageService.get('publicoobjetivo').id !== publicoobjetivoControl.nuevopublico.id
                            || localStorageService.get('publicoobjetivo').codigo !== publicoobjetivoControl.nuevopublico.codigo
                            || localStorageService.get('publicoobjetivo').descripcion !== publicoobjetivoControl.nuevopublico.descripcion
                            || JSON.stringify(localStorageService.get('publicoobjetivo').listaContactos) !== JSON.stringify(publicoobjetivoControl.nuevopublico.listaContactos)
                            || localStorageService.get('publicoobjetivo').publicopadre !== publicoobjetivoControl.nuevopublico.publicopadre
                            || localStorageService.get('publicoobjetivo').nombre !== publicoobjetivoControl.nuevopublico.nombre) {
                        publicoobjetivoControl.actualizarPublicoObjetivo();
                    }
                    return;
                }
                publicoobjetivoControl.agregarPublicoObjetivo();
            }
        };

        publicoobjetivoControl.agregarPublicoObjetivo = function () {
            var contactos = [];
            for (var i = appGenericConstant.CERO; i < publicoobjetivoControl.contactosseleccionados.length; i++) {
                var contacto = {
                    id: null,
                    idAspirante: publicoobjetivoControl.contactosseleccionados[i].id,
                    idPublicoObjetivo: null,
                    idAspiranteCliente: publicoobjetivoControl.contactosseleccionados[i].idAspCliente
                };
                contactos.push(contacto);
            }
            var publicoobj = {
                id: null,
                codigo: appConstant.VALIDAR_STRING(publicoobjetivoControl.nuevopublico.codigo),
                nombre: appConstant.VALIDAR_STRING(publicoobjetivoControl.nuevopublico.nombre),
                descripcion: publicoobjetivoControl.nuevopublico.descripcion,
                listaContactos: contactos,
                idPublicoObjetivo: (typeof publicoobjetivoControl.nuevopublico.publicopadre === 'undefined' ? null : publicoobjetivoControl.nuevopublico.publicopadre)
            };
            appConstant.MSG_LOADING(appGenericConstant.GUARDANDO_PUBLICO_OBJETIVO);
            appConstant.CARGANDO();
            publiobjetivoService.registrarPublicoObjetivo(publicoobj).then(function (data) {
                if (data.tipo === 409) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    return;
                }
                if (data.tipo === 500) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    return;
                }
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_GUARDADO);
                publicoobjetivoControl.nuevopublico = {};
                publicoobjetivoControl.contactosseleccionados = [];
                publicoobjetivoControl.ejecutarConsultarContactos();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        publicoobjetivoControl.actualizarPublicoObjetivo = function () {
            var contactos = [];
            for (var i = appGenericConstant.CERO; i < publicoobjetivoControl.contactosseleccionados.length; i++) {
                var contacto = {
                    id: null,
                    idAspirante: publicoobjetivoControl.contactosseleccionados[i].id,
                    idPublicoObjetivo: publicoobjetivoControl.nuevopublico.id,
                    idAspiranteCliente: publicoobjetivoControl.contactosseleccionados[i].idAspCliente
                };
                contactos.push(contacto);
            }
            var publicoobj = {
                id: publicoobjetivoControl.nuevopublico.id,
                codigo: appConstant.VALIDAR_STRING(publicoobjetivoControl.nuevopublico.codigo),
                nombre: appConstant.VALIDAR_STRING(publicoobjetivoControl.nuevopublico.nombre),
                descripcion: publicoobjetivoControl.nuevopublico.descripcion,
                listaContactos: contactos,
                idPublicoObjetivo: (typeof publicoobjetivoControl.nuevopublico.publicopadre === 'undefined' ? null : publicoobjetivoControl.nuevopublico.publicopadre)
            };
            appConstant.MSG_LOADING(appGenericConstant.ACTUALIZANDO_PUBLICO_OBEJTIVO);
            appConstant.CARGANDO();
            publiobjetivoService.registrarPublicoObjetivo(publicoobj).then(function (data) {
                if (data.tipo === 409) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ADVERTENCIA(data.message);
                    return;
                }
                if (data.tipo === 500) {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                    return;
                }
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_OK(appGenericConstant.REGISTRO_MODIFICADO);
                localStorageService.set('publicoobjetivo', data.objectResponse);
                localStorageService.set('vistaestados', publicoobjetivoControl.esvisible);
                localStorageService.set('contactosseleccionados', publicoobjetivoControl.contactosseleccionados);
                localStorageService.set('contactos', publicoobjetivoControl.contactos);
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        publicoobjetivoControl.onEliminarUno = function (item) {
            publicoobjetivoControl.report.selected.length = null;
            swal({
                title: appGenericConstant.PREG_ELIMINAR_PUBLICO_OBJETIVO,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false,
                allowEscapeKey: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_PUBLICO_OBJETIVO);
                appConstant.CARGANDO();
                setTimeout(function () {
                    publicoobjetivoControl.eliminarPublicoObjetivo(item);
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    return;
                }
            });
        };

        publicoobjetivoControl.onEliminarMasivo = function () {
            publicoobjetivoControl.listNoEliminados = [];
            publicoobjetivoControl.listaPublicosObjetivosId = [];
            swal({
                title: appGenericConstant.PREG_ELIMINAR_PUBLICOS_OBJETIVOS,
                text: appGenericConstant.CAMBIOS_IRREVERSIBLES,
                type: appGenericConstant.QUESTION,
                showCancelButton: true,
                confirmButtonText: appGenericConstant.ACEPTAR,
                cancelButtonText: appGenericConstant.CANCELAR,
                allowOutsideClick: false
            }).then(function () {
                appConstant.MSG_LOADING(appGenericConstant.ELIMINANDO_REGISTRO);
                appConstant.CARGANDO();
                setTimeout(function () {
                    angular.forEach(publicoobjetivoControl.report.selected, function (value, key) {
                        publicoobjetivoControl.listaPublicosObjetivosId.push(value.id);
                    });
                    publiobjetivoService.eliminarPublicoObjetivoMasivo(publicoobjetivoControl.listaPublicosObjetivosId).then(function (data) {
                        if (data.tipo === 200) {
                            publicoobjetivoControl.ejecutarConsultarpublicoObjetivo();
                            swal(appGenericConstant.PUBLICOS_OBJETIVOS_ELIMINADOS,
                                    appGenericConstant.PUBLICOS_OBJETIVOS_ELIMINADOS_SATIS,
                                    appGenericConstant.SUCCESS);
                            publicoobjetivoControl.report.selected.length = null;
                        } else if (data.tipo === 400) {
                            swal(appGenericConstant.ALTO_AHI,
                                    appGenericConstant.ALGUNOS_REGISTROS,
                                    appGenericConstant. WARNING);
                            publicoobjetivoControl.mensajeValidacion = true;
                            publicoobjetivoControl.listNoEliminados = data.objectoList;
                            publicoobjetivoControl.ejecutarConsultarpublicoObjetivo();
                            publicoobjetivoControl.report.selected.length = null;
                        } else {
                            appConstant.CERRAR_SWAL();
                            appConstant.MSG_GROWL_ERROR();
                        }
                    }).catch(function (e) {
                        appConstant.CERRAR_SWAL();
                        appConstant.MSG_GROWL_ERROR();
                        return;
                    });
                });
            }, function (dismiss) {
                if (dismiss === appGenericConstant.CANCEL) {
                    publicoobjetivoControl.report.selected.length = null;
                    publicoobjetivoControl.ejecutarConsultarpublicoObjetivo();
                }
            });
        };
        publicoobjetivoControl.eliminarPublicoObjetivo = function (item) {
            var publicoobj = {
                id: item.id,
                codigo: item.codigo,
                nombre: item.nombre,
                descripcion: item.descripcion,
                contactos: item.contactosseleccionados
            };
            publiobjetivoService.eliminarPublicoObjetivo(publicoobj).then(function (data) {
                if (data.tipo === 200) {
                    swal(appGenericConstant.PUBLICO_OBJETIVO_ELIMNADO,
                            appGenericConstant.PUBLICO_OBJETIVO_ELIMINADO_SATIS,
                            appGenericConstant.SUCCESS);
                    publicoobjetivoControl.report.selected.length = null;
                    publicoobjetivoControl.publicoobjetivos = [];
                    publicoobjetivoControl.ejecutarConsultarpublicoObjetivo();
                } else if (data.tipo === 409) {
                    swal(appGenericConstant.ALTO_AHI,
                            data.message,
                            appGenericConstant.WARNING);
                } else {
                    appConstant.CERRAR_SWAL();
                    appConstant.MSG_GROWL_ERROR();
                }
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        publicoobjetivoControl.ejecutarConsultarpublicoObjetivo = function () {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            publiobjetivoService.consultarPublicoObjetivos().then(function (data) {
                var publicoobjetivo = {};
                angular.forEach(data, function (value) {
                    publicoobjetivo = {
                        id: value.id,
                        codigo: value.codigo,
                        nombre: value.nombre,
                        contactos: value.listaContactos,
                        descripcion: value.descripcion,
                        publicopadre: value.publicopadre,
                        aspirantes: value.listaAspirantes,
                        idPublicoObjetivo: value.idPublicoObjetivo
                    };
                    publicoobjetivoControl.publicoobjetivos.push(publicoobjetivo);
                });
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                appConstant.CERRAR_SWAL();
                appConstant.MSG_GROWL_ERROR();
                return;
            });
        };

        publicoobjetivoControl.ejecutarConsultarpublicoObjetivoPadres = function () {
            publicoobjetivoControl.publicoObjetivosPadres = [];
            publiobjetivoService.consultarPublicoObjetivos().then(function (data) {
                var publicoobjetivo = {};
                angular.forEach(data, function (value) {
                    publicoobjetivo = {
                        id: value.id,
                        codigo: value.codigo,
                        nombre: value.nombre,
                        contactos: value.listaContactos,
                        descripcion: value.descripcion,
                        publicopadre: value.publicopadre,
                        aspirantes: value.listaAspirantes,
                        idPublicoObjetivo: value.idPublicoObjetivo
                    };
                    if (publicoobjetivoControl.nuevopublico !== null && publicoobjetivoControl.nuevopublico !== undefined) {
                        if (publicoobjetivoControl.nuevopublico.id !== publicoobjetivo.id) {
                            publicoobjetivoControl.publicoObjetivosPadres.push(publicoobjetivo);
                        }
                    } else {
                        publicoobjetivoControl.publicoObjetivosPadres.push(publicoobjetivo);
                    }
                });
            }).catch(function (e) {
                return;
            });
        };

        publicoobjetivoControl.ejecutarConsultarContactos = function () {
            publicoobjetivoControl.contactos = [];
            publiobjetivoService.consultarContactos().then(function (data) {
                var contacto = {};
                angular.forEach(data, function (value, key) {
                    contacto = {};
                    contacto = {
                        id: value.id,
                        tipoDocumento: value.idTipoIdentificacion,
                        numeroDocumento: value.identificacion,
                        email: value.email,
                        nombrecompleto: value.nombre + ' ' + value.apellido,
                        telefono: value.telefono,
                        programa: value.nombrePrograma,
                        periodo: value.periodoAcademico,
                        estado: value.estadoInscripcion === "PRE_INSCRITO" ? "PRE INSCRITO" : value.estadoInscripcion,
                        style: labelNotificacion(value.estadoInscripcion),
                        idAspCliente: value.idAspCliente,
                        celular: value.celular
                    };
                    publicoobjetivoControl.contactos.push(contacto);
                });
                localStorageService.set('contactos', publicoobjetivoControl.contactos);
                $location.path('/publico-objtivo-cud');
            }).catch(function (e) {
                return;
            });
        };

        function labelNotificacion(estado) {
            var style;
            if (estado === "INSCRITO") {
                style = "bs-label label-primary";
            } else if (estado === "PRE_INSCRITO") {
                style = "bs-label label-danger";
            } else if (estado === "MATRICULADO") {
                style = "bs-label label-warning";
            } else {
                style = "bs-label label-success";
            }
            return style;
        }

        /*Metodo para seleccionar todos los datos de la tabla al clistadoClientesheckear*/
        publicoobjetivoControl.onSelectTodos = function () {
            if (publicoobjetivoControl.selectTodos === true) {
                publicoobjetivoControl.selectContactosAllOrFiltrados(publicoobjetivoControl.filtrados);
            } else {
                publicoobjetivoControl.report.selected.length = null;
            }
        };
        publicoobjetivoControl.onDesSelectTodos = function () {
            if (publicoobjetivoControl.desDelectTodos === true) {
                publicoobjetivoControl.desSelectContactosAllOrFiltrados(publicoobjetivoControl.filtrado);
            } else {
                publicoobjetivoControl.reportes.selected.length = null;
            }
        };
        /*Metodo para al presionar un tr se checkee o se descheckee el checkbox */
        publicoobjetivoControl.onSelectSeparate = function () {
            publicoobjetivoControl.report.selected.length = null;
            publicoobjetivoControl.selectTodos = false;
        };
        publicoobjetivoControl.onSelectTodosTable = function (clase, item) {
            if (publicoobjetivoControl.report.selected.length === publicoobjetivoControl.filtrados.length
                    && publicoobjetivoControl.selectTodos === true) {
                publicoobjetivoControl.selectTodos = false;
            } else {
                if (!clase) {
                    if (publicoobjetivoControl.report.selected.length + appGenericConstant.UNO === publicoobjetivoControl.filtrados.length
                            && publicoobjetivoControl.selectTodos === false) {
                        publicoobjetivoControl.selectTodos = true;
                    }
                } else {
                    publicoobjetivoControl.selectTodos = false;
                }
            }
        };
        //Seleccionar todos los registro y pasarlos a contactos
        publicoobjetivoControl.selectContactosAllOrFiltrados = function (item) {
            angular.forEach(item, function (value, key) {
                publicoobjetivoControl.contactosseleccionados.push(value);
                var index = publicoobjetivoControl.contactos.indexOf(value);
                publicoobjetivoControl.contactos.splice(index, appGenericConstant.UNO);
            });
            publicoobjetivoControl.nuevopublico.listaContactos = publicoobjetivoControl.contactosseleccionados;
            //localStorageService.set('contactosseleccionados', publicoobjetivoControl.contactosseleccionados);
        };
        //Desseleccionar todos los registro y pasarlos a listado 
        publicoobjetivoControl.desSelectContactosAllOrFiltrados = function (item) {
            angular.forEach(item, function (value, key) {
                publicoobjetivoControl.contactos.splice(appGenericConstant.CERO, appGenericConstant.CERO, value);
                var index = publicoobjetivoControl.contactosseleccionados.indexOf(value);
                publicoobjetivoControl.contactosseleccionados.splice(index, appGenericConstant.UNO);
            });
            publicoobjetivoControl.nuevopublico.listaContactos = publicoobjetivoControl.contactosseleccionados;
            localStorageService.set('contactosseleccionados', publicoobjetivoControl.contactosseleccionados);
        };
        publicoobjetivoControl.ejecutarConsultarpublicoObjetivo();
        publicoobjetivoControl.ejecutarConsultarpublicoObjetivoPadres();
    }
})();
