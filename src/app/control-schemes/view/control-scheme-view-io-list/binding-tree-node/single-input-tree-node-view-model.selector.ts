import { createSelector } from '@ngrx/store';
import { CONTROLLER_CONNECTION_SELECTORS } from '@app/store';
import { ControllerInputType, HubIoOperationMode } from '@app/shared';

import { BindingTreeNodeViewModel } from './binding-tree-nove-view-model';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const SINGLE_INPUT_TREE_NODE_VIEW_MODEL_SELECTOR = (
    singleInputBinding: { inputId: string; inputType: ControllerInputType; controllerId: string; operationMode: HubIoOperationMode },
    isActive: boolean,
    ioHasNoRequiredCapabilities: boolean
) => createSelector(
    CONTROLLER_CONNECTION_SELECTORS.isConnected(singleInputBinding.controllerId),
    (isControllerConnected: boolean): BindingTreeNodeViewModel => {
        return {
            isActive,
            ioHasNoRequiredCapabilities,
            operationMode: singleInputBinding.operationMode,
            controlData: [ {
                controllerId: singleInputBinding.controllerId,
                isControllerConnected,
                inputId: singleInputBinding.inputId,
                inputType: singleInputBinding.inputType,
            } ]
        };
    }
);
