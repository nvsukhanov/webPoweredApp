import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoPipe } from '@ngneat/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ControlSchemeBindingType, ValidationMessagesDirective } from '@app/shared-misc';
import { HideOnSmallScreenDirective, ToggleControlComponent } from '@app/shared-ui';
import { ControlSchemeInputAction } from '@app/store';
import { BindingControlSelectHubComponent, BindingControlSelectIoComponent } from '@app/shared-control-schemes';

import {
    BindingControlPowerInputComponent,
    BindingControlSelectControllerComponent,
    BindingControlSelectControllerComponentData,
    BindingControlSelectLoopingModeComponent,
    BindingEditSectionComponent,
    BindingEditSectionsContainerComponent,
    CommonBindingsFormControlsBuilderService
} from '../common';
import { IBindingsDetailsEditComponent } from '../i-bindings-details-edit-component';
import { TrainControlBindingForm } from './train-control-binding-form';
import { TrainControlL10nService } from './train-control-l10n.service';

@Component({
    standalone: true,
    selector: 'lib-cs-binding-train-control-edit',
    templateUrl: './binding-train-control-edit.component.html',
    styleUrls: [ './binding-train-control-edit.component.scss' ],
    imports: [
        BindingEditSectionComponent,
        BindingControlSelectHubComponent,
        BindingControlSelectIoComponent,
        TranslocoPipe,
        MatDividerModule,
        HideOnSmallScreenDirective,
        BindingControlSelectControllerComponent,
        MatInputModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        BindingControlSelectLoopingModeComponent,
        ToggleControlComponent,
        BindingEditSectionsContainerComponent,
        ValidationMessagesDirective,
        BindingControlPowerInputComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingTrainControlEditComponent implements IBindingsDetailsEditComponent<TrainControlBindingForm> {
    public readonly bindingType = ControlSchemeBindingType.TrainControl;

    private _nextLevelControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.GearboxControl> | null = null;

    private _prevLevelControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.GearboxControl> | null = null;

    private _resetControlBindingComponentData: BindingControlSelectControllerComponentData<ControlSchemeBindingType.GearboxControl> | null = null;

    private _form?: TrainControlBindingForm;

    constructor(
        private readonly commonFormControlBuilder: CommonBindingsFormControlsBuilderService,
        private readonly l10nService: TrainControlL10nService
    ) {
    }

    public get form(): TrainControlBindingForm | undefined {
        return this._form;
    }

    public get nextLevelControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.GearboxControl> | null {
        return this._nextLevelControlBindingComponentData;
    }

    public get prevLevelControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.GearboxControl> | null {
        return this._prevLevelControlBindingComponentData;
    }

    public get resetControlBindingComponentData(): BindingControlSelectControllerComponentData<ControlSchemeBindingType.GearboxControl> | null {
        return this._resetControlBindingComponentData;
    }

    public setForm(
        form: TrainControlBindingForm
    ): void {
        this._form = form;
        this._nextLevelControlBindingComponentData = {
            bindingType: ControlSchemeBindingType.GearboxControl,
            inputFormGroup: this._form.controls.inputs.controls[ControlSchemeInputAction.NextLevel],
            inputAction: ControlSchemeInputAction.NextLevel,
            inputName$: this.l10nService.getBindingInputName(ControlSchemeInputAction.NextLevel)
        };
        this._prevLevelControlBindingComponentData = {
            bindingType: ControlSchemeBindingType.GearboxControl,
            inputFormGroup: this._form.controls.inputs.controls[ControlSchemeInputAction.PrevLevel],
            inputAction: ControlSchemeInputAction.PrevLevel,
            inputName$: this.l10nService.getBindingInputName(ControlSchemeInputAction.PrevLevel)
        };
        this._resetControlBindingComponentData = {
            bindingType: ControlSchemeBindingType.GearboxControl,
            inputFormGroup: this._form.controls.inputs.controls[ControlSchemeInputAction.Reset],
            inputAction: ControlSchemeInputAction.Reset,
            inputName$: this.l10nService.getBindingInputName(ControlSchemeInputAction.Reset)
        };
    }

    public addNextSpeedControl(): void {
        if (!this._form) {
            return;
        }
        this._form.controls.levels.insert(
            0,
            this.commonFormControlBuilder.speedLevelControl(MOTOR_LIMITS.maxSpeed)
        );
        this._form.controls.initialLevelIndex.setValue(
            this._form.controls.initialLevelIndex.value + 1
        );
        this._form.controls.initialLevelIndex.markAsDirty();
        this._form.controls.levels.markAsDirty();
        this._form.updateValueAndValidity();
    }

    public addPrevSpeedControl(): void {
        if (!this._form) {
            return;
        }
        this._form.controls.levels.push(
            this.commonFormControlBuilder.speedLevelControl(MOTOR_LIMITS.minSpeed)
        );
        this._form.controls.initialLevelIndex.markAsDirty();
        this._form.controls.levels.markAsDirty();
        this._form.updateValueAndValidity();
    }

    public removeSpeedControl(
        index: number
    ): void {
        if (!this._form) {
            return;
        }
        this._form.controls.levels.removeAt(index);
        if (index < this._form.controls.initialLevelIndex.value) {
            this._form.controls.initialLevelIndex.setValue(
                this._form.controls.initialLevelIndex.value - 1
            );
        }
        this._form.controls.initialLevelIndex.markAsDirty();
        this._form.controls.levels.markAsDirty();
        this._form.updateValueAndValidity();
    }
}
