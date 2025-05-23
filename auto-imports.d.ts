/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// noinspection JSUnusedGlobalSymbols
// Generated by unplugin-auto-import
// biome-ignore lint: disable
export {}
declare global {
  const APP_VERSION: typeof import('./src/core/utils/Dev')['APP_VERSION']
  const DeleteObjectFromArrayOnId: typeof import('./src/core/utils/DeleteObjectFromArrayOnId')['DeleteObjectFromArrayOnId']
  const EventBus: typeof import('./src/core/utils/EventBus')['EventBus']
  const GlobalEvents: typeof import('./src/core/utils/EventBus')['GlobalEvents']
  const IconsByModuleGroupID: typeof import('./src/core/utils/Icons')['IconsByModuleGroupID']
  const LOCALSTORAGE: typeof import('./src/core/config/LocalStorage')['LOCALSTORAGE']
  const NameCasting: typeof import('./src/core/utils/NameCasting')['NameCasting']
  const PeriodsHelper: typeof import('./src/core/utils/PeriodsHelper')['PeriodsHelper']
  const Plurize: typeof import('./src/core/utils/Numbers')['Plurize']
  const RouteMeta: typeof import('./src/core/config/Routes')['RouteMeta']
  const RouteNames: typeof import('./src/core/config/Routes')['RouteNames']
  const Routes: typeof import('./src/core/config/Routes')['Routes']
  const SOCIAL_LINKS: typeof import('./src/core/config/Social')['SOCIAL_LINKS']
  const TimeSpanPeriodType: typeof import('./src/core/utils/PeriodsHelper')['TimeSpanPeriodType']
  const TimeSpanShiftDirection: typeof import('./src/core/utils/PeriodsHelper')['TimeSpanShiftDirection']
  const acceptHMRUpdate: typeof import('pinia')['acceptHMRUpdate']
  const bootstrap: typeof import('./src/core/bootstrap')['default']
  const capitalizeFirstLetter: typeof import('./src/core/utils/Strings')['capitalizeFirstLetter']
  const clearDataForDriverLicense: typeof import('./src/core/utils/Validation')['clearDataForDriverLicense']
  const clearDataForPTSNumber: typeof import('./src/core/utils/Validation')['clearDataForPTSNumber']
  const clearDataForSTSNumber: typeof import('./src/core/utils/Validation')['clearDataForSTSNumber']
  const clearMorphologyInSearchTerm: typeof import('./src/core/utils/Strings')['clearMorphologyInSearchTerm']
  const clearPhone: typeof import('./src/core/utils/Validation')['clearPhone']
  const clearString: typeof import('./src/core/utils/Validation')['clearString']
  const clearVINNumber: typeof import('./src/core/utils/Formaters')['clearVINNumber']
  const colorsCasting: typeof import('./src/core/utils/colorsCasting')['colorsCasting']
  const computed: typeof import('vue')['computed']
  const convertDateForRequest: typeof import('./src/core/utils/Date')['convertDateForRequest']
  const core: typeof import('./src/core/index')['default']
  const createModule: typeof import('./src/core/utils/module-utils')['createModule']
  const dateMask: typeof import('./src/core/utils/Validation')['dateMask']
  const defineStore: typeof import('pinia')['defineStore']
  const dialogToChatModel: typeof import('./src/core/utils/dialogToChatModel')['dialogToChatModel']
  const findEventParentWithClass: typeof import('./src/core/utils/findEventParentWithClass')['findEventParentWithClass']
  const formatDateString: typeof import('./src/core/utils/formatDateString')['formatDateString']
  const formatDateToTime: typeof import('./src/core/utils/formatDateToTime')['formatDateToTime']
  const formatDriverLicenseNumber: typeof import('./src/core/utils/Formaters')['formatDriverLicenseNumber']
  const formatPTSNumber: typeof import('./src/core/utils/Formaters')['formatPTSNumber']
  const formatPhoneNumber: typeof import('./src/core/utils/phoneFormat')['formatPhoneNumber']
  const formatPhoneNumber1: typeof import('./src/core/utils/Formaters')['formatPhoneNumber1']
  const formatPrice: typeof import('./src/core/utils/Numbers')['formatPrice']
  const formatSTSNumber: typeof import('./src/core/utils/Formaters')['formatSTSNumber']
  const formatShortPhoneNumber: typeof import('./src/core/utils/phoneFormat')['formatShortPhoneNumber']
  const formatUGC: typeof import('./src/core/utils/Strings')['formatUGC']
  const formatVINNumber: typeof import('./src/core/utils/Formaters')['formatVINNumber']
  const getAvailableStepPeriodTypes: typeof import('./src/core/utils/PeriodsHelper')['getAvailableStepPeriodTypes']
  const getDateTimeIntervals: typeof import('./src/core/utils/PeriodsHelper')['getDateTimeIntervals']
  const getDocServerUrl: typeof import('./src/core/utils/getDocServerUrl')['getDocServerUrl']
  const getFormatService: typeof import('./src/core/utils/Formaters')['getFormatService']
  const getOriginalPhone: typeof import('./src/core/utils/phoneFormat')['getOriginalPhone']
  const getPhoneMask: typeof import('./src/core/utils/phoneFormat')['getPhoneMask']
  const getScrollbar: typeof import('./src/core/utils/Scroll')['getScrollbar']
  const getShortPhoneMask: typeof import('./src/core/utils/phoneFormat')['getShortPhoneMask']
  const getStringIntervals: typeof import('./src/core/utils/PeriodsHelper')['getStringIntervals']
  const getSystemColor: typeof import('./src/core/utils/getSystemColor')['getSystemColor']
  const getTaskWord: typeof import('./src/core/utils/getTaskWord')['getTaskWord']
  const getTimePeriod: typeof import('./src/core/utils/PeriodsHelper')['getTimePeriod']
  const getTimePeriodLabelWithParams: typeof import('./src/core/utils/PeriodsHelper')['getTimePeriodLabelWithParams']
  const getTimePeriodWithDirection: typeof import('./src/core/utils/PeriodsHelper')['getTimePeriodWithDirection']
  const getValidationService: typeof import('./src/core/utils/Validation')['getValidationService']
  const hexToRgb: typeof import('./src/core/utils/Color')['hexToRgb']
  const isClient: typeof import('./src/core/utils/typeGuards/isClient')['isClient']
  const isFieldIgnoreSubFields: typeof import('./src/core/utils/isFieldIgnoreSubFields')['isFieldIgnoreSubFields']
  const isValidNumber: typeof import('./src/core/utils/Validation')['isValidNumber']
  const loadModules: typeof import('./src/core/utils/module-utils')['loadModules']
  const lockBody: typeof import('./src/core/utils/Scroll')['lockBody']
  const nextTick: typeof import('vue')['nextTick']
  const onActivated: typeof import('vue')['onActivated']
  const onBeforeMount: typeof import('vue')['onBeforeMount']
  const onBeforeUnmount: typeof import('vue')['onBeforeUnmount']
  const onBeforeUpdate: typeof import('vue')['onBeforeUpdate']
  const onMounted: typeof import('vue')['onMounted']
  const onServerPrefetch: typeof import('vue')['onServerPrefetch']
  const openFreeModal: typeof import('./src/core/utils/openFreeModal')['openFreeModal']
  const parseJson: typeof import('./src/core/utils/parseJson')['parseJson']
  const prepareSmartSearchRegexp: typeof import('./src/core/utils/Strings')['prepareSmartSearchRegexp']
  const ref: typeof import('vue')['ref']
  const registerModuleRoutes: typeof import('./src/core/utils/module-utils')['registerModuleRoutes']
  const registerModuleStores: typeof import('./src/core/utils/module-utils')['registerModuleStores']
  const router: typeof import('./src/core/router')['default']
  const scrollPageToTop: typeof import('./src/core/utils/Scroll')['scrollPageToTop']
  const scrollToElement: typeof import('./src/core/utils/Scroll')['scrollToElement']
  const scrollWithSpeed: typeof import('./src/core/utils/Scroll')['scrollWithSpeed']
  const setRootCssProperty: typeof import('./src/core/utils/DomGlobals')['setRootCssProperty']
  const shortenString: typeof import('./src/core/utils/shortenString')['shortenString']
  const storeToRefs: typeof import('pinia')['storeToRefs']
  const toggleArray: typeof import('./src/core/utils/Array')['toggleArray']
  const unlockBody: typeof import('./src/core/utils/Scroll')['unlockBody']
  const uploadFiles: typeof import('./src/core/api')['uploadFiles']
  const useApi: typeof import('./src/core/api')['useApi']
  const useAuthStore: typeof import('./src/core/store/auth.store')['useAuthStore']
  const useCallCardsStore: typeof import('./src/core/store/callCards.store')['useCallCardsStore']
  const useCatchError: typeof import('./src/composables/catch-error')['useCatchError']
  const useCommand: typeof import('./src/composables/use-command')['useCommand']
  const useConfigurationStore: typeof import('./src/core/store/configuration.store')['useConfigurationStore']
  const useDashboardStore: typeof import('./src/core/store/dashboard.store')['useDashboardStore']
  const useDialogStore: typeof import('./src/core/store/dialogs.store')['useDialogStore']
  const useDictionariesStore: typeof import('./src/core/store/dictionaries.store')['useDictionariesStore']
  const useField: typeof import('vee-validate')['useField']
  const useFieldInputEvents: typeof import('./src/composables/use-object-field-dialog')['useFieldInputEvents']
  const useFilter: typeof import('./src/composables/use-filter')['useFilter']
  const useForm: typeof import('vee-validate')['useForm']
  const useModuleLoader: typeof import('./src/composables/module-loader')['useModuleLoader']
  const useModuleStore: typeof import('./src/core/store/modules.store')['useModuleStore']
  const useNotificationsStore: typeof import('./src/core/store/notifications.store')['useNotificationsStore']
  const useObjectEventListStore: typeof import('./src/core/store/objectEventList.store')['useObjectEventListStore']
  const useObjectFieldDialog: typeof import('./src/composables/use-object-field-dialog')['useObjectFieldDialog']
  const useObjectFieldServices: typeof import('./src/composables/use-object-field-services')['useObjectFieldServices']
  const useOpenExternalImage: typeof import('./src/composables/use-open-external-image')['useOpenExternalImage']
  const usePostFiles: typeof import('./src/composables/use-post-files')['usePostFiles']
  const useRoute: typeof import('vue-router')['useRoute']
  const useRouter: typeof import('vue-router')['useRouter']
  const useSharedModalsStore: typeof import('./src/core/store/sharedModals')['useSharedModalsStore']
  const useSlots: typeof import('vue')['useSlots']
  const useTableState: typeof import('./src/composables/use-table-state')['useTableState']
  const useTasksStore: typeof import('./src/core/store/tasks.store')['useTasksStore']
  const useUiStore: typeof import('./src/core/store/ui.store')['useUiStore']
  const useUploadFilesStore: typeof import('./src/core/store/uploadFiles.store')['useUploadFilesStore']
  const useUsersStore: typeof import('./src/core/store/users.store')['useUsersStore']
  const useWindowStore: typeof import('./src/core/store/window.store')['useWindowStore']
  const validAdress: typeof import('./src/core/utils/Validation')['validAdress']
  const validDate: typeof import('./src/core/utils/Validation')['validDate']
  const validDriverLicenseNumber: typeof import('./src/core/utils/Validation')['validDriverLicenseNumber']
  const validEmail: typeof import('./src/core/utils/Validation')['validEmail']
  const validOgrnIp: typeof import('./src/core/utils/Validation')['validOgrnIp']
  const validPTSNumber: typeof import('./src/core/utils/Validation')['validPTSNumber']
  const validPassportResidenceNumber: typeof import('./src/core/utils/Validation')['validPassportResidenceNumber']
  const validPassportRfIssuedPlaceNo: typeof import('./src/core/utils/Validation')['validPassportRfIssuedPlaceNo']
  const validPassportRfNumber: typeof import('./src/core/utils/Validation')['validPassportRfNumber']
  const validPassportRfSeria: typeof import('./src/core/utils/Validation')['validPassportRfSeria']
  const validPhone: typeof import('./src/core/utils/Validation')['validPhone']
  const validSTSNumber: typeof import('./src/core/utils/Validation')['validSTSNumber']
  const validVINNumber: typeof import('./src/core/utils/Validation')['validVINNumber']
  const watch: typeof import('vue')['watch']
  const watchEffect: typeof import('vue')['watchEffect']
}
// for type re-export
declare global {
  // @ts-ignore
  export type { Ref } from 'vue'
  import('vue')
  // @ts-ignore
  export type { LOCALSTORAGE, LOCALSTORAGE } from './src/core/config/LocalStorage'
  import('./src/core/config/LocalStorage')
  // @ts-ignore
  export type { GlobalEvents } from './src/core/utils/EventBus'
  import('./src/core/utils/EventBus')
  // @ts-ignore
  export type { TimeSpanPeriodType } from './src/core/utils/PeriodsHelper'
  import('./src/core/utils/PeriodsHelper')
}
