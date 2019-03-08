var VRTTool = angular.module('VRTTool', ['ngRoute', 'ngStorage', 'angularMoment']);

VRTTool.factory('ReportId', function() {

    var persistObject = [];

    function set(objectName, data) {
        persistObject[objectName] = data;
    }

    function get(objectName) {
        return persistObject[objectName];
    }

    return {
        set: set,
        get: get
    }
});


// configure our routes
VRTTool.config(function($routeProvider) {
    $routeProvider

    // route for the about page
        .when('/', {
        templateUrl: 'views/reportList.html',
        controller: 'reportListController'
    })

    .when('/report', {
        templateUrl: 'views/report.html',
        controller: 'reportController'
    })

    .when('/reportList', {
        templateUrl: 'views/reportList.html',
        controller: 'reportListController'
    })

    .otherwise({
        redirectTo: '/'
    });

    ;
});


VRTTool.controller('reportController', function($scope, $http, $location) {
    $scope.title = 'Crear Reporte';
    $scope.image1 = '';
    $scope.image2 = '';
    $scope.imageDiff = '';
    //$scope.required = true;
    $scope.report = {
        image1: '',
        image2: '',
        imageDiff: ''
    };


    $scope.addReport = function(isValid) {
        if (true) {
            $http.post('/report', $scope.report).then(function onSuccess(response) {
                console.log($scope.report);
                console.log(response);
                $scope.report = response.data;
                if (response.status == 200) {
                    $scope.status = 'success';
                    $location.path('/reportList');
                } else {
                    $scope.status = 'fail';
                }
            }).catch(function onError(response) {
                console.log(response);
                $scope.status = 'fail';
            });
        } else {
            $scope.status = 'incomplete';
        }

    };
});


VRTTool.controller('reportListController', function($scope, $http, ReportId) {
    $scope.title = 'Listar Reportes';
    $scope.status = '';
    $scope.url = 'http://localhost:8080/';
    //$scope.required = true;

    $scope.init = function() {
        $http.get('/reports/').then(function onSuccess(response) {
            console.log(response);
            $scope.reports = response.data.reports.sort(compare);
            if (response.status == 200) {
                $scope.status = 'success';
            }
        }).catch(function onError(response) {
            console.log(response);
        });
    };

    function compare(a, b) {
        return (b.create_at - a.create_at);
    }

});