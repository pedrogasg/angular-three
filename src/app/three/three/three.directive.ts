import {Directive, Input, ElementRef, ContentChild, AfterContentInit, OnInit} from '@angular/core';
import {CameraDirective} from  '../camera/camera.directive';
import * as THREE from 'three';
import {ReplaySubject} from "rxjs";
@Directive({
  selector: 'neo-three'
})
export class ThreeDirective implements AfterContentInit, OnInit {

  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  nativeElement: HTMLElement;
  meshes: ReplaySubject<THREE.Object3D>;
  @Input() height: number;
  @Input() width: number;
  @ContentChild(CameraDirective) camera: CameraDirective;
  constructor(elementRef: ElementRef) {
    this.nativeElement = elementRef.nativeElement;
    this.meshes = new ReplaySubject();
  }
  ngOnInit(){
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setClearColor(0x000000, 1.0);
    this.renderer.setSize(this.width, this.height);
    this.nativeElement.appendChild(this.renderer.domElement);
    this.meshes.subscribe((o) => {
      this.scene.add(o);
    });
  }
  ngAfterContentInit() {
    this.camera.lookAt(this.scene.position);
    this.render();
  }

  addToScene(o: THREE.Object3D){
    this.meshes.next(o);
  }
  render() {
    this.renderer.render(this.scene, this.camera.value);
  }

}
