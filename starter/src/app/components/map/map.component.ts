import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { useGeographic } from 'ol/proj';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { Map as OpenMap, View } from 'ol';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import { MapDataService } from 'src/app/map-data.service'; 



@Component({
  selector: 'starter-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styles: ``,
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLElement>;
  mapComponent: OpenMap | undefined;

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

    this.mapDataService.getLocalVectorLayer()
      .subscribe(vectorLayer => {
        this.mapComponent?.addLayer(vectorLayer);
      });
  }

  registerProjections() {
    register(proj4);
  }
}
