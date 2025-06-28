import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HotelService {
  private api = 'https://unstop-challenge.onrender.com/api';

  constructor(private http: HttpClient) {}

  getRooms() {
    return this.http.get(`${this.api}/rooms`);
  }

  bookRooms(count: number) {
    return this.http.post(`${this.api}/book`, { count });
  }

  resetRooms() {
    return this.http.post(`${this.api}/reset`, {});
  }

  generateOccupancy() {
    return this.http.post(`${this.api}/random`, {});
  }
}
