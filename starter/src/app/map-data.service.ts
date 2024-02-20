import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';

@Injectable({
  providedIn: 'root',
})
export class MapDataService {
  constructor(private http: HttpClient) {}

  public getLocalVectorSource(): Observable<VectorSource<Feature<Geometry>>> {
    const localUrl = 'assets/Forest_Disease_Risk_Areas_DBCA_024_WA_GDA2020_Public.geojson';

    return this.http.get(localUrl, { responseType: 'json' }).pipe(
      map(geojsonObject => this.createVectorSourceFromGeoJSON(geojsonObject))
    );
  }

  private createVectorSourceFromGeoJSON(geojsonObject: any): VectorSource<Feature<Geometry>> {
    const features = new GeoJSON().readFeatures(geojsonObject, {
      dataProjection: 'EPSG:4326',
    }).map(feature => feature as Feature<Geometry>);

    const vectorSource = new VectorSource<Feature<Geometry>>({
      features: features,
    });

    return vectorSource;
  }
}
