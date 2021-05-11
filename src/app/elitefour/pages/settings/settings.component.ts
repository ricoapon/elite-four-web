import { Component, OnInit } from '@angular/core';
import { version } from '../../../../../package.json';
import { author } from '../../../../../package.json';
import {ElectronService} from "../../../core/services";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  version: string = version;
  authorName = author.name
  configPath: string = ''

  constructor(private electronService: ElectronService) { }

  ngOnInit(): void {
    this.configPath = require('electron').remote.app.getPath('userData') + '\\config.json'
  }

  showDevTools() {
    this.electronService.ipcRenderer.send('open-devtools')
  }
}
