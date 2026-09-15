import { Service, signal } from '@angular/core';

export interface CheckoutSuccess {
  orderNumber: string;
  summary: string;
}

@Service()
export class CheckoutSuccessService {
  private readonly stateSignal = signal<CheckoutSuccess | null>(null);
  readonly state = this.stateSignal.asReadonly();

  show(success: CheckoutSuccess) {
    this.stateSignal.set(success);
  }

  clear() {
    this.stateSignal.set(null);
  }
}
