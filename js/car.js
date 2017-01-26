var app = angular.module('fleet', ['ui.bootstrap']);

app.controller('car-controller', ["$scope", function($scope) {

    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.selectedRows = new Array();
    $scope.nunRows = 0;


    $scope.cars = [{
            "combustivel": "Flex",
            "imagem": null,
            "marca": "Volkswagem",
            "modelo": "Gol",
            "placa": "FFF-5498",
            "valor": "20000"
        },
        {
            "combustivel": "Gasolina",
            "imagem": null,
            "marca": "Volkswagem",
            "modelo": "Fox",
            "placa": "FOX-4125",
            "valor": "20000"
        },
        {
            "combustivel": "Alcool",
            "imagem": "http://carros.ig.com.br/fotos/2010/290_193/Fusca2_290_193.jpg",
            "marca": "Volkswagen",
            "modelo": "Fusca",
            "placa": "PAI-4121",
            "valor": "20000"
        }

    ];

    $scope.numberOfPages = new Array(Math.ceil($scope.cars.length / $scope.pageSize));
    $scope.resetObj = null;
    $scope.editing = null;

    $scope.novo = function() {
        $scope.resetObj = null;
        $scope.editing = null;
        $scope.data = {};


    };


    $scope.select = function(e, c) {


        var arrow = e.target;
        var parent = arrow.parentElement.parentElement;

        if (arrow.classList.contains("fa-square-o")) {

            arrow.classList.remove("fa-square-o");
            arrow.classList.add("fa-check-square-o");

            parent.classList.add("selected-row");


            $scope.selectedRows.push(c.placa);

            $scope.nunRows += 1;

        } else {

            arrow.classList.remove("fa-check-square-o");
            arrow.classList.add("fa-square-o");

            parent.classList.remove("selected-row");

            var index = $scope.selectedRows.indexOf(c.placa);

            if (index > -1) {
                $scope.selectedRows.splice(index, 1);
            }

            $scope.nunRows -= 1;

        }

    };

    $scope.getSelRows = function() {

        var selected = new Array();

        for (var i = $scope.selectedRows.length - 1; i >= 0; i--) {

            for (var j = $scope.cars.length - 1; j >= 0; j--) {

                if ($scope.selectedRows[i] == $scope.cars[j].placa) {
                    selected.push($scope.cars[j]);
                }
            }

        }

        return selected;

    };

    $scope.salvar = function(data) {
        if ($scope.validate(data)) {
            if ($scope.resetObj != null) {
                var index = $scope.cars.indexOf($scope.editing);
                $scope.cars[index] = data;
            } else {
                $scope.cars.push(data);
            }
            
            $('#car-new').modal('hide');

            $scope.numberOfPages = new Array(Math.ceil($scope.cars.length / $scope.pageSize));
        } else {
            alert("Verifique se os campos estao preenchidos");
        }
    };

    $scope.edit = function() {
        var car = $scope.getSelRows()[0];

        $scope.resetObj = angular.copy(car);
        $scope.editing = car;

        var _edit = angular.copy(car);
        $scope.data = _edit;
    };

    $scope.remove = function() {

        var car = $scope.getSelRows();

        for (var i = car.length - 1; i >= 0; i--) {

            var index = $scope.cars.indexOf(car[i]);
            $scope.cars.splice(index, 1);

        }

        $scope.numberOfPages = new Array(Math.ceil($scope.cars.length / $scope.pageSize));
        
        $scope.selectedRows = new Array();
        $scope.nunRows = 0
    }

    $scope.cancelar = function() {
        $scope.resetObj = null;
        $scope.editing = null;
        $scope.data = {};
    };

    $scope.validate = function(data) {

        var valid = true;

        if (data.marca == null || data.marca == "" || data.marca == undefined) {
            valid = false;
        }
        if (data.modelo == null || data.modelo == "" || data.modelo == undefined) {
            valid = false;
        }
        if (data.placa == null || data.placa == "" || data.placa == undefined) {
            valid = false;
        }
        if (data.combustivel == null || data.combustivel == "" || data.combustivel == undefined) {
            valid = false;
        }

        return valid;

    };

    var match = function(item, val) {
        var regex = new RegExp(val, 'i');
        return item.marca.toString().search(regex) == 0 ||
            item.combustivel.search(regex) == 0;
    };

    $scope.filterCars = function(car) {
        // No filter, so return everything
        if (!$scope.q) return true;
        var matched = true;

        // Otherwise apply your matching logic
        $scope.q.split(' ').forEach(function(token) {
            matched = matched && match(car, token);
        });

        return matched;
    };

    $scope.selectPage = function(e, index) {

        $scope.currentPage = index;

        $(".selected-page").removeClass("selected-page");
        e.target.parentElement.classList.add("selected-page");

    };


    $scope.selectAllRows = function(e) {

        if (e.target.classList.contains("fa-square-o")) {

            var checks = $("td .fa-square-o");
            for (var i = checks.length - 1; i >= 0; i--) {
                checks[i].classList.remove("fa-square-o");
                checks[i].classList.add("fa-check-square-o");

                checks[i].parentElement.parentElement.classList.add("selected-row");

            }

            e.target.classList.remove("fa-square-o");
            e.target.classList.add("fa-check-square-o");

        } else {


            var checks = $("td .fa-check-square-o");
            for (var i = checks.length - 1; i >= 0; i--) {
                checks[i].classList.remove("fa-check-square-o");
                checks[i].classList.add("fa-square-o");


                checks[i].parentElement.parentElement.classList.remove("selected-row");

            }

            e.target.classList.remove("fa-check-square-o");
            e.target.classList.add("fa-square-o");


        }


    };

}]);

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});