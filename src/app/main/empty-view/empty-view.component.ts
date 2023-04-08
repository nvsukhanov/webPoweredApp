import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IState, SELECT_BLUETOOTH_AVAILABILITY } from '../../store';
import { Store } from '@ngrx/store';
import { NgIf } from '@angular/common';
import { PushModule } from '@ngrx/component';

@Component({
    standalone: true,
    selector: 'app-empty-view',
    templateUrl: './empty-view.component.html',
    styleUrls: [ './empty-view.component.scss' ],
    imports: [
        NgIf,
        PushModule,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyViewComponent {
    public readonly bluetoothAvailability$ = this.store.select(SELECT_BLUETOOTH_AVAILABILITY);

    constructor(
        private store: Store<IState>,
    ) {
    }
}
