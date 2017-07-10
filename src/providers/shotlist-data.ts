import { Injectable } from '@angular/core';
import { AuthService } from '../providers/auth-service';

import * as firebase from 'firebase';

@Injectable()
export class ShotlistData {
  
  public projectKey: string;
  public shotlistKey: string;
  public sceneKey: string;
  public shotKey: string;
  public takeKey: string;

  private rootRef = firebase.database().ref();

  private projectsRef = this.rootRef.child('projects');
  private projectRef: any;

  private shotlistsRef = this.rootRef.child('shotlists');
  private shotlistRef: any;

  private scenesRef: any;
  private sceneRef: any;

  private shotsRef: any;
  private shotRef: any;

  private takesRef: any;
  private takeRef: any;

  public takeCount: number;

  constructor(public authService: AuthService) {
    console.log('Hello ShotlistData Provider');

  }

////////////////
//  Key Repo  //
////////////////

  setCurrentProject(projectKey) {
    this.projectKey = projectKey;
    this.shotlistKey = projectKey;
    this.projectRef = this.projectsRef.child(projectKey);
    this.shotlistRef = this.shotlistsRef.child(projectKey);
    this.scenesRef = this.rootRef.child('/shotlists/' + this.shotlistKey + '/scenes/');
  }

  setSceneKey(sceneKey) {
    this.sceneKey = sceneKey;
    this.sceneRef = this.scenesRef.child(this.sceneKey);
    this.shotsRef = this.rootRef.child('/shotlists/' + this.shotlistKey + '/scenes/' + this.sceneKey + '/shots/');
//    console.log('shotlistData scenKey:', this.sceneKey);

  }

  setShotKey(shotKey) {
    this.shotKey = shotKey;
    this.shotRef = this.shotsRef.child(this.shotKey);
    this.takesRef = this.rootRef.child('/shotlists/' + this.shotlistKey + '/scenes/' + this.sceneKey + '/shots/' + this.shotKey + '/takes/');
  }

  setTakeKey(takeKey) {
    this.takeKey = takeKey;
    this.takeRef = this.takesRef.child(this.takeKey);
  }

//////////////////////
//	Scene Functions	//
//////////////////////

  createScene(sceneNumber: number, sceneSub: string, sceneTitle: string, sceneDescription: string, sceneLoc: string, sceneTime: string, pageCount: number, pageEighths: number): firebase.Promise<any> {
    // get newSceneRef
    var newSceneRef = this.scenesRef.push();
    //set sceneCount, shotCount, pageCount to 0
    var sceneCount: number = 0;
    var shotCount: number = 0;
    // push scene details to newRef
    var newKey: string  = newSceneRef.key;
    this.setSceneKey(newKey);
    return newSceneRef.set({
      key: newKey,
      sceneNumber: sceneNumber,
      sceneSub: sceneSub,
      title: sceneTitle,
      description: sceneDescription,
      sceneLoc: sceneLoc,
      sceneTime: sceneTime,
      pageCount: pageCount,
      pageEighths: pageEighths,      

      sceneCount: sceneCount,
      shotCount: shotCount
    })
    .then(() => {
      this.updateSceneCount();
    });
  }

  updateSceneCount() {
    this.scenesRef.once('value', snapshot => {
    console.log(snapshot.numChildren());
    var sceneCount = snapshot.numChildren();
    this.projectRef.update({sceneCount: sceneCount});
    this.shotlistRef.child('stats').update({sceneCount: sceneCount});
    });
  }

  updateScene(sceneNumber: number, sceneSub: string, sceneTitle: string, sceneDescription: string, sceneLoc: string, sceneTime: string, pageCount: number, pageEighths: number): firebase.Promise<any> {
    return this.scenesRef.child(this.sceneKey).update({
      sceneNumber: sceneNumber,
      sceneSub: sceneSub,
      title: sceneTitle,
      description: sceneDescription,
      sceneLoc: sceneLoc,
      sceneTime: sceneTime,
      pageCount: pageCount,
      pageEighths: pageEighths,      

    }); 
  }

  removeScene(sceneKey: string): firebase.Promise<any> {
    // remove sceneKey at /shotlists/projectKey/scenes/sceneKey/
    return firebase.database().ref().child('/shotlists/' + this.projectKey).child('/scenes/' + this.sceneKey).remove().then(() => {
      this.updateSceneCount();
    });
  };


  addSceneImage(sceneImage: string): firebase.Promise<any> {
//    let newStorageRef = firebase.storage().ref().child('/projects/' + this.projectKey).child('projectImage.jpeg');
    return firebase.storage().ref().child('/shotlists/' + this.projectKey).child('/scenes/' + this.sceneKey).child('sceneImage.jpeg').putString(sceneImage, 'base64', {contentType: 'image/jpeg'}).then( savedImage => {
        let downloadURL: string = savedImage.downloadURL;
        return firebase.database().ref().child('/shotlists/' + this.projectKey).child('/scenes/' + this.sceneKey).child('imageURL').set(downloadURL);
    });
  }

  removeSceneImage(sceneKey: string): firebase.Promise<any> {
    return firebase.storage().ref().child('/shotlists/' + this.shotlistKey).child('/scenes/' + sceneKey).child('sceneImage.jpeg').delete().then(() => {
      return firebase.database().ref().child('/shotlists/' + this.projectKey).child('/scenes/' + sceneKey).child('imageURL').set(null);
    });
  };

  updateSceneImage(sceneImage: string): firebase.Promise<any> {
//    let newStorageRef = firebase.storage().ref().child('/projects/' + this.projectKey).child('projectImage.jpeg');
    return firebase.storage().ref().child('/shotlists/' + this.projectKey).child('/scenes/' + this.sceneKey).child('sceneImage.jpeg').putString(sceneImage, 'base64', {contentType: 'image/jpeg'}).then( savedImage => {
        let downloadURL: string = savedImage.downloadURL;
        return firebase.database().ref().child('/shotlists/' + this.projectKey).child('/scenes/' + this.sceneKey).child('imageURL').set(downloadURL);
    });
  }

//////////////////////
//	Shot Functions	//
//////////////////////

  createShot(shotNumber: number, shotSub: number, shotTitle: string, shotDescription: string, shotLoc: string, shotTime: string, shotType: string, cameraMovement: string, pageCount: number, pageEighths: number): firebase.Promise<any> {
    // get newShotRef
    var newShotRef = this.shotsRef.push();
    var takeCount: number = 0;
    var pageCount: number = 0;
    var newKey: string  = newShotRef.key;
    this.setShotKey(newKey);
    // push shot details to newShotRef
    return newShotRef.set({
      key: newKey,
      shotNumber: shotNumber,
      shotSub: shotSub,
      title: shotTitle,
      description: shotDescription,
      shotLoc: shotLoc,
      shotTime: shotTime,
      shotType: shotType,
      cameraMovement: cameraMovement,
      pageCount: pageCount,
      pageEighths: pageEighths,

      takeCount: takeCount,
    }).then(() => {
      this.updateShotCount();
    });
  }

  updateShotCount() {
    this.shotsRef.once('value', snapshot => {
    console.log(snapshot.numChildren());
    var shotCount = snapshot.numChildren();
    this.projectRef.update({shotCount: shotCount});
    this.sceneRef.update({shotCount: shotCount});
    // this.shotlistRef.child('stats').update({shotCount: shotCount});
    });
  }

  updateShot(shotNumber: number, shotSub: number, shotTitle: string, shotDescription: string, shotLoc: string, shotTime: string, shotType: string, cameraMovement: string, pageCount: number, pageEighths: number): firebase.Promise<any> {
    return this.shotsRef.child(this.shotKey).update({
      shotNumber: shotNumber,
      shotSub: shotSub,
      title: shotTitle,
      description: shotDescription,
      shotLoc: shotLoc,
      shotTime: shotTime,
      shotType: shotType,
      cameraMovement: cameraMovement,
      pageCount: pageCount,
      pageEighths: pageEighths,        
    });
  }

  removeShot(shotKey: string): firebase.Promise<any> {
    // remove shotKey at /shotlists/projectKey/scenes/sceneKey/shots/shotKey
    return firebase.database().ref().child('shotlists/' + this.projectKey).child('scenes/' + this.sceneKey).child('shots/' + this.shotKey).remove()
    .then(() => {
      this.updateShotCount();
    });
  }

  addShotImage(shotImage: string): firebase.Promise<any> {
    return firebase.storage().ref().child('/shotlists/' + this.projectKey).child('/scenes/' + this.sceneKey).child('/shots/' + this.shotKey).child('shotImage.jpeg').putString(shotImage, 'base64', {contentType: 'image/jpeg'}).then( savedImage => {
        let downloadURL: string = savedImage.downloadURL;
        return firebase.database().ref().child('/shotlists/' + this.projectKey).child('/scenes/' + this.sceneKey).child('/shots/' + this.shotKey).child('imageURL').set(downloadURL);
    });
  }

  removeShotImage(shotKey: string): firebase.Promise<any> {
    return firebase.storage().ref().child('/shotlists/' + this.shotlistKey).child('/scenes/' + this.sceneKey).child('/shots/' + shotKey).child('shotImage.jpeg').delete().then(() => {
      return firebase.database().ref().child('/shotlists/' + this.projectKey).child('/scenes/' + this.sceneKey).child('/shots/' + shotKey).child('imageURL').set(null);
    });
  };


//////////////////////
//	Take Functions	//
//////////////////////

  createTake(): firebase.Promise<any> {
    // get newTakeRef
    var newTakeRef = this.takesRef.push();
    var i: number = this.takeCount;
    i++;
    var newCount: number = i;
    // push take details to newShotRef
    return newTakeRef.set({
      takeNumber: newCount,
      takeStar: false,
      takeNote: ""
    }).then(() => {
      this.updateTakeCount();
    });
  }

  updateTakeCount() {
    this.takesRef.once('value', snapshot => {
    console.log(snapshot.numChildren());
    var takeCount: number = snapshot.numChildren();
    this.projectRef.update({takeCount: takeCount});
    this.shotRef.update({takeCount: takeCount});
    this.takeCount = takeCount;
    // this.shotlistRef.child('stats').update({shotCount: shotCount});
    });
  }

  updateTake(takeNote: string): firebase.Promise<any> {
    return this.takesRef.child(this.takeKey).update({
      takeNote: takeNote         
    });
  }

  starTake() {
    console.log('starTake')
  }

  removeTake(takeKey: string): firebase.Promise<any> {
    // remove shotKey at /shotlists/projectKey/scenes/sceneKey/shots/shotKey
    return firebase.database().ref().child('shotlists/' + this.projectKey).child('scenes/' + this.sceneKey).child('shots/' + this.shotKey).child('takes/' + takeKey).remove()
    .then(() => {
      this.updateTakeCount();
    });
  }

}
