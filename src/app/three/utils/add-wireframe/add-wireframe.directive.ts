import {
  Directive, Input, OnInit, OnChanges, ViewChild, AfterViewInit, ContentChild,
  AfterContentInit
} from '@angular/core';
import * as THREE from 'three'
import {CubeDirective} from "../../geometry/cube/cube.directive";
import {MeshDirective} from "../../geometry/mesh/mesh.directive";
@Directive({
  selector: 'neo-add-wireframe'
})
export class AddWireframeDirective implements AfterContentInit{
  @ContentChild(MeshDirective) mesh:MeshDirective;
  constructor() {

  }
  ngAfterContentInit(){
    this.addWireframe(this.mesh);
  }
  private addWireframe(mesh: MeshDirective) {
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(mesh.mainGeometry),

      new THREE.LineBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.5
      })
    )
    mesh.addToObject3D(wireframe);
  }
}
