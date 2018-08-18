import {Directive, Input, forwardRef, Inject, OnInit} from '@angular/core';
import {ThreeDirective} from "../../three/three.directive";
import * as THREE from 'three';
@Directive({
  selector: 'neo-arrow'
})
export class ArrowDirective implements OnInit{
  @Input() direction: number[];
  @Input() origin: number[];
  @Input() length: number;
  @Input() color: number;
  constructor(@Inject(forwardRef(() => ThreeDirective)) private three: ThreeDirective) {}
  ngOnInit(){
    const [dx, dy, dz] = this.direction;
    const [ox, oy, oz] = this.origin;
    const direction = new THREE.Vector3(dx, dy, dz);
    direction.normalize()
    const origin = new THREE.Vector3(ox, oy, oz);
    const arrow = new THREE.ArrowHelper(direction, origin, this.length, this.color, 1);
    this.three.addToScene(arrow);
  }
}
