(function () {
    'use strict';
    angular.module('mytodoApp').controller('DashboardTreeCtrl', DashboardTreeCtrl);
    DashboardTreeCtrl.$inject = ['dashboardTreeService', '$scope', '$TreeDnDConvert', 'appConstant', 'appGenericConstant', 'localStorageService', 'appConstantValueList'];
    function DashboardTreeCtrl(dashboardTreeService, $scope, $TreeDnDConvert, appConstant, appGenericConstant, localStorageService, appConstantValueList) {
        var dashboardTreeControl = this;
        dashboardTreeControl.dashboardTree = dashboardTreeService.dashboardTree;
        dashboardTreeControl.dashboardTreeAuxiliar = dashboardTreeService.dashboardTreeAuxiliar;
        dashboardTreeControl.listaMatriculados = [];

        dashboardTreeControl.listaNivelesFormacion = [];
        dashboardTreeControl.listaPeriodoAcademicos = [];
        dashboardTreeControl.listaMatriculadosEC = [];
        //var to dnd
        var tree = {};
        $scope.tree_data = {};
        $scope.my_tree = tree = {};

        $scope._filter = {};
        $scope.expanding_property = {
            /*template: "<td>OK All</td>",*/
            field: 'Nombre',
            titleClass: 'text-center',
            cellClass: 'v-middle',
            displayName: 'Nombre'
        };

        $scope.col_defs = [
            { field: 'Descripcion' },
            { field: 'Cantidad' },
            { field: 'Total' }
        ];

        $scope.expanding_property_inside = {
            /*template: "<td>OK All</td>",*/
            field: 'Nombre',
            titleClass: 'text-center',
            titleTemplate: '<label> {{expandingProperty.displayName || expandingProperty.field || expandingProperty}} <input class="form-control" ng-model="_filter.Nombre"></label>',
            cellClass: 'v-middle',
            displayName: 'Nombre'
        };
        $scope.col_defs_inside = [
            {
                field: 'Descripcion',
                titleClass: 'text-center',
                titleTemplate: '<label> {{col.displayName || col.field}} <input class="form-control" ng-model="_filter.Descripcion"></label>'
            },
            {
                field: 'Cantidad',
                titleClass: 'text-center',
                titleTemplate: '<label> {{col.displayName || col.field}} <input class="form-control" ng-model="_filter.Cantidad"></label>'
            },
            {
                field: 'Total',
                titleClass: 'text-center',
                titleTemplate: '<label> {{col.displayName || col.field}} <input class="form-control" ng-model="_filter.Total"></label>'
            }];

        function onBuscarNivelesFormacion() {
            dashboardTreeService.listaNivelesFormacion().then(function (data) {
                dashboardTreeControl.listaNivelesFormacion = data;
                if (data[1]) {
                    dashboardTreeControl.dashboardTree.nivelFormacion = data[1].id; //nombreNivelFormacion;
                    onBuscarPeriodosAcademicos();
                }
            });
        }


        function onBuscarPeriodosAcademicos() {
            dashboardTreeService.listaPeriodosAcademicos().then(function (data) {
                dashboardTreeControl.listaPeriodoAcademicos = data;
                if (data[0]) {
                    dashboardTreeControl.dashboardTree.periodoAcademico = data[0].id;//nombrePeriodoAcademico;
                }
                consultarTree(dashboardTreeControl.dashboardTree.periodoAcademico, dashboardTreeControl.dashboardTree.nivelFormacion);
            });
        }

        onBuscarNivelesFormacion();

        //        localStorageService.set('listaMatriculados', dashboardTreeControl.listaMatriculados);

        dashboardTreeControl.onCambiarSelectPeriodoAcademico = function () {
            consultarTree(dashboardTreeControl.dashboardTree.periodoAcademico, dashboardTreeControl.dashboardTree.nivelFormacion);
            consultarListado(dashboardTreeControl.dashboardTree.periodoAcademico, dashboardTreeControl.dashboardTree.nivelFormacion);
        };

        dashboardTreeControl.onCambiarSelectNivelFormacion = function () {
            consultarTree(dashboardTreeControl.dashboardTree.periodoAcademico, dashboardTreeControl.dashboardTree.nivelFormacion);
            consultarListado(dashboardTreeControl.dashboardTree.periodoAcademico, dashboardTreeControl.dashboardTree.nivelFormacion);
        };

        dashboardTreeControl.getTotalMatriculados = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].cantidad);
            }
            return Math.round(totalNumber);
        };

        dashboardTreeControl.getTotalMatriculadosEc = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].cantidadEc);
            }
            return Math.round(totalNumber);
        };
        dashboardTreeControl.getTotalPagado = function (data) {
            if (!data || !data.length)
                return;

            var totalNumber = 0;
            for (var i = 0; i < data.length; i++) {
                totalNumber = totalNumber + parseFloat(data[i].valor);
            }
            return Math.round(totalNumber);
        };

        function consultarListado(idPeriodoAcademico, idNivelFormacion) {
            dashboardTreeService.listaMatriculadosEc(idPeriodoAcademico, idNivelFormacion).then(function (data) {
                dashboardTreeControl.listaMatriculadosEC = [];
                angular.forEach(data, function (value, key) {
                    angular.forEach(data.ec, function (valueEc, key) {
                        var matriculado = {
                            cantidad: value.cantidad,
                            horario: value.horario,
                            programa: value.programa,
                            semestre: value.semestre,
                            programaEc: valueEc.nombreProgramaEc,
                            cantidadEc: valueEc.cantidad
                        };
                        dashboardTreeControl.listaMatriculadosEC.push(matriculado);
                    });
                });

            }).catch(function (e) {
                dashboardTreeControl.listaMatriculadosEC = [];
                swal(appGenericConstant.HUBO_PROBLEMA, appGenericConstant.ERROR_INTERNO_SISTEMA, appGenericConstant.WARNING);
                appConstant.CERRAR_SWAL();
                return;
            });
        }

        function consultarTree(idPeriodoAcademico, idNivelFormacion) {
            appConstant.MSG_LOADING(appGenericConstant.CARGANDO);
            appConstant.CARGANDO();
            dashboardTreeService.listaMatriculadosExport(idPeriodoAcademico, idNivelFormacion).then(function (data) {
                var arr = $.map(JSON.parse(data.responseList[0]), function (el) {
                    return el
                });
                dashboardTreeControl.listaMatriculados = [];
                angular.forEach(arr, function (value, key) {
                    var matriculado = {
                        cantidad: value.cantidad,
                        horario: value.horario,
                        modalidad: value.modalidad,
                        periodo_academico: value.periodo_academico,
                        programa: value.programa,
                        semestre: value.semestre,
                        valor: value.valor
                    };
                    dashboardTreeControl.listaMatriculados.push(matriculado);
                });
                appConstant.CERRAR_SWAL();
            }).catch(function (e) {
                dashboardTreeControl.listaMatriculados = [];
                swal(appGenericConstant.HUBO_PROBLEMA, appGenericConstant.ERROR_INTERNO_SISTEMA, appGenericConstant.WARNING);
                appConstant.CERRAR_SWAL();
                return;
            });
            $scope.tree_data = {};
        }
        window.onload = function () {
            localStorageService.remove('listaMatriculados');
        };
    }
})();