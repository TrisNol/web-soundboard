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
  title = 'frontend';

  private audioContext: AudioContext;
  private microphoneStream: MediaStream | undefined = undefined;

  constructor(private soundboardService: SoundboardService) {
    this.audioContext = new (window.AudioContext)();
  }

  ngOnInit() {
    this.requestMicrophoneAccess();
  }

  requestMicrophoneAccess() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        this.microphoneStream = stream;
        console.log('Microphone access granted');
      })
      .catch((err: Error) => {
        console.error('Microphone access denied', err);
      });
  }

  playSound() {
    this.soundboardService.fetchAudio().subscribe((audioBlob: Blob) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      this.playAudio(audioUrl);
    });
  }

  playAudio(url: string) {
    const audioElement = new Audio(url);
    const sourceNode = this.audioContext.createMediaElementSource(audioElement);
    const destinationNode = this.audioContext.createMediaStreamDestination();

    sourceNode.connect(destinationNode);
    sourceNode.connect(this.audioContext.destination);  // To play through speakers
    if (this.microphoneStream)
      this.microphoneStream.getTracks().forEach(track => destinationNode.stream.addTrack(track));

    audioElement.play().then(() => {
      console.log('Playback started successfully');
    }).catch(error => {
      console.error('Playback failed:', error);
    });
  }
}
