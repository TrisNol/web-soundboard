import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SoundboardService {
    constructor(
        private readonly http: HttpClient
    ) { }

    fetchAudio(): Observable<Blob> {
        return this.http.get('http://localhost:3000/api/sound/42', { responseType: 'blob' });
    }
}