import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Consumer {
  id: number;
  consumerNumber: string;
  customerId: number;
  customerName: string;
  address: string;
  meterNumber?: string;
  connectionType: 'Domestic' | 'Commercial';
  sanctionedLoad: number;
  connectionDate: string;
  tariffCategory: string;
  status: 'Active' | 'Disconnected';
  zone: string;
}

interface BackendConsumerResponse {
  id: number;
  consumerNumber: string;
  name: string;
  address: string;
  meterNumber: string;
  tariffType: string;
  linkedUserId?: number;
  linkedUsername?: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class ConsumerService {
  private http = inject(HttpClient);

  private extractArea(address: string): string {
    const areas = ['Vijay Nagar','Rau','Pithampur','Freeganj','Dewas','Ujjain','Indore','Maksi Road','Tarana','Nagda'];
    const found = areas.find(a => address.toLowerCase().includes(a.toLowerCase()));
    return found ?? 'Ujjain';
  }

  private mapToFrontend(b: BackendConsumerResponse): Consumer {
    return {
      id: b.id,
      consumerNumber: b.consumerNumber,
      customerId: b.linkedUserId || 0,
      customerName: b.name,
      address: b.address,
      connectionType: b.tariffType === 'DOMESTIC' ? 'Domestic' : 'Commercial',
      sanctionedLoad: b.tariffType === 'INDUSTRIAL' ? 50 : 10,
      connectionDate: b.createdAt,
      tariffCategory: b.tariffType,
      status: 'Active',
      zone: this.extractArea(b.address),
    };
  }

  getAll(): Observable<Consumer[]> {
    return this.http.get<BackendConsumerResponse[]>(`${environment.apiUrl}/consumers`).pipe(
      map(res => res.map(c => this.mapToFrontend(c))),
      catchError(() => of([]))
    );
  }

  getById(id: number): Observable<Consumer | undefined> {
    return this.http.get<BackendConsumerResponse>(`${environment.apiUrl}/consumers/${id}`).pipe(
      map(c => this.mapToFrontend(c)),
      catchError(() => of(undefined))
    );
  }

  add(c: Partial<Consumer>): Observable<Consumer> {
    // The backend expects: { name, address, meterNumber, consumerNumber, tariffType }
    const payload = {
      name: c.customerName,
      address: c.address,
      meterNumber: c.meterNumber || `MN-${Math.floor(Math.random()*10000)}`,
      consumerNumber: c.consumerNumber || `1234567890${Math.floor(Math.random()*1000)}`,
      tariffType: c.connectionType === 'Domestic' ? 'DOMESTIC' : 'COMMERCIAL'
    };
    return this.http.post<BackendConsumerResponse>(`${environment.apiUrl}/consumers`, payload).pipe(
      map(res => this.mapToFrontend(res))
    );
  }

  update(id: number, c: Partial<Consumer>): Observable<Consumer> {
    // Backend doesn't support update yet, just return mapped
    return this.getById(id) as Observable<Consumer>;
  }

  toggleStatus(id: number, reason: string): Observable<Consumer> {
    // Backend doesn't support disconnect yet
    return this.getById(id) as Observable<Consumer>;
  }
}
