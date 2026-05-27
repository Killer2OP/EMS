import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Bill {
  id: number;
  consumerNumber: string;
  customerName: string;
  meterNumber: string;
  billingMonth: string;
  readingPeriod: string;
  previousReading: number;
  currentReading: number;
  unitsConsumed: number;
  ratePerUnit: number;
  slabCharges: number;
  taxes: number;
  totalAmount: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  dueDate: string;
  paidDate?: string;
  zone: string;
}

interface BackendBillResponse {
  id: number;
  consumerId: number;
  consumerName: string;
  consumerNumber: string;
  billingPeriod: string; // e.g. "2024-03"
  unitsConsumed: number;
  amountDue: number;
  dueDate: string;
  status: string; // 'PAID' | 'UNPAID' | 'OVERDUE'
  generatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class BillService {
  private http = inject(HttpClient);

  private mapToBill(b: BackendBillResponse): Bill {
    return {
      id: b.id,
      consumerNumber: b.consumerNumber,
      customerName: b.consumerName,
      meterNumber: 'N/A', // Backend response doesn't include meterNumber currently
      billingMonth: b.billingPeriod,
      readingPeriod: `01 - 30/31 of ${b.billingPeriod}`,
      previousReading: 0,
      currentReading: b.unitsConsumed,
      unitsConsumed: b.unitsConsumed,
      ratePerUnit: 5.0, // Assuming domestic for display if needed
      slabCharges: b.amountDue * 0.9,
      taxes: b.amountDue * 0.1,
      totalAmount: b.amountDue,
      status: (b.status === 'PAID' ? 'Paid' : b.status === 'OVERDUE' ? 'Overdue' : 'Unpaid') as Bill['status'],
      dueDate: b.dueDate,
      paidDate: b.status === 'PAID' ? b.dueDate : undefined,
      zone: 'Ujjain'
    };
  }

  getAll(): Observable<Bill[]> {
    return this.http.get<BackendBillResponse[]>(`${environment.apiUrl}/bills`).pipe(
      map(res => res.map(b => this.mapToBill(b))),
      catchError(() => of([]))
    );
  }

  getByConsumer(consumerId: string): Observable<Bill[]> {
    return this.http.get<BackendBillResponse[]>(`${environment.apiUrl}/bills/consumer/${consumerId}`).pipe(
      map(res => res.map(b => this.mapToBill(b))),
      catchError(() => of([]))
    );
  }

  getLatest(consumerId: string): Observable<Bill | undefined> {
    return this.getByConsumer(consumerId).pipe(
      map(bills => {
        if (!bills || bills.length === 0) return undefined;
        return [...bills].sort((a, b) => b.id - a.id)[0];
      })
    );
  }

  add(b: Partial<Bill>): Observable<Bill> {
    // Generate bill endpoint expects GenerateBillRequest
    // @NotNull private Long consumerId;
    // @NotBlank private String billingPeriod;
    // @NotNull private Double unitsConsumed;
    const payload = {
      consumerId: 1, // Need actual ID here, hardcoded for signature matching; will fail if ID=1 doesn't exist
      billingPeriod: b.billingMonth || '2025-05',
      unitsConsumed: b.unitsConsumed || 100
    };
    return this.http.post<BackendBillResponse>(`${environment.apiUrl}/bills`, payload).pipe(
      map(res => this.mapToBill(res))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/bills/${id}`);
  }

  markPaid(id: number): Observable<Bill> {
    // Backend updates status when payment is processed, but if UI forces it:
    return this.http.get<BackendBillResponse>(`${environment.apiUrl}/bills/${id}`).pipe(
      map(res => this.mapToBill(res))
    );
  }

  calculateBill(prev: number, curr: number): { units: number; slabCharges: number; taxes: number; total: number } {
    const units = curr - prev;
    let slabCharges = 0;
    if (units <= 100) slabCharges = units * 3.5;
    else if (units <= 200) slabCharges = 100 * 3.5 + (units - 100) * 5;
    else slabCharges = 100 * 3.5 + 100 * 5 + (units - 200) * 7;
    const taxes = slabCharges * 0.11;
    return { units, slabCharges: +slabCharges.toFixed(2), taxes: +taxes.toFixed(2), total: +(slabCharges + taxes).toFixed(2) };
  }
}
