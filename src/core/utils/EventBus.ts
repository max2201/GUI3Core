import { TinyEmitter } from 'tiny-emitter'

export const EventBus = new TinyEmitter()

export enum GlobalEvents {
  ModuleDataChanged = 'ModuleDataChanged',
  OpenFreeModal = 'OpenFreeModal',
  OpenLiteView = 'OpenLiteView',
  CloseLiteView = 'CloseLiteView',
  ShowObjectFieldDialog = 'ShowObjectFieldDialog',
  FocusElement = 'FocusElement',
}
