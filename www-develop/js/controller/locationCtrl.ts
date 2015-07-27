module Controller {
    export class LocationCtrl {
        result:any;
        locationId:number;

        user:any = {};

        state:string;
        onProfile:boolean;

        publicLocation:boolean;

        constructor(private $window, private UtilityService, private UserService, private $scope, private $stateParams, private LocationService,
                    private $ionicLoading, private webPath, maxSpinningDuration, private $state, private $ionicPopup, private $rootScope) {
            this.locationId = $stateParams.locationId;
            this.state = this.$state.current.name;

            if (this.$state.current.name.indexOf('profile') > -1) {
                this.onProfile = true;
            }

            this.$ionicLoading.show({templateUrl: 'templates/static/loading.html', duration: maxSpinningDuration});

            this.LocationService.getLocationById(this.locationId).then((result)=> {
                this.$ionicLoading.hide();
                this.result = result.data;
                this.result.create_date = moment(new Date(this.result.create_date)).format('L');
                this.publicLocation = this.result.public;

                // workaround, because title do not update in tripDetail.html
                $scope.navTitle = this.result.title;

                this.UserService.getUser(this.result.userid)
                    .then(result => {
                        this.user = result.data;
                        this.$ionicLoading.hide();
                    });
            })
        }


        togglePublic() {
            this.LocationService.togglePublicLocation(this.result._id);
        }

        deleteLocation() {
            var confirmPopup = this.getConfirmPopup('Location löschen',
                'Bist du dir sicher, dass du deine Location löschen möchtest?', 'Abbrechen', 'OK');
            confirmPopup.then((res) => {
                if (res) {
                    this.LocationService.deleteLocation(this.result._id)
                        .then(result => {
                            this.showSuccessPopup();
                            this.$state.go('tab.profile', {userId: this.$rootScope.userID});
                        })
                        .catch(result => {
                            //location is used in trip
                            var confirmPopup = this.getConfirmPopup('Location löschen',
                                'Die Location wird in einem Trip verwendet. Wirklich löschen?', 'Nein', 'Ja');
                            confirmPopup.then((res) => {
                                if (res) {
                                    this.LocationService.deleteLocationForce(this.result._id)
                                        .then(result => {
                                            this.showSuccessPopup();
                                            this.$state.go('tab.profile', {userId: this.$rootScope.userID});
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        })
                                }
                            })

                        });
                }
            });
        }

        showSuccessPopup() {
            this.UtilityService.showPopup('Location erfolgreich gelöscht');

        }

        getConfirmPopup(title, textMsg, textNo, textYes) {
            return this.$ionicPopup.confirm({
                title: title,
                template: textMsg,
                buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                    text: textNo,
                    type: 'button-default',
                    onTap: function (e) {
                        // e.preventDefault() will stop the popup from closing when tapped.
                        //e.preventDefault();
                    }
                }, {
                    text: textYes,
                    type: 'button-positive',
                    onTap: function (e) {
                        // Returning a value will cause the promise to resolve with the given value.
                        return true;
                    }
                }]
            });
        }

        openMaps() {
            console.log('is android: ' + this.$rootScope.isAndroid);
            console.log('is IOS: ' + this.$rootScope.isIOS);
            if (this.$rootScope.isAndroid) {
                this.$window.open('geo:' + this.result.geotag.lat + ',' + this.result.geotag.long + '?z=11&q=' + this.result.geotag.lat + ',' + this.result.geotag.long + '(Treasure)', '_system', 'location=yes')
            } else if (this.$rootScope.isIOS) {
                this.$window.open('http://maps.apple.com/?&saddr=' + this.result.geotag.lat + ',' + this.result.geotag.long);
            }
        }

        static controllerId:string = "LocationCtrl";
    }
}
