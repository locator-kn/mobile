module Service {
    export class GeolocationService {


        constructor(private $q, private $ionicLoading, private $ionicActionSheet) {
        }


        getCurrentLocation() {
            var q = this.$q.defer();
            var posOptions = {maximumAge: 3000, timeout: 5000, enableHighAccuracy: true};
            this.$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
            navigator.geolocation.getCurrentPosition((result) => {
                // Do any magic we need
                q.resolve(result);
            }, (err) => {
                q.reject(err)
            }, posOptions);

            return q.promise;
        }

        getGeoLocation() {
            var q = this.$q.defer();
// Show the action sheet
            var hideSheet = this.$ionicActionSheet.show({
                buttons: [
                    {text: 'Finde mich'},
                    {text: 'Google Map'}
                ],
                titleText: 'Geolocation bestimmen',
                cancelText: 'Abbrechen',
                cancel: ()=> {
                    hideSheet();
                },
                buttonClicked: (index) => {
                    if (index === 0) {
                    } else {
                            hideSheet();
                    }
                }
            });

            return q.promise;
        }

        static serviceId:string = "GeolocationService";
    }
}
