<template>
  <div class="float-editor">
    <label class="text-primary">{{ label }}</label>
    <div>
      <input
        type="number"
        :min="min"
        class="form-control"
        :class="{ 'is-invalid': isInvalid }"
        :placeholder="placeholder"
        :value="value"
        :step="step"
        @keypress="filterFloat"
        @keydown="$emit('keydown', $event)"
        @input="$emit('input', $event.target.value)">
    </div>
    <slot />
  </div>
</template>

<script lang="js">
/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/strict-boolean-expressions */
export default {
  props: {
    label: {
      type: [String, Number],
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    step: {
      type: String,
      default: '0.1',
    },
    value: {
      type: [String, Number],
      required: true,
    },
    min: {
      type: [String, Number],
      required: false,
      // Meaning it's accepting negative by default
      default: '',
    },
    regexFloatFiltering: {
      type: String,
      required: false,
      default: '[0-9-.,]',
    },
    validState: {
      type: Boolean,
      default: null,
      required: false,
    },
  },
  computed: {
    isInvalid() {
      return this.validState === false
    },
  },
  methods: {
    filterFloat(e) {
      if (!e.key.match(new RegExp(this.regexFloatFiltering, 'g'))) {
        e.preventDefault()
      }
    },
  },
}
</script>
