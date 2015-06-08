module Controller {
    export class WelcomeCtrl {

        constructor(private $scope, private $rootScope, private $element) {
            // add logo to navbar
            $scope.navTitle= '<img src="./images/locator-logo.png" class="logo"/>';

            // set height (workaround) for each button
            var elementHeigth = angular.element(this.$element).height();
            var heightTop = 42.9805;
            var heightBottom = 48.9865;
            angular.element(".height-3").css({'height': (elementHeigth-(heightBottom+heightTop)) / 3 +"px" });
        }



        static controllerId:string = "WelcomeCtrl";
    }
}
