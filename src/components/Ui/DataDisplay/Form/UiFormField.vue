<template>
  <div class="ui-form-field" :class="[...modifiers]">
    <template v-if="separateLabel">
      <label class="ui-form-field__label" :for="id">
        <!--        \u200B - (нуль ширины пробел) для того, чтобы был контент в элементе, если он не содержит текста и считалась высота строки-->
        <span
          >{{ label || '\u200B'
          }}<span v-if="isRequired" class="ui-form-field__label-sup-star">*</span></span
        >
        <div
          v-if="error"
          class="ui-form-field__label-error-icon"
          :title="typeof error === 'string' ? error : ''"
        >
          <SvgIcon
            :width="size === 'large' ? 14 : 12"
            :height="size === 'large' ? 14 : 12"
            name="info"
          />
        </div>
      </label>
      <div class="ui-form-field__content">
        <slot :error="error"></slot>
      </div>
    </template>
    <template v-else>
      <label :for="id">
        <span class="ui-form-field__label" v-if="label">{{ label }}</span>
        <slot :error="error"></slot>
      </label>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
  },
  label: {
    type: String,
    default: '',
  },
  helper: {
    type: String,
    default: '',
  },
  additionalClass: {
    type: Array,
    default: () => [],
  },
  size: {
    type: String,
    default: 'normal',
    validator: (size: string) => ['large', 'normal'].includes(size),
  },
  // modifiers
  error: {
    type: [String, Boolean],
    required: false,
  },
  separateLabel: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  hasModified: {
    type: Boolean,
    default: false,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
})
const modifiers = computed(() => [
  props.error && 'ui-form-field--error',
  `ui-form-field--size-${props.size}`,
  props.hasModified ? 'ui-form-field--modified' : undefined,
])
</script>

<style scoped lang="scss">
.ui-form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;

  &__content {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  &__label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-family: Inter;
    font-weight: var(--font-weight-500);
    font-size: var(--font-size-standart);
    color: var(--color-gray);
    line-height: 15.6px;

    &-sup-star {
      color: var(--color-red);
      font-size: var(--font-size-24);
      line-height: 8px;
    }

    &-error-icon {
      display: flex;
      color: var(--component-danger-color);

      &:hover {
        cursor: pointer;
      }
    }
  }

  &--size {
    &-normal {
    }

    &-large {
      gap: 8px;

      .ui-form-field__label {
        font-size: var(--font-size-14);
        line-height: 18.2px;
      }
    }
  }

  &--modified {
    .ui-form-field__label {
      color: var(--color-primary) !important;
    }
  }
}
</style>
