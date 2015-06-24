module Service {
    export class CameraService {


        constructor(private $q, private $ionicActionSheet) {
        }


        getPicture = (options) => {
            var q = this.$q.defer();
            navigator.camera.getPicture((result) => {
                // Do any magic we need
                q.resolve(result);
            }, (err) => {
                q.reject(err)
            }, options);

            return q.promise;
        };

        showPictureActions = () => {
            var q = this.$q.defer();

            // Show the action sheet
            var hideSheet = this.$ionicActionSheet.show({
                buttons: [
                    {text: 'Foto aufnehmen'},
                    {text: 'Fotoalbum'}
                ],
                titleText: 'Fotoauswahl',
                cancelText: 'Abbrechen',
                cancel: ()=> {
                    hideSheet();
                },
                buttonClicked: (index) => {
                    if (index === 0) {
                        // take a picture
                        this.getPicture({
                            quality: 100,
                            correctOrientation: true
                        }).then((data) => {
                            q.resolve(data);
                            hideSheet();

                        }).catch((err)=> {
                            q.reject(err);
                            hideSheet();

                        });
                    } else {
                        // take from gallery
                        return this.getPicture({
                            quality: 100,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                        }).then((data) => {
                            q.resolve(data);
                            hideSheet();
                        }).catch((err)=> {
                            q.reject(err);
                            hideSheet();
                        });
                    }
                }
            });
            return q.promise;
        };


        static serviceId:string = "CameraService";
    }
}
