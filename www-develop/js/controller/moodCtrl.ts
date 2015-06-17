module Controller {
    export class MoodCtrl {

        moods:any = {};
        selected:any = [];

        constructor(private DataService, private SearchService) {
            this.DataService.getAvailableMoods().then((result) => {
                this.moods = result.data;
            });
        }

        sync(bool, item) {
            if (bool) {
                // add item
                this.selected.push(item);
                // if we have gone over maxItems:
                if (this.selected.length > 3) {
                    //remove oldest item
                    this.selected[0].checked = false;
                    this.selected.splice(0,1);
                }
            } else {
                // remove item
                for (var i=0 ; i < this.selected.length; i++) {
                    if (this.selected[i] === item){
                        this.selected.splice(i,1);
                    }
                }
            }
            this.SearchService.setMoods(this.selected);
        }

        static
            controllerId:string = "MoodCtrl";
    }
}
