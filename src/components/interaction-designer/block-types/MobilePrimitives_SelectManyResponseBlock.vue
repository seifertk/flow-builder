<template>
  <div class="mobile-primitive-select-many-response-block">
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

      <div class="prompt-resource">
        <resource-editor
          v-if="promptResource"
          :label="'flow-builder.prompt' | trans"
          :resource="promptResource"
          :block="block"
          :flow="flow" />
      </div>

      <hr>

      <choices-builder
        :block="block"
        @choiceChanged="handleChoiceChanged" />

      <hr>

      <minimum-choices-editor :block="block" />
      <maximum-choices-editor :block="block" />

      <hr>

      <block-output-branching-config
        :block="block"
        :has-exit-per-choice="false"
        :label-class="''"
        @branchingTypeChanged="reflowExitsWhenSwitchingToBranchingTypeNotUnified()" />

      <slot name="extras"></slot>

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
import {Component} from 'vue-property-decorator'
import SelectManyResponseStore, {BLOCK_TYPE} from '@/store/flow/block-types/MobilePrimitives_SelectManyResponseBlockStore'
import {namespace} from 'vuex-class'
import {createDefaultBlockTypeInstallerFor} from '@/store/builder'
import Categorization from '@/components/interaction-designer/block-editors/Categorization.vue'
import BlockOutputBranchingConfig from '@/components/interaction-designer/block-editors/BlockOutputBranchingConfig.vue'
import ChoicesBuilder from '@/components/interaction-designer/block-editors/ChoicesBuilder.vue'
import MinimumChoicesEditor from '@/components/interaction-designer/block-editors/MinimumChoicesEditor.vue'
import {IBlock} from '@floip/flow-runner'
import MaximumChoicesEditor from '@/components/interaction-designer/block-editors/MaximumChoicesEditor.vue'
import BlockNameEditor from '../block-editors/NameEditor.vue'
import BlockLabelEditor from '../block-editors/LabelEditor.vue'
import BlockSemanticLabelEditor from '../block-editors/SemanticLabelEditor.vue'
import BlockExitSemanticLabelEditor from '../block-editors/ExitSemanticLabelEditor.vue'
import FirstBlockEditorButton from '../flow-editors/FirstBlockEditorButton.vue'
import ResourceEditor from '../resource-editors/ResourceEditor.vue'
import BlockId from '../block-editors/BlockId.vue'
import SelectOneResponseBlock from './MobilePrimitives_SelectOneResponseBlock.vue'
import GenericContactPropertyEditor from '../block-editors/GenericContactPropertyEditor.vue'

const blockVuexNamespace = namespace(`flow/${BLOCK_TYPE}`)
const builderVuexNamespace = namespace('builder')

@Component({
  components: {
    BlockId,
    BlockNameEditor,
    BlockLabelEditor,
    BlockOutputBranchingConfig,
    BlockSemanticLabelEditor,
    BlockExitSemanticLabelEditor,
    ChoicesBuilder,
    Categorization,
    FirstBlockEditorButton,
    GenericContactPropertyEditor,
    MinimumChoicesEditor,
    MaximumChoicesEditor,
    ResourceEditor,
  },
})
export class MobilePrimitives_SelectManyResponseBlock extends SelectOneResponseBlock {
  showSemanticLabel = false

  //Important: Even we extends from SelectOneResponseBlock, to avoid conflict
  // we SHOULD re-declare @blockVuexNamespace based getter, state, action, mutation
  @builderVuexNamespace.Getter declare isEditable: boolean
  @blockVuexNamespace.Action declare handleBranchingTypeChangedToUnified: ({block}: {block: IBlock}) => void
}

export default MobilePrimitives_SelectManyResponseBlock
export const install = createDefaultBlockTypeInstallerFor(BLOCK_TYPE, SelectManyResponseStore)
</script>
