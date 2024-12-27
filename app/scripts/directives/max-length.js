(function () {
    'use strict';
    angular.module('mytodoApp.directive').directive('maxLength', ['$compile', '$log', function ($compile, $log) {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function (scope, elem, attrs, ctrl) {
                    attrs.$set("ngTrim", "false");
                    var maxlength = parseInt(attrs.maxLength, 10);
                    ctrl.$parsers.push(function (value) {
                        if (value.length > maxlength)
                        {
                            value = value.substr(0, maxlength);
                            ctrl.$setViewValue(value);
                            ctrl.$render();
                        }
                        return value;
                    });
                }
            };
        }]);
})();
