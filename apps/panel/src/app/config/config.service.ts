import { inject, Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly _meta = inject(Meta);

  public readonly version: string;

  constructor() {
    const tag = this._meta.getTag('name="version"');
    this.version = tag?.content || 'dev';
  }
}
