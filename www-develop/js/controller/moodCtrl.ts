module Controller {
    export class MoodCtrl {

        moods:any = [];
        selected:any = [];

        constructor(private DataService, private SearchService, private $ionicLoading) {
            // get all moods from data service
            this.DataService.getAvailableMoods().then((result) => {
                this.$ionicLoading.hide();
                this.moods = result.data;
            });
        }

        setMood(mood) {
            this.SearchService.setMood(mood);
        }

        static controllerId:string = "MoodCtrl";
    }
}
