<template>
  <div :class="['location-time', !location.RegionTz && 'location-time_empty']">
    <div class="d-flex flex-align-center">
      <SvgIcon :width="24" :height="24" name="clock" is-link @click="openEditClientTime" />
      <div v-if="location.RegionTz">
        <span class="mr-1">Время клиента:</span>
        <span class="color-default">{{ timeString }}</span>
      </div>
      <div v-else class="location-time-select" @click="openEditClientTime">
        Задать время клиента
      </div>
    </div>

    <div v-if="location.RegionTz" class="d-flex flex-align-center">
      <SvgIcon
        :width="16"
        :height="16"
        name="pencil"
        class="c-primary"
        is-link
        @click="openEditClientTime"
      />
    </div>

    <UiFieldDetialsModal
      compact
      :hide-close="clientTime"
      v-if="anchorId"
      :anchor-id="anchorId"
      :is-open="isOpenClientTimeForm"
      title="Время клиента"
      @close="closeEditClientTime"
    >
      <div class="location-time-form">
        <UiLoader :loading="isLoadingData" theme="page" />
        <div class="location-time-form-inputs">
          <UiSelect1
            :model-value="selectedState"
            :options="states"
            select-label="Федеральный округ"
            searchable
            @update:model-value="onChangeSelectedState"
          />
          <UiSelect1
            :model-value="selectedRegion"
            :options="regions"
            select-label="Регион"
            searchable
            @update:model-value="onChangeSelectedRegion"
          />
          <UiSelect1
            :model-value="selectedCity"
            :options="cities"
            select-label="Город"
            searchable
            @update:model-value="onChangeSelectedCity"
          />
        </div>
        <div>Время клиента: {{ clientTime || timeString }}</div>
      </div>

      <template #actions>
        <UiButton1 v-if="clientTime" variant="outline" @click="onClickCancel">Отменить</UiButton1>
        <UiButton1 :disabled="!clientTime" @click="onClickSave"> Сохранить </UiButton1>
      </template>
    </UiFieldDetialsModal>
  </div>
</template>

<script setup lang="ts">
import type { ClientLocation } from '@/core/interface/Requests'
import type { ISelect } from '@/core/interface/Ui'
import moment from 'moment'

const props = defineProps<{
  location: ClientLocation
  timeString: string
  anchorId: string
}>()

const errorMessage = ref(false)

const apiUrl = 'https://region.xlombard.ru/api/'
const fetchConfig = {
  method: 'GET',
  mode: 'cors',
  headers: {
    Accept: 'application/json',
  },
} as any

const fetchGeoApi = (method: string) => {
  return new Promise((resolve, reject) => {
    fetch(apiUrl + method, fetchConfig)
      .then((response) => {
        response
          .json()
          .then((result) => {
            resolve(result)
          })
          .catch((e) => {
            window.console.error(e)
            reject(e)
          })
      })
      .catch((e) => {
        window.console.error(e)
        reject(e)
      })
  })
}

interface RegionItem {
  citiesCount: number
  regionCode: number
  regionName: string
  regionTz: number
  citiesItems: string[]
}

interface StateItem {
  regionsCount: number
  subjectCode: number
  subjectName: string
  regionsItems: RegionItem[]
}

interface FullInfo {
  totalCountCity: number
  totalCountRegion: number
  totalCountSubject: number
  items: StateItem[]
}

const fullInfo = ref<FullInfo>()

const states = computed<ISelect[]>(() => {
  return (fullInfo.value?.items || []).map((item) => {
    return {
      value: item.subjectCode,
      label: item.subjectName,
    }
  })
})

const selectedState = ref()
const onChangeSelectedState = (item: ISelect) => {
  selectedState.value = item

  if (selectedRegion.value?.stateCode !== item.value) {
    selectedRegion.value = undefined
    selectedCity.value = undefined
  }
}

interface RegionSelectItem extends ISelect {
  stateCode: number
  region: RegionItem
}

const regionsItemsFromRegion = (region: RegionItem, stateCode: number) => {
  return {
    value: region.regionCode,
    label: region.regionName,
    stateCode: stateCode,
    region,
  } as RegionSelectItem
}

const regions = computed(() => {
  if (selectedState.value) {
    const stateCode = selectedState.value.value
    const state = (fullInfo.value?.items || []).find((state) => state.subjectCode === stateCode)

    return state?.regionsItems.map((region) => regionsItemsFromRegion(region, stateCode)) || []
  }

  return (fullInfo.value?.items || []).reduce((acc, item) => {
    acc.push(
      ...item.regionsItems.map((region) => {
        return regionsItemsFromRegion(region, item.subjectCode)
      }),
    )

    return acc
  }, [] as RegionSelectItem[])
})

const selectedRegion = ref<RegionSelectItem>()
const onChangeSelectedRegion = (item: RegionSelectItem) => {
  selectedRegion.value = item

  if (!selectedState.value) {
    selectedState.value = states.value.find((state) => state.value === item.stateCode)
  }

  if (selectedCity.value?.regionCode !== item.value) {
    selectedCity.value = undefined
  }
}

interface CitySelectItem extends ISelect {
  stateCode: number
  regionCode: number
}

const cityItemsFromRegion = (region: RegionItem, stateCode: number) => {
  return region.citiesItems.map((city) => {
    return {
      label: city,
      value: city,
      regionCode: region.regionCode,
      stateCode: stateCode,
    } as CitySelectItem
  })
}

const cities = computed<CitySelectItem[]>(() => {
  if (selectedRegion.value && selectedState.value) {
    return cityItemsFromRegion(selectedRegion.value.region, selectedState.value.value)
  }

  return (fullInfo.value?.items || []).reduce((acc, item) => {
    item.regionsItems.forEach((region) => {
      acc.push(...cityItemsFromRegion(region, item.subjectCode))
    })

    return acc
  }, [] as CitySelectItem[])
})

const selectedCity = ref<CitySelectItem>()

const clientTime = computed(() => {
  const regionTz = selectedRegion.value?.region.regionTz

  if (!regionTz) return

  const momentInstance = moment()
  momentInstance.utcOffset(regionTz * 60)

  return momentInstance.format('HH:mm')
})

const onChangeSelectedCity = (item: CitySelectItem) => {
  selectedCity.value = item

  if (!selectedState.value) {
    selectedState.value = states.value.find((state) => state.value === item.stateCode)
    selectedRegion.value = regions.value.find((region) => region.value === item.regionCode)
  }
}

const updateDataFromLocation = () => {
  if (!props.location) {
    selectedState.value = undefined
    selectedRegion.value = undefined
    selectedCity.value = undefined
    return
  }

  selectedState.value = states.value.find((state) => state.value === props.location.SubjectCode)
  selectedRegion.value = regions.value.find((region) => region.value === props.location.RegionCode)
  selectedCity.value = cities.value.find((city) => city.value === props.location.City)
}

const isLoadingData = ref(false)

const loadFullData = () => {
  isLoadingData.value = true

  return fetchGeoApi('fullData')
    .then((data) => {
      errorMessage.value = false
      fullInfo.value = data as FullInfo
    })
    .catch(() => {
      errorMessage.value = true
    })
    .finally(() => {
      isLoadingData.value = false
    })
}

const isOpenClientTimeForm = ref(false)
const openEditClientTime = () => {
  loadFullData().finally(() => {
    if (props.location) {
      updateDataFromLocation()
    }
  })
  isOpenClientTimeForm.value = true
}
const closeEditClientTime = () => {
  isOpenClientTimeForm.value = false
}

const cancelChanges = () => {
  updateDataFromLocation()
}

const onClickCancel = () => {
  cancelChanges()
}

const emits = defineEmits(['change'])

const onClickSave = () => {
  emits('change', {
    SubjectCode: selectedState.value?.value || null,
    SubjectName: selectedState.value?.label || null,
    RegionCode: selectedRegion.value?.value || null,
    RegionName: selectedRegion.value?.label || null,
    RegionTz: selectedRegion.value?.region.regionTz || null,
    City: selectedCity.value?.value || null,
  } as ClientLocation)
  closeEditClientTime()
}
</script>

<style lang="scss" scoped>
.location-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  color: var(--color-gray);
  background-color: #f9fafe;
  border: var(--border-default);
  padding-top: 10px;
  padding-bottom: 10px;

  &_empty {
    color: var(--color-primary);
  }
}

.location-time-select {
  height: 14px;
  cursor: pointer;
}

.location-time-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.location-time-form-inputs {
  display: grid;
  grid-template-columns: repeat(3, calc((100% - (8px * 2)) / 3));
  gap: 8px;
}
</style>
