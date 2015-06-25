module Service {
    export class CameraService {


        constructor(private $q, private $ionicActionSheet,private $jrCrop) {
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
                            var options;

                            this.$jrCrop.crop({
                                url: data,
                                width: 200,
                                height: 200,
                                cancelText: 'Abbrechen',
                                chooseText: 'Auswählen',
                                getOnlyData: true,
                                roundData: true
                            }).then((canvas) =>  {
                                console.log('canvas: '+ canvas)
                                // success!
                                debugger;

                                q.resolve(canvas);

                            }, function() {
                                console.log('eeerrorororoor')
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
                        }).then((data) => {
                            console.log(data)
                            this.$jrCrop.crop({
                                url: data,
                                width: 200,
                                height: 200
                            }).then((canvas) =>  {
                                console.log('canvas: '+ canvas)
                                // success!
                                debugger;
                                q.resolve(canvas);

                            }, function() {
                                console.log('eeerrorororoor')
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


        static serviceId:string = "CameraService";
    }
}
