module Controller {
    export class OptionCtrl {

        result:any = {};

        locateType = 'tab.locate-options';
        state;

        isLocation:boolean;
        path:string;

        constructor(private webPath, private TripService, private GeolocationService, private $ionicScrollDelegate, private $window, private $state) {
            this.state = this.$state.current.name;
            this.path = this.webPath;

            debugger;
            if (this.state === this.locateType) {
                this.isLocation = true;
                this.result = GeolocationService.getResultInfoObject();
                if(this.result.picture === 'images/header-image-placeholder.png'){
                    this.path = '';
                }
            } else {
                this.result = TripService.getResultInfoObject();
            }

            this.$ionicScrollDelegate.scrollTop(true);

        }

        restartTrip() {
            this.$state.go('tab.offer');
            this.$window.location.reload(true);
        }

        restartLocation() {
            this.$state.go('tab.locate');
            this.$window.location.reload(true);
        }

        static controllerId:string = "OptionCtrl";
    }
}
