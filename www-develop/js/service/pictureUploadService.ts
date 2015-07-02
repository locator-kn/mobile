module Service {
    export class PictureUploadService {

        constructor(private $http, private $q, private basePath, private CacheFactory, private $cordovaFileTransfer, private $ionicLoading, private $ionicPlatform) {
        }


        uploadImage = (filePath, destinationPath, opt)=> {
            // TODO: check if png or jpeg
            // TODO: implement processing
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

                this.$cordovaFileTransfer.upload(destinationPath, filePath, options, true).then(function (result) {
                    console.log("SUCCESS: " + result.response);
                    q.resolve(result);
                }, function (err) {
                    console.log("ERROR: " + err);
                    q.reject(err);
                }, function (progress) {

                    // TODO how?
                    //q.notify(progress)
                    // constant progress updates
                });
            });
            return q.promise;
        };

        static serviceId:string = "PictureUploadService";
    }
}
