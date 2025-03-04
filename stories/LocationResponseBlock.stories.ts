import LocationResponseBlock from '@/components/interaction-designer/block-types/SmartDevices_LocationResponseBlock.vue'
import locationResponseBlockStore, {BLOCK_TYPE} from '@/store/flow/block-types/SmartDevices_LocationResponseBlockStore'
import {Component, Vue} from 'vue-property-decorator'
import {namespace} from 'vuex-class'
import Vuex from 'vuex'
import {IRootState, store} from '@/store'
import {BaseMountedVueClass, IBaseOptions} from './story-utils/storeSetup'
import FlowBuilderSidebarEditorContainer from './story-utils/FlowBuilderSidebarEditorContainer.vue'

Vue.use(Vuex)

const blockVuexNamespace = namespace(`flow/${BLOCK_TYPE}`)

export default {
  title: 'SmartDevices/Location Response Block',
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
}

const LocationResponseBlockTemplate = `
  <flow-builder-sidebar-editor-container :block="activeBlock">
    <location-response-block
      :block="activeBlock"
      :flow="activeFlow"/>
  </flow-builder-sidebar-editor-container>
`

const BaseOptions: IBaseOptions = {
  components: {LocationResponseBlock, FlowBuilderSidebarEditorContainer},
  template: LocationResponseBlockTemplate,
  store: new Vuex.Store<IRootState>(store),
}

// default location-response block state
@Component({
  ...BaseOptions,
})
class CurrentClass1 extends BaseMountedVueClass {
  async mounted() {
    await this.baseMounted(BLOCK_TYPE, locationResponseBlockStore)
  }
}

export const Default = () => (CurrentClass1)

//ExistingDataPreFilled
@Component({
  ...BaseOptions,
})
class CurrentClass2 extends BaseMountedVueClass {
  async mounted() {
    const {block: {uuid: blockId}} = await this.baseMounted(BLOCK_TYPE, locationResponseBlockStore)

    this.setDescription(blockId)
    this.setAccuracyThreshold({blockId, value: 10.3})
    this.setAccuracyTimeout({blockId, value: 145})
    this.setTags(blockId)
  }

  @blockVuexNamespace.Action setAccuracyThreshold: any
  @blockVuexNamespace.Action setAccuracyTimeout: any
}

export const ExistingDataPreFilled = () => (CurrentClass2)

//NonStartingBlock
@Component({
  ...BaseOptions,
})
class CurrentClass3 extends BaseMountedVueClass {
  async mounted() {
    const {block: {uuid: blockId}, flow: {uuid: flowId}} = await this.baseMounted(BLOCK_TYPE, locationResponseBlockStore)

    this.setDescription(blockId)
    await this.fakeCaseBlockAsFirstBlock(flowId)
  }
}

export const NonStartingBlock = () => (CurrentClass3)
