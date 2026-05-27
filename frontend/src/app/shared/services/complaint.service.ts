import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Complaint {
  id: string;
  customerId: number;
  consumerNumber?: string;
  customerName: string;
  category: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  dateRaised: string;
  lastUpdatedDate?: string;
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
  loggedByAdmin?: boolean;
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private http = inject(HttpClient);

  // Priority is a frontend-only concept — stored in localStorage keyed by complaint ID
  private readonly PRIORITY_KEY = 'vs_complaint_priorities';

  private savePriority(complaintId: number, priority: string): void {
    const stored = this.getPriorityMap();
    stored[complaintId] = priority;
    localStorage.setItem(this.PRIORITY_KEY, JSON.stringify(stored));
  }

  private getPriorityMap(): Record<number, string> {
    const raw = localStorage.getItem(this.PRIORITY_KEY);
    return raw ? JSON.parse(raw) : {};
  }

  private getPriority(complaintId: number): Complaint['priority'] {
    const map = this.getPriorityMap();
    return (map[complaintId] as Complaint['priority']) ?? 'Medium';
  }

  private categoryToBackend(category: string): string {
    const map: Record<string, string> = {
      'Power Outage': 'OUTAGE',
      'Meter Fault': 'METER_FAULT',
      'Billing Issue': 'BILLING',
      'Voltage Fluctuation': 'OTHER',
      'New Connection Request': 'OTHER',
      'Other': 'OTHER',
    };
    return map[category] ?? category.toUpperCase().replace(/ /g, '_');
  }

  private mapToComplaint(b: BackendComplaintResponse): Complaint {
    return {
      id: `CMP-${b.id}`,
      customerId: b.consumerId,
      customerName: b.consumerName,
      category: b.category.replace(/_/g, ' '),
      description: b.description,
      priority: this.getPriority(b.id),
      status: (b.status === 'OPEN' ? 'Open' : b.status === 'ASSIGNED' ? 'In Progress' : 'Resolved') as Complaint['status'],
      dateRaised: b.createdAt ? b.createdAt.split('T')[0] : '',
      lastUpdatedDate: b.resolvedAt ? b.resolvedAt.split('T')[0] : (b.createdAt ? b.createdAt.split('T')[0] : ''),
      assignedSmeId: b.assignedSmeId,
      assignedSmeName: b.assignedSmeName,
      resolutionNotes: b.resolutionNotes ?? (b.resolvedAt ? `Resolved on ${b.resolvedAt.split('T')[0]}` : undefined)
    };
  }

  getAll(): Observable<Complaint[]> {
    return this.http.get<BackendComplaintResponse[]>(`${environment.apiUrl}/complaints`).pipe(
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
    const priority = c.priority ?? 'Medium';
    const payload = {
      description: c.description || 'No description provided',
      category: this.categoryToBackend(c.category || 'Other')
    };
    return this.http.post<BackendComplaintResponse>(`${environment.apiUrl}/complaints`, payload).pipe(
      map(res => {
        this.savePriority(res.id, priority); // ← save priority against the real complaint ID
        return this.mapToComplaint(res);
      })
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
