import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { useGeographic } from 'ol/proj';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { Map as OpenMap, View } from 'ol';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector'; 
import { MapDataService } from 'src/app/map-data.service'; 
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Style, Fill, Stroke } from 'ol/style'; 
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import {FormsModule } from '@angular/forms';

@Component({
  selector: 'starter-map',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLElement>;
  mapComponent: OpenMap | undefined;
  vectorLayer: VectorLayer<VectorSource<Feature<Geometry>>> | undefined;
  layerVisible: boolean = true; 

  constructor(private mapDataService: MapDataService) {} 

  ngOnInit() {
    useGeographic();
    this.registerProjections();
  }

  ngAfterViewInit() {
    this.initMap();
    this.addLocalVectorLayer(); 
  }

  private initMap() {
    this.mapComponent = new OpenMap({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: this.mapContainer.nativeElement,
      view: new View({
        center: [121.6555, -30.7891],
        zoom: 6,
      }),
    });
  }

  private addLocalVectorLayer() {
    this.mapDataService.getLocalVectorSource() 
      .subscribe(vectorSource => {
        this.vectorLayer = new VectorLayer({
          source: vectorSource,
          style: new Style({ 
            fill: new Fill({
              color: 'rgba(255, 0, 0, 0.1)',
            }),
            stroke: new Stroke({
              color: '#ff0000',
              width: 2,
            }),
          }),
          visible: this.layerVisible,
        });
        this.mapComponent?.addLayer(this.vectorLayer);
      });
  }

  toggleLayerVisibility() {
    if (this.vectorLayer) {
      this.vectorLayer.setVisible(!this.vectorLayer.getVisible());
    }
  }

  registerProjections() {
    register(proj4);
  }
}
