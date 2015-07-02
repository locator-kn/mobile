module Controller {
    export class InsertLocationCtrl {
        imageURI;
        headerImagePath;

        result:any = {};

        //trip
        documentId:string;
        locationTitle:string = '';
        revision:string;
        geotag:any = {};
        lat:string;
        long:string;

        me:any = {};

        pictureWidth:number = 256;
        pictureHeight:number = 150;

        map:any = {};

        // TODO: refactor
        uploadIsDone:boolean;
        isUploading:boolean;
        documentWasCreated:boolean;
        imageHasBeenUploaded:boolean;
        mapMarkerSet:boolean;

        constructor(private CameraService, private $scope,  private basePath, private GeolocationService, private UserService,
                    private PictureUploadService, private webPath) {

            this.UserService.getMe().then(user => {
                this.me = user.data;
            });

            this.map = {
                center: {
                    // kn fh
                    latitude: 47.668403,
                    longitude: 9.170499
                },
                zoom: 12,
                clickedMarker: {
                    id: 0,
                    latitude: null,
                    longitude: null
                },
                events: this.getEvents()
            };
        }

        getEvents() {
            return {
                mousedown: (mapModel, eventName, originalEventArgs) => {
                    this.clickMapEvent(mapModel, eventName, originalEventArgs);
                }
            }
        }

        clickMapEvent(mapModel, eventName, originalEventArgs) {
            console.log(mapModel);
            var e = originalEventArgs[0];
            var lat = e.latLng.lat(),
                lon = e.latLng.lng();
            this.map.clickedMarker = {
                id: 0,
                options: {
                    labelClass: "marker-labels",
                    labelAnchor: "50 0"
                },
                latitude: lat,
                longitude: lon
            };
            console.log(this.map.clickedMarker);
            //this.mapMarkerSet = true;
            this.$scope.$apply();
            //
            //this.getCityFromMarker();

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

                this.map.clickedMarker = {
                    id: 0,
                    options: {
                        labelClass: "marker-labels",
                        labelAnchor: "50 0"
                    },
                    latitude: this.lat,
                    longitude: this.long
                };
                console.log(this.map.clickedMarker);
                this.mapMarkerSet = true;
                this.$scope.$apply();

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
