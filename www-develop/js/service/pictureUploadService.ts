module Service {
    export class PictureUploadService {

        constructor(private $http, private $q, private basePath, private CacheFactory, private $cordovaFileTransfer, private $ionicLoading) {
        }


        uploadImage = (filePath, destinationPath, opt)=> {
            // TODO: check if png or jpeg
            // TODO: implement processing
            var q = this.$q.defer();

            var options = {
                // IMPORTANT!!
                fileKey: "file",
                fileName: "image.png",
                chunkedMode: false,
                mimeType: "image/png",
                params: {
                    width: opt.width,
                    height: opt.height,
                    xCoord: opt.x,
                    yCoord: opt.y
                }
            };
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
        };

        static serviceId:string = "PictureUploadService";
    }
}
