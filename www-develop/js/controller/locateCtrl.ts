module Controller {
    export class LocateCtrl {
        imageURI;

        lat:string;
        long:string;


        constructor(private $scope, private CameraService, private GeolocationService) {
        }

        getPhoto = ()  => {
            this.CameraService.getPicture().then((imageURI) => {
                this.imageURI = imageURI;
            }, (err)=> {
                console.log(err);
            })
        };

        getCurrentPosition = () => {
           this.GeolocationService.getCurrentLocation().then((position) => {
               this.lat  = position.coords.latitude;
               this.long = position.coords.longitude;
            })
        };

        static
            controllerId:string = "LocateCtrl";
    }
}
