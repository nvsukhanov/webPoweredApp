import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ControllerTypeSelectComponent } from '../controller-type-select';
import {
    ACTIONS_CONFIGURE_CONTROLLER,
    ControllerConnectionState,
    ControllerType,
    IState,
    SELECT_CONTROLLER_CONFIG,
    SELECT_CONTROLLER_CONNECTION_STATE,
    SELECT_CONTROLLER_STATE,
    SELECT_CONTROLLER_TYPE
} from '../../store';
import { Store } from '@ngrx/store';
import { JsonPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { LetModule, PushModule } from '@ngrx/component';
import { ControllerGamepadViewComponent } from '../controller-gamepad-view';
import { ControllerKeyboardViewComponent } from '../controller-keyboard-view';
import { TranslocoModule } from '@ngneat/transloco';

@Component({
    standalone: true,
    selector: 'app-configure-controller',
    templateUrl: './configure-controller.component.html',
    styleUrls: [ './configure-controller.component.scss' ],
    imports: [
        ControllerTypeSelectComponent,
        NgIf,
        MatButtonModule,
        NgSwitchCase,
        FormsModule,
        PushModule,
        NgSwitch,
        JsonPipe,
        LetModule,
        ControllerGamepadViewComponent,
        ControllerKeyboardViewComponent,
        TranslocoModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfigureControllerComponent implements OnDestroy {
    public readonly controllerConnectionState$ = this.store.select(SELECT_CONTROLLER_CONNECTION_STATE);

    public readonly connectedControllerType$ = this.store.select(SELECT_CONTROLLER_TYPE);

    public readonly controllerTypes = ControllerType;

    public readonly controllerConfig$ = this.store.select(SELECT_CONTROLLER_CONFIG);

    public readonly controllerState$ = this.store.select(SELECT_CONTROLLER_STATE);

    public readonly controllerConnectionStates = ControllerConnectionState;

    constructor(
        private readonly store: Store<IState>,
    ) {
    }

    public ngOnDestroy(): void {
        this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.cancelListeningForGamepad());
    }

    public isControllerTypeSelected(type: ControllerType | null): boolean {
        return type !== null && type !== ControllerType.Unassigned;
    }

    public disconnectGamepad(index: number | null): void {
        if (index !== null) { // TODO: maybe we can avoid using null in the state
            this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.disconnectGamepad({ index }));
        }
    }

    public disconnectKeyboard(): void {
        this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.keyboardDisconnected());
    }

    public cancelListening(): void {
        this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.cancelListeningForGamepad());
    }

    public onControllerListeningStart(controllerType: ControllerType | null): void {
        switch (controllerType) {
            case ControllerType.GamePad:
                this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.listenForGamepad());
                break;
            case ControllerType.Keyboard:
                this.store.dispatch(ACTIONS_CONFIGURE_CONTROLLER.keyboardConnected());
                break;
            case ControllerType.Unassigned:
            case null:
                return;
        }
    }
}
