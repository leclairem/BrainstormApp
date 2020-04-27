import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { File } from '@ionic-native/file/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-edit-idea',
  templateUrl: './edit-idea.page.html',
  styleUrls: ['./edit-idea.page.scss'],
})
export class EditIdeaPage implements OnInit {

  thread:any;
  editForm: FormGroup;
  cameraImg:string;
  imgURL = '';
  imgPath = '';
  thumbPath = '';
  imgs = []

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private file: File,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      param => {
        this.thread = param;
      });
      this.editForm = this.formBuilder.group({
        description: new FormControl(this.thread.description, Validators.required)
      })
  }

  saveChanges(value){
    var self = this;
    var db = firebase.firestore();
    self.imgs = [];
    db.collection('ideas').doc(self.thread.docID).update({
      'description': value.description
    });
  }

  async uploadPic(){
    var self = this;
    var db = firebase.firestore();
    await this.pickImage();
    await db.collection('ideas').doc(self.thread.docID).get().then(doc => {
      self.imgs = doc.data().imgs;
    });
    
    self.imgs.push(self.imgURL);
    
    await db.collection('ideas').doc(self.thread.docID).update({
      'imgs': self.imgs
    });
  }

  async pickImage() {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    try {
      console.log(this);
      let cameraInfo = await this.camera.getPicture(options);
      let blobInfo = await this.makeFileIntoBlob(cameraInfo);
      let uploadInfo: any = await this.uploadToFirebase(blobInfo);
      console.log(uploadInfo);
      // let url:any = uploadInfo.ref.getDownloadURL();
      alert("File Upload Success " + uploadInfo);
      this.cameraImg = uploadInfo;
      // this.new_product_form.patchValue({'img': uploadInfo});
      this.imgURL = uploadInfo;
    } catch (e) {
      console.log(e.message);
      alert("File Upload Error " + e.message);
    }
  }

  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = "";
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          let { name, nativeURL } = fileEntry;

          // get the path..
          let path = nativeURL.substring(0, nativeURL.lastIndexOf("/"));
          console.log("path", path);
          console.log("fileName", name);

          fileName = name;

          // we are provided the name, so now read the file into
          // a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          let imgBlob = new Blob([buffer], {
            type: "image/jpeg"
          });
          console.log(imgBlob.type, imgBlob.size);
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

  uploadToFirebase(_imageBlobInfo) {
    console.log("uploadToFirebase");
    return new Promise((resolve, reject) => {
      let imageid = (Math.floor(Math.random() * 2000)).toString();
      let filename = "Brainstorm_"+imageid
      // filename = _imageBlobInfo.fileName;
      let fileRef = firebase.storage().ref("images/" + filename);
      this.imgPath = ("images/" + filename);
      this.thumbPath = ('images/thumb_'+filename);
      let uploadTask = fileRef.put(_imageBlobInfo.imgBlob);
      let mydownloadurl="";
      

      uploadTask.on(
        "state_changed",
        (_snapshot: any) => {
          console.log(
            "snapshot progess " +
              (_snapshot.bytesTransferred / _snapshot.totalBytes) * 100
          );
        },
        _error => {
          console.log(_error);
          reject(_error);
        },
        () => {
          // completion...  get the image URL for saving to database
          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            mydownloadurl = downloadURL;
            resolve( mydownloadurl);
          });
          // resolve( uploadTask.snapshot);
          // resolve( mydownloadurl);

        }
      );
    });
  }
}
