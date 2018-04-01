import { PouchdbServiceProvider } from './../../providers/pouchdb-service/pouchdb-service';
import { Component } from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  data: IDBData[] = []
  constructor(private pouchdbService: PouchdbServiceProvider) {}

  ngOnInit(){
    this.fetchData()
  }

  async fetchData(){

    setTimeout(()=>{
      this.pouchdbService.fetchData()
      .then(data=>{
        this.data = data
        console.log('data in home page',data)
      })
    }, 5000)
    
  }


}
