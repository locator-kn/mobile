module Controller {
    export class MainCtrl {


        constructor(private $scope, private $rootScope, private $location, private $window) {


        }

        closeOverlay() {
            this.$rootScope.$emit('closeDialog');
        }

        static controllerId:string = "MainCtrl";
    }
}
