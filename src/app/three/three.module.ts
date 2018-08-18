import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreeDirective } from './three/three.directive';
import { CameraDirective } from './camera/camera.directive';
import { LightDirective } from './light/light.directive';
import { AddWireframeDirective, ArrowDirective, GridDirective } from './utils';
import { MeshDirective, CubeDirective, SphereDirective } from './geometry';
import { PlotDirective } from './plot/plot.directive';



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ThreeDirective, CubeDirective, CameraDirective, LightDirective, AddWireframeDirective, MeshDirective, SphereDirective, ArrowDirective, GridDirective, PlotDirective],
  exports: [ThreeDirective, CubeDirective, CameraDirective, LightDirective, AddWireframeDirective, MeshDirective, SphereDirective, ArrowDirective, GridDirective]
})
export class ThreeModule { }
