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
        edit:boolean = false;

        constructor(private $q, private UtilityService, private CameraService, private $scope, private basePath, private GeolocationService,
                    private UserService, private $state, private PictureUploadService, private webPath,
                    private $rootScope, private $ionicLoading, private ngProgressLite,
                    private maxSpinningDuration, private LocationService, private $stateParams) {
            // google analytics
            if (typeof analytics !== undefined && typeof analytics !== 'undefined') {
                analytics.trackView("InsertLocation Controller");
            }

            if (this.$state.current.name.indexOf('edit') > -1) {
                this.edit = true;
                this.$ionicLoading.show({
                    templateUrl: 'templates/static/loading.html',
                    duration: this.maxSpinningDuration
                });
                this.LocationService.getLocationById($stateParams.locationId).then((result) => {
                    this.result = result.data;
                    if (result.data.images.picture) {
                        this.headerImagePath = result.data.images.picture;
                    } else {
                        this.headerImagePath = result.data.images.googlemap;
                    }
                    this.documentId = result.data._id;
                    this.locationFormDetails.title = result.data.title;
                    this.locationFormDetails.tags = result.data.tags.join(' ');
                    this.locationFormDetails.description = result.data.description;
                    this.locationFormDetails.city = result.data.city;
                    this.locationFormDetails.public = result.data.public;
                    // always true by edit location because it is required to create one
                    this.mapMarkerSet = true;

                    var map = {
                        center: {
                            // kn fh
                            latitude: result.data.geotag.lat,
                            longitude: result.data.geotag.long
                        },
                        zoom: 12,
                        clickedMarker: {
                            id: 0,
                            latitude: result.data.geotag.lat,
                            longitude: result.data.geotag.long
                        }
                    };
                    this.GeolocationService.setGeoPosition(map);
                    this.$ionicLoading.hide();
                }).catch(()=> {
                    this.$ionicLoading.hide();
                    this.UtilityService.showErrorPopup('Keine Internetverbindung');
                });
            }

            this.UserService.getMe().then(user => {
                this.me = user.data;
            });

            $rootScope.$on('newGeoPosition', () => {
                this.map = this.GeolocationService.getGeoPosition();
                this.mapMarkerSet = true;
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

            this.UtilityService.showPopup('Das Bild wird im Hintergrund hochgeladen. Beschreibe doch deine Location solange du wartest.');

            this.PictureUploadService.uploadImage(file, this.basePath + '/users/my/locations/picture/mobile', formData)
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
                })
        }

        showNewImage(data) {
            this.imageHasBeenUploaded = true;
            this.headerImagePath = data.imageLocation + '?size=mobile';
        }

        getCityFromMarker() {
            return this.$q((resolve, reject) => {
                this.GeolocationService.getCityByCoords(this.map.clickedMarker.latitude, this.map.clickedMarker.longitude)
                    .then(result => {

                        var locality;
                        result.forEach((item:any) => {
                            if (item.types[0] === 'locality') {
                                locality = item;
                            }
                        });

                        if (locality) {
                            this.insertLocality(locality);
                            console.info('First Case');
                            return resolve();
                        } else {
                            var cityname;
                            result[0].address_components.forEach((item:any) => {
                                if (item.types[0] === 'locality') {
                                    cityname = item.long_name;
                                }
                            });

                            if (cityname) {
                                this.GeolocationService.getPlaceIdByAddress(cityname)
                                    .then(nestedResult => {
                                        locality = {};
                                        locality.place_id = nestedResult[0].place_id;
                                        locality.formatted_address = nestedResult[0].formatted_address;
                                        this.insertLocality(locality);
                                        console.info('second');
                                        return resolve();

                                    })
                                    .catch(error => {
                                        console.log(error);
                                        return reject();
                                    });
                            }
                        }

                    });

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
            if (!this.locationFormDetails.title) {
                this.UtilityService.showPopup('Deine Location benötigt noch einen Titel.');
                return;
            }

            if (!this.mapMarkerSet) {
                this.UtilityService.showPopup('Wo befindet sich deine Location?');
                return;
            }

            if (!this.locationFormDetails.description) {
                this.UtilityService.showPopup('Deine Location benötigt noch eine Beschreibung.');
                return;
            }

            if (!(this.locationFormDetails.tags.length > 0)) {
                this.UtilityService.showPopup('Füge noch durch Leerzeichen getrennte Tags hinzu, mit der nach deiner Location gesucht werden kann. (z.B. Bodensee baden Natur)');
                return;
            }

            if (this.isUploading) {
                this.UtilityService.showPopup('Du kannst deine Location speichern, sobald dein Bild hochgeladen ist.');
                return;
            }


            this.getCityFromMarker().then(() => {


                this.locationFormDetails.tags = this.locationFormDetails.tags.split(' ');

                var formValues = angular.copy(this.locationFormDetails);

                formValues.geotag = {
                    long: this.map.clickedMarker.longitude,
                    lat: this.map.clickedMarker.latitude
                };


                this.GeolocationService.saveLocation(formValues, this.documentId).
                    then((result) => {
                        if (!this.edit) {
                            if (this.headerImagePath) {
                                var pic = this.headerImagePath;
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
                        } else {
                            this.UtilityService.showPopup('Location erfolgreich aktualisiert');

                            this.$state.go('tab.profile', {
                                userId: this.me._id
                            });
                        }
                        this.resetController();
                    }).catch((err) => {
                        this.UtilityService.showErrorPopup('Location konnte nicht erstellt werden. Überprüfe deine Internetverbindung.');

                    })
            });
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
                this.UtilityService.showErrorPopup('Bitte warte kurz bis das Bild fertig geladen wurde');
                return;
            }
            this.$ionicLoading.show({templateUrl: 'templates/static/loading.html', duration: this.maxSpinningDuration});
            if (!this.edit) {
                this.$state.go('tab.locate-position');
            } else {
                this.$state.go('tab.profile-locations-detail-edit-position', {
                    locationId: this.result._id
                });
            }
        }

        insertLocality(locality) {
            this.locationFormDetails.city.title = locality.formatted_address;
            this.locationFormDetails.city.place_id = locality.place_id;
            this.locationFormDetails.city.id = locality.place_id;
        }

        strip(value) {
            this.locationFormDetails.tags = value.replace(/,/g, ' ').replace(/\s\s+/g, ' ').replace(/\./g,' ');
        }

        static controllerId:string = "InsertLocationCtrl";
    }
}
