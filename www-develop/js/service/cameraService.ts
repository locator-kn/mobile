module Service {
    export class CameraService {


        constructor(private $q, private $ionicPopup, private $timeout, private $ionicActionSheet) {
        }


        getPicture(options) {
            var q = this.$q.defer();
            navigator.camera.getPicture((result) => {
                // Do any magic we need
                q.resolve(result);
            }, (err) => {
                q.reject(err)
            }, options);

            return q.promise;
        }

        showPictureActions = () => {
            // Show the action sheet
            this.$ionicActionSheet.show({
                buttons: [
                    {text: 'Foto aufnehmen'},
                    {text: 'Fotoalbum'}
                ],
                titleText: 'Fotoauswahl',
                cancelText: 'Abbrechen',
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    if (index === 0) {
                        // take a picture

                    } else {
                        // take from gallery
                    }
                    return true;
                }
            });
        };


        static
            serviceId:string = "CameraService";
    }
}
