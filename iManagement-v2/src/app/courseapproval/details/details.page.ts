import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ActionSheetController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { SqliteService } from 'src/app/services/sqlite.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  public CoursesDetails = {};
  public data: any;

  constructor(
    public alertController: AlertController,
    private route: ActivatedRoute,
    public actionSheetController: ActionSheetController,
    private sqlite: SqliteService,
    private router: Router
  ) {
   }

  ngOnInit() {
    this.getSenaraiTugas(this.data);
  }

  async getSenaraiTugas(id) {
    this.sqlite.getTugasLuarDetails(id)
    .then((data) => {
      this.CoursesDetails = data;
    }, err => console.error(err));
  }

}
