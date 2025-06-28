import { Component, OnInit } from '@angular/core';
import { HotelService } from './hotel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  rooms: any[] = [];
  count = 1;

  constructor(private hotel: HotelService) {}

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.hotel.getRooms().subscribe((res: any) => (this.rooms = res));
  }

  bookRooms() {
    this.hotel.bookRooms(this.count).subscribe(() => this.loadRooms());
  }

  reset() {
    this.hotel.resetRooms().subscribe(() => this.loadRooms());
  }

  randomize() {
    this.hotel.generateOccupancy().subscribe(() => this.loadRooms());
  }
}
