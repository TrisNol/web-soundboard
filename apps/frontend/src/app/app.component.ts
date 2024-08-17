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

  private audioContext: AudioContext | undefined = undefined;

  private microphoneStream: MediaStream | undefined = undefined;

  constructor(private soundboardService: SoundboardService) {
  }

  async ngOnInit() {
    this.requestMicrophoneAccess();
  }

  async requestMicrophoneAccess() {
    const s = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    console.log(s);
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

  async playAudio(url: string) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext)();
    }

    if (!this.microphoneStream) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        this.microphoneStream = stream;
      } catch (error) {
        console.error('Error accessing microphone:', error);
        return;
      }
    }

    const audioElement = new Audio(url);
    const sourceNode = this.audioContext.createMediaElementSource(audioElement);
    const destinationNode = this.audioContext.createMediaStreamDestination();

    sourceNode.connect(this.audioContext.destination); // Play audio to the speaker
    sourceNode.connect(destinationNode); // Forward audio to MediaStreamDestination

    // Add the tracks from the destination node to the microphone stream
    destinationNode.stream.getAudioTracks().forEach(track => {
      this.microphoneStream?.addTrack(track);
    });

    // Start playing the audio
    audioElement.play().then(() => {
      console.log('Playback started successfully');
    }).catch(error => {
      console.error('Playback failed:', error);
    });
  }
}
