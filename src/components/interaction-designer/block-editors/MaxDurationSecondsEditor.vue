<template>
  <validation-message
    #input-control="{ isValid }"
    :message-key="`block/${block.uuid}/config/ivr/max_duration_seconds`">
    <div
      v-if="hasIvr"
      class="block-max-duration-seconds">
      <numeric-editor
        v-model.number="duration"
        :regex-numeric-filtering="'[0-9]'"
        :label="'flow-builder.max-duration-in-seconds' | trans"
        :placeholder="'flow-builder.enter-value' | trans"
        :valid-state="isValid" />
    </div>
  </validation-message>
</template>

<script lang="js">
/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/strict-boolean-expressions */
import NumericEditor from '@/components/common/NumericEditor'
import {get} from 'lodash'
import {lang} from '@/lib/filters/lang'

export default {
  components: {
    NumericEditor,
  },
  mixins: [lang],
  props: {
    hasIvr: {
      default: true,
      type: Boolean,
    },
    block: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      defaultMaxDuration: 0,
    }
  },

  computed: {
    duration: {
      get() {
        return get(this.block, 'config.ivr.max_duration_seconds', '')
      },
      set(value) {
        this.$emit('commitMaxDurationChange', value)
      },
    },
  },
}
</script>
