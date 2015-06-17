module Controller {
    export class MoodCtrl {

        moods:any = {};

        constructor(private DataService, private SearchService) {
            this.DataService.getAvailableMoods().then((result) => {
                this.moods = result.data;
            });
        }

        setMoods(moods) {
            this.SearchService.setMoods(moods);
        }

        static
            controllerId:string = "MoodCtrl";
    }
}
