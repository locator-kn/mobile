module Controller {
    export class MoodCtrl {

        moods:any = [];
        selected:any = [];

        offerState = 'tab.offer';
        moodSearchState = 'tab.search-moods';
        searchState = 'tab.search';

        state:string;

        constructor(private DataService, private SearchService, private $ionicLoading, private $state, private TripService) {
            this.state = this.$state.current.name;

            // get all moods from data service
            this.DataService.getAvailableMoods().then((result) => {
                this.$ionicLoading.hide();
                this.moods = result.data;
            });
        }

        setMood(mood) {
            debugger;
            if(this.state === this.moodSearchState) {
                this.SearchService.setMood(mood);
                this.$state.go(this.searchState);
            } else {
                this.TripService.setMood(mood);
                this.$state.go(this.offerState);
            }
        }

        static controllerId:string = "MoodCtrl";
    }
}
