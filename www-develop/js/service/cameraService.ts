module Service {
    export class CameraService {


        constructor(private $q, private $ionicActionSheet, private $jrCrop) {
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
                        }).then((url) => {
                            this.cropImage(url).then((data)=> {
                                q.resolve(data);
                            }).catch((err)=> {
                                q.reject(err);
                            });
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
                        }).then((url) => {
                            this.cropImage(url).then((data)=> {
                                q.resolve(data);
                            }).catch((err)=> {
                                q.reject(err);
                            });
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

        cropImage = (url) => {
            var q = this.$q.defer();

            this.$jrCrop.crop({
                url: url,
                width: 200,
                height: 200,
                cancelText: 'Abbrechen',
                chooseText: 'Auswählen',
                getOnlyData: true,
                roundData: true
            }).then((cropInfo) => {
                q.resolve(cropInfo);
            }).catch((err) => {
                q.reject(err);
            });
            return q.promise;

        };


        static serviceId:string = "CameraService";
    }
}
