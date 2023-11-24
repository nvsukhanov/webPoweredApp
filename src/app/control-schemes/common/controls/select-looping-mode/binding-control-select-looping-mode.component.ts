import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoPipe } from '@ngneat/transloco';
import { getEnumValues } from '@app/shared-misc';
import { LoopingMode } from '@app/store';

import { LoopingModeToL10nKeyPipe } from './looping-mode-to-l10n-key.pipe';

@Component({
    standalone: true,
    selector: 'app-binding-control-select-looping-mode',
    templateUrl: './binding-control-select-looping-mode.component.html',
    styleUrls: [ './binding-control-select-looping-mode.component.scss' ],
    imports: [
        MatFormFieldModule,
        MatOptionModule,
        MatSelectModule,
        NgForOf,
        NgIf,
        ReactiveFormsModule,
        TranslocoPipe,
        LoopingModeToL10nKeyPipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BindingControlSelectLoopingModeComponent {
    @Input() public control?: FormControl<LoopingMode>;

    public readonly availableLoopingModes: ReadonlyArray<LoopingMode> = getEnumValues(LoopingMode);
}
