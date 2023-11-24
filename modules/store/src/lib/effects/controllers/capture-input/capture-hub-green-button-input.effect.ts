import { createEffect } from '@ngrx/effects';
import { Action, Store, createSelector } from '@ngrx/store';
import { inject } from '@angular/core';
import { NEVER, Observable, distinctUntilChanged, map, mergeAll, mergeMap, pairwise, startWith, switchMap } from 'rxjs';
import { ControllerInputType, ControllerType, GREEN_BUTTON_INPUT_ID, MAX_INPUT_VALUE, NULL_INPUT_VALUE } from '@app/shared-misc';

import { CONTROLLER_INPUT_SELECTORS, CONTROLLER_SETTINGS_SELECTORS, HUBS_SELECTORS, HUB_RUNTIME_DATA_SELECTORS } from '../../../selectors';
import { controllerIdFn } from '../../../reducers';
import { CONTROLLER_INPUT_ACTIONS } from '../../../actions';
import { HubStorageService } from '../../../hub-storage.service';

const HUB_INPUT_READ_SELECTOR = createSelector(
    HUBS_SELECTORS.selectAll,
    HUB_RUNTIME_DATA_SELECTORS.selectIds,
    CONTROLLER_SETTINGS_SELECTORS.selectEntities,
    (hubs, hubRuntimeIds, settings) => {
        const hubRuntimeIdsSet = new Set<string | number>(hubRuntimeIds);
        return hubs.filter((hub) => hubRuntimeIdsSet.has(hub.hubId)).map((hub) => hub.hubId)
                   .filter((hub) => {
                       const hubControllerId = controllerIdFn({ hubId: hub, controllerType: ControllerType.Hub });
                       const hubSettings = settings[hubControllerId];
                       return !(hubSettings?.ignoreInput);
                   });
    }
);

function readHubsGreenButtons(
    store: Store,
    hubStorage: HubStorageService
): Observable<Action> {
    return store.select(HUB_INPUT_READ_SELECTOR).pipe(
        map((hubIds) => {
            return hubIds.map((hubId) => {
                return hubStorage.get(hubId).properties.buttonState.pipe(
                    startWith(null),
                    distinctUntilChanged(),
                    pairwise(),
                    map(([ prev, next ]) => {
                        const value = next ? MAX_INPUT_VALUE : NULL_INPUT_VALUE;
                        return CONTROLLER_INPUT_ACTIONS.inputReceived({
                            nextState: {
                                controllerId: controllerIdFn({ hubId, controllerType: ControllerType.Hub }),
                                inputType: ControllerInputType.Button,
                                inputId: GREEN_BUTTON_INPUT_ID,
                                value,
                                isActivated: !!value,
                                rawValue: value,
                                timestamp: Date.now()
                            },
                            prevValue: +!!prev
                        });
                    })
                );
            });
        }),
        mergeAll(),
        mergeMap((t) => t),
    );
}

export const CAPTURE_HUB_GREEN_BUTTON_INPUT = createEffect((
    store: Store = inject(Store),
    hubStorage: HubStorageService = inject(HubStorageService)
) => {
    return store.select(CONTROLLER_INPUT_SELECTORS.isCapturing).pipe(
        switchMap((isCapturing) => isCapturing
                                   ? readHubsGreenButtons(store, hubStorage)
                                   : NEVER
        )
    );
}, { functional: true });

