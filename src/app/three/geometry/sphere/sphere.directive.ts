import {Directive, Input, ContentChild, AfterContentInit} from '@angular/core';
import {MeshDirective} from "../mesh/mesh.directive";
import * as THREE from 'three';
@Directive({
  selector: 'neo-sphere'
})
export class SphereDirective implements  AfterContentInit{
  @Input() radius: number;
  @Input() widthSegments: number;
  @Input() heightSegments: number;
  @ContentChild(MeshDirective) mesh:MeshDirective;

  ngAfterContentInit(){
    this.buildMesh();
  }
  buildMesh(): void{
    const geometry = new THREE.SphereGeometry(this.radius,this.widthSegments,this.heightSegments);
    this.mesh.mainGeometry = geometry;
  }

}
