import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageGeneratorService {
  constructor(private http: HttpClient) { }

  async generateImage() {
    return this.http.post('https://api.stability.ai/v1/generation/stable-diffusion-512-v2-0/text-to-image',
    {
      text_prompts: [
        {
          width: 128,
          text: 'the portrait of a business man, cartoon, with green or yellow background',
          weight: 0.5,
          cfg_scale: 10,
          steps: 50,
        },
      ],
    },
    {
      headers: {
        Authorization: `${environment.STABLE_API_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
    },
    )
  }
}
