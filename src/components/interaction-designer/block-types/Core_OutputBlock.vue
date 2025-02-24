<template>
  <div class="core-output-block">
    <h3 class="block-editor-header">
      {{ `flow-builder.${block.type}` | trans }}
    </h3>

    <fieldset :disabled="!isEditable">
      <block-label-editor
        :block="block"
        @gearClicked="showSemanticLabel = !showSemanticLabel" />
      <block-semantic-label-editor
        v-if="showSemanticLabel"
        :block="block" />
      <block-name-editor :block="block" />

      <slot name="extras" />

      <validation-message
        #input-control="{ isValid }"
        :message-key="`block/${block.uuid}/config/value`">
        <expression-input
          :label="'flow-builder.output-expression' | trans"
          :placeholder="'flow-builder.enter-expression' | trans"
          :current-expression="value"
          :valid-state="isValid"
          @commitExpressionChange="commitExpressionChange" />
      </validation-message>

      <hr>
      <block-output-branching-config
        :block="block"
        :has-exit-per-choice="false"
        @branchingTypeChangedToUnified="handleBranchingTypeChangedToUnified({block})" />

      <categorization :block="block" />

      <generic-contact-property-editor :block="block" />

      <hr>

      <first-block-editor-button
        :flow="flow"
        :block-id="block.uuid" />
    </fieldset>
    <block-id :block="block" />
  </div>
</template>

<script lang="ts">
import {namespace} from 'vuex-class'
import {Component, Prop} from 'vue-property-decorator'
import {IOutputBlock} from '@floip/flow-runner/src/model/block/IOutputBlock'
import {IBlock, IFlow} from '@floip/flow-runner'
import OutputStore, {BLOCK_TYPE} from '@/store/flow/block-types/Core_OutputBlockStore'
import Lang from '@/lib/filters/lang'
import Categorization from '@/components/interaction-designer/block-editors/Categorization.vue'
import {createDefaultBlockTypeInstallerFor} from '@/store/builder'
import {mixins} from 'vue-class-component'
import ExpressionInput from '@/components/common/ExpressionInput.vue'
import BlockOutputBranchingConfig from '@/components/interaction-designer/block-editors/BlockOutputBranchingConfig.vue'
import BlockNameEditor from '../block-editors/NameEditor.vue'
import BlockLabelEditor from '../block-editors/LabelEditor.vue'
import BlockSemanticLabelEditor from '../block-editors/SemanticLabelEditor.vue'
import FirstBlockEditorButton from '../flow-editors/FirstBlockEditorButton.vue'
import BlockId from '../block-editors/BlockId.vue'
import GenericContactPropertyEditor from '../block-editors/GenericContactPropertyEditor.vue'

const blockVuexNamespace = namespace(`flow/${BLOCK_TYPE}`)
const builderVuexNamespace = namespace('builder')

@Component({
  components: {
    GenericContactPropertyEditor,
    ExpressionInput,
    BlockNameEditor,
    BlockLabelEditor,
    BlockSemanticLabelEditor,
    FirstBlockEditorButton,
    BlockId,
    Categorization,
    BlockOutputBranchingConfig,
  },
})
class Core_OutputBlock extends mixins(Lang) {
  @Prop() readonly block!: IOutputBlock

  @Prop() readonly flow!: IFlow

  showSemanticLabel = false

  get value(): string {
    return this.block.config.value || ''
  }

  @blockVuexNamespace.Action editOutputExpression!: (params: { blockId: string, value: string }) => Promise<string>
  @blockVuexNamespace.Action handleBranchingTypeChangedToUnified!: ({block}: {block: IBlock}) => void

  @builderVuexNamespace.Getter isEditable !: boolean

  commitExpressionChange(value: string): Promise<string> {
    return this.editOutputExpression({blockId: this.block.uuid, value})
  }
}

export default Core_OutputBlock
export const install = createDefaultBlockTypeInstallerFor(BLOCK_TYPE, OutputStore)
</script>
