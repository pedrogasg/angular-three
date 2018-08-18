import {Directive, OnInit, forwardRef, Inject, Input} from '@angular/core';
import {ThreeDirective} from "../three/three.directive";
import * as THREE from 'three';
@Directive({
  selector: 'neo-light'
})
export class LightDirective implements OnInit{
  @Input() color: number;
  @Input() intensity: number;
  @Input() x: number;
  @Input() y: number;
  @Input() z: number;
  @Input() distance: number;
  constructor(@Inject(forwardRef(() => ThreeDirective)) private three: ThreeDirective) {

  }

  ngOnInit(){
    const light = new THREE.PointLight(this.color, this.intensity, this.distance);
    light.position.set(this.x, this.y, this.z);
    this.three.addToScene(light);
  }

}
