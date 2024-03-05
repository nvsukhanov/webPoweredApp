import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { MOTOR_LIMITS } from 'rxpoweredup';
import { ControlSchemeBindingInputs, ControlSchemeInput, ControlSchemeInputAction, PortCommandTask } from '@app/store';
import { ControlSchemeBindingType } from '@app/shared-misc';

import { IBindingL10n } from '../i-binding-l10n';
import { ControllerInputNameService, DirectionAwareControllerInputNameService } from '../common';

@Injectable()
export class TrainControlL10nService implements IBindingL10n<ControlSchemeBindingType.TrainControl> {
    constructor(
        private readonly translocoService: TranslocoService,
        private readonly controllerNameProvider: ControllerInputNameService,
        private readonly directionAwareControllerNameProvider: DirectionAwareControllerInputNameService
    ) {
    }

    public buildTaskSummary(
        task: PortCommandTask<ControlSchemeBindingType.TrainControl>
    ): Observable<string> {
        const level = task.payload.initialLevelIndex - task.payload.speedIndex;
        const speedPercent = Math.round((task.payload.speed / MOTOR_LIMITS.maxSpeed) * 100);
        const isLooping = task.payload.isLooping;
        return this.translocoService.selectTranslate('controlScheme.trainControlBinding.taskSummary', { level, speedPercent, isLooping });
    }

    public getBindingInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.TrainControl>,
    ): Observable<string> {
        switch (actionType) {
            case ControlSchemeInputAction.NextLevel:
                return this.translocoService.selectTranslate('controlScheme.trainControlBinding.prevLevel');
            case ControlSchemeInputAction.PrevLevel:
                return this.translocoService.selectTranslate('controlScheme.trainControlBinding.nextLevel');
            case ControlSchemeInputAction.Reset:
                return this.translocoService.selectTranslate('controlScheme.trainControlBinding.reset');
        }
    }

    public getControllerInputName(
        actionType: keyof ControlSchemeBindingInputs<ControlSchemeBindingType.TrainControl>,
        inputConfig: ControlSchemeInput
    ): Observable<string> {
        switch (actionType) {
            case ControlSchemeInputAction.NextLevel:
            case ControlSchemeInputAction.PrevLevel:
                return this.directionAwareControllerNameProvider.getFullControllerInputNameData(inputConfig);
            case ControlSchemeInputAction.Reset:
                return this.controllerNameProvider.getFullControllerInputNameData(inputConfig);
        }
    }

}
