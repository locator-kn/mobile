module Controller {
    export class MoodCtrl {

        moods:any = [];
        selected:any = [];

        constructor(private DataService, private SearchService) {
            // get all moods from data service
            this.DataService.getAvailableMoods().then((result) => {
                this.moods = result.data;
                // old selected moods - needed because of state change
                this.selected = this.SearchService.getMoods();

                // TODO: search alternative for initialisation of old selections
                for (var mood in this.moods) {
                    for (var selected in this.selected) {
                        if (this.moods[mood].query_name == this.selected[selected].query_name) {
                            this.moods[mood].checked = true;
                        }
                    }
                }

            });


        }

        sync(bool, item) {
            if (bool) {
                // add item
                this.selected.push(item);
                // if we have gone over maxItems:
                if (this.selected.length > 3) {
                    this.select(this.selected[3].query_name, false);
                    this.selected.splice(3,1);
                }
            } else {
                // remove item
                for (var i = 0; i < this.selected.length; i++) {
                    // diff by query name because if checks hashKey
                    if (this.selected[i].query_name === item.query_name) {
                        this.selected.splice(i, 1);
                    }
                }
            }
            this.SearchService.setMoods(this.selected);
        }

        select(query_name, value) {
            for (var mood in this.moods) {
                if (this.moods[mood].query_name == query_name) {
                    this.moods[mood].checked = value;
                }
            }
        }

        static
            controllerId:string = "MoodCtrl";
    }
}
