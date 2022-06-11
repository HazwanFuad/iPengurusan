import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-viewreason',
  templateUrl: './viewreason.page.html',
  styleUrls: ['./viewreason.page.scss'],
})
export class ViewreasonPage implements OnInit {

  constructor(
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async handleActionClick() {

    const actionSheet = await this.actionSheetController.create({
      header: 'Sahkan Kelulusan Alasan?',
      mode: 'ios',
      buttons: [
        // { text: 'Delete', role: 'destructive' },
        {
          text: 'Ya',
          handler: () => {
            this.router.navigate(['/attendace']);
          }
        },
        {
          text: 'Tidak',
          role: 'destructive',
          handler: () => {
            this.router.navigate(['/attendace']);
          }
        },
        {
          text: 'KIV',
          handler: () => {
            this.router.navigate(['/attendace']);
          }
        },
        {
          text: 'Kembali',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

}
