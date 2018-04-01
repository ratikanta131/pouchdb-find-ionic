import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
import cordovaSqlitePlugin from 'pouchdb-adapter-cordova-sqlite';
import 'rxjs/add/operator/toPromise';
import { Platform } from 'ionic-angular';

/*
  Generated class for the PouchdbServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PouchdbServiceProvider {

  db: any;
  dbName: string = 'pfind'

  constructor(public http: HttpClient, private platform: Platform) {}

  setDB(){

    PouchDB.plugin(PouchFind);
    if(this.platform.is('android') && this.platform.is('cordova')){      
      PouchDB.plugin(cordovaSqlitePlugin);
	    this.db = new PouchDB(this.dbName, {adapter: 'cordova-sqlite'});
    }else{  
      this.db = new PouchDB(this.dbName); 
    }


  }

  async writeData(){
    try{

      let data: IData[] = <IData[]>(await this.http.get('/assets/data.json').toPromise())

      let dbDataList: IDBData[] = []
      data.forEach(serverData=>{
        let dbData: IDBData = {
          _id: 'data:' + serverData.id,
          area: serverData.area,
          below: serverData.below,
          indicator: serverData.indicator,
          isKPI: serverData.indicator.kpi,
          ius: serverData.ius,
          rank: serverData.rank,
          src: serverData.src,
          subgrp: serverData.subgrp,
          top: serverData.top,
          tp: serverData.tp,
          trend: serverData.trend,
          value: serverData.value
        }

        dbDataList.push(dbData)
      })

      await this.db.bulkDocs(dbDataList)

    }catch(err){
      console.log("Error in writing data: " + err)
    }


  }

  async createIndex(){

    try{
      await this.db.createIndex({
        index: {fields: ['value']}
      });
    }catch(err){
      console.log("Error in creating index: " + err)
    }

  }


  async fetchData(): Promise<IDBData[]> {

    try{



      let explain = await this.db.explain({
        selector: {
          value: '2.3'
        }
      })

      console.log('explain', explain)


      let data = await this.db.find({
        selector: {
          value: '2.3'
        }
      })

      return <IDBData[]>data.docs
    }catch(err){
      console.log("Error in fetching data: " + err)
    }
  }


}
