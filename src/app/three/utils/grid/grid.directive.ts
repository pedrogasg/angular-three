import {Directive, forwardRef, Inject, Input, OnInit} from '@angular/core';
import {ThreeDirective} from "../../three/three.directive";
import * as THREE from 'three';
@Directive({
  selector: 'neo-grid'
})
export class GridDirective implements OnInit{

  @Input() size: number;
  @Input() divisions: number;
  @Input() color: number;
  @Input() centerColor: number;
  constructor(@Inject(forwardRef(() => ThreeDirective)) private three: ThreeDirective) {}
  ngOnInit(){
    const grid = new THREE.GridHelper(this.size, this.divisions, this.centerColor, this.color);
    this.three.addToScene(grid);
  }

}
