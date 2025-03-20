<template>
  <div
    :class="[
      'svg-icon-wrapper',
      {
        'svg-icon-wrapper_primary': primary,
        'svg-icon-wrapper_outlined': outlined,
        'svg-icon-wrapper_disabled': disabled,
        'svg-icon-wrapper_secondary': secondary,
        'svg-icon-wrapper_primary-outlined': primaryOutlined,
        'svg-icon-wrapper_success-outlined': successOutlined,
        'svg-icon-wrapper_warning-outlined': warningOutlined,
        'svg-icon-wrapper_danger-outlined': dangerOutlined,
        'svg-icon-wrapper_unexpected-outlined': unexpectedOutlined,
      },
      ...(additionalClass || []),
    ]"
    :style="{
      width: width ? width + 'px' : undefined,
      height: height ? height + 'px' : undefined,
      padding,
    }"
  >
    <svg
      class="svg-icon"
      aria-hidden="true"
      :class="[
        {
          'svg-icon_inverted-colors': invertedColors,
          'svg-icon_danger-colors': dangerColors,
          'svg-icon_primary-colors': primaryColors,
        },
      ]"
    >
      <use :href="symbolId" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  prefix: {
    type: String,
    default: 'icon',
  },
  name: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: 24,
  },
  height: {
    type: Number,
    default: 24,
  },
  padding: {
    type: String,
    default: '0',
  },
  additionalClass: {
    type: Array,
    defualt: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  primary: {
    type: Boolean,
    default: false,
  },
  secondary: {
    type: Boolean,
    default: false,
  },
  invertedColors: {
    type: Boolean,
    default: false,
  },
  dangerColors: {
    type: Boolean,
    default: false,
  },
  primaryColors: {
    type: Boolean,
    default: false,
  },
  outlined: {
    type: Boolean,
    default: false,
  },
  primaryOutlined: {
    type: Boolean,
    default: false,
  },
  successOutlined: {
    type: Boolean,
    default: false,
  },
  warningOutlined: {
    type: Boolean,
    default: false,
  },
  dangerOutlined: {
    type: Boolean,
    default: false,
  },
  unexpectedOutlined: {
    type: Boolean,
    default: false,
  },
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style lang="scss" scoped>
.svg-icon-wrapper {
  display: inline-block;

  &_outlined {
    border: 1px solid var(--color-border);
    border-radius: 15%;
  }

  &_primary {
    border-radius: 15%;
    background-color: var(--component-primary) !important;

    .svg-icon {
      color: var(--color-font-invert) !important;
    }

    &:hover {
      color: var(--component-primary) !important;
    }
  }

  &_primary-outlined {
    border: 1px solid var(--color-border);
    border-radius: 15%;
    background-color: var(--component-primary-background) !important;

    .svg-icon {
      color: var(--component-primary-color) !important;
    }

    &:hover {
      color: var(--component-primary) !important;
      border-color: var(--component-primary) !important;
    }
  }

  &_success-outlined {
    border: 1px solid var(--color-border);
    border-radius: 15%;
    background-color: var(--component-green-background) !important;

    .svg-icon {
      color: var(--component-green-color) !important;
    }

    &:hover {
      background-color: var(--component-green-backgroud-hover) !important;
    }
  }

  &_warning-outlined {
    border: 1px solid var(--color-border);
    border-radius: 15%;
    background-color: var(--component-warning-background) !important;

    .svg-icon {
      color: var(--component-warning-color) !important;
    }

    &:hover {
      background-color: var(--component-warning-backgroud-hover) !important;
    }
  }

  &_danger-outlined {
    border: 1px solid var(--color-border);
    border-radius: 15%;
    background-color: var(--component-) !important;

    .svg-icon {
      color: var(--component-warning-color) !important;
    }

    &:hover {
      background-color: var(--component-warning-backgroud-hover) !important;
    }
  }

  &_unexpected-outlined {
    border: 1px solid var(--color-border);
    border-radius: 15%;
    background-color: var(--component-purple-background) !important;

    .svg-icon {
      color: var(--component-purple-color) !important;
    }

    &:hover {
      background-color: var(--component-purple-backgroud-hover) !important;
    }
  }

  &_disabled {
    user-select: none !important;
    pointer-events: none;
    background-color: var(--loader-overlay-background) !important;

    .svg-icon {
      color: var(--color-gray) !important;
    }
  }
}

.svg-icon-wrapper:hover {
  cursor: pointer;
  color: var(--color-font);

  .svg-icon_inverted-colors {
    color: var(--color-font-invert);
  }

  .svg-icon_danger-colors {
    color: var(--color-red);
  }

  .svg-icon_primary-colors {
    color: var(--component-primary-hover);
  }
}

.svg-icon {
  display: inline-block;
  width: 100%;
  height: 100%;
  line-height: 1;
  color: var(--color-gray) !important;
  transition: all 0.25s ease-out 0.05s;

  &_primary-colors {
    color: var(--color-primary) !important;
  }
}
</style>
