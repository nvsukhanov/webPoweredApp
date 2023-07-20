import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, of, switchMap, take } from 'rxjs';
import { PushPipe } from '@ngrx/component';
import { TranslocoModule } from '@ngneat/transloco';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { CONTROL_SCHEME_V2_ACTIONS, CONTROL_SCHEME_V2_SELECTORS, ControlSchemeV2Model, ROUTER_SELECTORS } from '@app/store';

import { RoutesBuilderService } from '../../routing';
import { ControlSchemeEditFormComponent } from './edit-form';
import { ControlSchemeEditForm } from './types';
import { mapFormToModel } from '../map-form-to-model';

@Component({
    standalone: true,
    selector: 'app-control-scheme',
    templateUrl: './control-scheme-edit.component.html',
    styleUrls: [ './control-scheme-edit.component.scss' ],
    imports: [
        ControlSchemeEditFormComponent,
        PushPipe,
        TranslocoModule,
        NgIf,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeEditComponent implements OnDestroy {
    public readonly currentlyEditedScheme$: Observable<ControlSchemeV2Model | undefined> =
        this.store.select(ROUTER_SELECTORS.selectCurrentlyEditedSchemeId).pipe(
            switchMap((i) => i === null ? of(undefined) : this.store.select(CONTROL_SCHEME_V2_SELECTORS.selectScheme(i)))
        );

    private sub?: Subscription;

    constructor(
        private readonly store: Store,
        private readonly routesBuilderService: RoutesBuilderService,
        private readonly router: Router
    ) {
    }

    public ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    public onSave(
        form: ControlSchemeEditForm
    ): void {
        this.store.dispatch(CONTROL_SCHEME_V2_ACTIONS.update({
            scheme: mapFormToModel(form)
        }));
    }

    public onCancel(): void {
        this.currentlyEditedScheme$.pipe(
            take(1)
        ).subscribe((i) => {
            this.router.navigate(i === undefined ? this.routesBuilderService.controlSchemesList : this.routesBuilderService.controlSchemeView(i.id));
        });
    }
}
