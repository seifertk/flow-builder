<template>
  <div class="block-errors-expandable card">
    <div class="card-title m-0 px-2 pt-1 menu-bg-color">
      {{ trans(`flow-builder.${block.type}`) }}
      <div class="text-secondary">
        <small>{{ blockLabel }}</small>
      </div>
    </div>
    <div
      v-for="error in errorsToShow"
      :key="error.dataPath"
      class="card-body d-flex justify-content-between px-2 py-0 highlight-on-hover menu-bg-color">
      <span class="text-danger align-self-center">{{ error.dataPath }} - {{ error.message }}</span>
      <button
        type="button"
        class="btn btn-link btn-link-text"
        @click="$emit('fixBlockError', `block/${block.uuid}`, error.dataPath)">
        {{ 'flow-builder.fix-issue' | trans }}
      </button>
    </div>
    <div
      v-if="isListLong"
      type="button"
      class="btn btn-link text-left px-2 m-0 border-0 text-center menu-bg-color"
      @click.stop="toggleList">
      <font-awesome-icon
        v-if="!isExpanded"
        :icon="['fas', 'chevron-down']"
        :aria-label="'flow-builder.show-more' | trans" />
      <font-awesome-icon
        v-else
        :icon="['fas', 'chevron-up']"
        :aria-label="'flow-builder.show-less' | trans" />
    </div>
  </div>
</template>

<script lang="ts">
import Component, {mixins} from 'vue-class-component'
import {IValidationStatus} from '@/store/validation'
import Lang from '@/lib/filters/lang'
import {ErrorObject} from 'ajv'
import {Prop} from 'vue-property-decorator'
import {IBlock, IFlow} from '@floip/flow-runner'
import {namespace} from 'vuex-class'
import {get, union} from 'lodash'

const flowVuexNamespace = namespace('flow')
const validationVuexNamespace = namespace('validation')

const DEFAULT_LIST_SIZE = 3

@Component({})
export default class BlockErrorsExpandable extends mixins(Lang) {
  @Prop({required: true}) readonly block!: IBlock

  isExpanded = false

  get errorsToShow(): ErrorObject[] {
    return this.isExpanded
      ? this.allErrors ?? []
      : this.allErrors?.slice(0, DEFAULT_LIST_SIZE) ?? []
  }

  /**
   * get allErrors to consider errors from:
   * - block validation
   * - resource validation
   */
  get allErrors(): ErrorObject[] {
    return union(this.blockValidationStatusesForCurrentBlock?.ajvErrors, this.resourceValidationStatusesForCurrentBlock?.ajvErrors)
  }

  get isListLong(): boolean {
    return this.allErrors && this.allErrors.length > DEFAULT_LIST_SIZE
  }

  get blockLabel(): string {
    const {label} = this.block
    return Boolean(label)
      ? label
      : this.trans('flow-builder.untitled-block')
  }

  get resourceValidationStatusesForCurrentBlock(): IValidationStatus {
    return get(this.validationStatuses, `resource/${this.block.config?.prompt}`)
  }

  get blockValidationStatusesForCurrentBlock(): IValidationStatus {
    return get(this.validationStatuses, `block/${this.block.uuid}`)
  }

  toggleList(): void {
    this.isExpanded = !this.isExpanded
  }

  @validationVuexNamespace.State validationStatuses!: { [key: string]: IValidationStatus }
  @flowVuexNamespace.Getter activeFlow?: IFlow
}
</script>
<style scoped>
.menu-bg-color {
  background-color: #F8F8F8;
}

.highlight-on-hover:hover {
  background-color: #FFEBEB;
}

.btn-link-text {
  text-decoration: underline;
  color: #216FCE;
}
</style>
