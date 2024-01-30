import { FormControl, FormGroup } from '@angular/forms';
import { ControlSchemeInputAction } from '@app/store';

import { InputFormGroup } from '../common';

export type ServoBindingForm = FormGroup<{
    inputs: FormGroup<{
        [ControlSchemeInputAction.Servo]: InputFormGroup;
    }>;
    hubId: FormControl<string | null>;
    portId: FormControl<number | null>;
    calibrateOnStart: FormControl<boolean>;
    range: FormControl<number>;
    aposCenter: FormControl<number>;
    speed: FormControl<number>;
    power: FormControl<number>;
    invert: FormControl<boolean>;
    useAccelerationProfile: FormControl<boolean>;
    useDecelerationProfile: FormControl<boolean>;
}>;
