module Controller {
    export class InsertLocationCtrl {
        imageURI;

        lat:string;
        long:string;

        pictureWidth:number = 256;
        pictureHeight:number = 150;

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
            var opt = {
                width: this.pictureWidth,
                height: this.pictureHeight
            };
            this.CameraService.selectPicture(opt).then((data) => {
                this.imageURI = data;
            });
        };

        static controllerId:string = "InsertLocationCtrl";
    }
}
