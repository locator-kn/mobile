module Service {
    export class PictureUploadService {

        constructor(private $http, private $q, private basePath, private CacheFactory, private $cordovaFileTransfer, private $ionicLoading, private $ionicPlatform) {
        }


        uploadImage = (filePath, destinationPath, opt)=> {
            var q = this.$q.defer();

            var options = {
                // IMPORTANT!!
                fileKey: "file",
                fileName: "image.jpeg",
                chunkedMode: false,
                mimeType: "image/jpeg",
                params: opt
            };

            this.$ionicPlatform.ready(()=> {

                this.$cordovaFileTransfer.upload(destinationPath, filePath, options, true).then((result) => {
                    console.log("SUCCESS: " + result.response);
                    q.resolve(result);
                }, (err) => {
                    console.log("ERROR: " + err);
                    q.reject(err);
                },  (progress) => {
                    q.notify(progress);
                });
            });
            return q.promise;
        };

        static serviceId:string = "PictureUploadService";
    }
}
