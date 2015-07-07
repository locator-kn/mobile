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
            city: {},
            public: true
        };

        me:any = {};

        pictureWidth:number = 256;
        pictureHeight:number = 150;

        map:any = {};

        uploadIsDone:boolean;
        isUploading:boolean;
        documentWasCreated:boolean;
        imageHasBeenUploaded:boolean;
        mapMarkerSet:boolean;

        googleMap:boolean = false;
        error:boolean = false;

        constructor(private CameraService, private $scope, private basePath, private GeolocationService, private UserService,
                    private PictureUploadService, private webPath, private $ionicLoading, private $ionicPopup, private ngProgressLite) {

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
                },
                tilesloaded: () => {
                    this.$ionicLoading.hide();

                }
            }
        }

        clickMapEvent(mapModel, eventName, originalEventArgs) {
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
            this.ngProgressLite.start();
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
                    this.ngProgressLite.done();
                }, (err) => {
                    console.log(err);
                    this.$ionicLoading.hide();
                    this.isUploading = false;
                    this.ngProgressLite.done();
                }, (process) => {
                    var perc:number = process.loaded / process.total;
                    this.ngProgressLite.set(perc);
                    console.log('progress:', perc, '% ');
                })
        }

        showNewImage(data) {
            this.imageHasBeenUploaded = true;
            this.headerImagePath = data.imageLocation.picture  + '?size=mobile' ;
        }

        // sample
        getCurrentPosition = () => {
            if (!this.googleMap) {
                this.googleMap = true;
                this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            }

            this.GeolocationService.getCurrentLocation().then((position) => {
                this.lat = position.coords.latitude;
                this.long = position.coords.longitude;

                this.map.clickedMarker.latitude = this.lat;
                this.map.clickedMarker.longitude = this.long;
                this.map.zoom = 15;
                this.map.center.latitude = this.lat;
                this.map.center.longitude = this.long;

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
                console.log('error - missing parameter')
                this.error = true;
                return;
            }

            if (this.isUploading) {
                this.$ionicPopup.alert({title: 'Du kannst deine Location speichern, sobald dein Bild hochgeladen ist.'});
                return;
            }
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
                    this.$ionicPopup.alert({title: 'Herzlichen Glückwunsch, deine FETT GEILE Location wurde erstellt. Dieser Text wird durch einen Screen ersetzt und erscheint bald nicht mehr...'});
                    this.resetController();

                }).catch((err) => {
                    console.log(err);
                })
        };

        resetController() {
            // TODO: another, smarter way?
            this.imageURI = '';
            this.headerImagePath = '';
            this.result = {};
            //trip
            this.documentId = '';
            this.locationTitle = '';
            this.revision = '';
            this.geotag = {};
            this.lat = '';
            this.long = '';
            this.locationFormDetails = {
                tags: '',
                title: '',
                description: '',
                budget: '',
                city: {},
                public: true
            };
            this.me = {};
            this.map = {};
            this.uploadIsDone = false;
            this.isUploading = false;
            this.documentWasCreated = false;
            this.imageHasBeenUploaded = false;
            this.mapMarkerSet = false;
            this.googleMap = false;
            this.error = false;
        }

        toggleMap = ()=> {
            this.googleMap = !this.googleMap;
            if (this.googleMap) {
                this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            }
        };


        static controllerId:string = "InsertLocationCtrl";
    }
}
