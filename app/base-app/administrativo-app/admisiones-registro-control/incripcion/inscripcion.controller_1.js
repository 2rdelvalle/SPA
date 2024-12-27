(function () {
    'use strict';
    angular.module('mytodoApp').controller('inscripcionCtrll', inscripcionCtrll);
    inscripcionCtrll.$inject = ['$scope', '$http', 'inscripcionService', 'ValidationService', 'growl', '$location', 'localStorageService'];
    function inscripcionCtrll($scope, $http, inscripcionService, ValidationService, growl, $location, localStorageService) {


        $(document).ready(function () {

            // An array of dates
            var active_dates = ["21/5/2014", "25/5/2014"];

            // datepicker
            jQuery('#containerDate').datepicker({
                format: "dd/mm/yyyy",
                autoclose: true,
                language: "es",
                beforeShowDay: function (date) {
                    var d = date;
                    var curr_date = d.getDate();
                    var curr_month = d.getMonth() + 1; //Months are zero based
                    var curr_year = d.getFullYear();
                    var formattedDate = curr_date + "/" + curr_month + "/" + curr_year;

                    if ($.inArray(formattedDate, active_dates) !== -1) {
                        return {
                            classes: 'activeClass'
                        };
                    }
                    return;
                }
            });
        });

        var inscripcionControl = this;
        var config = {};
        inscripcionControl.disabled = false;
        inscripcionControl.fecha = {id: 3, nombre: "05/19/2016"};
        inscripcionControl.listaPrueba = [
            {
                id: 1,
                nombre: "jadjadja",
                apellido: "adadada"
            },
            {
                id: 2,
                nombre: "jadjsdfsdfsdfsdfadja",
                apellido: "adadasdfsdfsdfda"
            }
        ];

        inscripcionControl.listaPruebaHorario = [
        ];

        inscripcionControl.prueba = function (item) {
            alert(item);
        };

        inscripcionControl.clickPrueba = function (item) {

//            gestionAdmision.obsAux = "itemsdjkhfisdhfjsbduf busgdhfiuhsdiu fsudhf iuhsd fiuhsd iufhs diuhfiu sdhfi usdhfi uhsudisuf disuf";
            $("#popV1").show();

//            $('#prueba' + item.id).popover({
//                restrict: 'EA',
//                html: true,
//                title: "Observación" + '<button type="button" id="botonX" class="btn btn-xs btn-danger editable-cancel pull-right" ng-click="inspCtrll.clickPrueba2(item)"> <i class="glyph-icon icon-times"> </i> </button> ',
//                content: '<input type="text" id="txtDate" />',
//                placement: "left", trigger: "manual"}).popover('show');
//                    

            inscripcionControl.disabled = true;






//            $('#btnComd3' + item.id).popover({
//                title: 'Observación',
//                content: document.getElementById("textAreaHid"+item.id).value,
//                placement: "top", trigger: "click"
//            }).popover('show');


//            $('#btnComd3' + item.id).click(function (event) {
//                event.preventDefault();
//
//            });

//            $('#btnComd3' + item.id).popover({
//                title: 'Observación',
//                content: document.getElementById("textAreaHid" + item.id).value,
//                placement: "top"
//            }).popover('show');
//
//            $('#btnComd3' + item.id).blur(function () {
//                $('#btnComd3' + item.id).popover('hide');
//
//            });

//            $('#divPopov' + item).popover({
//                title: 'John',
//                content: 'Loading...'
//            });

//            $('button').tooltip('show');1
//
//            $('#btnComd2' + item).on('shown.bs.popover', function () {
//                $('#new_input').focus();
//            });
//
//            $(document).on('blur', '#btnComd2' + item, function () {
//                $(this).popover('hide');
//            });

//        $('#btnComd2' + item).popover({
//            html: true,
//            content:'<div class="input-group">' +
//                    '<input id="new_input" type="text" placeholder="My Dashboard" class="form-control">' +
//                    '<span class="input-group-btn">' +
//                    '<button class="btn btn-success btn-default" type="button">Create</button>' +
//                    '</span>' +
//                    '</div>'
//        });
//
//        $('#btnComd3' + item).on('shown.bs.popover', function () {
//            $('#new_input').focus();
//        });
//
//        $(document).on('blur', '#btnComd2' + item, function () {
//            $(this).popover('hide');
//        });




//            $('#btnComd2' + item).blur(function () {
//                $('#btnComd2' + item).popover('hide');
//            });

        };

        inscripcionControl.clickPrueba2 = function (item) {
//            alert("ahdhad");
            $("#popV1").hide();

//            $('#botonX').popover('destroy').popover('hide');

            inscripcionControl.disabled = false;

        };


        $('#containerDate').datepicker().on('changeDate', function (e) {
            var testdate = Date();
            testdate = $.datepicker.formatDate("dd/m/yy", new Date(e.date));

            if (testdate === "21/5/2014") {
                inscripcionControl.listaPruebaHorario = [
                    {
                        id: 1,
                        nombre: "05/27/2016"
                    },
                    {
                        id: 2,
                        nombre: "05/20/2016"
                    },
                    {
                        id: 3,
                        nombre: "05/19/2016"
                    },
                    {
                        id: 4,
                        nombre: "05/15/2016"
                    },
                    {
                        id: 5,
                        nombre: "05/14/2016"
                    }
                ];


                $("#selc").html(inscripcionControl.listaPruebaHorario);
                $( "#selc" ).change();
//                alert(testdate);
            }

            if (testdate === "25/5/2014") {
                inscripcionControl.listaPruebaHorario = [
                    {
                        id: 1,
                        nombre: "05/27/2016"
                    },
                    {
                        id: 2,
                        nombre: "05/20/2016"
                    }
                ];
                $("#selc").html(inscripcionControl.listaPruebaHorario);
                $( "#selc" ).change();
//                alert(testdate);
            }



        });



    }

})

        ();
