module Controller {
    export class LocateCtrl {
        imageURI;

        lat:string;
        long:string;


        constructor(private CameraService, private GeolocationService) {
        }

        // sample
        getCurrentPosition = () => {
            this.GeolocationService.getCurrentLocation().then((position) => {
                this.lat = position.coords.latitude;
                this.long = position.coords.longitude;
            })
        };

        showPictureActions= () => {
            this.CameraService.showPictureActions().then((data) => {
                this.imageURI = data;
            });
        };

        static controllerId:string = "LocateCtrl";
    }
}
