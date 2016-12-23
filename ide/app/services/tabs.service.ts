import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'lodash';
declare let _:any;

@Injectable()
export class TabsService {
  activeTab$: BehaviorSubject<any> = new BehaviorSubject(null);
  activeField$: BehaviorSubject<any> = new BehaviorSubject(null);
  tabs$: BehaviorSubject<any[]> = new BehaviorSubject([]);

  constructor() {}

  setActiveTab(tab: any): void {
    let tabs = this.tabs$.getValue();
    let normalizedTab: any = this.retrieveTab(tabs, tab);
    let selectedTab: any = _.find(tabs, { url: tab.url });
    
    selectedTab.active = true;

    tabs.forEach(tab => { tab.active = (tab.url === selectedTab.url) });

    this.activeTab$.next(selectedTab);
    this.tabs$.next(tabs);
  }

  openTab(tab: any): void {
    let tabs: any[] = this.tabs$.getValue();
    let tabIsOpen: boolean = _.find(tabs, { url: tab.url, editor: tab.editor });
    
    if (tabIsOpen) {
      
      this.setActiveTab(tab);

    } else {
      let builtedTab: any = this.buildTab(tab);
      tabs.forEach((tab) => tab.active = false);
      tabs.push(builtedTab);
      this.tabs$.next(tabs);
    }
    
  }

  closeTab(tab: any): void {
    let tabs: any[] = this.tabs$.getValue();
    tabs.splice(tabs.indexOf(tab), 1);
    
    if (tabs.length === 0) {
      this.activeTab$.next(null);
    }

    this.tabs$.next(tabs);
  }

  selectField(field: any): void {
    this.activeField$.next(field);
  }

  getActiveTab(): Observable<any> {
    return this.activeTab$.asObservable();
  }

  getTabs(): Observable<any[]> {
    return this.tabs$.asObservable();
  }

  private retrieveTab(tabs: any[], tab: any): any {
    let pindex = this.index(tab.path[0].type);
    console.log(tabs[pindex]);
    for (let elt of tabs[pindex].children) {
      if (elt.url.split('/').pop() == tab.url.split('/').pop()) {
        if (tab.path.length > 1) {
          let cindex = this.index(tab.path[1].type, pindex);
          for (let celt of elt.children[cindex].children) {
            if (celt.label == tab.path[1].name) {
              return celt;
            }
          }
        } else {
          return elt;
        }
      }
    }
  }

  private index(type: string, parentIndex?: number) {
    if (parentIndex === undefined) {
      
      switch (type) {
        case 'Forms':
          return 0;
        case 'Views':
          return 1;
        case 'Agents':
          return 2;
        default: 
      }

    } else {
      switch (parentIndex) {
        case 0:
          
          switch (type) {
            case 'Fields':
              return 0;
            case 'Actions':
              return 1;
            case 'Hide Whens':
              return 2;
            default:
          }

          break;
        case 1:
          
          switch (type) {
            case 'Actions':
              return 0;
            case 'Columns':
              return 1;
            default:
          }

          break;
        case 2:
          return 0;
      }
    }
  }

  private buildTab(tab: any): any {
    let newtab = { 
      title: tab.label, 
      editor: tab.editor, 
      path: tab.path, 
      url: tab.url,
      active: true 
    };
    /* if (newtab.editor === 'code') {
     *     this.aceNumber++;
     * }
     * What is this code for ?!
     */ 
    return newtab;
  }
}