import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  public playSound(sound: string) {
    let audio = new Audio();
    audio.src = '../../assets/sounds/' + sound;
    audio.load();
    audio.play();
    return audio;
  }
}
