'use strict';
/**
 * @ngdoc overview
 * @name YINN
 * @description
 * #YINN
 *
 * Main module of the application.
 */

angular.module('mytodoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngDialog',
    'ui.sortable',
    'LocalStorageModule',
    'mytodoApp.service',
    'mytodoApp.directive',
    'objectTable',
    'ghiscoding.validation',
    'pascalprecht.translate',
    'hiComponents.helpMe',
    'ngMask',
    'vAccordion',
    'angular-growl',
    'ui.utils.masks',
    'ngTagsInput',
    'xeditable',
    'ngFileUpload',
    'ui.bootstrap',
    'textAngular',
    'frapontillo.bootstrap-switch',
    'ui.select',
    'vcRecaptcha',
    'ngTable',
    'angular.filter',
    'satellizer',
    'nvd3',
    'ngMap',
    'ngJsonExportExcel',
    'webcam',
    'FBAngular',
    'ngIdle',
    'ivh.treeview',
    'ngFileSaver',
    'ntt.TreeDnD'
]).config(['localStorageServiceProvider', function (localStorageServiceProvider) {
    localStorageServiceProvider.setPrefix('ls')
        .setStorageType('sessionStorage');
}]).config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
}]).config(['$translateProvider', function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '../locales/validation/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('es').fallbackLanguage('es');
    $translateProvider.useSanitizeValueStrategy('escapeParameters');
}]).config(['growlProvider', function (growlProvider) {
    growlProvider.globalTimeToLive(3000);
    growlProvider.onlyUniqueMessages(true);
    growlProvider.globalDisableCountDown(true);
}]).config(['vcRecaptchaServiceProvider', function (vcRecaptchaServiceProvider) {
    vcRecaptchaServiceProvider.setDefaults({
        key: '6Lf0XGoUAAAAANMQZqDPJy1KoP2sec_FCDReSqNc',
        type: 'image'
    });
}]).config(function ($routeProvider, $httpProvider) {
    $routeProvider.when('/facturacion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/prerequisitos-inscripcion/template-ejemplo.html'
    }).when('/datatable', {
        templateUrl: 'views/datatable.html',
        controller: 'datatableCtrl'
    }).when('/wizard', {
        templateUrl: 'views/wizard.html'
    }).when('/forms', {
        templateUrl: 'views/forms.html'
    }).when('/plantilla-ejemplo', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/prerequisitos-inscripcion/template-ejemplo.html'
    }).when('/modals', {
        templateUrl: 'views/modals.html',
        controller: 'ModalesCtrl'
    }).when('/recurso-educativo', {
        templateUrl: 'base-app/administrativo-app/recurso-institucionales/recurso-educativos/recurso-educativo.html'
    }).when('/recurso-educativo-editar', {
        templateUrl: 'base-app/administrativo-app/recurso-institucionales/recurso-educativos/editar-recurso-educativo.html'
    }).when('/recurso-educativo-ver-mas', {
        templateUrl: 'base-app/administrativo-app/recurso-institucionales/recurso-educativos/ver-mas-recurso-educativo.html'
    }).when('/recurso-educativo-registrar', {
        templateUrl: 'base-app/administrativo-app/recurso-institucionales/recurso-educativos/registrar-recurso-educativo.html'
    }).when('/recurso-institucionales', {
        templateUrl: 'base-app/administrativo-app/recurso-institucionales/submenu-recurso-institucionales.html'
    }).when('/cud-caja', {
        templateUrl: 'base-app/tesoreria-app/caja/cud-caja.html'
    }).when('/cierre-caja', {
        templateUrl: 'base-app/tesoreria-app/cierre-caja/cierre-caja.html'
    }).when('/gestionar-caja', {
        templateUrl: 'base-app/tesoreria-app/caja/gestionar-caja.html'
    }).when('/registrar-pago', {
        templateUrl: 'base-app/tesoreria-app/registrar-pago/registrar-pago.html'
    }).when('/egresos', {
        templateUrl: 'base-app/tesoreria-app/egresos-caja/egresos-caja.html'
    }).when('/franquicia', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/franquicias/franquicias.html'
    }).when('/registrofranquicia', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/franquicias/gestionFranquicia.html'
    }).when('/adminstrativo', {
        templateUrl: 'base-app/administrativo-app/menu-adminstrativo.html'
    }).when('/admin-registro-control', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/submenu-admin-registro-control.html'
    }).when('/maestro-requisitos', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/prerequisitos-inscripcion/prerequisitos-inscripcion.html'
    }).when('/tesoreria', {
        templateUrl: 'base-app/tesoreria-app/menu-tesoreria.html'
    }).when('/gestionar-maestros-requisitos', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/prerequisitos-inscripcion/cud-requisitos.html'
    }).when('/registrar-requisito', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/prerequisitos-inscripcion/registrar-prerequisitos-inscripcion.html'
    }).when('/mostrar-requisito', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/prerequisitos-inscripcion/mostrar-prerequistos-inscripcion.html'
    }).when('/editar-requisito', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/prerequisitos-inscripcion/editar-prerequisitos-inscripcion.html'
    }).when('/financiero', {
        templateUrl: 'base-app/financiero-app/financiero/menu-financiero.html'
    }).when('/mostrar-prerequisito-inscripcion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/prerequisitos-inscripcion/mostrar-prerequisitos-inscripcion.html'
    }).when('/tesoreria', {
        templateUrl: 'base-app/tesoreria-app/menu-tesoreria.html'
    }).when('/programas-academicos', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/programas-academicos/programas-academicos.html'
    }).when('/programas-academicos-gestion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/programas-academicos/programas-academicos-gestion.html'
    }).when('/categorias-actividades', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/categorias-actividades/categorias-actividades.html'
    }).when('/categorias-actividades-gestion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/categorias-actividades/categorias-actividades-gestion.html'
    }).when('/templateok', {
        templateUrl: 'views/template.html'
    }).when('/tipo-campania', {
        templateUrl: 'base-app/crm-app/mercadeo-app/tipo-campañas/tipo-campaña.html'
    }).when('/gestion-tipo-campania', {
        templateUrl: 'base-app/crm-app/mercadeo-app/tipo-campañas/gestion-tipo-campaña.html'
    }).when('/configuracion', {
        templateUrl: 'base-app/configuracion-app/menu-configuracion.html'
    }).when('/administracion-general', {
        templateUrl: 'base-app/configuracion-app/administracion-general/sub-menu-administracion-general.html'
    }).when('/cud-facultad', {
        templateUrl: 'base-app/configuracion-app/administracion-general/facultades/cud-facultad.html'
    }).when('/facultad', {
        templateUrl: 'base-app/configuracion-app/administracion-general/facultades/facultad.html'
    }).when('/institucion', {
        templateUrl: 'base-app/configuracion-app/administracion-general/colegios/colegio.html'
    }).when('/gestionar-institucion', {
        templateUrl: 'base-app/configuracion-app/administracion-general/colegios/cud-colegios.html'
    }).when('/gestionar-institucion-fileUpload', {
        templateUrl: 'base-app/configuracion-app/administracion-general/colegios/fileUploadColegio.html'
    }).when('/crm', {
        templateUrl: 'base-app/crm-app/menu-crm.html'
    }).when('/cartera-interno', {
        templateUrl: 'base-app/crm-app/cartera/submenu-cartera.html'
    }).when('/crm-mercadeo', {
        templateUrl: 'base-app/crm-app/mercadeo-app/submenu-mercadeo.html'
    }).when('/crm-mercadeo-gestion-campania', {
        templateUrl: 'base-app/crm-app/mercadeo-app/gestion-campania/consultar-campania.html'
    }).when('/crm-mercadeo-gestion-campania-cud', {
        templateUrl: 'base-app/crm-app/mercadeo-app/gestion-campania/cud-campania.html'
    }).when('/crm-mercadeo-gestion-campania-cud-e', {
        templateUrl: 'base-app/crm-app/mercadeo-app/gestion-campania/cud-campania_1.html'
    }).when('/crm-mercadeo-gestion-actividad-cud', {
        templateUrl: 'base-app/crm-app/mercadeo-app/gestion-campania/cud-actividad.html'
    }).when('/crm-mercadeo-gestion-evento', {
        templateUrl: 'base-app/crm-app/mercadeo-app/gestion-eventos/consultar-evento.html'
    }).when('/crm-mercadeo-gestion-evento-registrar', {
        templateUrl: 'base-app/crm-app/mercadeo-app/gestion-eventos/registrar-evento.html'
    }).when('/crm-mercadeo-gestion-evento-ver', {
        templateUrl: 'base-app/crm-app/mercadeo-app/gestion-eventos/ver-evento.html'
    }).when('/crm-mercadeo-gestion-evento-editar', {
        templateUrl: 'base-app/crm-app/mercadeo-app/gestion-eventos/editar-evento.html'
    }).when('/formas-de-pago', {
        templateUrl: 'base-app/tesoreria-app/formas-de-pago/formas-de-pago.html'
    }).when('/formas-de-pago-gestion', {
        templateUrl: 'base-app/tesoreria-app/formas-de-pago/formas-de-pago-gestion.html'
    }).when('/banco', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/bancos/entidades-bancarias-recaudo.html'
    }).when('/periodos-academicos', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/periodos-academicos/periodo-academico.html'
    }).when('/gestion-periodo-academico', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/periodos-academicos/gestion-periodo-academico.html'
    }).when('/gestionar-entidad-banco-recaudo', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/bancos/cud-bancos.html'
    }).when('/weareworking', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/prerequisitos-inscripcion/template-404.html'
    }).when('/menu-facturacion', {
        templateUrl: 'base-app/facturacion-app/menu-facturacion.html'
    }).when('/gestionar-conceptos', {
        templateUrl: 'base-app/facturacion-app/gestion-de-conceptos/submenu-gestion-de-conceptos.html'
    }).when('/gestionar-concepto-facturacion', {
        templateUrl: 'base-app/facturacion-app/gestion-de-conceptos/conceptos-de-facturacion/gestion-conceptos-facturacion.html'
    }).when('/crud-conceptos-de-facturacion', {
        templateUrl: 'base-app/facturacion-app/gestion-de-conceptos/conceptos-de-facturacion/crud-conceptos-facturacion.html'
    }).when('/nivel-formacion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/nivel-formacion/nivel-formacion.html'
    }).when('/nivel-formacion-gestion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/nivel-formacion/nivel-formacion-gestion.html'
    }).when('/gestionar-puc-cuentas-contables', {
        templateUrl: 'base-app/facturacion-app/cuentas-contables/cuentas-contables.html'
    }).when('/gestionar-cuentas-contables-cud', {
        templateUrl: 'base-app/facturacion-app/cuentas-contables/cud-cuentas-contables.html'
    }).when('/tipo-programas', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/tipo-programas/tipo-programas.html'
    }).when('/tipo-programas-gestion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/tipo-programas/tipo-programas-gestion.html'
    }).when('/gestion-planeacion-academica', {
        templateUrl: 'base-app/administrativo-app/planificacion-academica/planeacion-academica/gestion-planeacion-academica.html'
    }).when('/crud-planeacion-academica', {
        templateUrl: 'base-app/administrativo-app/planificacion-academica/planeacion-academica/crud-planeacion-acedemica.html'
    }).when('/parametros-creditos', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/parametros-creditos/parametros-creditos.html'
    }).when('/gestion-parametros-creditos', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/parametros-creditos/gestion-parametros-credito.html'
    }).when('/solicitud-credito', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/solicitud-credito/solicitud-credito-financiero.html'
    }).when('/consulta-credito', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/solicitud-credito/consultar-credito-financiero.html'
    }).when('/consulta-creditos', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/solicitud-credito/consultar-creditos.html'
    }).when('/historial-credito', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/historial-credito/historial-credito-financiero.html'
    }).when('/historial-liquidacion', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/historial-liquidacion/historial-liquidacion.html'
    }).when('/aplicar-descuento', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/descuentos-historial/descuentos-historial.html'
    }).when('/definir-solicitud-credito', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/solicitud-credito/definir-solicitud-credito-financiero.html'
    }).when('/publico-objtivo', {
        templateUrl: 'base-app/crm-app/candidatos/candidatos.html'
    }).when('/publico-objtivo-cud', {
        templateUrl: 'base-app/crm-app/candidatos/candidatos.html'
    }).when('/tipos-convenios', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/tipos-convenios/tipo-convenio.html'
    }).when('/tipo-convenio-cud', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/tipos-convenios/tipo-convenio-cud.html'
    }).when('/admisiones', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/admisiones/admisiones.html'
    }).when('/preinscripcion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/incripcion/inicio-inscripcion.html'
    }).when('/inscripcion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/incripcion/inicio-inscripcion.html'
    }).when('/inscripcionapp', {
        templateUrl: 'base-app/inscripcion-app/menu-inscripcion.html'
    }).when('/pagainscripcion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/incripcion/inicio-inscripcion.html'
    }).when('/nopagainscripcion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/incripcion/inicio-inscripcion.html'
    }).when('/inscripcion-cud', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/incripcion/cud-inscripcion.html'
    }).when('/inscripcion-cud_1', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/incripcion/agendar-entrevista.html'
    }).when('/inscripcion-temp', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/incripcion/detalle-inscripciontemp.html'
    }).when('/inscripcion-wizard', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/incripcion/wizard-inscripcion.html'
    }).when('/inscripcion-curso', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/incripcion/cud-inscripcion-curso.html'
    }).when('/cronograma-academico', {
        templateUrl: '/base-app/administrativo-app/cronograma-academico/consultar-cronograma-academico.html'
    }).when('/cronograma-academico-cud', {
        templateUrl: '/base-app/administrativo-app/cronograma-academico/cud-cronograma-academico.html'
    }).when('/pruebas-y-entrevistas', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/pruebas-y-entrevistas/gestion-pruebas-y-entrevistas.html'
    }).when('/cud-pruebas-y-entrevistas', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/pruebas-y-entrevistas/cud-pruebas-y-entrevistas.html'
    }).when('/verificar-requisitos', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/verificar-requisitos/verificar-requisitos.html'
    }).when('/configuracion-requisitos-programas', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/configuracion-requisitos-programas/configuracion-requisitos-programas.html'
    }).when('/configuracion-requisitos-programas-gestion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/configuracion-requisitos-programas/configuracion-requisitos-programas-gestion.html'
    }).when('/liquidar-conceptos', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/liquidar-conceptos/liquidar-conceptos.html'
    }).when('/gestionar-liquidar-conceptos', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/liquidar-conceptos/cud-liquidar-conceptos.html'
    }).when('/apertura-cierre-caja', {
        templateUrl: 'base-app/tesoreria-app/apertura-cierre-caja/gestionar-apertura-cierre-caja.html'
    }).when('/apertura-caja', {
        templateUrl: 'base-app/tesoreria-app/apertura-cierre-caja/aperturaCaja.html'
    }).when('/configurar-programas-academicos', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/configurar-programas-academicos/configuracion-programa-academico.html'
    }).when('/gestion-configurar-programa', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/configurar-programas-academicos/gestion-configurar-programa.html'
    }).when('/liquidar-conceptos', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/liquidar-conceptos/liquidar-conceptos.html'
    }).when('/concepto-valor', {
        templateUrl: 'base-app/facturacion-app/gestion-de-conceptos/concepto-valor/concepto-valor.html'
    }).when('/concepto-valor-gestion', {
        templateUrl: 'base-app/facturacion-app/gestion-de-conceptos/concepto-valor/concepto-valor-gestion.html'
    }).when('/plantillas', {
        templateUrl: 'base-app/facturacion-app/plantillas/plantillas.html'
    }).when('/plantillas-gestion', {
        templateUrl: 'base-app/facturacion-app/plantillas/plantillas-gestion.html'
    }).when('/cartera', {
        templateUrl: 'base-app/crm-app/cartera/cartera/cartera.html'
    }).when('/cartera-gestion', {
        templateUrl: 'base-app/crm-app/cartera/cartera/cartera-gestion.html'
    }).when('/cruzar-referencia', {
        templateUrl: 'base-app/financiero-app/menu-financiero.html'
    }).when('/cruzar-referencia-masivo', {
        templateUrl: 'base-app/financiero-app/menu-financiero.html'
    }).when('/calendario-academico', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/calendario-academico/calendario-academico.html'
    }).when('/gestion-calendario-academico', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/calendario-academico/gestion-calendario-academico.html'
    }).when('/anular-recibo-caja', {
        templateUrl: 'base-app/tesoreria-app/anular-recibo-caja/anular-recibo-caja.html'
    }).when('/error-autorizacion', {
        templateUrl: 'base-app/autenticacion/error-autorizacion.html'
    }).when('/dashboard-interno', {
        templateUrl: 'base-app/crm-app/dashboard/submenu-dashboard.html'
    }).when('/dashboard-cartera', {
        templateUrl: 'base-app/crm-app/dashboard/dashboard-cartera/dashboard-cartera.html'
    }).when('/dashboard-cliente', {
        templateUrl: 'base-app/crm-app/dashboard/dashboard-cliente/dashboard-cartera.html'
    }).when('/dashboard-totales', {
        templateUrl: 'base-app/crm-app/dashboard/dashboard-totales/dashboard-totales.html'
    }).when('/dashboard-jerarquia-201702TL', {
        templateUrl: 'base-app/crm-app/dashboard/dashboard-tree201702TL/dashboard-tree.html'
    }).when('/descuentos', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/descuentos/descuentos.html'
    }).when('/clientes', {
        templateUrl: 'base-app/crm-app/clientes/clientes.html'
    }).when('/clientes-gestion', {
        templateUrl: 'base-app/crm-app/clientes/clientes-gestion.html'
    }).when('/docente', {
        templateUrl: 'base-app/docente/menu-docente.html'
    }).when('/gestion-docente', {
        templateUrl: 'base-app/docente/gestion-docente/gestion-docente.html'
    }).when('/cud-docente', {
        templateUrl: 'base-app/docente/gestion-docente/cud-docente.html'
    }).when('/seguridad', {
        templateUrl: 'base-app/seguridad-app/menu-seguridad.html'
    }).when('/ubicacion', {
        templateUrl: 'base-app/seguridad-app/ubicacion/ubicacion.html'
    }).when('/administracion-academica', {
        templateUrl: 'base-app/configuracion-app/administracion-academica/sub-menu-administracion-academica.html'
    }).when('/cud-grupo', {
        templateUrl: 'base-app/configuracion-app/administracion-academica/grupos/cud-grupo.html'
    }).when('/grupos', {
        templateUrl: 'base-app/configuracion-app/administracion-academica/grupos/grupos.html'
    }).when('/matricular-curso', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/matricular-curso/matricular-curso.html'
    }).when('/cargos', {
        templateUrl: 'base-app/configuracion-app/administracion-general/cargos/cargos.html'
    }).when('/cud-cargos', {
        templateUrl: 'base-app/configuracion-app/administracion-general/cargos/cud-cargos.html'
    }).when('/funcionario', {
        templateUrl: 'base-app/seguridad-app/funcionarios/submenuFuncionarios.html'
    }).when('/estudiante', {
        templateUrl: 'base-app/seguridad-app/estudiantes/submenuEstudiantes.html'
    }).when('/usuario', {
        templateUrl: 'base-app/seguridad-app/funcionarios/usuario/usuarios.html'
    }).when('/usuario-estudiante', {
        templateUrl: 'base-app/seguridad-app/estudiantes/usuarioEstudiante/usuariosEstudiantes.html'
    }).when('/cud-usuario', {
        templateUrl: 'base-app/seguridad-app/funcionarios/usuario/cud-usuario.html'
    }).when('/cud-usuario-estudiante', {
        templateUrl: 'base-app/seguridad-app/estudiantes/usuarioEstudiante/cud-usuarioEstudiante.html'
    }).when('/seccional', {
        templateUrl: 'base-app/configuracion-app/administracion-general/seccionales/gestion-seccionales.html'
    }).when('/cud-seccional', {
        templateUrl: 'base-app/configuracion-app/administracion-general/seccionales/cud-seccionales.html'
    }).when('/cargos', {
        templateUrl: 'base-app/configuracion-app/administracion-general/cargos/cargos.html'
    }).when('/cud-cargos', {
        templateUrl: 'base-app/configuracion-app/administracion-general/cargos/cud-cargos.html'
    }).when('/roles', {
        templateUrl: 'base-app/seguridad-app/funcionarios/roles/roles.html'
    }).when('/cud-roles', {
        templateUrl: 'base-app/seguridad-app/funcionarios/roles/cud-roles.html'
    }).when('/roles-usuario', {
        templateUrl: 'base-app/seguridad-app/funcionarios/roles-usuario/roles-usuario.html'
    }).when('/cud-roles-usuario', {
        templateUrl: 'base-app/seguridad-app/funcionarios/roles-usuario/cud-roles-usuario.html'
    }).when('/lista-admisiones', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/lista-admisiones/lista-admisiones.html'
    }).when('/asistencia-seminario', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/asistencia/asistencia.html'
    }).when('/verificar-asistencia', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/asistencia/asistencia-certificado.html'
    }).when('/verificar-asistencia-estudiante', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/asistencia/asistencia-certificado-estudiante.html'
    }).when('/verificar-asistencia-periodo', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/asistencia-periodo/asistencia-certificado-periodo.html'
    }).when('/configurar-educacion-continuada', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/configurar-educacion-continuada/configuracion-educacion-continuada.html'
    }).when('/gestion-configurar-educacion-continuada', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/configurar-educacion-continuada/gestion-configurar-educacion-continuada.html'
    }).when('/estado_financiero', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/estado-financiero/estado-financiero.html'
    }).when('/modulos', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/modulos/modulos.html'
    }).when('/modulos-gestion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/modulos/modulos-gestion.html'
    }).when('/malla-academica', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/malla-academica/malla-academica.html'
    }).when('/malla-academica-gestion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/malla-academica/malla-academica-gestion.html'
    }).when('/matricula-academica', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/matricula-academica/matricula-academica.html'
    }).when('/gestion-admitidos', {
        templateUrl: 'base-app/administrativo-app/gestion-admitidos/submenu-gestion-admitidos.html'
    }).when('/aplazamiento', {
        templateUrl: 'base-app/administrativo-app/gestion-admitidos/aplazamiento/aplazamiento.html'
    }).when('/cambio-horario', {
        templateUrl: 'base-app/administrativo-app/gestion-admitidos/cambio-horario/cambio-horario.html'
    }).when('/cambio-semestre', {
        templateUrl: 'base-app/administrativo-app/gestion-admitidos/cambio-semestre/cambio-semestre.html'
    }).when('/cambio-programa', {
        templateUrl: 'base-app/administrativo-app/gestion-admitidos/cambio-programa/cambio-programa.html'
    }).when('/nota-habilitacion', {
        templateUrl: 'base-app/administrativo-app/gestion-admitidos/habilitacion/habilitacion.html'
    }).when('/verificar-docente', {
        templateUrl: 'base-app/docente/verificar-nota-asistencia/verificar-nota-asistencia.html'
    }).when('/carga-docente', {
        templateUrl: 'base-app/docente/cargadocente/carga-docente.html'
    }).when('/carga-docente-gestion', {
        templateUrl: 'base-app/docente/cargadocente/crud-carga-docente.html'
    }).when('/planificacion-academica', {
        templateUrl: 'base-app/administrativo-app/planificacion-academica/submenu-planificacion-academica.html'
    }).when('/gestion-programacion-academica', {
        templateUrl: 'base-app/administrativo-app/planificacion-academica/programacion-academica/gestion-programacion-academica.html'
    }).when('/crud-programacion-academica', {
        templateUrl: 'base-app/administrativo-app/planificacion-academica/programacion-academica/crud-programacion-acedemica.html'
    }).when('/hoja-vida-estudiante', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/hoja-de-vida-estudiante/hoja-vida-estudiante.html'
    }).when('/auditoria', {
        templateUrl: 'base-app/auditoria-app/menu-auditoria.html'
    }).when('/historial-movimiento-caja', {
        templateUrl: 'base-app/auditoria-app/historial-movimiento-caja/historial-movimiento-caja.html'
    }).when('/auditoria-tipo-convenio', {
        templateUrl: 'base-app/auditoria-app/tipo-convenio/tipo-convenio-auditoria.html'
    }).when('/auditoria-desercion', {
        templateUrl: 'base-app/auditoria-app/desercion/desercion.html'
    }).when('/historial-movimiento-caja-detalle', {
        templateUrl: 'base-app/auditoria-app/historial-movimiento-caja/historial-movimiento-caja-gestion.html'
    }).when('/informe-reportes', {
        templateUrl: 'base-app/informes-reportes-app/menu-informes-reportes.html'
    }).when('/historial-ape-cierre', {
        templateUrl: 'base-app/informes-reportes-app/historial-apertura-cierre-caja/historial-aper-cierre.html'
    }).when('/historial-inicio', {
        templateUrl: 'base-app/informes-reportes-app/historial-inicio-sesion/historia-inicio.html'
    }).when('/historia-estudiante', {
        templateUrl: 'base-app/informes-reportes-app/historial-estudiante/historia-estudiante.html'
    }).when('/grupo-modulo', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/grupo-modulo/gestion-grupo-modulo.html'
    }).when('/cud-grupo-modulo', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/grupo-modulo/cud-grupoModulo.html'
    }).when('/candidatos', {
        templateUrl: 'base-app/crm-app/candidatos/candidatos.html'
    }).when('/agregar-candidatos', {
        templateUrl: 'base-app/crm-app/candidatos/cud-candidatos.html'
    }).when('/listar-candidatos', {
        templateUrl: 'base-app/crm-app/candidatos/lista-candidatos.html'
    }).when('/candidato-detalle', {
        templateUrl: 'base-app/crm-app/candidatos/candidato-detalle.html'
    }).when('/candidato-detalle-editar', {
        templateUrl: 'base-app/crm-app/candidatos/candidato-detalle-editar.html'
    }).when('/candidato-detalle-dashboard', {
        templateUrl: 'base-app/crm-app/candidatos/candidato-detalle-dashboard.html'
    }).when('/liquidar-matricula', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/liquidar-matricula/liquidar-matricula.html'
    }).when('/liquidar-matricula-2', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/liquidar-matricula-sin-descuento/liquidar-matricula.html'
    }).when('/solicitar-habilitacion', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/solicitud-habilitacion/solicitud-habilitacion.html'
    }).when('/cambiar-documento-estudiante', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/cambio-identificacion/cambio-identificacion-estudiante.html'
    }).when('/gestion-grupo-matricula', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/grupo-matricula/gestion-grupo-matricula.html'
    }).when('/gestion-grupo-matricula-estudiante', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/grupo-matricula/gestion-grupo-matricula-especifico.html'
    }).when('/matricula-estudiante', {
        templateUrl: 'base-app/estudiante-app/grupo-matricula-estudiante/gestion-grupo-matricula-especifico.html'
    }).when('/configuracion-nota', {
        templateUrl: 'base-app/configuracion-app/administracion-academica/configuracionnota/configuracion-nota.html'
    }).when('/asignar-nota', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/nota/asignar-nota.html'
    }).when('/modificar-menu-rol', {
        templateUrl: 'base-app/seguridad-app/funcionarios/roles/modificar-menu-roles.html'
    }).when('/malla-academica-detalle', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/malla-academica/malla-academica-detalle.html'
    }).when('/homologar', {
        templateUrl: 'base-app/administrativo-app/gestion-admitidos/homologar/homologar.html'
    }).when('/menu-estudiante', {
        templateUrl: 'base-app/estudiante-app/menu-estudiante.html'
    }).when('/malla-estudiante', {
        templateUrl: 'base-app/estudiante-app/malla-estudiante/malla-estudiante.html'
    }).when('/malla-estudiante-busqueda', {
        templateUrl: 'base-app/estudiante-app/malla-estudiante-codigo/malla-estudiante-codigo.html'
    }).when('/nota-estudiante', {
        templateUrl: 'base-app/estudiante-app/nota-estudiante/nota-estudiante.html'
    }).when('/paz-salvo-academico', {
        templateUrl: 'base-app/estudiante-app/paz-salvo-academico/paz-salvo-academico.html'
    }).when('/asignar-nota-docente', {
        templateUrl: 'base-app/docente/nota/asignar-nota-docente.html'
    }).when('/lista-descuento', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/descuentos/descuentosEstudiante.html'
    }).when('/estado-acedemico-estudiante', {
        templateUrl: 'base-app/administrativo-app/gestion-admitidos/estado-academico-estudiante/estado-academico-estudiante.html'
    }).when('/liquidar-modulo', {
        templateUrl: 'base-app/estudiante-app/liquidar-modulos/liquidar-modulo.html'
    }).when('/profile', {
        templateUrl: 'base-app/estudiante-app/hoja-vida-estudiante/curriculum-estudiante.html'
    }).when('/asistencia-diaria', {
        templateUrl: 'base-app/docente/asistencia/asistencia-diaria.html'
    }).when('/cambio-grupo', {
        templateUrl: 'base-app/administrativo-app/gestion-admitidos/cambio-grupo/cambio-grupo.html'
    }).when('/aspirante-grado', {
        templateUrl: 'base-app/administrativo-app/gestion-admitidos/aspirantes-graduados/aspirante-graduados.html'
    }).when('/certificados', {
        templateUrl: 'base-app/certificados-app/menu-certificados.html'
    }).when('/configuracion-certificado', {
        templateUrl: 'base-app/certificados-app/configuracion-certificados/configuracion-certificados.html'
    }).when('/configuracion-details', {
        templateUrl: 'base-app/certificados-app/configuracion-certificados/configuracion-certificados-details.html'
    }).when('/registrar-certificados', {
        templateUrl: 'base-app/certificados-app/generar-certificados/generar-certificados.html'
    }).when('/certificados-details', {
        templateUrl: 'base-app/certificados-app/generar-certificados/generar-certificados-details.html'
    }).when('/programacion-academica-horarios', {
        templateUrl: 'base-app/administrativo-app/planificacion-academica/programacion-academica/gestion-programacion-acedemica-horarios.html'
    }).when('/programacion-academica-horarios-details', {
        templateUrl: 'base-app/administrativo-app/planificacion-academica/programacion-academica/crud-programacion-acedemica-horarios.html'
    }).when('/reportes-administrativos', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/reportes-administrativos/reportes-administrativos.html'
    }).when('/historial-liquidacion-estudiante-e', {
        templateUrl: 'base-app/estudiante-app/historial-liquidacion/historial-liquidacion.html'
    }).when('/estado-financiero-estudiante', {
        templateUrl: 'base-app/estudiante-app/estado-financiero/estado-financiero.html'
    }).when('/liquidar-concepto-estudiante', {
        templateUrl: 'base-app/estudiante-app/liquidar-conceptos/liquidar-conceptos.html'
    }).when('/evaluacion-docente', {
        templateUrl: 'base-app/estudiante-app/evaluacion-docente/evaluacion-docente.html'
    }).when('/corte-gestion', {
        templateUrl: 'base-app/auditoria-app/corte-gestion/corte-gestion.html'
    }).when('/corte-gestion-convenio', {
        templateUrl: 'base-app/auditoria-app/corte-gestion-convenios/corte-gestion-convenios.html'
    }).when('/encuestas', {
        templateUrl: 'base-app/auditoria-app/encuesta/encuesta.html'
    }).when('/resultado-encuesta', {
        templateUrl: 'base-app/auditoria-app/encuesta/resultado-encuesta.html'
    }).when('/cambio-documento-auditoria', {
        templateUrl: 'base-app/auditoria-app/cambio-documento/cambio-documento-auditoria.html'
    }).when('/estudiante-retirado-auditoria', {
        templateUrl: 'base-app/auditoria-app/estudiante-retirado-auditoria/estudiante-retirado-auditoria.html'
    }).when('/auditoria-nota', {
        templateUrl: 'base-app/auditoria-app/auditoria-nota/auditoria-nota.html'
    }).when('/reportes-auditoria', {
        templateUrl: 'base-app/auditoria-app/reportes-administrativos/reportes-administrativos.html'
    }).when('/interfaz-contable-auditoria', {
        templateUrl: 'base-app/auditoria-app/interfaz-contable/interfaz-contable.html'
    }).when('/gestionEvaluacionEmpresa', {
        templateUrl: 'base-app/auditoria-app/encuesta/noSubirEmpresaEncuesta.html'
    }).when('/entrega-uniforme', {
        templateUrl: 'base-app/auditoria-app/auditoria-entrega-uniforme/auditoria-entrega-uniforme.html'
    }).when('/auditoria-convenio-informe', {
        templateUrl: 'base-app/auditoria-app/auditoria-convenio-informe/auditoria-convenio-informe.html'
    }).when('/historial-liquidacion-movimientos', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/historial-liquidacion/historial-liquidacion-movimientos.html'
    }).when('/referencia-bancaria', {
        templateUrl: 'base-app/financiero-app/financiero/financiero/referencia-bancaria/referencia-bancaria.html'
    }).when('/turno', {
        templateUrl: 'base-app/crm-app/turno/turno.html'
    }).when('/turno-pantalla', {
        templateUrl: 'base-app/crm-app/turno/turno-pantalla.html'
    }).when('/inscripcion-cursos', {
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/inscrptionV2/inscription-v2.html'
    }).when('/asistencia-estudiante-seminario',{
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/asistencia-seminario/asistencia-estudiante-seminario.html'
    }).when('/form-inscripcion-V2',{
        templateUrl: 'base-app/administrativo-app/admisiones-registro-control/inscrptionV2/inscription-v2.html'
    }).when('/liquidar-congresos',{
        templateUrl: 'base-app/financiero-app/financiero/financiero/liquidar-congresos/liquidar-congresos.html'
    })
      .otherwise({
        redirectTo: '/'
    });
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}).config(function ($provide) {
    $provide.decorator('hiHelpDB', ['helpDB', function (helpDB) {
        return helpDB;
    }]);
    $provide.decorator('hiHelpDesk', ['$delegate', function ($delegate) {
        $delegate.setLocale('es');
        return $delegate;
    }]);
}).value('helpDB', {
    /**
     * Define your locale specific HelpDb(Which is nothing but a JSON) using value provider
     * of Angular.
     * NOTE: This is just the one way to add HelpText. If you want to load help text
     * from server, then either monkey patch the `hiHelpDBService.get` using decorator
     * and get your JSON and return it. `helpDesk` Service is smart enough to handle the
     * angular promise object.
     */
    es: {
        email: 'Email',
        password: 'Fournir un mot de passe de 8 caractères atleast . Votre mot de passe doit avoir au moins 2 -numériques \
      1 - caractère spécial.',
        confirmEmail: 'Confirme Email.',
        file: 'Téléchargez votre dernier CV . S\'il vous plaît noter que le type de fichier doit être un texte, pdf , doc . \
      Taille du fichier peut être inférieure ou égale à 5 MB',
        gender: 'Mentionnez votre sexe. Il sera utilisé par notre moteur d\'intelligence pour filtrer \', mails indésirables sur',
        mac: 'El identificador de equipo(mac addres) corresponde a 6 pares de números hexadecimales separados por (:) ejemplo: af:23:43:cb:44:55',
        direccionEntidad: 'Digite una dirección y presione la tecla "coma" para confirmar. Si desea agregar varias, separelas por comas.',
        telefonoEntidad: 'Digite una teléfono y presione la tecla "coma" para confirmar. Si desea agregar varios, separelos por comas.',
        fechaPago: 'Las fechas de pago siguientes se calcularán de acuerdo a la fecha seleccionada.',
        contrasenha: 'Digite una contraseña minimo de 8 caracteres.',
        contrasenha2: 'Vuelva a digitar la contraseña del usuario.'
    }
}).run(function (editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}).run(function ($rootScope, $location, localStorageService) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        var ruta = '/#' + $location.$$path;
        if (localStorageService.get("autorizacion") === null) {
            $location.path("/");
            return;
        }
        if (window.history.forward(1)) {
            $location.path(window.history.forward(1));
        }
        var aux = localStorageService.get("modulo");
        for (var i = 0; i < aux.length; i++) {
            if (aux[i].ruta === ruta && aux[i].selected === false) {
                $location.path("/error-autorizacion");
                break;
            }
            if (aux[i].ruta === ruta) {
                break;
            }
            for (var j = 0; j < aux[i].children.length; j++) {
                if (aux[i].children[j].ruta === ruta && aux[i].children[j].selected === false) {
                    $location.path("/error-autorizacion");
                    break;
                }
                if (aux[i].children[j].ruta === ruta) {
                    break;
                }
                for (var k = 0; k < aux[i].children[j].children.length; k++) {
                    if (aux[i].children[j].children[k].ruta === ruta && aux[i].children[j].children[k].selected === false) {
                        $location.path("/error-autorizacion");
                        break;
                    }
                    if (aux[i].children[j].children[k].ruta === ruta) {
                        break;
                    }
                }
            }
        }
        $location.path($location.$$path);
        return;
    });
}).config(['KeepaliveProvider', 'IdleProvider', function (KeepaliveProvider, IdleProvider) {
    IdleProvider.idle(10);
    IdleProvider.timeout(900);
    KeepaliveProvider.interval(10);
}]).config(function (ivhTreeviewOptionsProvider) {
    ivhTreeviewOptionsProvider.set({
        idAttribute: 'id', labelAttribute: 'label', childrenAttribute: 'children', selectedAttribute: 'selected',
        useCheckboxes: true, expandToDepth: 0, indeterminateAttribute: '__ivhTreeviewIndeterminate',
        expandedAttribute: '__ivhTreeviewExpanded', defaultSelectedState: true, validate: true,
        twistieCollapsedTpl: '<span style="zoom:1.5" class="glyphicon glyphicon-chevron-right"></span>',
        twistieExpandedTpl: '<span style="zoom:1.5" class="glyphicon glyphicon-chevron-down"></span>',
        twistieLeafTpl: '&#9679;'
    });
});
