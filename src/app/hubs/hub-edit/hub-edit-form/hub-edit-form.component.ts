import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { HubConfiguration } from '../../../store';
import { MatCardModule } from '@angular/material/card';
import { JsonPipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ROUTE_PATHS } from '../../../routes';

export type HubEditFormSaveResult = {
    hubId: string;
    name: string;
};

@Component({
    standalone: true,
    selector: 'app-hub-edit-form',
    templateUrl: './hub-edit-form.component.html',
    styleUrls: [ './hub-edit-form.component.scss' ],
    imports: [
        MatCardModule,
        NgIf,
        MatButtonModule,
        JsonPipe,
        MatInputModule,
        ReactiveFormsModule,
        TranslocoModule,
        RouterLink,
        MatProgressBarModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HubEditFormComponent {
    @Input() public isSaving: boolean | undefined;

    @Output() public readonly save = new EventEmitter<HubEditFormSaveResult>();

    public readonly form: FormGroup<{
        hubId: FormControl<string>;
        name: FormControl<string | null>;
    }>;

    private _hubConfiguration?: HubConfiguration;

    private _viewPath: string[] = [];

    private readonly maxHubNameLength = 14;

    constructor(
        formBuilder: FormBuilder
    ) {
        this.form = formBuilder.group({
            hubId: formBuilder.control<string>('', { nonNullable: true }),
            name: formBuilder.control<string>('', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(this.maxHubNameLength),
                Validators.pattern(/^[a-zA-Z0-9_.\s]+$/)
            ])
        });
    }

    @Input()
    public set hubConfiguration(v: HubConfiguration | undefined) {
        if (v) {
            if (this._hubConfiguration?.name !== v.name) {
                this.form.patchValue(v);
                this.form.controls.name.markAsPristine();
                this._viewPath = [ '', ROUTE_PATHS.hub, v.hubId ];
            }
        } else {
            this.form.reset();
            this._viewPath = [];
        }
        this._hubConfiguration = v;
    }

    public get hubConfiguration(): HubConfiguration | undefined {
        return this._hubConfiguration;
    }

    public get viewPath(): string[] {
        return this._viewPath;
    }

    public onSave(): void {
        if (this.form.valid) {
            this.save.emit({
                hubId: this.form.controls.hubId.value,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                name: this.form.controls.name.value!
            });
        }
    }
}
