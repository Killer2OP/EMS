import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  zone: string;
  connectionType: 'Domestic' | 'Commercial';
  meterNumber: string;
  status: 'Active' | 'Disconnected';
  createdAt: string;
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
export class CustomerService {
  private http = inject(HttpClient);

  private extractArea(address: string): string {
    const areas = ['Vijay Nagar','Rau','Pithampur','Freeganj','Dewas','Ujjain','Indore','Maksi Road','Tarana','Nagda'];
    const found = areas.find(a => address.toLowerCase().includes(a.toLowerCase()));
    return found ?? 'Ujjain';
  }

  private mapToCustomer(b: BackendConsumerResponse): Customer {
    return {
      id: b.id,
      name: b.name,
      email: b.linkedUsername ? `${b.linkedUsername}@example.com` : 'unknown@email.com',
      phone: '9999999999',
      address: b.address,
      zone: this.extractArea(b.address),
      connectionType: b.tariffType === 'DOMESTIC' ? 'Domestic' : 'Commercial',
      meterNumber: b.meterNumber,
      status: 'Active',
      createdAt: b.createdAt
    };
  }

  getAll(): Observable<Customer[]> {
    return this.http.get<BackendConsumerResponse[]>(`${environment.apiUrl}/consumers`).pipe(
      map(res => res.map(c => this.mapToCustomer(c))),
      catchError(() => of([]))
    );
  }

  getById(id: number): Observable<Customer | undefined> {
    return this.http.get<BackendConsumerResponse>(`${environment.apiUrl}/consumers/${id}`).pipe(
      map(c => this.mapToCustomer(c)),
      catchError(() => of(undefined))
    );
  }

  add(c: Partial<Customer>): Observable<Customer> {
    const payload = {
      name: c.name,
      address: c.address,
      meterNumber: c.meterNumber || `MN-${Math.floor(Math.random()*10000)}`,
      consumerNumber: `1234567890${Math.floor(Math.random()*1000)}`,
      tariffType: c.connectionType === 'Domestic' ? 'DOMESTIC' : 'COMMERCIAL'
    };
    return this.http.post<BackendConsumerResponse>(`${environment.apiUrl}/consumers`, payload).pipe(
      map(res => this.mapToCustomer(res))
    );
  }

  update(id: number, c: Partial<Customer>): Observable<Customer> {
    return this.getById(id) as Observable<Customer>;
  }
}
