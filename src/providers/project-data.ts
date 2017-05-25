import { Injectable } from '@angular/core';
import { AuthService } from '../providers/auth-service';

import * as firebase from 'firebase';

@Injectable()
export class ProjectData {

  private currentUser: string;
  private currentUserEmail: string;
  
  public projectKey: string;
  public shotlistKey: string;
  public sceneKey: string;
  public shotKey: string;

  // declare projectsRef and titleRef correctly?????
  private projectsRef: any;
  private titleRef: any;

  constructor(public authService: AuthService) {
    //
    // AuthService ready. incorporate here
    //
    console.log('Hello ProjectData Provider');
    this.currentUser = firebase.auth().currentUser.uid;
    this.currentUserEmail = firebase.auth().currentUser.email;
    this.projectsRef = firebase.database().ref('projects');
  }

  setCurrentProject(projectKey) {
    this.projectKey = projectKey;
    this.shotlistKey = projectKey;
    this.titleRef = this.projectsRef.child(this.projectKey);
    // console.log('projectdata:', projectKey)
  }

  setSceneKey(sceneKey) {
    this.sceneKey = sceneKey;
  }

  setShotKey(shotKey) {
    this.shotKey = shotKey;
  }

  createProject(projectTitle: string, projectDescription: string, pageCount: number, pageEighths: number): firebase.Promise<any> {
    // get userKey as variable  
    var userKey: string = this.currentUser;
    // get newProjectRef
    var newProjectRef = this.projectsRef.push();
    // assign newKey to variables
    var newKey: string  = newProjectRef.key;
    //set sceneCount, shotCount, pageCount to 0
    var sceneCount: number = 0;
    var shotCount: number = 0;
    // make new project
    return newProjectRef.set({
      key: newKey,
      title: projectTitle,
      description: projectDescription,
      owner: userKey,
      ownerEmail: this.currentUserEmail,
      sceneCount: sceneCount,
      shotCount: shotCount,
      pageCount: pageCount,
      pageEighths: pageEighths
    }).then(function() {
      // push userKey & newRefKey to new /projectsByUser/userKey/newRefKey
      return firebase.database().ref().child('projectsByUser').child(userKey).child(newKey).set(true);
    }).then(function() {
        // push newRefKey to new /shotlists/newRefKey      
        return firebase.database().ref().child('shotlists').child(newKey).child('stats').set({
          sceneCount: sceneCount,
          shotCount: shotCount,
          pageCount: pageCount,
          pageEighths: pageEighths
        });
      });  
  }

  addProjectPhoto() {
    console.log('Add Cover Photo clicked')
  }

  removeProject(projectId: string): firebase.Promise<any> {
    // get userKey as variable
    var userKey: string = this.currentUser;
    // get projectKey as variable
    var projectKey: string = projectId;
    // remove projectKey at /projects/projectKey
    return firebase.database().ref().child('projects').child(projectId).remove().then(function() {
      // remove projectKey at /projectsByUser/userKey/projectKey
      return firebase.database().ref().child('projectsByUser').child(userKey).child(projectKey).remove().then(function() {
      // remove projectKey at /shotlists/projectKey
       return firebase.database().ref().child('shotlists').child(projectKey).remove()
      });
    });
  }

  updateProject(projectTitle: string, projectDescription: string, pageCount: number, pageEighths: number): firebase.Promise<any> {
    var projectKey = this.projectKey;
    return this.projectsRef.child(this.projectKey).update({
      title: projectTitle,
      description: projectDescription,
      pageCount: pageCount,          
      pageEighths: pageEighths          
    }).then(function() {
      return firebase.database().ref().child('shotlists').child(projectKey).child('stats').update({
        pageCount: pageCount,
        pageEighths: pageEighths
      });
    });  
  }

}