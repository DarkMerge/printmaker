import { Component, DestroyRef, computed, effect, inject, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.html',
  styleUrl: './order-success.css',
})
export class OrderSuccess {
  readonly visible = input(false);
  readonly orderNumber = input('');
  readonly summary = input('');
  readonly autoDismissMs = input(4200);
  readonly dismissed = output<void>();

  protected readonly dismissing = signal(false);
  protected readonly sweepSeconds = computed(() => Math.max(1500, this.autoDismissMs()) / 1000);

  private timers: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    effect(() => {
      if (!this.visible()) {
        return;
      }
      this.clearTimers();
      this.dismissing.set(false);
      const ms = Math.max(1500, this.autoDismissMs());
      this.timers.push(setTimeout(() => this.dismissing.set(true), ms - 420));
      this.timers.push(setTimeout(() => this.dismissed.emit(), ms));
    });

    inject(DestroyRef).onDestroy(() => this.clearTimers());
  }

  private clearTimers() {
    for (const timer of this.timers) {
      clearTimeout(timer);
    }
    this.timers = [];
  }
}
