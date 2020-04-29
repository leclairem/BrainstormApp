import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import * as firebase from "firebase";
import { ItemService } from '../item.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.page.html',
  styleUrls: ['./create-thread.page.scss'],
})
export class CreateThreadPage implements OnInit {

  newIdeaForm: FormGroup;
  cameraImg:string;
  imgURL='/assets/1.png';
  imgPath='';
  thumbPath='';

  constructor(
    private router: Router,
 	  public formBuilder: FormBuilder,
 	  public itemService: ItemService,
    private camera: Camera,
    private file: File,
    public loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.newIdeaForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      category: new FormControl('Engineering', Validators.required),
      img:new FormControl(this.imgURL,Validators.required)
    });
  }

  async createIdea(value){
    await this.itemService.generateThread(value);
    await this.presentLoading();
    this.router.navigate(['/my-ideas']);
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Generating your IDea\nPlease wait...',
      duration: 2000
    });
    await loading.present();
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
