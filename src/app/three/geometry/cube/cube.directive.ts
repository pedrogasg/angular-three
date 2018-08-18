import {Input, Directive, ContentChild, AfterContentInit} from '@angular/core';
import * as THREE from 'three';
import {MeshDirective} from "../mesh/mesh.directive";
@Directive({
  selector: 'neo-cube'
})
export class CubeDirective implements AfterContentInit{
  @Input() height: number;
  @Input() width: number;
  @Input()  depth: number;
  @ContentChild(MeshDirective) mesh:MeshDirective;


  ngAfterContentInit(){
    this.buildMesh();
  }
  private buildMesh(): void {
    const geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
    this.mesh.mainGeometry = geometry;
  }
}
