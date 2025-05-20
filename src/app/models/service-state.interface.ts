import { Signal } from '@angular/core';
import { LoadingState } from './loading-state.enum';

export interface ServiceState {
  status: Signal<LoadingState>;
  error: Signal<Error | null>;
}
