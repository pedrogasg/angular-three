import {Directive, Inject, forwardRef, OnInit, Input, AfterContentInit} from '@angular/core';
import {ThreeDirective} from "../../three/three.directive";
import * as THREE from 'three';
@Directive({
  selector: 'neo-mesh'
})
export class MeshDirective implements  OnInit, AfterContentInit{
  @Input() color: number;
  @Input() emissive: number;
  @Input() x: number;
  @Input() y: number;
  @Input() z: number;
  private o3D: THREE.Object3D;
  private mesh: THREE.Mesh;
  private geometry: THREE.Geometry;
  private material: THREE.MeshPhongMaterial;
  constructor(@Inject(forwardRef(() => ThreeDirective)) private three: ThreeDirective) {}
  ngOnInit(){
    this.prepateMesh();
  }
  ngAfterContentInit(){
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.o3D.add(this.mesh);
    this.three.addToScene(this.o3D);
  }
  set mainGeometry(geometry: THREE.Geometry|THREE.BufferGeometry){
    this.mesh.geometry = geometry;
  }
  get mainGeometry(){
    return this.mesh.geometry;
  }
  addToObject3D(mesh: THREE.Mesh|THREE.LineSegments){
    this.o3D.add(mesh);
  }
  private prepateMesh(): void{
    this.o3D = new THREE.Object3D();
    this.geometry = new THREE.Geometry();
    this.material = new THREE.MeshPhongMaterial({
      color: this.color,
      emissive: this.emissive,
      side: THREE.DoubleSide,
      shading: THREE.FlatShading
    });
    this.o3D.position.set(this.x, this.y, this.z)
  }
}
