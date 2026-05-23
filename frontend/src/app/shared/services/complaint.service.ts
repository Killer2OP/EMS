import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Complaint {
  id: string;
  customerId: number;
  customerName: string;
  category: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  dateRaised: string;
  assignedSmeId?: number;
  assignedSmeName?: string;
  resolutionNotes?: string;
  dateOfVisit?: string;
  photoUrl?: string;
}

interface BackendComplaintResponse {
  id: number;
  consumerId: number;
  consumerName: string;
  description: string;
  category: string;
  status: string;
  assignedSmeId?: number;
  assignedSmeName?: string;
  createdAt: string;
  resolvedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private http = inject(HttpClient);

  private mapToComplaint(b: BackendComplaintResponse): Complaint {
    return {
      id: `CMP-${b.id}`,
      customerId: b.consumerId,
      customerName: b.consumerName,
      category: b.category.replace('_', ' '),
      description: b.description,
      priority: 'High', // Defaulting as backend doesn't have priority
      status: (b.status === 'OPEN' ? 'Open' : b.status === 'ASSIGNED' ? 'In Progress' : 'Resolved') as Complaint['status'],
      dateRaised: b.createdAt.split('T')[0],
      assignedSmeId: b.assignedSmeId,
      assignedSmeName: b.assignedSmeName,
      resolutionNotes: b.resolvedAt ? `Resolved on ${b.resolvedAt}` : undefined
    };
  }

  getAll(): Observable<Complaint[]> {
    return this.http.get<BackendComplaintResponse[]>(`${environment.apiUrl}/complaints/active`).pipe(
      map(res => res.map(c => this.mapToComplaint(c))),
      catchError(() => of([]))
    );
  }

  getByCustomer(customerId: number): Observable<Complaint[]> {
    return this.http.get<BackendComplaintResponse[]>(`${environment.apiUrl}/complaints/consumer/${customerId}`).pipe(
      map(res => res.map(c => this.mapToComplaint(c))),
      catchError(() => of([]))
    );
  }

  getBySme(smeId: number): Observable<Complaint[]> {
    return this.http.get<BackendComplaintResponse[]>(`${environment.apiUrl}/complaints/sme/assigned`).pipe(
      map(res => res.map(c => this.mapToComplaint(c))),
      catchError(() => of([]))
    );
  }

  getById(id: string): Observable<Complaint | undefined> {
    const numericId = id.replace('CMP-', '');
    return this.http.get<BackendComplaintResponse>(`${environment.apiUrl}/complaints/${numericId}`).pipe(
      map(c => this.mapToComplaint(c)),
      catchError(() => of(undefined))
    );
  }

  add(c: Partial<Complaint>): Observable<Complaint> {
    const payload = {
      description: c.description || 'No description provided',
      category: c.category?.toUpperCase().replace(' ', '_') || 'OTHER'
    };
    return this.http.post<BackendComplaintResponse>(`${environment.apiUrl}/complaints`, payload).pipe(
      map(res => this.mapToComplaint(res))
    );
  }

  assignSme(id: string, smeId: number, smeName: string): Observable<Complaint> {
    const numericId = id.replace('CMP-', '');
    return this.http.put<BackendComplaintResponse>(`${environment.apiUrl}/complaints/${numericId}/assign`, { smeUserId: smeId }).pipe(
      map(res => this.mapToComplaint(res))
    );
  }

  resolve(id: string, notes: string, visitDate: string, status: 'In Progress' | 'Resolved'): Observable<Complaint> {
    const numericId = id.replace('CMP-', '');
    return this.http.put<BackendComplaintResponse>(`${environment.apiUrl}/complaints/${numericId}/resolve`, { resolutionNotes: notes }).pipe(
      map(res => this.mapToComplaint(res))
    );
  }
}
