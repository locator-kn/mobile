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
        locationFormDetails:any = {
            tags: '',
            title: '',
            description: '',
            budget: '',
            city: {}
        };

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

        error:boolean = false;

        constructor(private CameraService, private $scope, private basePath, private GeolocationService, private UserService,
                    private PictureUploadService, private webPath, private $ionicLoading, private $ionicPopup) {

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
            this.mapMarkerSet = true;
            this.getCityFromMarker();

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
            this.$ionicPopup.alert({title: 'Das Bild wird im Hintergrund hochgeladen. Beschreibe doch deine Location solange du wartest.'});
            this.PictureUploadService.uploadImage(file, this.basePath + '/users/my/locations/picture', formData)
                .then((data) => {
                    this.$ionicLoading.hide();
                    var dataObject = JSON.parse(data.response);

                    this.showNewImage(dataObject);
                    this.documentId = dataObject.id;
                    this.revision = dataObject.rev;
                    this.uploadIsDone = true;
                    this.isUploading = false;
                }).catch((err) => {
                    console.log(err);
                    this.$ionicLoading.hide();
                    this.isUploading = false;
                });
        }

        showNewImage(data) {
            this.imageHasBeenUploaded = true;
            this.headerImagePath = data.imageLocation.thumbnail;
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
                this.mapMarkerSet = true;
                this.getCityFromMarker();
                if (!this.$scope.$$phase) {
                    this.$scope.$apply();
                }

            })
        };

        getCityFromMarker() {
            this.GeolocationService.getCityByCoords(this.map.clickedMarker.latitude, this.map.clickedMarker.longitude)
                .then(result => {
                    var locality;
                    result.data.results.forEach(item => {
                        if (item.types[0] == 'locality') {
                            locality = item;
                        }
                    });

                    this.locationFormDetails.city.title = locality.formatted_address;
                    this.locationFormDetails.city.place_id = locality.place_id;
                    this.locationFormDetails.city.id = locality.place_id;
                });
        }

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

        saveLocation = () => {
            if (!this.mapMarkerSet
                || !this.locationFormDetails.title
                || !this.locationFormDetails.description
                || !this.locationFormDetails.tags) {
                this.error = true;
                console.log('error: missing values')
                return;
            }
            debugger;
            var formValues = angular.copy(this.locationFormDetails);

            formValues.geotag = {
                long: this.map.clickedMarker.longitude,
                lat: this.map.clickedMarker.latitude
            };

            formValues.tags = formValues.tags.split(" ");

            this.GeolocationService.saveLocation(formValues, this.documentId).
                then((result) => {
                    console.log('saved ' + result);
                    this.documentWasCreated = true;
                }).catch((err) => {
                    console.log(err);
                })
        };


        static controllerId:string = "InsertLocationCtrl";
    }
}
