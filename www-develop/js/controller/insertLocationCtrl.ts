module Controller {
    export class InsertLocationCtrl {
        imageURI;
        headerImagePath;

        result:any = {};

        //trip
        documentId:string;
        locationTitle:string = '';
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
        imageHasBeenUploaded:boolean;

        constructor(private CameraService, private basePath, private GeolocationService, private UserService,
                    private PictureUploadService, private webPath) {

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
            } else {
                delete formData._id;
                delete formData._rev;
            }
            this.PictureUploadService.uploadImage(file, this.basePath + '/users/my/locations/picture', formData)
                .then((data) => {
                    this.showNewImage(data);
                    this.documentId = data.id;
                    this.revision = data.rev;
                    this.uploadIsDone = true;
                    this.isUploading = false;
                }).catch((err) => {
                    console.log(err);
                    this.isUploading = false;
                });
            // TODO impl.. processing
        }

        showNewImage(data) {
            this.imageHasBeenUploaded = true;
            var path = JSON.parse(data.response);
            this.headerImagePath = path.imageLocation.thumbnail;
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
                this.uploadImage(data);

            });
        };

        static controllerId:string = "InsertLocationCtrl";
    }
}
