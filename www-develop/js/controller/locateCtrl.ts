module Controller {
    export class LocateCtrl {
        imageURI;

        constructor(private $scope, private CameraService) {
        }

        getPhoto = ()  => {
            this.CameraService.getPicture().then((imageURI) => {
                this.imageURI = imageURI;
            }, (err)=> {
                console.log(err);
            })
        };

        static
            controllerId:string = "LocateCtrl";
    }
}
