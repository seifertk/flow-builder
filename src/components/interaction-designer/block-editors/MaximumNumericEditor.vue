<template>
  <validation-message
    #input-control="{ isValid }"
    :message-key="`block/${block.uuid}/config/validation_maximum`">
    <div class="block-validation-max">
      <numeric-editor
        v-model.number="maxValue"
        :regex-numeric-filtering="'[0-9]'"
        :label="'flow-builder.maximum-value-(inclusive)' | trans"
        :placeholder="'flow-builder.enter-value' | trans"
        :valid-state="isValid" />
    </div>
  </validation-message>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/strict-boolean-expressions */
import NumericEditor from '@/components/common/NumericEditor.vue'
import Lang from '@/lib/filters/lang'
import Component, {mixins} from 'vue-class-component'
import {Prop} from 'vue-property-decorator'
import {IBlock} from '@floip/flow-runner'

@Component({
  components: {
    NumericEditor,
  },
})
class MaximumNumericEditor extends mixins(Lang) {
  @Prop() readonly block!: IBlock

  get maxValue() {
    return this.block.config.validation_maximum
  }
  set maxValue(value) {
    this.$emit('commitValidationMaximumChange', value)
  }
}
export default MaximumNumericEditor
</script>
