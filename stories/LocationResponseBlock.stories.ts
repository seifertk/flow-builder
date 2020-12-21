import Vue from 'vue'
import Vuex from 'vuex'

import LocationResponseBlock from '@/components/interaction-designer/block-types/SmartDevices_LocationResponseBlock.vue'
import FlowBuilderSidebarEditorContainer from './story-utils/FlowBuilderSidebarEditorContainer.vue'

import {IRootState, store} from '@/store'
import caseBlockStore, {BLOCK_TYPE as CASE_BLOCK_TYPE} from '@/store/flow/block-types/Core_CaseBlockStore'
import locationResponseBlockStore, {BLOCK_TYPE} from '@/store/flow/block-types/SmartDevices_LocationResponseBlockStore'

import {baseMounted, BaseMountedVueClass, safeRegisterBlockModule} from './story-utils/storeSetup'
import {Component} from 'vue-property-decorator'
import {namespace} from 'vuex-class'

Vue.use(Vuex)

const flowVuexNamespace = namespace('flow')
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

const BaseOptions = {
  components: {LocationResponseBlock, FlowBuilderSidebarEditorContainer},
  template: LocationResponseBlockTemplate,
}

// default location-response block state
@Component<any>(
    {
        ...BaseOptions,
        store: new Vuex.Store<IRootState>(store),
        async mounted() {
            await baseMounted.bind(this)(BLOCK_TYPE, locationResponseBlockStore)
        },
    }
)
class CurrentClass1 extends BaseMountedVueClass {}
export const Default = () => (CurrentClass1)

//ExistingDataPreFilled
@Component<any>({
    ...BaseOptions,
    store: new Vuex.Store<IRootState>(store),
    async mounted() {
        const {block: {uuid: blockId}, flow: {uuid: flowId}} = await baseMounted.bind(this)(BLOCK_TYPE, locationResponseBlockStore)

        this.setDescription(blockId)
        this.setAccuracyThreshold({blockId, value:10.3})
        this.setAccuracyTimeout({blockId, value:145})
    },
})
class CurrentClass2 extends BaseMountedVueClass {
    setDescription(blockId) { // TODO: Find a wait to define this in BaseClass or other ParentClass without '_this.setDescription is not a function' error
        this.block_setName({blockId: blockId, value: "A Name"})
        this.block_setLabel({blockId: blockId, value: "A Label"})
        this.block_setSemanticLabel({blockId: blockId, value: "A Semantic Label"})
    }

    @blockVuexNamespace.Action setAccuracyThreshold:any
    @blockVuexNamespace.Action setAccuracyTimeout:any

    @flowVuexNamespace.Mutation block_setName:any
    @flowVuexNamespace.Mutation block_setLabel:any
    @flowVuexNamespace.Mutation block_setSemanticLabel:any
}
export const ExistingDataPreFilled = () => (CurrentClass2)

//NonStartingBlock
@Component<any>(
    {
        ...BaseOptions,
        store: new Vuex.Store<IRootState>(store),
        async mounted() {
            const {block: {uuid: blockId}, flow: {uuid: flowId}} = await baseMounted.bind(this)(BLOCK_TYPE, locationResponseBlockStore)

            this.block_setName({blockId: blockId, value: "A Name"})
            this.block_setLabel({blockId: blockId, value: "A Label"})
            this.block_setSemanticLabel({blockId: blockId, value: "A Semantic Label"})

            // Fake a 1st block to make sure the current block won't be selected
            // @ts-ignore
            await safeRegisterBlockModule.bind(this)(CASE_BLOCK_TYPE, caseBlockStore)
            const caseBlock = await this.flow_addBlankBlockByType({type: CASE_BLOCK_TYPE})
            const {uuid: caseBlockId} = caseBlock

            this.flow_setFirstBlockId({blockId: caseBlockId, flowId: flowId})
        },
    }
)
class CurrentClass3 extends BaseMountedVueClass {
    @flowVuexNamespace.Mutation block_setName:any
    @flowVuexNamespace.Mutation block_setLabel:any
    @flowVuexNamespace.Mutation block_setSemanticLabel:any
    @flowVuexNamespace.Mutation flow_setFirstBlockId:any
}
export const NonStartingBlock = () => (CurrentClass3)