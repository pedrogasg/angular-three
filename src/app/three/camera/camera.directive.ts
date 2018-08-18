import {Directive, OnInit, Input} from '@angular/core';
import * as THREE from 'three';
@Directive({
  selector: 'neo-camera'
})
export class CameraDirective implements OnInit {

  private camera: THREE.PerspectiveCamera;
  @Input() fov: number;
  @Input() aspect: number;
  @Input() near: number;
  @Input() far: number;
  @Input() x: number;
  @Input() y: number;
  @Input() z: number;
  constructor() {

  }
  ngOnInit(){
    this.camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
    this.camera.position.x = this.x;
    this.camera.position.y = this.y;
    this.camera.position.z = this.z;
  }
  get value() {
    return this.camera;
  }
  lookAt(v: THREE.Vector3){
    this.camera.lookAt(v);
  }

}
