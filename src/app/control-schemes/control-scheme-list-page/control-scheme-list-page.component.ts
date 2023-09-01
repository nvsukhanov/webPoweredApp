import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LetDirective, PushPipe } from '@ngrx/component';
import { NgForOf, NgIf } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CONTROL_SCHEME_ACTIONS, ControlSchemeModel } from '@app/store';
import { ConfirmationDialogModule, ConfirmationDialogService, FeatureToolbarControlsDirective, HintComponent } from '@app/shared';

import { RoutesBuilderService } from '../../routing';
import { CONTROL_SCHEMES_LIST_PAGE_SELECTORS } from './control-schemes-list.selectors';
import { ControlSchemeCreateDialogComponent } from './control-scheme-create-dialog';
import { ControlSchemeViewUrlPipe } from './control-scheme-view-url.pipe';

@Component({
    standalone: true,
    selector: 'app-control-scheme-list-page',
    templateUrl: './control-scheme-list-page.component.html',
    styleUrls: [ './control-scheme-list-page.component.scss' ],
    imports: [
        LetDirective,
        NgForOf,
        NgIf,
        PushPipe,
        TranslocoModule,
        MatButtonModule,
        MatIconModule,
        RouterLink,
        MatCardModule,
        MatListModule,
        MatDialogModule,
        ControlSchemeViewUrlPipe,
        HintComponent,
        FeatureToolbarControlsDirective,
        ConfirmationDialogModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlSchemeListPageComponent {
    public readonly controlSchemes$ = this.store.select(CONTROL_SCHEMES_LIST_PAGE_SELECTORS.selectSchemesList);

    public readonly canCreateScheme$ = this.store.select(CONTROL_SCHEMES_LIST_PAGE_SELECTORS.canCreateScheme);

    constructor(
        private readonly store: Store,
        protected readonly routesBuilderService: RoutesBuilderService,
        private readonly dialog: MatDialog,
        private readonly router: Router,
        private readonly confirmationDialogService: ConfirmationDialogService,
        private readonly transloco: TranslocoService
    ) {
    }

    public trackSchemeById(index: number, scheme: ControlSchemeModel): string {
        return scheme.name;
    }

    public onCreate(): void {
        const dialogRef = this.dialog.open<ControlSchemeCreateDialogComponent, null, { name: string }>(
            ControlSchemeCreateDialogComponent,
        );

        dialogRef.afterClosed().subscribe((result) => {
            if (result !== undefined) {
                this.router.navigate(
                    this.routesBuilderService.controlSchemeView(result.name)
                );
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.createControlScheme(result));
            }
        });
    }

    public onDelete(
        name: string
    ): void {
        this.confirmationDialogService.confirm(
            this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationTitle', { name }),
            {
                content$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationContent'),
                confirmTitle$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationConfirmButtonTitle'),
                cancelTitle$: this.transloco.selectTranslate('controlScheme.deleteSchemeConfirmationCancelButtonTitle')
            }
        ).subscribe((isConfirmed) => {
            if (isConfirmed) {
                this.store.dispatch(CONTROL_SCHEME_ACTIONS.deleteControlScheme({ name }));
            }
        });
    }
}
