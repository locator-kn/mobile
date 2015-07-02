module Controller {
    export class InsertLocationCtrl {
        imageURI;

        result:any = {};

        //trip
        documentId:string;
        locationTitle:string;
        revision:string;

        lat:string;
        long:string;

        me:any = {};

        pictureWidth:number = 256;
        pictureHeight:number = 150;


        // TODO: refactor
        uploadIsDone:boolean;
        isUploading:boolean;
        documentWasCreated:boolean;

        constructor(private CameraService, private basePath, private GeolocationService, private UserService,
                    private PictureUploadService) {

            this.UserService.getMe().then(user => {
                this.me = user.data;
            });
        }

        uploadImage(image) {
            this.uploadIsDone = false;

            this.isUploading = true;
            var file = image.src;
            var formData = {
                width: Math.round(image.width),
                height: Math.round(image.height),
                xCoord: Math.round(image.x),
                yCoord: Math.round(image.y),
                locationTitle: this.locationTitle.toLowerCase() || 'supertrip',
                _id: '',
                _rev: ''
            };

            if (this.documentWasCreated) {
                formData._id = this.documentId;
                formData._rev = this.revision;
            }
            this.PictureUploadService.uploadImage(file, this.basePath + '/users/my/locations/picture', formData)
                .error(() => {
                    this.isUploading = false;
                })
                .progress(evt => {
                    // TODO: impl processing
                }).success((data, status, headers, config) => {
                    console.log('file', config.file.name, 'uploaded. Response:', data);

                    //this.showNewImage(data);
                    this.documentId = data.id;
                    this.revision = data.rev;
                    this.uploadIsDone = true;
                    this.isUploading = false;
                });

            //this.InsertTripService.uploadImage(formData);
        }

        // sample
        getCurrentPosition = () => {
            this.GeolocationService.getCurrentLocation().then((position) => {
                this.lat = position.coords.latitude;
                this.long = position.coords.longitude;
            })
        };

        showPictureActions = () => {
            var opt = {
                width: this.pictureWidth,
                height: this.pictureHeight
            };
            this.CameraService.selectPicture(opt).then((data) => {

                // TODO: check image size

                this.imageURI = data;

            });
        };

        static controllerId:string = "InsertLocationCtrl";
    }
}
