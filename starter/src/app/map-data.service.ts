import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Fill, Stroke } from 'ol/style';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';


@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  constructor(private http: HttpClient) {}

  public getLocalVectorLayer(): Observable<VectorLayer<VectorSource<Feature<Geometry>>>> {

    const localUrl = 'assets/Forest_Disease_Risk_Areas_DBCA_024_WA_GDA2020_Public.geojson';

    return this.http.get(localUrl, { responseType: 'json' }).pipe(
      map(geojsonObject => this.createVectorLayerFromGeoJSON(geojsonObject))
    );
  }

  private createVectorLayerFromGeoJSON(geojsonObject: any): VectorLayer<VectorSource<Feature<Geometry>>> {
    const features = new GeoJSON().readFeatures(geojsonObject, {
      dataProjection: 'EPSG:4326',

    }).map(feature => feature as Feature<Geometry>);

    const vectorSource = new VectorSource<Feature<Geometry>>({
      features: features,
    });

    const vectorLayer = new VectorLayer<VectorSource<Feature<Geometry>>>({
      source: vectorSource,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 0, 0, 10)',
        }),
        stroke: new Stroke({
          color: 'red',
          width: 1,
        }),
      }),
    });

    return vectorLayer;
  }
}
