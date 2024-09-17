import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SoundboardService } from "./services/soundboard.service";

@Component({
  standalone: true,
  imports: [RouterModule, HttpClientModule],
  providers: [SoundboardService],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'Web Soundboard';
  public sounds: any[] = [];

  private audioElement: HTMLAudioElement | undefined;
  constructor(private soundboardService: SoundboardService) {
  }

  async ngOnInit() {
    this.soundboardService.fetchSounds().subscribe((sounds: any[]) => {
      console.log(sounds);
      this.sounds = sounds;
    });
  }

  playSound(sound: any) {
    this.soundboardService.fetchAudio(sound.id).subscribe((audioBlob: Blob) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      this.playAudio(audioUrl);
    });
  }

  async playAudio(url: string) {


    const audioElement = new Audio(url);
    if (this.audioElement) {
      this.audioElement.srcObject = null;
    }
    this.audioElement = audioElement;
    // Start playing the audio
    audioElement.play().then(() => {
      console.log('Playback started successfully');
    }).catch(error => {
      console.error('Playback failed:', error);
    });
  }
}
