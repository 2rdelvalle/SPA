(function () {
    'use strict';
    angular.module('mytodoApp').controller('pruebasEntrevistasCtrl', pruebasEntrevistasCtrl);
    pruebasEntrevistasCtrl.$inject = [ 'pruebasEntrevistasServices', 'appConstant', '$location', 'growl',  'localStorageService'];
    function pruebasEntrevistasCtrl(pruebasEntrevistasServices, appConstant,  $location, growl,  localStorageService) {

        var gestionPruebasEntrevistas = this;

        gestionPruebasEntrevistas.Programas = [];
        gestionPruebasEntrevistas.cantidad = false;
        gestionPruebasEntrevistas.lunes = true;
        gestionPruebasEntrevistas.martes = true;
        gestionPruebasEntrevistas.miercoles = true;
        gestionPruebasEntrevistas.jueves = true;
        gestionPruebasEntrevistas.viernes = true;
        gestionPruebasEntrevistas.sabado = true;
        gestionPruebasEntrevistas.domingo = true;
        gestionPruebasEntrevistas.turnoUnico = true;
        gestionPruebasEntrevistas.turnoContinuo = false;
        gestionPruebasEntrevistas.turnoParticionado=false;
        gestionPruebasEntrevistas.lunesCheck = "disabled";
        gestionPruebasEntrevistas.martesCheck = "disabled";
        gestionPruebasEntrevistas.miercolesCheck = "disabled";
        gestionPruebasEntrevistas.juevesCheck = "disabled";
        gestionPruebasEntrevistas.viernesCheck = "disabled";
        gestionPruebasEntrevistas.sabadoCheck = "disabled";
        gestionPruebasEntrevistas.domingoCheck = "disabled";
        gestionPruebasEntrevistas.turnoUnicoCheck = true;
        gestionPruebasEntrevistas.PruebaEntevistaEntity = pruebasEntrevistasServices.PruebaEntevista;
        gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar = pruebasEntrevistasServices.PruebaEntevistaAuxiliar;
        gestionPruebasEntrevistas.config = {globalTimeToLive: 3000, disableCountDown: true};
        gestionPruebasEntrevistas.options = appConstant.FILTRO_TABLAS;

        gestionPruebasEntrevistas.report = {
            selected: null
        };
        gestionPruebasEntrevistas.selectedOption = gestionPruebasEntrevistas.options[0];



        function onBuscarRequisitosPrueba() {
            var nombrePrograma;
            pruebasEntrevistasServices.buscarRequisito().then(function (data) {
                for (var i = 0; i < data.length; i++) {
                    for (var e = 0; e < data[i].requisitosAsignados.length; e++) {
                        if (data[i].requisitosAsignados[e].caracteristica.nombre === "Prueba") {
                            gestionPruebasEntrevistas.requisito={
                            idPrograma:data[i].id,
                            codigoPrograma:data[i].codigo,   
                            nombrePrograma:data[i].nombrePrograma,
                            nombreRequisitosAsignados:data[i].requisitosAsignados[e].nombre,
                            codigoRequisitosAsignados:data[i].requisitosAsignados[e].codigo,
//                            configuracionAgenda:data[i].requisitosAsignados[e].configuracionAgenda,
//                             fechaInicial:data[i].requisitosAsignados[e].configuracionAgenda.fechaInicial,
//                             fechaFinal:data[i].requisitosAsignados[e].configuracionAgenda.fechaFinal,
//                             duracion:data[i].requisitosAsignados[e].configuracionAgenda.duracion,
//                             responsable:data[i].requisitosAsignados[e].configuracionAgenda.responsable,
//                             observaciones:data[i].requisitosAsignados[e].configuracionAgenda.observaciones,
//                             tipoTurno:data[i].requisitosAsignados[e].configuracionAgenda.tipoTurno,
//                             variosUserCita:data[i].requisitosAsignados[e].configuracionAgenda.variosUserCita,
//                             cantidad:data[i].requisitosAsignados[e].configuracionAgenda.cantidad
                            };
                            gestionPruebasEntrevistas.Programas.push(gestionPruebasEntrevistas.requisito);
                        }

                    }
                }
            });
           
        }

        gestionPruebasEntrevistas.turnoUnic = function () {
            
            gestionPruebasEntrevistas.lunes = true;
            gestionPruebasEntrevistas.martes = true;
            gestionPruebasEntrevistas.miercoles = true;
            gestionPruebasEntrevistas.jueves = true;
            gestionPruebasEntrevistas.viernes = true;
            gestionPruebasEntrevistas.sabado = true;
            gestionPruebasEntrevistas.domingo = true;
            gestionPruebasEntrevistas.lunesCheck = "disabled";
            gestionPruebasEntrevistas.martesCheck = "disabled";
            gestionPruebasEntrevistas.miercolesCheck = "disabled";
            gestionPruebasEntrevistas.juevesCheck = "disabled";
            gestionPruebasEntrevistas.viernesCheck = "disabled";
            gestionPruebasEntrevistas.sabadoCheck = "disabled";
            gestionPruebasEntrevistas.domingoCheck = "disabled";
            gestionPruebasEntrevistas.turnoUnicoCheck = false;
            gestionPruebasEntrevistas.turnoParticionado=false;
            gestionPruebasEntrevistas.turnoContinuo=false;
        };
        
        gestionPruebasEntrevistas.turnoParticio= function(){
            gestionPruebasEntrevistas.lunesCheck = "";
            gestionPruebasEntrevistas.martesCheck = "";
            gestionPruebasEntrevistas.miercolesCheck = "";
            gestionPruebasEntrevistas.juevesCheck = "";
            gestionPruebasEntrevistas.viernesCheck = "";
            gestionPruebasEntrevistas.sabadoCheck = "";
            gestionPruebasEntrevistas.domingo = true;
            gestionPruebasEntrevistas.domingoCheck = "disabled";
            gestionPruebasEntrevistas.turnoUnicoCheck = true;
            gestionPruebasEntrevistas.turnoParticionado=true;
            gestionPruebasEntrevistas.turnoUnico = false;
            gestionPruebasEntrevistas.turnoContinuo=false;
            
            
        };
        gestionPruebasEntrevistas.turnoConti= function(){
            gestionPruebasEntrevistas.lunesCheck = "";
            gestionPruebasEntrevistas.martesCheck = "";
            gestionPruebasEntrevistas.miercolesCheck = "";
            gestionPruebasEntrevistas.juevesCheck = "";
            gestionPruebasEntrevistas.viernesCheck = "";
            gestionPruebasEntrevistas.sabadoCheck = "";
            gestionPruebasEntrevistas.domingoCheck = "";
            gestionPruebasEntrevistas.turnoUnicoCheck = true;
            gestionPruebasEntrevistas.turnoParticionado=false;
            gestionPruebasEntrevistas.turnoUnico = false;
            
            
        };
        
        gestionPruebasEntrevistas.onLimpiar = function () {
            pruebasEntrevistasServices.facultad = {};
            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.nombreRequisito = null;
            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.nombrePrograma = null;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.codigoPrograma = null;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.nombreRequisito = null;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.fechaInicial= null;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.fechaFinal= null;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.duracion= null;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.responsable= null;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.observaciones= null;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.tipoTurno= null;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.variosUserCita= null;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.cantidad= null;
            localStorageService.remove('PruebaEntrevista');

        };
//        gestionPruebasEntrevistas.onClickToAddPruebaEntrevista = function () {
//            gestionPruebasEntrevistas.onLimpiar();
//            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.disableVerDetalle = false;
//            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.disableCodigo = false;
//            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.titulo = "";
//            localStorageService.set('PruebaEntrevista', null);
//            localStorageService.set('PruebasEntrevistasAuxiliar', gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar);
//            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.titulo = "facultad";
//        };

//        gestionPruebasEntrevistas.onSubmitForm = function () {
//            if (new ValidationService().checkFormValidity($scope.formRegistrarFacultad)) {
//                if (gestionPruebasEntrevistas.PruebaEntevistaEntity.id === null || gestionPruebasEntrevistas.PruebaEntevistaEntity.id === undefined) {
//                    gestionPruebasEntrevistas.onRegistrarFacultad();
//
//                    new ValidationService().resetForm($scope.formRegistrarFacultad);
//                } else {
//
//                    gestionPruebasEntrevistas.onActulizarFacultad();
//                }
//
//            }
//        };



//        gestionPruebasEntrevistas.onRegistrarFacultad = function () {
//
//            var newFacultad = {
//                codigo: gestionPruebasEntrevistas.PruebaEntevistaEntity.codigo.toUpperCase(),
//                nombre: gestionPruebasEntrevistas.PruebaEntevistaEntity.nombre.toUpperCase(),
//                estadoLogico: "A"
//            };
//            pruebasEntrevistasServices.facultadCodExiste(newFacultad).then(function (data) {
//                pruebasEntrevistasServices.facultadNomExiste(newFacultad).then(function (nom) {
//                    if (typeof data === 'object' && data.length !== 0) {
//                        growl.warning("<div><table><tr><td><i class='glyphicon glyphicon-warning-sign' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><strong>ALTO AHÍ</strong><BR><span>Ya existe un registro con el código ingresado</span></span></td></tr><table></div>", gestionPruebasEntrevistas.config);
//
//                    } else if (typeof nom === 'object' && nom.length !== 0) {
//                        growl.warning("<div><table><tr><td><i class='glyphicon glyphicon-warning-sign' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><strong>ALTO AHÍ</strong><BR><span>Ya existe un registro con el nombre ingresado</span></span></td></tr><table></div>", gestionPruebasEntrevistas.config);
//                    } else {
//                        pruebasEntrevistasServices.RegistrarPruebaEntevista(newFacultad).then(function (data) {
//                            gestionPruebasEntrevistas.onLimpiar();
//
//                            growl.success("<div><table><tr><td><i class='glyphicon glyphicon-ok' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><strong>BIEN HECHO</strong><BR><span>Tu registro ha sido agregado</span></span></td></tr><table></div>", gestionPruebasEntrevistas.config);
//
//                        });
//                    }
//
//                });
//
//            });
//        };

        if (localStorageService.get('PruebaEntrevista') !== null) {
            gestionPruebasEntrevistas.PruebaEntevistaEntity  = localStorageService.get('PruebaEntrevista');
           };
        
        if (localStorageService.get('PruebasEntrevistasAuxiliar') !== null) {
            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar = localStorageService.get('PruebasEntrevistasAuxiliar');
           };
        gestionPruebasEntrevistas.onConfig=function(){
             var item = localStorageService.get("PruebaEntrevista");
           
             pruebasEntrevistasServices.buscarRequisitosConfig(item).then(function (data) {
                var e=0;
                var listaRequisitosAsig=[];
                 for(var i=0;i<data[0].requisitosAsignados.length;i++){
                     if(data[0].requisitosAsignados[i].codigo === item.codigoRequisitosAsignados){
                          e=i;
                     }else{
                         listaRequisitosAsig.push(data[0].requisitosAsignados[i]);
                     }
                    
                 }
                var updateProgramasAcademicos =
                        {
                            id: data[0].id,
                            nivelFormacion: data[0].nivelFormacion,
                            areaConocimiento: data[0].areaConocimiento,
                            codigo: data[0].codigo,
                            nombrePrograma: data[0].nombrePrograma,
                            registroCalificado: data[0].registroCalificado,
                            estado: data[0].estado,
                            codigoSnies: data[0].codigoSnies,
                            facultad: data[0].facultad,
                            modalidad: data[0].modalidad,
                            jornada: data[0].jornada,
                            informacionGeneral: {
                                fechaResolucion: data[0].informacionGeneral.fechaResolucion,
                                vigencia: data[0].informacionGeneral.vigencia,
                                titulo: data[0].informacionGeneral.titulo,
                                duracion: data[0].informacionGeneral.duracion,
                                reconocimiento: data[0].informacionGeneral.reconocimiento,
                                creditos: data[0].informacionGeneral.creditos
                            },
                            requisitosAsignados:[{
                                "codigo":  data[0].requisitosAsignados[e].codigo,
                                "nombre": data[0].requisitosAsignados[e].nombre,
                                "caracteristica": {
                                    "codigo": data[0].requisitosAsignados[e].caracteristica.codigo,
                                    "nombre": data[0].requisitosAsignados[e].caracteristica.nombre
                                },
                                "descripcion": data[0].requisitosAsignados[e].descripcion,
                                "tipoRequisito": {
                                    "codigo":data[0].requisitosAsignados[e].tipoRequisito.codigo,
                                    "nombre":data[0].requisitosAsignados[e].tipoRequisito.nombre
                                },
                                "estado": {
                                    "id": data[0].requisitosAsignados[e].estado.id,
                                    "codigo": data[0].requisitosAsignados[e].estado.codigo,
                                    "nombre": data[0].requisitosAsignados[e].estado.nombre
                                },
                                "obligatorio":data[0].requisitosAsignados[e].obligatorio,
                                "id": data[0].requisitosAsignados[e].id,
                                "configuracionAgenda":{
                                    "fechaInicial":gestionPruebasEntrevistas.PruebaEntevistaEntity.fechaInicial,
                                    "fechaFinal":gestionPruebasEntrevistas.PruebaEntevistaEntity.fechaFinal,
                                    "duracion":gestionPruebasEntrevistas.PruebaEntevistaEntity.duracion,
                                    "responsable":gestionPruebasEntrevistas.PruebaEntevistaEntity.responsable,
                                    "observaciones":gestionPruebasEntrevistas.PruebaEntevistaEntity.observaciones,
                                    "tipoTurno":gestionPruebasEntrevistas.PruebaEntevistaEntity.tipoTurno,
                                    "variosUserCita":gestionPruebasEntrevistas.cantidad,
                                    "cantidad":gestionPruebasEntrevistas.PruebaEntevistaEntity.cantidad
                                }
                            }],
                            "requisitosDisponibles":data[0].requisitosDisponibles
                        };
                        
                        updateProgramasAcademicos.requisitosAsignados = updateProgramasAcademicos.requisitosAsignados.concat(listaRequisitosAsig);
                pruebasEntrevistasServices.ActulizarPruebaEntrevista(updateProgramasAcademicos).then(function (data) {
                    gestionPruebasEntrevistas.onLimpiar();
                });
            });
            
            
        };        
        gestionPruebasEntrevistas.onEdit = function (item) {
            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.disableVerDetalle = false;
            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.disableCodigo = true;
            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.titulo = "Agregar";
            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.nombreRequisito = item.nombreRequisitosAsignados;
            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.nombrePrograma = item.nombrePrograma;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.codigoPrograma = item.codigoPrograma;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.nombrePrograma = item.nombrePrograma;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.codigoRequisitosAsignados = item.codigoRequisitosAsignados;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.nombreRequisito = item.nombreRequisitosAsignados;
//            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.nombreRequisito = item.nombreRequisitosAsignados;
//            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.nombrePrograma = item.nombrePrograma;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.codigoPrograma = item.codigoPrograma;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.nombreRequisito = item.nombreRequisitosAsignados;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.fechaInicial= item.configuracionAgenda.fechaInicial;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.fechaFinal= item.configuracionAgenda.fechaFinal;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.duracion= item.configuracionAgenda.duracion;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.responsable= item.configuracionAgenda.responsable;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.observaciones= item.configuracionAgenda.observaciones;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.tipoTurno= item.configuracionAgenda.tipoTurno;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.variosUserCita= item.configuracionAgenda.variosUserCita;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.cantidad= item.configuracionAgenda.cantidad;

            gestionPruebasEntrevistas.PruebaEntevistaEntity.idPrograma = item.id;
            $location.path('/cud-pruebas-y-entrevistas');
            localStorageService.set('PruebaEntrevista', gestionPruebasEntrevistas.PruebaEntevistaEntity);
            localStorageService.set('PruebasEntrevistasAuxiliar', gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar);
        };
        gestionPruebasEntrevistas.onVerDetalle = function (item) {
            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.disableVerDetalle = true;
            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.disableCodigo = true;
            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.titulo = "Ver detalle del";
            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.nombreRequisito = item.nombreRequisitosAsignados;
            gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar.nombrePrograma = item.nombrePrograma;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.codigoPrograma = item.codigoPrograma;
            gestionPruebasEntrevistas.PruebaEntevistaEntity.nombreRequisito = item.nombreRequisitosAsignados;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.fechaInicial= item.configuracionAgenda.fechaInicial;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.fechaFinal= item.configuracionAgenda.fechaFinal;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.duracion= item.configuracionAgenda.duracion;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.responsable= item.configuracionAgenda.responsable;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.observaciones= item.configuracionAgenda.observaciones;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.tipoTurno= item.configuracionAgenda.tipoTurno;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.variosUserCita= item.configuracionAgenda.variosUserCita;
//            gestionPruebasEntrevistas.PruebaEntevistaEntity.cantidad= item.configuracionAgenda.cantidad;

            gestionPruebasEntrevistas.PruebaEntevistaEntity.id = item.id;
            $location.path('/cud-pruebas-y-entrevistas');
            localStorageService.set('PruebaEntrevista', gestionPruebasEntrevistas.PruebaEntevistaEntity);
            localStorageService.set('PruebasEntrevistasAuxiliar', gestionPruebasEntrevistas.PruebasEntrevistasAuxiliar);
        };
        gestionPruebasEntrevistas.onActulizarFacultad = function (item) {

            var newFacultad = {
                codigo: gestionPruebasEntrevistas.PruebaEntevistaEntity.codigo,
                nombre: gestionPruebasEntrevistas.PruebaEntevistaEntity.nombre.toUpperCase(),
                estadoLogico: "A",
                id: gestionPruebasEntrevistas.PruebaEntevistaEntity.id
            };

            pruebasEntrevistasServices.facultadNomExiste(newFacultad).then(function (data) {
                var storage = localStorageService.get('PruebaEntrevista');
                if (storage.nombre === newFacultad.nombre) {
                    data.length = 0;
                }
                if (typeof data === 'object' && data.length !== 0) {
                    growl.warning("<div><i class='glyphicon glyphicon-warning-sign' style='padding-left: 15px;font-size: 20px;'></i>&nbsp;&nbsp;<span><strong>ALTO AHÍ</strong><BR><span style='padding-left: 42px;'>Ya existe un registro con el nombre ingresado</span></span></div>", gestionPruebasEntrevistas.config);

                } else {
                    pruebasEntrevistasServices.ActulizarPruebaEntrevista(newFacultad).then(function (data) {

                        growl.success("<div><table><tr><td><i class='glyphicon glyphicon-ok' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><strong>BIEN HECHO</strong><BR><span>Tu registro ha sido modificado</span></span></td></tr><table></div>", gestionPruebasEntrevistas.config);

                    });
                }
            });



        };

      

        onBuscarRequisitosPrueba();



    }

})();





