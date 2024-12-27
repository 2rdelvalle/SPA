(function () {
    'use strict';
    angular.module('mytodoApp').service('appConstant', ['growl', function (growl) {
//<--- LISTAS --->
            this.FILTRO_TABLAS = [ {name: '20', value: '20'},
                {name: '50', value: '50'}, {name: '100', value: '100'},
                {name: '150', value: '150'}, {name: '200', value: '200'}, 
                {name: '300', value: '300'}];

            this.LISTA_DESCUENTOS = [
                {id: 1, valor: '5%', valorPorcentaje: 0.05},
                {id: 1, valor: '6,575%', valorPorcentaje: 0.06575},
                {id: 1, valor: '10%', valorPorcentaje: 0.10},
                {id: 1, valor: '13,51%', valorPorcentaje: 0.1351},
                {id: 1, valor: '15%', valorPorcentaje: 0.15},
                {id: 1, valor: '18.14%', valorPorcentaje: 0.1841},
                {id: 1, valor: '20%', valorPorcentaje: 0.20},
                {id: 1, valor: '23,33%', valorPorcentaje: 0.2333},
                {id: 1, valor: '25%', valorPorcentaje: 0.25},
                {id: 1, valor: '30%', valorPorcentaje: 0.30},
                {id: 1, valor: '35%', valorPorcentaje: 0.35},
                {id: 1, valor: '40%', valorPorcentaje: 0.40},
                {id: 1, valor: '45%', valorPorcentaje: 0.45},
                {id: 1, valor: '45,71%', valorPorcentaje: 0.457143},
                {id: 1, valor: '48.64%', valorPorcentaje: 0.486486},
                {id: 1, valor: '50%', valorPorcentaje: 0.50},
                {id: 1, valor: '55%', valorPorcentaje: 0.55},
                {id: 1, valor: '60%', valorPorcentaje: 0.60},
                {id: 1, valor: '65%', valorPorcentaje: 0.65},
                {id: 1, valor: '70%', valorPorcentaje: 0.70},
                {id: 1, valor: '75%', valorPorcentaje: 0.75},
                {id: 1, valor: '80%', valorPorcentaje: 0.80},
                {id: 1, valor: '88,7%', valorPorcentaje: 0.887},
                {id: 1, valor: '85%', valorPorcentaje: 0.85},
                {id: 1, valor: '90%', valorPorcentaje: 0.90},
                {id: 1, valor: '95%', valorPorcentaje: 0.95},
                {id: 1, valor: '100%', valorPorcentaje: 1}
            ];

            this.CATEGORIAS_RECEPCION_TURNOS = [
                {name: 'Inscripcion Ben Avid', value: 'Inscripcion Ben Avid'},
                {name: 'Inscripcion Elyon Yireh', value: 'Inscripcion Elyon Yireh'},
                {name: 'Matricula Curso', value: 'Matricula Curso'}
            ];

            this.CATEGORIAS_CARTERA_TURNOS = [
                {name: 'Codigo de Matricula', value: 'Codigo de Matricula'},
                {name: 'Convenio de pago', value: 'Convenio de pago'},
                {name: 'Estado Financiero', value: 'Estado Financiero'},
                {name: 'Descuento - Beca', value: 'Descuento - Beca'},
                {name: 'Liquidacion Matricula', value: 'Liquidacion Matricula'},
                {name: 'Liquidacion Niveles Ingles', value: 'Liquidacion Niveles Ingles'},
                {name: 'Paz y Salvo Financiero', value: 'Paz y Salvo Financiero'},
                {name: 'Saldo años anteriores', value: 'Saldo años anteriores'}
            ];

            this.CATEGORIAS_PRACTICA_TURNOS = [
                {name: 'Solicitud Practicas', value: 'Solicitud Practicas'},
                {name: 'Legalizacion Practicas', value: 'Legalizacion Practicas'}
            ];

            this.CATEGORIAS_ADMISIONES_TURNOS = [
                {name: 'Acta de grado', value: 'Acta de grado'},
                {name: 'Aplazamiento', value: 'Aplazamiento'},
                {name: 'Certificado de Notas', value: 'Certificado de Notas'},
                {name: 'Certificado de estudio', value: 'Certificado de estudio'},
                {name: 'Certificado de diplomado', value: 'Certificado de diplomado'},
                {name: 'Cambio de Semestre', value: 'Cambio de Semestre'},
                {name: 'Cambio de Horario', value: 'Cambio de Horario'},
                {name: 'Cambio de Documento', value: 'Cambio de Documento'},
                {name: 'Copia de Diploma', value: 'Copia de Diploma'},
                {name: 'Diplomados', value: 'Diplomados'},
                {name: 'Habilitacion', value: 'Habilitacion'},
                {name: 'Homologacion', value: 'Homologacion'},
                {name: 'Paz y Salvo Academico', value: 'Paz y Salvo Academico'},
                {name: 'Reintegro', value: 'Reintegro'}
            ];
            this.CATEGORIAS_CARNET_TURNOS = [
                {name: 'Toma de fotos', value:'Toma de fotos'},
                {name: 'Entrega de carnets', value: 'Entrega de carnets'}
            ];
            //<--- FUNCIONES --->
            this.MSG_SWAL_GENERIC = function (titulo, type) {
                swal({
                    title: titulo,
                    type: type,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
            };
            this.MSG_LOADING = function (titulo) {
                swal({
                    title: titulo,
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
            };
            this.MSG_CONFIRMACION = function () {
                swal({
                    title: 'Confirmando datos, espera un momento...',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
            };
            this.MSG_REPORTE = function () {
                swal({
                    title: 'Generando reporte, espera un momento...',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
            };
            this.MSG_ADVERTENCIA_BUSQUEDA = function () {
                swal({
                    title: 'La búsqueda no generó ningún resultado.. ',
                    type: 'warning',
                    showCancelButton: false,
                    confirmButtonText: 'Aceptar',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                });
            };
            this.MSG_CONFIRMACION_ANULACION = function () {
                swal({
                    title: '¿Esta seguro de anular el registro?',
                    type: 'warning',
                    input: 'textarea',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '¡Si, anularlo!',
                    inputValidator: function (value) {
                        return new Promise(function (resolve, reject) {
                            if (value) {
                                texto = value;
                                resolve();
                            } else {
                                reject('El motivo no puede ser vacio');
                            }
                        });
                    }
                }).then(function () {
                    swal('¡El registro ha sido anulado!', '', 'success');
                });

            };

            this.MSG_ERROR = function (title, type) {
                swal('Hubo un problema', title, type);
            };
            this.VALIDAR_STRING = function (value) {
                if (typeof value === 'string') {
                    value = value.toUpperCase();
                }
                return value;
            };
            this.MSG_GROWL_OK = function (text) {
                growl.success("<div><table><tr><td><i class='glyphicon glyphicon-ok' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><strong>BIEN HECHO</strong><BR><span>" + text + "</span></span></td></tr><table></div>");
            };
            this.MSG_GROWL_ADVERTENCIA = function (text) {
                growl.warning("<div><table><tr><td><i class='glyphicon glyphicon-warning-sign' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><strong>ALTO AHÍ</strong><BR><span>" + text + "</span></span></td></tr><table></div>");
            };
            this.MSG_GROWL_ERROR = function () {
                growl.error("<div><table><tr><td><i class='glyphicon glyphicon-remove-circle' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><strong>OOPS!!</strong><BR><span>Presentamos problemas en el sistema, comunícate con nosotros.</span></span></td></tr><table></div>");
            };
            this.MSG_GROWL_ERROR = function (text) {
                growl.error("<div><table><tr><td><i class='glyphicon glyphicon-remove-circle' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><BR><span>" + text + "</span></span></td></tr><table></div>");
            };
            this.MSG_REPORTE_ERROR = function () {
                growl.warning("<div><table><tr><td><i class='glyphicon glyphicon-warning-sign' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><strong>ALTO AHI</strong><BR><span>No se pudo generar el reporte.</span></span></td></tr><table></div>");
            };
            this.MSG_EMAIL_REPORTE_ERROR = function () {
                growl.warning("<div><table><tr><td><i class='glyphicon glyphicon-warning-sign' style='padding-left: 15px;font-size: 20px;'></i></td>&nbsp;&nbsp;<td  style='padding-left: 16px;'><span><strong>ALTO AHI</strong><BR><span>No se pudo enviar el certificado.</span></span></td></tr><table></div>");
            };
            this.CARGANDO = function () {
                swal.enableLoading();
            };
            this.CERRAR_SWAL = function () {
                swal.closeModal();
            };
            this.TO_DATE_LONG = function (dateStr) {
                var dateStrLong;
                if (typeof dateStr === 'undefined' || typeof dateStr === null) {
                    dateStr = null;
                    return dateStr;
                } else {
                    var parts = [];
                    if (dateStr.match('/')) {
                        parts = dateStr.split('/');
                    } else {
                        parts = dateStr.split('-');
                    }
                    dateStr = new Date(parts[2], parts[1] - 1, parts[0]);
                    dateStrLong = Date.parse(dateStr);
                    return dateStrLong;
                }
            };


            this.TO_LONG_DATE_FORMATO_DDMMYYYY = function (date) {
                var d = new Date(date),
                        month = '' + (d.getMonth() + 1),
                        day = '' + d.getDate(),
                        year = d.getFullYear();
                if (month.length < 2)
                    month = '0' + month;
                if (day.length < 2)
                    day = '0' + day;
                return [day, month, year].join('/');
            };

            this.MENSAJE_GENERICO = function (data) {
                switch (data.tipo) {
                    case 200:
                        this.MSG_GROWL_OK(data.message);
                        break;
                    case 409:
                        this.MSG_GROWL_ADVERTENCIA(data.message);
                        break;
                    case 400:
                        this.MSG_GROWL_ERROR();
                        break;
                    case 500:
                        this.MSG_GROWL_ERROR();
                        break;
                }
            };

            this.VALIDAR_NULL_UNDEFINED_VACIO = function (data) {
                return  (data !== null &&
                        data !== "" &&
                        data !== undefined);
            };

        }]).constant('appGenericConstant', {
        'MICRO_SERVICIO_ADMISIONES': 'admisiones',
        'MICRO_SERVICIO_FINANCIERO': 'financiero',
        'MICRO_SERVICIO_CRM': 'crm',
        'MICRO_SERVICIO_CONFIGENERAL': 'configeneral',
        'MICRO_SERVICIO_MATRICULA': 'matricula',
        'MICRO_SERVICIO_USUARIO': 'auth',
        'INSCRITO': 'INSCRITO',
        'ESPACIO': ' ',
        'GUION_ESPACIO': ' - ',
        'VACIO': '""',
        'VACIO_DOBLE': "",
        'INDEFINIDO': 'undefined',
        'CERO': 0,
        'UNO': 1,
        'DOS': 2,
        'TRES': 3,
        'CUATRO': 4,
        'CINCO': 5,
        'SEIS': 6,
        'SIETE': 7,
        'OCHO': 8,
        'NUEVE': 9,
        'DIEZ': 10,
        'DIECISIETE': 17,
        'VEINTIUNO': 21,
        'SETENTA': 70,
        'CARTAGENA': 'COLOMBIA - BOLÍVAR - CARTAGENA DE INDIAS',
        'ACTIVO': 'active',
        'SI': 'si',
        'NO_MAYUS': 'NO',
        'ENTER': 13,
        'PAIS_DEFECTO': 4,
        'DEPARTAMENTO_DEFECTO': 4,
        'MUNICIPIO_DEFECTO': 1059,
        'ID_PAIS_COLOMBIA': 4,
        'OTRO_CODE': '0000000000000',
        //mensajes de notificación http
        'OK': 200,
        'ERROR': 500,
        'ADVERTENCIA': 409,
        'ERROR4': 400,
        'FECHA_DDMMYYYY': 'dd/MM/yyyy',
        'FECHA_MMDDYYYY': 'MM/dd/yyyy',
        'ID_SEMINARIO': 220,
        'ID_DIPLOMADO': 219,
        'ID_CURSO': 218,
        'ID_CONGRESO': 217,
        'ID_UNIVERSIDAD_ELYON_YIRETH': 1,
        'INSCRIPCION': 'En Inscripcion',
        'ABIERTO': 'Abierto',
        'ABIERTA': 'ABIERTA',
        'ESTADO_ACTIVO': 'ACTIVO',
        'CAMPO_REQUIERE_NUMEROS_OCHO': 'Campo requiere un número de 8 digitos',
        'CAMPO_REQUIRE_NUMEROS_DIEZ': 'Campo requiere un número de 10 digitos',
        'CARGANDO': 'Cargando datos, espera un momento...',
        'CONFIRMANDO_DATOS': 'Confirmando datos, espera un momento...',
        'CARGANDO_MAPA_ESPERE': 'Cargando mapa, espera un momento...',
        'INFORMACION_FINANCIERA_DEL_ESTUDIANTE': 'Cargando datos del estudiante, espera un momento...',
        'CARGANDO_GRAFICA': 'Cargando gráfica, espera un momento...',
        'CRITERIOS_DE_BUSQUEDA': 'No ha seleccionado criterios de búsqueda',
        'ASPIRANTE_RECHAZADO': 'El aspirante ha sido rechazado.',
        'RECHAZADO': 'RECHAZADO',
        'ADMITIDO': 'ADMITIDO',
        'NO_LIQUIDACION': 'No se pudo generar la liquidación',
        'ASPIRANTE_ADMITIDO': 'El aspirante ha sido admitido.',
        'ASPIRANTES_ADMITIDOS': 'Los aspirantes seleccionados han sido admitidos.',
        'VERIFICACION_REQUISITO': 'La verificación de requisitos se ha realizado exitosamente.',
        'EXTENSION_PDF': '.PDF',
        'ERROR_INTERNO_SISTEMA': 'No se pudo realizar el proceso debido a un error interno del sistema. Cerciorese que tiene conexión a Internet, si es así, comunícate con nosotros.',
        'AGREGAR_MODULO': 'Agregar modulo',
        'REGISTRO_GUARDADO': 'Tu registro ha sido agregado.',
        'EXISTE_NIVEL_FORMACION': 'Ya existe un nivel de formación con el código ingresado.',
        'CODIGO_EXISTE': 'CÓDIGO EXISTE',
        'REGISTRO_MODIFICADO': 'Tu registro ha sido modificado.',
        'REGISTRO_ELIMINADO': 'Tu registro ha sido eliminado.',
        'MODIFICAR_NIVEL_FORMACION': 'Modificar Nivel de Formación',
        'PREG_ELIMINAR_NIVEL_FORMACION': '¿Estás seguro que deseas eliminar este nivel de formación?',
        'PREG_ELIMINAR_NIVELES_FORMACION': '¿Estás seguro que deseas eliminar los niveles de formación seleccionados?',
        'CAMBIOS_IRREVERSIBLES': 'Recuerda que los cambios son irreversibles.',
        'ELIMINANDO_REGISTRO': 'Eliminando registro, espera un momento...',
        'NIVEL_FORMACION_ELIMINADO': 'Nivel de Formación Eliminado',
        'NIVELES_FORMACION_ELIMINADO': 'Niveles de Formación Eliminados',
        'NIVEL_FORMACION_ELIMINADO_SATISFACTORIO': 'El nivel de formación ha sido eliminado satisfactoriamente.',
        'NIVELES_FORMACION_ELIMINADO_SATISFACTORIO': 'Los niveles de formación han sido eliminados satisfactoriamente.',
        'NIVEL_FORMACION_NO_ELIMINADO': 'El nivel de formación no pudo ser eliminado.',
        'NIVELES_FORMACION_NO_ELIMINADO': 'Algunos niveles de formación no pudieron ser eliminados.',
        'ACEPTAR': 'Aceptar',
        'CANCELAR': 'Cancelar',
        'SUCCESS': 'success',
        'WARNING': 'warning',
        'QUESTION': 'question',
        'CANCEL': 'cancel',
        'NO': 'NO',
        'INFO': 'info',
        'REGRESAR': 'Regresar',
        'IMPRIMIR': 'Imprimir',
        'INGRESAR': 'Ingresar',
        'CAMBIANDO_PROGRAMA': 'Cambiando programa, espere un momento',
        'CAMBIO_PROGRAMA_NO_POSIBLE': 'No fue posible realizar el cambio de programa.',
        'HUBO_PROBLEMA': 'Hubo un problema',
        'NO_ENCONTRARON_PROGRAMA': 'No se encontraron programas',
        'NO_SELECCION_PROGRAMA': 'No ha seleccionado un programa académico',
        'INGRESAR_CODIGO': 'Debe ingresar un codigo a verificar.',
        'ASISTENCIA_DIARIA': 'La asistencia diaria se registró satisfactoriamente.',
        'ESTUDIANTE_NO_EDUCACION_CONTINUADA': 'El estudiante no se encuentra inscrito en el programa de educación continuada',
        'GENERAR_NO_CERTIFICADO': 'No es posible generar el certificado porque no se ha configurado el programa selecionado en el período Actual.',
        'ENVIAR_NO_CERTIFICADO': 'No es posible enviar el certificado porque no se ha configurado el programa selecionado en el período Actual.',
        'AGREGAR_CALENDARIO_ACADEMICO': 'Agregar Calendario Académico',
        'VER_CALENDARIO_ACADEMICO': 'Ver Calendario Académico',
        'MODIFICAR_CALENDARIO_ACADEMICO': 'Modificar Calendario Académico',
        'PREG_ELIMINAR_PROGRAMA_ACADEMICO': '¿Estás seguro que deseas eliminar este programa académico?',
        'CALENDARIO_ACADEMICO_ELIMINADO': 'Calendarios Académicos Eliminados',
        'AGREGAR_CATEGORIA_ACTIVIDADES': 'Agregar Categoría de Actividades',
        'VER_DETALLES_CATEGORIA_ACT': 'Ver detalles de Categoría de Actividades',
        'MODIFICAR_CATEGORIA_ACTIVIDADES': 'Modificar Categoría de Actividades',
        'ELIMINAR_REGISTRO': '¿Está seguro que desea eliminar este registro?',
        'ELIMINAR_REGISTROS': '¿Está seguro que desea eliminar estos registros?',
        'TITLE_CATEGORIA_ELIMINADA': 'Categoria Eliminada',
        'TITLE_CATEGORIAS_ELIMINADAS': 'Categorias Eliminadas',
        'MSG_CATEGORIA_ELIMINADA': 'La Categoria ha sido eliminada satisfactoriamente.',
        'MSG_CATEGORIAS_ELIMINADAS': 'Las Categorias han sido eliminadas satisfactoriamente.',
        'DETALLE_ASIGNACION_REGISTRO': 'Detalle Asignación de Registros',
        'ASIGNAR_REQUISITOS': 'Asignar Requisitos',
        'ASIGNAR_REQUISITOS_SATISFACTORIO': 'Requisitos asignados satisfactoriamente.',
        'CONSULTAR_ESTUDIANTE': 'Consultando estudiante...',
        /*
         * EDUCACION CONTINUADA
         */
        'DETALLE_EDUCACION_CONTINUADA': 'Detalle Configuración Educación Continuada',
        'CONFIG_EDUCACION_CONTINUADA': 'Configurar Educación Continuada',
        /*
         * GRUPO MODULO
         */
        'GUARDANDO_MODULO': 'Guardando grupo módulo, espere un momento...',
        'MODIFICAR': 'MODIFICAR',
        'MODIFICAR_GRUPO_MODULO': 'Modificando grupo módulo, espere un momento...',
        'GENERANDO_REPORTE_ESPERE': 'Generando Reporte, espere un momento...',
        'NO_GENERAR_REPORTE': 'No se pudo generar el reporte.',
        /*
         *HOJA DE VIDA ESTUDIANTE
         */
        'VERIFICANDO_ASPIRANTE': 'Verificando aspirante, espere un momento...',
        'GUARDANDO_DATOS': 'Guardando datos',
        'DATOS_ACTUALIZADO_SATISFACTORIO': 'La actualización de datos se realizó satisfactoriamente',
        'GUARDANDO_DATOS_ESPERE': 'Guardando datos, espere un momento...',
        'ENVIANDO_MENSAJE_ESPERE': 'Enviando mensaje, espere un momento...',
        'HAY_DATOS_SIN_CONFIRMAR': 'Hay campos sin confirmar',
        'PREG_DESEA_GUARDARLOS': '¿Deseas guardarlos de todos modos?',
        /*
         * INSCRIPCION
         */
        'VERIFICACION_EXITOSA': 'VERIFICACIÓN EXITOSA',
        'INSCRIPCION_EXITOSA': 'INSCRIPCIÓN EXITOSA',
        'INSCRIPCION_GUARDADA': 'Su inscripción ha sido guardada con éxito.',
        'PAGO_EXITO': 'Su pago ha sido verificado con éxito presione Aceptar para continuar con su inscripción.',
        'VERIFICACION_ESTUDIANTE': 'Verificación de estudiante exitosa',
        'EDUCACION_NO_CONTINUADA': 'No se ha encontrado configuración de programa de educación continuada.',
        /*
         * MALLA ACADEMICA
         */
        'AGREGAR_MALLA_ACADEMICA': 'Agregar malla académica',
        'VER_MALLA_ACDEMICA': 'Ver detalle malla académica',
        'MODIFICAR_MALLA_ACDEMICA': 'Modificar malla académica',
        'NO_ENCONTRARON_COINCIDENCIAS': 'No se encontraron coincidencias en la búsqueda.',
        /*
         * MODULOS
         */
        'VER_DETALLE_MODULO': 'Ver detalle módulo',
        /*
         * NIVEL FORMACION
         */
        'AGREGAR_NIVEL_FORMACION': 'Agregar Nivel de Formación',
        /*
         * SOLICITUD HABILITACION
         */
        'SOLICITUD_HABILITACION_HECHA': 'La solicitud de habilitación se ha realizado satisfactoriamente',
        'SOLICITUD_HABILITACION_EXISTE': 'Ya existe una solicitud de habilidacion para esta referencia',
        'PAGADA': 'PAGADA',
        'REFERENCIA_NO_ENCONTRADA': 'La referencia ingresada no existe',
        'REFERENCIA_NO_PAGADA': 'La referencia ingresada NO se encuentra pagada',
        'ESTUDIANTE_NO_REPROBADO': 'El estudiante NO tiene modulos REPROBADOS',
        /*
         * PERIODOS ACADEMICOS
         */
        'DETALLE': 'DETALLE',
        'FECHA_INICIO_MAYO_FINAL': 'La fecha de inicio no debe ser mayor a la fecha de fin.',
        'ANO_DEBE_TENER_CARACTERES': 'El año lectivo debe tener 4 carácteres.',
        'FECHA_INICIO_MENOR_ANO': 'La fecha de inicio no debe ser menor  al año lectivo.',
        'FECHA_FIN_MENOR_ANO': 'La fecha de fin no debe ser menor  al año lectivo.',
        'PREG_ELIMINAR_PERIODO_ACADEMICO': 'Estás seguro que deseas eliminar este período académico',
        'PERIODO_ACADEMICO_ELIMINADO': 'Período Académico eliminado',
        'PERIODO_ACADEMICO_ELIMINADO_SATIS': 'El período académico ha sido eliminado satisfactoriamente',
        'PERIODOS_ACADEMICOS_ELIMINADOS': 'Períodos académicos eliminados',
        'PERIODOS_ACADEMICOS_ELIMINADOS_SATIS': 'Los períodos académicos han sido eliminados satisfactoriamente',
        'AGREGAR': 'AGREGAR',
        'ALTO_AHI': 'Alto Ahí',
        'REGISTRO_UTILIZADO': 'No es posible eliminar el registro seleccionado porque esta siendo utilizado',
        'PREG_ELIMINAR_PERIODOS_ACADEMICOS': '¿Estás seguro que deseas eliminar los períodos académicos seleccionados?',
        'ALGUNOS_REGISTROS': 'Algunos registros no pudieron ser eliminados!',
        /*
         * PREINSCRIPCION
         */
        'CONSULTANDO_DATOS_ESPERE': 'Consultando datos, espere un momento...',
        'NO_PROGRAMA_PLANEACION': 'No se encontraron programas con planeación académica',
        'CAMPO_REQUERIDO': 'Campo requerido.',
        'OTRO': 'OTRO',
        /*
         * PREREQUISITO
         */
        'AGREGAR_REQUISITO': 'Agregar Requisito',
        'PREG_ELIMINAR_REQUISITO': '¿Está seguro que deseas eliminar este requisito?',
        'PREG_ELIMINAR_REQUISITOS': '¿Está seguro que deseas eliminar los requisitos seleccionados?',
        'REQUISITO_ELIMINADO': 'Requisito Eliminado',
        'REQUISITOS_ELIMINADOS_SATIS': 'Requisitos han sido eliminados satisfactoriamente.',
        'REQUISITOS_ELIMINADOS': 'Requisitos eliminados',
        'REQUISITO_ELIMINADO_SATI': 'El requisito ha sido eliminado satisfactoriamente.',
        'REQUISITO_NO_ELIMINADO': 'El requisito no pudo ser eliminado.',
        'ALGUNOS_REQUISITOS': 'Algunos requisitos no pudieron  ser eliminados.',
        'CODIGO_REGISTRO_EXISTE': 'Ya existe un registro con el código asignado.',
        'NOMBRE_REGISTRO_EXISTE': 'Ya existe un registro con el nombre ingresado.',
        'MODIFICAR_REQUISITO': 'Modificar Requisito',
        'DETALLE_REQUISITO': 'Detalle Requisito',
        'SELECCIONE_TIPO': 'Seleccione un tipo',
        'SELECCIONE_ESTADO': 'Seleccione un estado',
        /*
         * PREREQUISITO INSCRIPCION
         */
        'AGREGAR_PROGRAGA_ACADEMICO': 'Agregar Programa Académico',
        'VER_PROGRAMA_ACADEMICO': 'Ver Programa Académico',
        'MODIFICAR_PROGRAMA_ACADEMICO': 'Modificar Programa Académico',
        'PROGRAMA_ACADEMICO_ELIMINADO': 'Programa Académico Eliminado',
        'PROGRAMA_ACADEMICO_ELIMINADO_SATIS': 'El programa académico ha sido eliminado satisfactoriamente.',
        'PROGRMA_ACADEMICO_ELIMINADOS_SATIS': 'Los programas académicos han sido eliminados satisfactoriamente.',
        'PROGRAMA_NO_ELIMINAR': 'No es posible eliminar el programa académico',
        'PROGRAMA_ACADEMICO_NO_ELIMINAR': 'El programa académico no pudo ser eliminado.',
        'PRG_ELIMINAR_PROGRAMAS': '¿Estás seguro que deseas eliminar los programas académicos seleccionados?',
        'PROGRAMA_ACADEMICOS_ELIMINADOS': 'Programas Académicos Eliminados',
        'ALGUNOS_PROGRAMAS': 'Algunos programas académicos no pudieron ser eliminados.',
        /*
         * PREREQUISITO INSCRIPCION
         */
        'EXISTE_CODIGO_INGRESADO': 'Ya existe un registro con el código ingresado.',
        'PREG_ELIMINAR_TIPOCONVENIO': '¿Estás seguro que deseas eliminar este tipo de convenio?',
        'PREG_ELIMINAR_TIPOCONVENIOS': '¿Estás seguro que deseas eliminar los tipos de convenios seleccionados?',
        'TIPOCONVENIO_ELIMINADO': 'Tipo de convenio eliminado',
        'TIPOCONVENIOS_ELIMINADOS': 'Tipos de convenios eliminados',
        'TIPOCONVENIO_ELIMINADO_SATIS': 'El tipo de convenio ha sido eliminado satisfactoriamente',
        'TIPOCONVENIOS_ELIMINADOS_SATIS': 'Los tipos de convenios han sido eliminados satisfactoriamente',
        /*
         * CRONOGRAMA
         */
        'INFORMACION': 'Información: Antes de actualizar debe realizar cambios en el formulario',
        'ADVERTENCIA_CRONOGRAMA': 'Advertencia',
        'REGISTRAR_CRONOGRAMA_ACADEMICO': 'REGISTRAR CRONOGRAMA ACADÉMICO',
        'REGISTRO_EXITOSO': 'REGISTRO EXITOSO: Tú registro ha sido agregado satisfactoriamente',
        'ACTUALIZACION_EXITOSO': 'ACTUALIZACION EXITOSO',
        'ELIMINACION_EXITOSO': 'ELIMINACIÓN EXITOSO: Tú registro ha sido eliminado satisfactoriamente',
        'EVENTO_ELIMINADO': 'El evento se ha eliminado',
        'ELIMINACION_SATIS': 'ELIMINACIÓN SATISFACTORIA: Tu registro ha sido eliminado satisfactoriamente',
        /*
         * GESTION ADMITIDOS
         */
        'ESTUDIANTE_NO_SOLICITUDES': 'El estudiante no tiene solicitudes registradas.',
        'ESTUDIANTE_NO_EXISTE': 'No existe un estudiante con el código ingresado',
        'CAMBIO_HORARIO': 'El cambio de horario se ha realizado satisfactoriamente',
        /*
         * PLANIFICACION ACADEMICA
         */
        'AGREGAR_PLANEACION': 'Agregar Planeación Académica',
        'MODIFICAR_PLANEACION': 'Modificar Planeación Académica',
        'DETALLE_PLANEACION': 'Detalle Planeación Académica',
        'PREG_ELIMINAR_PLENEACION': '¿Estás seguro que deseas eliminar esta planeación académica?',
        'PLANEACION_NO_ELIMINADA': 'La planecion académica no pudo ser eliminada.',
        'PLANEACION_ELIMINADA': 'Planeación Académica Eliminada',
        'PLANEACIONES_ELIMINADAS': 'Planeaciones Académicas Eliminadas',
        'PLANEACION_ELIMINADA_SATIS': 'La planeacion académica ha sido eliminada satisfactoriamente.',
        'PLANEACIONES_ELIMINADAS_SATIS': 'Las planeaciones académicas han sido eliminadas satisfactoriamente.',
        'NECESITAMOS_CONFIRMAR': 'Necesitamos Confirmar',
        'SEGURO_ELIMINAR_REGISTROS': '¿Seguro deseas eliminar los registros seleccionados?',
        'ALGUNOS_PLANEACIONES': 'Algunas planeaciones académicas no pudieron ser eliminadas.',
        'MODIFICAR_PROGRAMACION_ACEDEMICA': 'Modificar Programación Académica',
        'DETALLE_PROGRAMACION_ACADEMICA': 'Detalle Programación Académica',
        /*
         * RECURSOS EDUCATIVOS
         */
        'AGREGAR_RECURSO_EDUCATIVO': 'Agregar Recurso Educativo',
        'MODIFICAR_RECURSO_EDUCATIVO': 'Modificar Recurso Educativo',
        'DETALLE_RECURSO_EDUCATIVO': 'Detalle Recurso Educativo',
        'PREG_ELIMINAR_RECURSO_EDUCATIVO': '¿Estás seguro que deseas eliminar este recurso educativo?',
        'PREG_ELIMINAR_RECURSOS_EDUCATIVOS': '¿Estás seguro que deseas eliminar los recursos educativos seleccionados?',
        'RECURSO_ELIMINADO': 'Recurso Educativo Eliminado',
        'RECURSOS_ELIMINADOS': 'Recusos Educativos Eliminados',
        'RECURSO_ELIMINADO_SATIS': 'El recurso educativo ha sido eliminado satisfactoriamente.',
        'RECURSO_NO_ELIMINADO': 'El recurso educativo no pudo ser eliminado.',
        'RECURSOS_NO_ELIMINADOS': 'Los recursos educativos han sido eliminados satisfactoriamente.',
        'ALGUNOS_RECURSOS': 'Algunos recursos educativos no pudieron ser eliminados.',
        /*
         * AUDITORIA
         */
        'NO_MOVIMIENTO_CAJA': 'No se han realizado movimientos de caja para esta fecha.',
        /*
         * AUTENTICACION
         */
        'INICIANDO_SESION': 'Iniciando Sesión...',
        'USUARIO_NO_AUTORIZADO': 'Usuario No Autorizado',
        'USUARIO_CONTRASENA_INCORRECTA': 'Usuario o Contraseña incorrecta',
        'AUN_UN_INTENTO': 'Aún tienes un intento.',
        'CAMBIANDO_CONTRASENA': 'Cambiando contraseña...',
        'OOPS': 'Oops',
        'BIEN_HECHO': 'BIEN HECHO',
        'CARACTERES': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        'SESION_EXPIRADA': 'Sesión Expirada',
        'INACTIVIDAD': 'Se ha cerrado la sesión debido a que se ha detectado una inactividad de 15 minutos. Por favor, presione ACEPTAR  inicie sesión nuevament',
        /*
         * CONFIGURACION APP
         */
        'PRE_ELIMINAR_GRUPO': '¿Estás seguro que deseas eliminar este grupo?',
        'ELIMINANDO_GRUPO': 'Eliminando grupo, espera un momento...',
        'GRUPO_ELIMINADO': 'Grupo eliminado',
        'GRUPO_ELIMINADO_SATIS': 'El grupo ha sido eliminado satisfactoriamente',
        'GRUPO_NO_ELIMINADO': 'No es posible eliminar el grupo seleccionado porque esta siendo utilizado',
        /*
         * CARGO
         */
        'AGREGAR_CARGO': 'Agregar Cargo',
        'PREG_ELIMINAR_CARGO': '¿Estás seguro que deseas eliminar este cargo?',
        'CARGO_ELIMINADO': 'Cargo Eliminado',
        'CARGO_ELIMINADO_SATIS': 'El cargo ha sido eliminado satisfactoriamente.',
        'CARGO_NO_ELIMINADO': 'No es posible eliminar la cargo seleccionado porque esta siendo utilizada',
        'MODIFICAR_CARGO': 'Modificar Cargo',
        'PREG_ELIMINAR_CARGOS': '¿Estás seguro que deseas eliminar estos cargos?',
        'CARGOS_ELIMINADOS': 'Cargos Eliminados',
        'CARGOS_ELIMINADOS_SATIS': 'Los cargos han sido eliminados satisfactoriamente.',
        'CARGOS_NO_ELIMINADOS': 'Algunos cargos no pudieron ser eliminados',
        /*
         * INSTITUCION
         */
        'AGREGAR_INSTITUCION': 'Agregar Institución',
        'MODIFICAR_INSTITUCION': 'Modificar Institución',
        'PREG_ELIMINAR_INSTITUCION': '¿Estás seguro que deseas eliminar esta institución?',
        'INSTITUCION_ELIMINADA': 'Institución eliminada',
        'INSTITUCION_ELIMINADA_SATIS': 'La institución ha sido eliminada satisfactoriamente',
        'INSTITUCION_NO_ELIMINADA': 'No es posible eliminar la institución seleccionada porque esta siendo utilizada',
        'PREG_ELIMINAR_INSTITUCIONES': '¿Estás seguro que deseas eliminar estas instituciones?',
        'INSTITUCIONES_ELIMINADAS': 'INSTITUCIONES ELIMINADAS',
        'INSTITUCIONES_ELIMINADAS_SATIS': 'Las instituciones han sido eliminadas satisfactoriamente.',
        'DETALLE_INSTITUCION': 'Detalle Institución',
        /*
         * FACULTADES
         */
        'FACULTADES_ELIINADAS': 'Facultades Eliminadas',
        'AGREGAR_FACULTAD': 'Agregar Facultad',
        'PREG_ELIMINAR_FACULTAD': '¿Estás seguro que deseas eliminar esta facultad?',
        'FACULTAD_ELIMINADA': 'Facultad Eliminada',
        'FACULTAD_ELIMINADA_SATIS': 'La facultad ha sido eliminada satisfactoriamente.',
        'FACULTADES_ELIMINADAS_SATIS': 'Las facultades han sido eliminadas satisfactoriamente.',
        'FACULTAD_NO_ELIMINADA': 'No es posible eliminar la facultad seleccionada porque esta siendo utilizada',
        'PREG_ELIMINAR_FACULTADES': '¿Estás seguro que deseas eliminar estas facultades?',
        'ALGUNAS_FACULTADES': 'Algunas facultades no pudieron ser eliminadas',
        'MODIFICAR_FACULTAD': 'Modificar Facultad',
        /*
         * SECCIONAL
         */
        'AGREGAR_SECCIONAL': 'Agregar seccional',
        'MODIFICAR_SECCIONAL': 'Modificar seccional',
        'DETALLE_SECCIONAL': 'Detalle Seccional',
        /*
         * CARTERA
         */
        'SELECCIONAR_RANGO': 'Debes seleccionar un rango para la búsqueda por fechas',
        'MENSAJE_ENVIADO_CLIENTE_SELE': 'Se ha enviado un mensaje al cliente seleccionado',
        'MENSAJE_ENVIADO_CLIENTES_SELE': 'Se ha enviado un mensaje a los clientes seleccionados.',
        /*
         * GESTION CAMPAÑA
         */
        'AGREGAR_CAMPAÑA': 'AGREGAR CAMPAÑA',
        'AGREGAR_ACTIVIDAD': 'AGREGAR ACTIVIDAD',
        'DETALLE_CAMPAÑA': 'DETALLE CAMPAÑA',
        'DETALLE_ACTIVIDAD': 'DETALLE ACTIVIDAD',
        'MODIFICAR_CAMPAÑA': 'MODIFICAR CAMPAÑA',
        'MODIFICAR_ACTIVIDAD': 'MODIFICAR ACTIVIDAD',
        'GUARDANDO_CAMPAÑA_ESPERE': 'Guardando campaña, espere un momento...',
        'EXISTE_REGISTRO_CAMPAÑA': 'Ya existe un registro con el nombre y tipo de campaña ingresado.',
        'NO_PUEDE_CERRAR_CAMPAÑA': 'No se puede cerrar esta campaña porque tiene actividades en curso.',
        'ELIMINANDO_CAMPAÑA_ESPERE': 'Eliminando campaña, espere un momento...',
        'PREG_ELIMINAR_CAMPAÑA': '¿Estás seguro que deseas eliminar esta campaña?',
        'CAMPAÑA_NO_POSIBLE_ELIMINADA': 'No es posible eliminar la  campaña seleccionada.',
        'CAMPAÑA_ELIMINADA': 'Campaña Eliminada',
        'CAMPAÑA_ELIMINADA_SATIS': 'La campaña ha sido eliminada satisfactoriamente',
        'PREG_CAMPAÑAS_ELIMINADAS': '¿Estás seguro que deseas eliminar las campañas seleccionadas?',
        'CAMPAÑAS_ELIMINADAS': 'Campañas Eliminadas',
        'CAMPAÑAS_ELIMINADAS_SATIS': 'Las campañas han sido eliminadas satisfactoriamente',
        'ALGUNAS_CAMPAÑAS': 'Algunas campañas no pudieron ser eliminadas',
        'FECHA_FIN_ACTIVIDADES': 'La fecha de fin de las actividades no puede ser menor a la fecha inicio.',
        'RANGO_FECHA_ACTIVIDAD': 'El rango de fechas de la actividad no puede estar por fuera del rango de fechas de la campaña.',
        'GUARDANDO_ACTIVIDAD': 'Guardando actividad, espere un momento...',
        'RANGO_ACTIVIDAD_CAMPAÑA': 'El rango de fechas de la activdad no puede estar por fuera del rango de fechas de la campaña.',
        'ACTUALIZANDO_ACTIVIDAD': 'Actualizando actividad, espere un momento...',
        'PREG_ELIMINAR_ACTIVIDAD': '¿Estás seguro que deseas eliminar esta actividad?',
        'PREG_ELIMINAR_ACTIVIDADES': '¿Estás seguro que deseas eliminar las actividades seleccionadas?',
        'ELIMINANDO_ACTIVIDAD_ESPERE': 'Eliminando actividad, espere un momento...',
        'REGISTRO_POSIBLE_ELIMINAR': 'No es posible eliminar el registro seleccionado porque su estado se encuentra en curso',
        'ACTIVIDAD_ELIMINADA': 'Actividad Eliminada',
        'ACTIVIDADES_ELIMINADAS': 'Actividades Eliminadas',
        'ACTIVIDAD_ELIMINADA_SATIS': 'La actividad ha sido eliminada satisfactoriamente',
        'ACTIVIDADES_ELIMINADAS_SATIS': 'Las actividades han sido eliminadas satisfactoriamente',
        'ACTIVIDAD_NO_ELIMINAR': 'No es posible eliminar la actividad seleccionada porque está siendo utilizada',
        'ALGUNAS_ACTIVIDADES': 'Algunas actividades no pudieron ser eliminadas',
        'ENVIO_INDIVIDUAL_CORREO': 'Envío Individual de correo',
        'MENSAJE_CONTACTO_SELECCIONADO': 'Se ha enviado un mensaje al contacto seleccionado.',
        'ENVIO_MASIVO_CORREO': 'Envío Masivo de correos',
        'MENSAJE_CONTACTOS_SELECCIONADO': 'Se ha enviado un mensaje a los contactos seleccionados',
        /*
         * PUBLICO OBJETIVO
         */
        'AGREGAR_PUBLICO_OBJETIVO': 'AGREGAR PÚBLICO OBJETIVO',
        'CONTACTOS_SELECCIONADOS': 'Contactos Seleccionados',
        'CONTACTOS_DISPONIBLES': 'Contactos Disponibles',
        'DETALLE_PUBLICO_OBJETIVO': 'DETALLE PÚBLICO OBJETIVO',
        'CONTACTOS_ASOCIADOS': 'Contactos asociados',
        'GUARDANDO_PUBLICO_OBJETIVO': 'Guardando publico objetivo, espere un momento...',
        'PUBLICO_OBJETIVO_PADRE': 'El público objetivo padre no tiene contactos asociados.',
        'MODIFICAR_PUBLICO_OBJETIVO': 'MODIFICAR PÚBLICO OBJETIVO',
        'ACTUALIZANDO_PUBLICO_OBEJTIVO': 'Actualizando publico objetivo, espere un momento...',
        'ELIMINANDO_PUBLICO_OBJETIVO': 'Eliminando publico objetivo, espere un momento...',
        'PREG_ELIMINAR_PUBLICO_OBJETIVO': 'Estás seguro que deseas eliminar este público objetivo?',
        'PREG_ELIMINAR_PUBLICOS_OBJETIVOS': '¿Estás seguro que deseas eliminar los públicos objetivos seleccionados?',
        'PUBLICOS_OBJETIVOS_ELIMINADOS': 'Públicos Objetivos eliminados',
        'PUBLICOS_OBJETIVOS_ELIMINADOS_SATIS': 'Los públicos objetivos han sido eliminados satisfactoriamente',
        'PUBLICO_OBJETIVO_ELIMINADO_SATIS': 'El público objetivo ha sido eliminado satisfactoriamente',
        'PUBLICO_OBJETIVO_ELIMNADO': 'Público objetivo eliminado',
        'ELIMINANDO_TIPO_CAMPAÑA': 'Eliminando tipo de campaña, espere un momento...',
        'PREG_ELIMINAR_TIPO_CAMPAÑA': '¿Estás seguro que deseas eliminar este tipo de campaña?',
        'PREG_ELIMINAR_TIPOS_CAMPAÑAS': '¿Estás seguro que deseas eliminar los tipos de campañas seleccionados?',
        'TIPO_CAMPAÑA_ELIMINADO': 'Tipo de campaña eliminado',
        'TIPO_CAMPAÑA_ELIMINADO_SATIS': 'El tipo de campaña ha sido  eliminado satisfactoriamente',
        'TIPO_CAMPAÑA_NO_ELIMNADO': 'No es posible eliminar el tipo de campaña seleccionado',
        'ALGUNOS_TIPO_CAMPAÑA': 'No es posible eliminar algunos Tipos de campañas seleccionados',
        'TIPOS_CAMPAÑAS_ELIMINADOS': 'Tipos de campañas eliminados',
        'TIPOS_CAMPAÑAS_ELIMINADOS_SATIS': 'Los tipos de campaña han sido  eliminados satisfactoriamente',
        /*
         *CARGA DOCENTE
         */
        'EXISTE_NIVEL_TITULO': 'Ya existe un registro con el nivel de educativo y titulo académico ingresado.',
        'AGREGAR_DOCENTE': 'Agregar Docente',
        'AGREGAR_REGISTRO_INFORMACION_ACADEMICA': 'Debes agregar un registro de información académica.',
        'VER_DOCENTE': 'Ver Docente',
        'MODIFICAR_DOCENTE': 'Modificar Docente',
        /*
         * CUENTAS CONTABLES
         */
        'MODIFICAR_CUENTA_CONTABLE': 'Modificar Cuenta Contable',
        'AGREGAR_CUENTA_CONTABLE': 'Agregar Cuenta Contable',
        'PREG_ELIMINAR_CUENTA_CONTABLE': '¿Estás seguro que deseas eliminar esta cuenta contable? ',
        'CUENTA_CONTABLE_ELIMINADA': 'Cuenta contable eliminada',
        'CUENTA_CONTABLE_ELIMINADA_SATIS': 'La cuenta contable han sido eliminada satisfactoriamente.',
        'CUENTA_CONTABLE_NO_ELIMINADA': 'Esta cuenta contables no pudo ser eliminada. Puede que esté en uso.',
        'PREG_ELIMINAR_CUENTAS_CONTABLES': '¿Estás seguro que deseas eliminar las cuentas contables seleccionadas?',
        'CUENTAS_CONTABLES_ELIMINADA': 'Cuentas contables eliminadas',
        'CUENTAS_CONTABLES_ELIMINADAS_SATIS': 'Las cuentas contables han sido eliminadas satisfactoriamente.',
        'ALGUNAS_CUENTAS_CONTABLES': 'Algunas cuentas contables no pudieron ser eliminadas.',
        /*
         * CONCEPTO VALOR
         */
        'CONFIGURAR_CONCEPTO_VALOR': 'Configurar Concepto por Valor',
        'DETALLES_CONCEPTO_VALOR': 'Detalles Concepto por Valor',
        'AGREGAR_CONCEPTO_FACTURACION': 'Agregar Concepto de facturación',
        'MODIFICAR_CONCEPTO_FACTURACION': 'Modificar Concepto de facturación',
        'DETALLE_CONCEPTO_FACTURACION': 'Detalle Concepto de facturación',
        'PREG_ELIMINAR_CONCEPTO_FACTURACION': '¿Estás seguro que deseas eliminar este concepto de facturación?',
        'PREG_ELIMINAR_CONCEPTOS_FACTURACION': '¿Estás seguro que deseas eliminar los conceptos de facturación seleccionados?',
        'CONCEPTO_FACTURACION_ELIMINADO_SATIS': 'El concepto de facturación ha sido eliminado satisfactoriamente.',
        'CONCEPTO_FACTURACION_NO_ELIMINAR': 'No se puede eliminar un concepto de facturación que tenga elementos relacionados',
        'ALGUNOS_CONCEPTOS_FACTURACION': 'Algunos conceptos de facturación no pudieron ser eliminados',
        'CONCEPTO_FACTURACION_ELIMINADOS': 'Conceptos de Facturación Eliminados',
        'CONCEPTO_FACTURACION_ELIMINADOS_SATIS': 'Los conceptos de facturación han sido eliminados satisfactoriamente',
        /*fv
         * PLANTILLAS
         */
        'AGREGAR_PLANTILLA': 'Agregar Plantilla',
        'DETALLE_PLANTILLA': 'Detalles de Plantilla',
        'MODIFICAR_PLANTILLA': 'Modificar Plantilla',
        'PLANTILLA_ELIMINADA': 'Plantilla Eliminada',
        'PLANTILLA_ELIMINADA_SATIS': 'La plantilla ha sido eliminada satisfactoriamente',
        'PLANTILLA_NO_ELIMINADA': 'La plantilla no pudo ser eliminada.',
        'PREG_ELIMINAR_PLANTILLA': '¿Estás seguro que deseas eliminar esta plantilla?',
        'AGREGAR_ENTIDAD_BANCARIA': 'Agregar Entidad bancaria o de Recaudo',
        'PREG_ELIMINAR_ENTIDAD_BANCARIA': '¿Estás seguro que deseas eliminar esta entidad bancaria?',
        'ENTIDAD_BANCARIA_ELIMINADA': 'Entidad bancaria eliminada',
        'ENTIDAD_BANCARIA_ELIMINADA_SATIS': 'La entidad bancaria ha sido eliminada satisfactoriamente',
        'BANCO_NO_ELIMINAR': 'No se puede eliminar un banco que tenga elementos relacionados.',
        'ENTIDADES_BANCARIAS_ELIMINADAS': 'Entidades bancarias eliminadas',
        'ENTIDADES_BANCARIAS_ELIMINADAS_SATIS': 'Las entidades bancarias han sido eliminadas satisfactoriamente',
        'PREG_ELIMINAR_ENTIDADES_BANCARIAS': '¿Estás seguro que deseas eliminar las entidades bancarias seleccionadas?',
        'EXISTE_NIT_INGRESADO': 'Ya existe un registro con el NIT ingresado.',
        'DETALLE_ENTIDAD_RECAUDO': 'Detalle Entidad bancaria o de Recaudo',
        'MODIFICAR_ENTIDAD_BANCARIA': 'Modificar Entidad bancaria o de Recaudo',
        'CONFIGURACION_TIPO_COBRO': 'Configuración por tipo de cobro',
        'CONSULTANDO_ABONOS_REALIZADOS': 'Consultando abonos realizados...',
        'NO_HAY_ABONOS': 'No hay abonos realizados para hacer cruces.',
        'ABONO_INSUFICIENTE': 'El abono es insuficiente para cubrir el saldo a cruzar',
        'ESTUDIANTE_NO_TIENE_LIQUIDACION': 'El estudiante no tiene liquidaciones pendientes.',
        'HA_SELECCIONADO_ELEMENTOS': 'Ha seleccionado más de un elemento a editar',
        'PREG_ELIMINAR_FRANQUICIA': '¿Estás seguro que deseas eliminar esta franquicia?',
        'FRANQUICIA_ELIMINADA': 'Franquicia eliminada',
        'FRANQUICIA_NO_ELIMINADA': 'No es posible eliminar la franquicia seleccionada porque esta siendo utilizada',
        'FRANQUICIA_ELIMINADA_SATIS': 'La franquicia  ha sido eliminada satisfactoriamente',
        'CONVENIO_AGREGADO': 'El convenio ha sido agregado.',
        'EXISTE_CONVENIO_NOMBRE': 'Ya existe un convenio con el nombre ingresado',
        'EXISTE_CONVENIO_CODIGO': 'Ya existe un convenio con el código ingresado.',
        'PREG_ELIMINAR_FRANQUICIAS': '¿Estás seguro que deseas eliminar las franquicias seleccionadas?',
        'FRANQUICIAS_ELIMINADAS': 'Franquicias eliminadas',
        'FRANQUICIAS_ELIMINADAS_SATIS': 'Las franquicias han sido eliminadas satisfactoriamente',
        'NO_SE_ENCONTRO_ESTUDIANTE': 'No se encontró un estudiante con esta identificación',
        /*
         *PARAMETRO CREDITO
         */
        'VALOR_MINIMO_FINANCIAR': 'El valor mínimo a financiar no puede ser mayor que 100',
        'VALOR_MAXIMO_FINANCIAR': 'El valor máximo a financiar no puede ser mayor que 100',
        'TAZA_INTERES_CORRIENTE': 'La tasa de interés corriente no puede ser mayor que 100.',
        'TAZA_INTERES_MORA': 'La tasa de interés mora no puede ser mayor que 100.',
        'VALOR_MINIMO_NO_MAYOR_VALOR_MAXIMO': 'El valor mínimo a financiar no puede ser mayor que el valor máximo a financiar.',
        'CUOTA_MINIMA_NO_MAYOR_CUOTA_MAXIMA': 'La cuota mínima a financiar no puede ser mayor  que la cuota máxima a financiar',
        'REGISRO_CONFIGURADO': 'Tu registro ha sido configurado',
        'ESTUDIANTE_NO_PROGRAMA_ASOCIADO': 'El estudiante no tiene programa académico asociado',
        'ESTUDIANTE_TIENE_SOLICITUD_CREDITO': 'El estudiante ya tiene una solicitud de crédito financiero en el período actual.',
        'ESTUDIANTE_TIENE_CARTERA_VENCIDA': 'El estudiante tiene cartera vencida',
        'NO_ENCONTRO_LIQUIDACION_MATRICULA': 'No se encontró liquidación de matricula en el período académico actual para este  estudiante.',
        'FECHA_PLAN_AMORTIZACION_MODIFICADA_SATIS': 'Las fechas del plan de amortizacion han sido modificadas satisfactoriamente',
        'REALICE_SIMULACION': 'Realice por los menos una simulación.',
        'SOLICITUD_CREDITO_EXITOSO': 'Su solicitud de crédito se ha realizado exitosamente.',
        'SELECCIONAR_LINEA_CREDITO': 'Debe seleccionar una línea de crédito.',
        'SELECCIONAR_MODULO_FINANCIAR': 'Debe seleccionar por lo menos un módulo a financiar',
        'LINEA_CREDITO_NO_CONFIGURADA': 'La línea de crédito seleccionada no se encuentra configurada.',
        'AGREGAR_ROL': 'Agregar Rol',
        'ROL_ELIMINADO': 'Rol Eliminado',
        'MODIFICAR_ROL': 'Modificar Rol',
        'NECESARIO_CERRAR_SESION': 'Es necesario cerrar la sesión',
        'ROL_HA_GUARDAR': 'El rol ha guardar es utilizado por el usuario en sesión.',
        'CERRAR_SESION': 'Cerrar sesión',
        'ASIGNAR_ROLES_USUARIO': 'Asignar Roles por usuario',
        'MODIFICAR_ROLES_USUARIO': 'Modificar roles por usuario',
        'AGREGAR_USUARIO': 'Agregar Usuario',
        'CREAR_USUARIO_SISTEMA': 'Crear Usuario Sistema',
        'CONTRASENA_NO_COINCIDE': 'La contraseña no coincide',
        'CONTRASENA_DEBE_CONTENER': 'La contraseña debe contener minimo 8 caracteres y maximo 20',
        'VER_USUARIO': 'Ver Usuario',
        'MODIFICAR_USUARIO': 'Modificar Usuario',
        'MODIFICAR_USUARIO_SISTEMA': 'Modificar Usuario Sistema',
        'DETALLE_RECIBO_CAJA': 'Detalle Recibo de Caja',
        'ANULAR_RECIBO_CAJA': 'Anular Recibo de Caja',
        'DESEA_CONTINUAR': 'Desea continuar',
        'ANULARA_RECIBO_CAJA': 'Se anulará el recibo de caja',
        'USUARIO_CONTRASENA_INVALIDA': 'Usuario o Contraseña inválida',
        'RECIBO_PAGO_ANULADO': 'Recibo de Pago anulado',
        'RECIBO_PAGO_ANULADO_SATIS': 'El recibo de pago ha sido anulado satisfactoriamente',
        'ESTADO_CAJA_ABIERTA': 'Estado de la caja ABIERTA',
        'APERTURA_CAJA': 'Apertura de Caja',
        'DETALLE_CAJA': 'Detalle Caja',
        'MODIFICAR_CAJA': 'Modificar Caja',
        'AGREGAR_CAJA': 'Agregar Caja',
        'PREG_ELIMINAR_CAJA': '¿Estás seguro que deseas eliminar esta caja?',
        'PREG_ELIMINAR_CAJAS': '¿Estás seguro que deseas eliminar las cajas seleccionadas?',
        'CAJA_ELIMINADA': 'Caja Eliminada',
        'CAJAS_ELIMINADAS': 'Cajas Eliminadas',
        'CAJA_ELIMINADA_SATIS': 'La caja ha sido eliminada satisfactoriamente',
        'CAJAS_ELIMINADAS_SATIS': 'Las cajas han sido eliminadas satisfactoriamente.',
        'CAJA_NO_ELIMINADA': 'No fue posible eliminar la caja, por que está siendo utilizada',
        'ALGUNAS_CAJA': 'Algunas cajas no pudieron ser eliminadas!',
        'DESEA_CONTINUAR_PROCESO': '¿Desea continuar con el proceso?',
        'CAJA_DESCUADRADA': 'La caja se encuentra descuadrada!',
        'USUARIO_CLAVE_INVALIDA': 'Usuario o Clave invalida',
        'ESTADO_CAJA_CERRADA': 'Estado de la caja CERRADA',
        'MONTO_MAYOR_A_CAJA': 'El monto es mayor al total en caja',
        'CERCIORATE_CONEXION_INTERNET': 'Cerciorate que tienes conexión a Internet. Si es así, comunícate con nosotros',
        'AGREGAR_FORMA_PAGO': 'Agregar Forma de Pago',
        'VER_DETALLE_FORMA_PAGO': 'Ver detalles de Forma de Pago',
        'MODIFICAR_FORMA_PAGO': 'Modificar Forma de Pago',
        'PREG_ELIMINAR_FORMA_PAGO': 'Está seguro que desea eliminar esta Forma de Pago',
        'PREG_ELIMINAR_FORMAS_PAGOS': '¿Está seguro que desea eliminar estas Formas de Pago?',
        'FORMA_PAGO_ELIMINADO': 'Forma de Pago Eliminado',
        'FORMAS_PAGOS_ELIMINADOS': 'Formas de Pagos Eliminados',
        'FORMA_PAGO_ELIMINADO_SATIS': 'Forma de Pago ha sido eliminado satisfactoriamente',
        'FORMAS_PAGOS_ELIMINADOS_SATIS': 'Las formas de pagos  han sido eliminadas satisfactoriamente',
        'FORMA_PAGO_NO_ELIMINADO': 'Forma de Pago no pudo ser eliminado',
        'ALGUNAS_FORMAS_PAGOS': 'Algunas formas de pagos no pudieron ser eliminadas',
        'INGRESE_NUEVAMENTE_REFERENCIA': 'Ingrese nuevamente la referencia.',
        'REALIZANDO_CIERRE_PERIODO': 'Realizando cierre de período, espera un momento...',
        'CIERRE_PERIOSO_REALIZADO_SATIS': 'Cierre de Periodo Realizado Correctamente',
        'TENGA_EN_CUENTA': '¡IMPORTANTE!, debe crear un nuevo periodo academico en estado inscripción.',
        'MODULO_SE_AGREGO_MALLA': 'El modulo seleccionado ya se agrego a esta malla academica',
        /*GRUPO MATRICULA*/
        'NO_ESTUDIANTES': 'No hay estudiantes matriculados que coincidan con la configuración de este grupo',
        'REGISTRO_MATRICULA': 'El estudiante fue matriculado exitozamente.',
        'NO_SELECT_ESTUDIANTES': 'No ha asociado estudiantes al grupo',
        'MAX_ESTUDIANTE': 'El máximo de estudiantes para este grupo fue alcanzado, no puede agregar más',
        'NO_RESULTADO': 'La búsqueda para el programa y nivel seleccionado no arrojo resultados',
        'AGREGAR_CERTIFICADO': 'Agregar Certificado',
        'MODIFICAR_CERTIFICADO': 'Modificar Certificado',
        'AGREGAR_GESTIONAR_CERTIFICADO': 'Agregar Certificado',
        'MODIFICAR_GESTIONAR_CERTIFICADO': 'Modificar Certificado',
        'CONCEPTO_INGRESO': 'INGRESO',
        'SI_MAYUS': 'SI',
        'DETALLE_CERTIFICADO': 'Detalle Certificado'

    }).constant('appConstantValueList', {
//Lista_valor
        'LV_AREA_MODALIDAD': "AREA_MODALIDAD",
        'LV_NIVEL_ACADEMICO': "NIVEL_ACADEMICO",
        'LV_NIVEL_EDUCATIVO': "NIVEL_EDUCATIVO",
        'LV_ETAPA_REGISTRO': "ETAPA_REGISTRO",
        'LV_AREA_CONOCIMIENTO': "AREA_CONOCIMIENTO",
        'LV_ESTADO': "ESTADO",
        'LV_HORARIO': "HORARIO",
        'LV_HORARIO_MEDELLIN': "HORARIO_MEDELLIN",
        'LV_RECONOCIMIENTO_MEN': "RECONOCIMIENTO_MEN",
        'LV_TIPO_IDENTIFICACION': "TIPO_IDENTIFICACION",
        'LV_MEDIO_DIFUSION': "MEDIO_DIFUSION",
        'LV_MEDIO_CAPTURA': "MEDIO_CAPTURA",
        'LV_TIPO_VIVIENDA': 'TIPO_VIVIENDA',
        'LV_GRUPO_SANGUINEO': 'GRUPO_SANGUINEO',
        'LV_GENERO': 'GENERO',
        'LV_ESTADO_CIVIL': 'ESTADO_CIVIL',
        'LV_ESTRATO': 'ESTRATO',
        'LV_ESTADO_PERIODO_ACADEMICO': 'ESTADO_PERIODO_ACADEMICO',
        'LV_SECTOR_COLEGIO': 'SECTOR_COLEGIO',
        'LV_CARACTER_ACADEMICO': 'CARACTER_ACADEMICO',
        'LV_CAUSAL_ANULACION': 'CAUSAL_ANULACION',
        'LV_TIPO_CONCEPTO': 'TIPO_CONCEPTO',
        'LV_MOTIVO_PENDIENTE': 'MOTIVO_PENDIENTE',
        'ESTADO_CANDIDATO_CARTERA': 'ESTADO_CANDIDATO_CARTERA'
    });
})();
