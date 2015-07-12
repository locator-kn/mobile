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

        error:boolean = false;

        constructor(private CameraService, private $scope, private basePath, private GeolocationService,
                    private UserService, private $state, private PictureUploadService, private webPath,
                    private $rootScope, private $ionicLoading, private $ionicPopup, private ngProgressLite,
                    private $ionicScrollDelegate, private maxSpinningDuration) {

            this.UserService.getMe().then(user => {
                this.me = user.data;
            });

            $rootScope.$on('newGeoPosition', () => {
                this.map = this.GeolocationService.getGeoPosition();
                this.mapMarkerSet = true;
                this.getCityFromMarker();

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
            this.headerImagePath = data.imageLocation + '?size=mobile';
        }

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

            var stringTags = [];
            formValues.tags.forEach(item => {
                stringTags.push(item.text);
            });
            formValues.tags = stringTags;

            this.GeolocationService.saveLocation(formValues, this.documentId).
                then((result) => {
                    if (this.headerImagePath) {
                        var pic = this.headerImagePath + '?size=mobile';
                    } else {
                        var pic = 'images/header-image-placeholder.png';
                    }
                    var info = {
                        tripId: result.data.id,
                        picture: pic
                    };
                    this.GeolocationService.setResultInfoObject(info);
                    this.$state.go('tab.locate-options');

                    this.documentWasCreated = true;
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
            this.error = false;
        }

        goToMap() {
            if (this.isUploading) {
                this.$ionicPopup.alert({title: 'Bitte warte kurz bis das Bild fertig geladen wurde'});
                return;
            }
            this.$ionicLoading.show({templateUrl: 'templates/static/loading.html', duration: this.maxSpinningDuration});
            this.$state.go('tab.locate-position');
        }

        static controllerId:string = "InsertLocationCtrl";
    }
}
