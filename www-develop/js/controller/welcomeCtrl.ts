module Controller {
    export class WelcomeCtrl {

        private screenHeight;

        constructor(private $scope, private $element, $window) {
            // add logo to navbar
            $scope.navTitle = '<img src="./images/locator-logo.png" class="logo"/>';

            this.screenHeight = window.innerHeight;
        }



        static controllerId:string = "WelcomeCtrl";
    }
}
