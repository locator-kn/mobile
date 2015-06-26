module Controller {
    export class WelcomeCtrl {

        constructor(private $scope, private $element, $window) {
            // add logo to navbar
            $scope.navTitle = '<img src="./images/locator-logo.png" class="logo"/>';
        }
        static controllerId:string = "WelcomeCtrl";
    }
}
