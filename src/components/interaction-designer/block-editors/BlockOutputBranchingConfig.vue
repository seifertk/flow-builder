<template>
  <div class="block-output-branching-config">
    <div class="form-group">
      <label :class="labelClass">{{ 'flow-builder.output-branching' | trans }}</label>

      <div class="btn-group d-block">
        <button
          v-if="hasExitPerChoice"
          :class="{
            active: isBranchingTypeExitPerChoice,
            'btn-primary': isBranchingTypeExitPerChoice,
            'btn-outline-primary': !isBranchingTypeExitPerChoice,
          }"
          :title="'flow-builder.separate-output-for-each-choice' | trans"
          class="btn btn-sm"
          data-placement="bottom"
          data-toggle="tooltip"
          @click="selectedBranchingType = OutputBranchingType.EXIT_PER_CHOICE">
          <font-awesome-icon
            :icon="['fac', 'one-exit-per-choice']"
            class="exit-type-icons" />
        </button>

        <button
          v-if="hasUnifiedExit"
          :class="{
            active: isBranchingTypeUnified,
            'btn-primary': isBranchingTypeUnified,
            'btn-outline-primary': !isBranchingTypeUnified,
          }"
          :title="'flow-builder.one-output-for-all-choices' | trans"
          class="btn btn-sm"
          data-placement="bottom"
          data-toggle="tooltip"
          @click="selectedBranchingType = OutputBranchingType.UNIFIED">
          <font-awesome-icon
            :icon="['fac', 'single-exit']"
            class="exit-type-icons" />
        </button>

        <button
          :class="{
            active: isBranchingTypeAdvanced,
            'btn-primary': isBranchingTypeAdvanced,
            'btn-outline-primary': !isBranchingTypeAdvanced,
          }"
          :title="'flow-builder.advanced-configuration-of-outputs' | trans"
          class="btn btn-sm"
          data-placement="bottom"
          data-toggle="tooltip"
          :disabled="!hasUnifiedExit && !hasExitPerChoice"
          @click="selectedBranchingType = OutputBranchingType.ADVANCED">
          <font-awesome-icon
            :icon="['fac', 'advanced-exit']"
            class="exit-type-icons" />
        </button>
      </div>
    </div>

    <advanced-exits-builder
      v-if="isBranchingTypeAdvanced"
      :block="block" />

    <div class="form-group">
      <h6>When no valid response/all exit expressions evaluate to false</h6>

      <div class="form-check">
        <input
          :id="NoValidResponseHandler.END_CALL"
          v-model="noValidResponse"
          class="form-check-input"
          type="radio"
          :value="NoValidResponseHandler.END_CALL">

        <label
          class="form-check-label"
          :for="NoValidResponseHandler.END_CALL">
          End the call/session
        </label>
      </div>

      <div class="form-check">
        <input
          :id="NoValidResponseHandler.CONTINUE_THRU_EXIT"
          v-model="noValidResponse"
          class="form-check-input"
          type="radio"
          :value="NoValidResponseHandler.CONTINUE_THRU_EXIT">

        <label
          class="form-check-label"
          :for="NoValidResponseHandler.CONTINUE_THRU_EXIT">
          Continue through Default exit
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {get, isEmpty, isNil, find} from 'lodash'
  import {Component, Prop} from 'vue-property-decorator'
  import {IBlock, IBlockExit, ValidationException} from '@floip/flow-runner'
  import {mixins} from 'vue-class-component'
  import AdvancedExitsBuilder from '@/components/interaction-designer/block-editors/AdvancedExitsBuilder.vue'
  import Lang from '@/lib/filters/lang'
  import {namespace} from 'vuex-class'

  const flowVuexNamespace = namespace('flow')

  export enum OutputBranchingType {
    UNIFIED = 'UNIFIED',
    EXIT_PER_CHOICE = 'EXIT_PER_CHOICE',
    ADVANCED = 'ADVANCED',
  }

  export enum NoValidResponseHandler {
    END_CALL = 'END_CALL',
    CONTINUE_THRU_EXIT = 'CONTINUE_THRU_EXIT',
  }

  export interface IVendorMetadataWithBranchingType {
    io_viamo: {
      branchingType: OutputBranchingType,
    },
  }

  export interface IBlockWithBranchingType extends IBlock {
    vendor_metadata: IVendorMetadataWithBranchingType,
  }

  @Component({
    components: {
      AdvancedExitsBuilder,
    },
  })
  export default class BlockOutputBranchingConfig extends mixins(Lang) {
    @Prop() readonly block!: IBlock
    @Prop() readonly hasExitPerChoice!: boolean
    @Prop({default: true}) readonly hasUnifiedExit!: boolean
    @Prop({default: 'text-primary'}) readonly labelClass?: string

    OutputBranchingType = OutputBranchingType
    NoValidResponseHandler = NoValidResponseHandler

    mounted(): void {
      if (isEmpty(this.selectedBranchingType)) {
        // todo: should this be EXIT_PER_CHOICE for SelectOne block?
        this.selectedBranchingType = OutputBranchingType.UNIFIED
      }

      if (isEmpty(this.noValidResponse)) {
        this.noValidResponse = NoValidResponseHandler.END_CALL
      }
    }

    get selectedBranchingType(): OutputBranchingType {
      return get(this.block.vendor_metadata, 'io_viamo.branchingType')
    }

    set selectedBranchingType(value: OutputBranchingType) {
      const {uuid: blockId} = this.block
      this.block_updateVendorMetadataByPath({blockId, path: 'io_viamo.branchingType', value})

      switch (value) {
        case OutputBranchingType.UNIFIED:
          this.$emit('branchingTypeChangedToUnified')
          break
        case OutputBranchingType.EXIT_PER_CHOICE:
          // handled via change event from SelectOne; felt awkward importing SelectOne store here
          // should likely make branching types extendable
          //this.reflowExitsFromChoices({blockId})
          break
        case OutputBranchingType.ADVANCED:
          // todo: restore from cache
          break
        default:
          console.warn('block-editors/BlockOutputBranchingConfig',
            'Unknown branching type received.',
            {branchingType: value})
      }

      this.$emit('branchingTypeChanged', {branchingType: value})
    }

    get noValidResponse(): NoValidResponseHandler {
      return get(this.block.vendor_metadata, 'io_viamo.noValidResponse')
    }

    set noValidResponse(value: NoValidResponseHandler) {
      const {uuid: blockId} = this.block
      this.block_updateVendorMetadataByPath({blockId, path: 'io_viamo.noValidResponse', value})
      const defaultExit: IBlockExit = find(this.block.exits, 'default')!

      if (defaultExit == null) {
        throw new ValidationException(`Missing default exit on block ${blockId}.`)
      }

      this.block_exitClearDestinationBlockFor({blockExit: defaultExit})
    }

    get isBranchingTypeExitPerChoice(): boolean {
      return this.selectedBranchingType === OutputBranchingType.EXIT_PER_CHOICE
    }

    get isBranchingTypeUnified(): boolean {
      return this.selectedBranchingType === OutputBranchingType.UNIFIED
    }

    get isBranchingTypeAdvanced(): boolean {
      return this.selectedBranchingType === OutputBranchingType.ADVANCED
    }

    @flowVuexNamespace.Mutation block_updateVendorMetadataByPath!:
      ({blockId, path, value}: { blockId: string, path: string, value: object | string }) => void
    @flowVuexNamespace.Mutation block_exitClearDestinationBlockFor!:
      ({blockExit}: {blockExit: IBlockExit}) => void
  }
</script>

<style scoped>
.exit-type-icons {
  font-size: 1.5rem;
}
</style>
