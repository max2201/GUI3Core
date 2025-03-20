<template>
  <div class="">
    <div class="filter__section-title">Искать в разрезе</div>

    <div class="filter__scope">
      <UiCheckbox
        type="radio"
        name="scope"
        :checked="clientScope === 'client'"
        @change="clientScope = 'client'"
      >
        Клиенты
      </UiCheckbox>
      <UiCheckbox
        type="radio"
        name="scope"
        :checked="clientScope === 'docs'"
        @change="clientScope = 'docs'"
      >
        Договора
      </UiCheckbox>
      <UiCheckbox
        type="radio"
        name="scope"
        :checked="clientScope === 'employees'"
        @change="clientScope = 'employees'"
      >
        Сотрудники
      </UiCheckbox>
    </div>

    <div class="filter__scope-search">
      <UiInput1
        v-model="clientSearch"
        placeholder="Поиск по клиентам"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const clientSearch = ref('')
const clientScope = ref('')
</script>

<style lang="scss" scoped>
.filter {
  &__scope {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    .cb {
      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
  }
  &__scope-search {
    margin-top: 20px;
  }
}
</style>
