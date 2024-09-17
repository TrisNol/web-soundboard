import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class SoundboardService {
    private sound: HTMLAudioElement | undefined;
    constructor(
        private readonly http: HttpClient
    ) { }

    fetchAudio(id: string): Observable<Blob> {
        return this.http.get(`http://localhost:3000/api/sound/${id}`, { responseType: 'blob' });
    }

    fetchSounds(): Observable<any[]>{
        return this.http.get<any[]>(`http://localhost:3000/api/sound`);
    }
}