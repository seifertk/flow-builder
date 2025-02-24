<template>
  <div class="mobile-primitive-message-block">
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

      <hr>

      <block-output-branching-config
        :block="block"
        :has-exit-per-choice="false"
        @branchingTypeChangedToUnified="handleBranchingTypeChangedToUnified({block})" />

      <resource-editor
        v-if="promptResource"
        :resource="promptResource"
        :block="block"
        :flow="flow" />

      <slot name="extras" />

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

import {IBlock, IBlockExit, IFlow, IResource} from '@floip/flow-runner'
import {IMessageBlock} from '@floip/flow-runner/src/model/block/IMessageBlock'

import MessageStore, {BLOCK_TYPE} from '@/store/flow/block-types/MobilePrimitives_MessageBlockStore'
import Lang from '@/lib/filters/lang'
import Categorization from '@/components/interaction-designer/block-editors/Categorization.vue'
import {createDefaultBlockTypeInstallerFor} from '@/store/builder'
import {mixins} from 'vue-class-component'
import BlockOutputBranchingConfig from '@/components/interaction-designer/block-editors/BlockOutputBranchingConfig.vue'
import ResourceEditor from '../resource-editors/ResourceEditor.vue'
import BlockNameEditor from '../block-editors/NameEditor.vue'
import BlockLabelEditor from '../block-editors/LabelEditor.vue'
import BlockSemanticLabelEditor from '../block-editors/SemanticLabelEditor.vue'
import FirstBlockEditorButton from '../flow-editors/FirstBlockEditorButton.vue'
import BlockId from '../block-editors/BlockId.vue'
import GenericContactPropertyEditor from '../block-editors/GenericContactPropertyEditor.vue'

const flowVuexNamespace = namespace('flow')
const builderVuexNamespace = namespace('builder')
const blockVuexNamespace = namespace(`flow/${BLOCK_TYPE}`)

@Component({
  components: {
    GenericContactPropertyEditor,
    BlockNameEditor,
    BlockLabelEditor,
    BlockSemanticLabelEditor,
    ResourceEditor,
    FirstBlockEditorButton,
    BlockId,
    Categorization,
    BlockOutputBranchingConfig,
  },
})
class MobilePrimitives_MessageBlock extends mixins(Lang) {
  @Prop() readonly block!: IMessageBlock

  @Prop() readonly flow!: IFlow

  showSemanticLabel = false

  get promptResource(): IResource {
    return this.resourcesByUuid[this.block.config.prompt]
  }

  @flowVuexNamespace.Getter resourcesByUuid!: { [key: string]: IResource }

  @flowVuexNamespace.Action block_convertExitFormationToUnified!:
    ({blockId, test}: {blockId: IBlock['uuid'], test: IBlockExit['test']}) => Promise<void>

  @builderVuexNamespace.Getter isEditable !: boolean

  @blockVuexNamespace.Action handleBranchingTypeChangedToUnified!: ({block}: {block: IBlock}) => void
}

export default MobilePrimitives_MessageBlock
export const install = createDefaultBlockTypeInstallerFor(BLOCK_TYPE, MessageStore)
</script>
