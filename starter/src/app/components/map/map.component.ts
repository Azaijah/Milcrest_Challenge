import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { useGeographic } from 'ol/proj';
import proj4 from 'proj4';
import { register } from 'ol/proj/proj4';
import { Map as OpenMap, View, Overlay } from 'ol';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { MapDataService } from 'src/app/map-data.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Style, Fill, Stroke } from 'ol/style';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'starter-map',
  standalone: true,
  imports: [CommonModule, MatSlideToggleModule, FormsModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: true })
  mapContainer!: ElementRef<HTMLElement>;

  @ViewChild('popup', { static: true })
  popupElement!: ElementRef;

  mapComponent: OpenMap | undefined;
  vectorLayer: VectorLayer<VectorSource<Feature<Geometry>>> | undefined;
  layerVisible: boolean = true;
  popup: Overlay | undefined;



  constructor(private mapDataService: MapDataService) {}

  ngOnInit() {

    useGeographic();
    this.registerProjections();
  }

  ngAfterViewInit() {
    this.initMap();
    this.addLocalVectorLayer();
    this.initPopup();
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
        center: [117, -33],
        zoom: 8,
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

  private initPopup() {
    
    this.popup = new Overlay({
      element: this.popupElement.nativeElement,
      autoPan: false,
    });
    this.mapComponent?.addOverlay(this.popup);

    this.mapComponent?.on('pointermove', (e) => {
      if (e.dragging) {
        return;
      }
      const feature = this.mapComponent?.forEachFeatureAtPixel(e.pixel, (feat) => feat);
      if (feature) {
        const coordinates = e.coordinate;
        this.popup?.setPosition(coordinates);
        const formattedCoordinates = `Lon: ${coordinates[0].toFixed(5)}<br>Lat: ${coordinates[1].toFixed(5)}`;
        this.popupElement.nativeElement.innerHTML = `<strong>Forest Disease Risk Area</strong><br>${formattedCoordinates}`;  
        this.popupElement.nativeElement.style.display = 'block';
      } else {
        this.popupElement.nativeElement.style.display = 'none';
      }
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
