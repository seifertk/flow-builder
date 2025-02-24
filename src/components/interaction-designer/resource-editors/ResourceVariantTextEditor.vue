<template>
  <validation-message
    #input-control="{ isValid }"
    :message-key="`resource/${resourceId}/values/${index}/value`">
    <div class="resource-variant-text-editor">
      <div
        class="content-editor"
        :class="{'content-editor-selected': !!content}">

        <div class="input-group">
          <div v-if="label" class="input-group-prepend">
            <span class="input-group-text">{{ label }}</span>
          </div>

          <textarea
            ref="input"
            v-model="content"
            v-focus="isSelected"
            :placeholder="placeholder || `flow-builder.enter-${resourceVariant.content_type.toString().toLowerCase()}-content` | trans"
            class="form-control"
            :rows="rows"
            @focus="select"
            @blur="deselect" />
        </div>

        <!-- <button @click="select"
                class="btn btn-xs btn-secondary">
          <i class="glyphicon glyphicon-pencil"></i>
        </button> -->
      </div>

      <div class="content-toolbar">
        <!--      <block-content-autogen-button-->
        <!--          v-if="enableAutogenButton"-->
        <!--          :isEditable="isEditable"-->
        <!--          :langId="langId"-->
        <!--          :type="type"-->
        <!--          :block="block"-->
        <!--          class="pull-right" />-->

        <span
          v-if="isEditable"
          class="text-muted transition-all"
          :class="{invisible: !characterCounter.count}">
          {{ characterCounter.count }} characters

        <template v-if="mode === 'sms' && characterCounter.pages > 1">
          ({{ characterCounter.pages }} {{ characterCounter.hasUnicode ? 'unicode pages' : 'pages' }})
        </template>
      </span>

        <a
          v-if="doesContentContainExpression"
          v-b-tooltip.hover.top.html="`<p>${trans('flow-builder.youre-using-floip-expressions')}</p>
                     <p>
                       <strong>${trans('flow-builder.pro-tip')}:</strong>
                       ${trans('flow-builder.floip-expressions-escape-with-double-at-symbol')}
                     </p>`"
          href="https://floip.gitbooks.io/flow-specification/content/fundamentals/expressions.html"
          target="_blank">

          <kbd style="margin-left: 1em">
            <i class="glyphicon glyphicon-console" />
            <i
              v-if="doesContentContainExpressionError"
              class="glyphicon glyphicon glyphicon-remove-sign text-danger" />
            <i
              v-else
              class="glyphicon glyphicon-ok-sign text-success" />
          </kbd>
        </a>

        <div
          v-if="doesContentContainExpressionError"
          class="alert alert-danger"
          style="
  margin-top: 0.5em;
">
          <p>
            <i class="glyphicon glyphicon-remove-sign" />
            <strong>
              <a
                href="https://floip.gitbooks.io/flow-specification/content/fundamentals/expressions.html"
                target="_blank">FLOIP Expression</a>
              {{ 'flow-builder.error-found' | trans }}
            </strong>
          </p>

          <p>
            <!-- NOTE: Funky source formatting to mitigate spaces between parens -->
            <em>
              {{ contentExpressionAST.message }}
              (<span v-if="contentExpressionAST.location.start.line !== 1">{{ 'flow-builder.on-line' | trans }}
              {{ contentExpressionAST.location.start.line }},
            </span>{{ 'flow-builder.at-character' | trans }} {{ contentExpressionAST.location.start.column }})
            </em>
          </p>
        </div>
      </div>

      <!--    <template v-if="!isEditable">-->
      <!--      <p v-if="content">{{content}}</p>-->
      <!--      <p>-->
      <!--        <em class="text-muted">{{'flow-builder.no-sms-content-yet' | trans}}</em>-->
      <!--      </p>-->
      <!--    </template>-->
    </div>
  </validation-message>
</template>

<script lang="js">
/* eslint-disable @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/strict-boolean-expressions */
import Vue from 'vue'
import {lang} from '@/lib/filters/lang'
import {parse as floipExpressionParser} from '@floip/expression-parser'
import {isObject, some} from 'lodash'
import VueFocus from 'vue-focus'
import {mapActions} from 'vuex'
import {BTooltip} from 'bootstrap-vue'
import ValidationMessage from '@/components/common/ValidationMessage'

// import BlockContentAutogenButton from './BlockContentAutogenButton'

Vue.component('BTooltip', BTooltip)

export default {
  components: {
    ValidationMessage,
    // BlockContentAutogenButton,
  },
  mixins: [lang, VueFocus.mixin],

  props: {
    index: {
      type: Number,
      default: null,
    },
    isEditable: Boolean,

    label: {
      type: String,
      default: null,
    },

    placeholder: {
      type: String,
      default: null,
    },

    resourceId: {
      type: String,
      default: null,
    },
    resourceVariant: {
      // as () => IResourceValue
      type: Object,
      default: null,
    },
    mode: {
      type: String,
      default: null,
    },

    enableAutogenButton: {
      type: Boolean,
      default: true,
    },

    rows: {
      type: Number,
      default: 2,
    },

    // maybe!?

    // block: Object,
    // langId: [String, Number],
    // type: String,
    // pathToTextContent: String,
  },

  data: () => ({isSelected: false}),

  computed: {
    content: {
      get() {
        return this.resourceVariant.value
      },

      set(value) {
        const {resourceId, mode} = this
        const {language_id: languageId, content_type: contentType} = this.resourceVariant

        this.$emit('beforeResourceVariantChanged', {variant: this.resourceVariant, resourceId})
        this.resource_setOrCreateValueModeSpecific({
          resourceId,
          filter: {language_id: languageId, content_type: contentType, modes: [mode]},
          value,
        })
        this.$emit('afterResourceVariantChanged', {variant: this.resourceVariant, resourceId})
      },
    },

    contentExpressionAST() {
      let ast = []

      try {
        ast = floipExpressionParser(this.content)
      } catch (e) {
        if (e instanceof SyntaxError || e.name === 'SyntaxError') {
          return e
        }
      }

      const hasMembers = some(ast, isObject)
      return hasMembers
        ? ast
        : null
    },

    doesContentContainExpression() {
      return !!this.contentExpressionAST
    },

    doesContentContainExpressionError() {
      return !!(this.contentExpressionAST instanceof Error)
    },

    characterCounter() {
      const
        hasUnicode = !/^[\x00-\x7F]*$/.test(this.content)
      const count = this.content.length

      console.debug('BlockTextContentEditorForLangAndType', 'characterCounter', {hasUnicode, count})

      return {
        hasUnicode,
        count,
        pages: hasUnicode ? Math.ceil(count / 70) : Math.ceil(count / 160),
      }
    },
  },

  methods: {
    ...mapActions('flow', ['resource_setOrCreateValueModeSpecific']),

    select() {
      this.isSelected = true
    },
    deselect() {
      this.isSelected = false
    },

    // debouncedSaveTree: debounce(function () {
    //   this.$store.dispatch('attemptSaveTree')
    // }, 500),
  },
}
</script>

<style lang="scss" scoped>
.resource-variant-text-editor {
  margin-bottom: 10px;
}

.block-text-content-editor-for-lang-and-type {
  margin-bottom: 0.5em;

  .content-editor {
    position: relative;

    textarea {
      height: 56px;
    }

    textarea, input[type="text"] {
      &:not(:focus) {
        + button {
          opacity: 1;
        }
      }

      + button {
        position: absolute;
        bottom: 7px;
        // 15px padding => parent, 8px padding => textarea
        right: 10px; //15px + 7px;

        transition: opacity 200ms ease-in-out;
        opacity: 0;
      }
    }

    &-selected {
      textarea, input[type="text"] {
        background-color: #F8F8F8;
        //border-color: #DDDDDD;
      }
    }
  }

  .content-toolbar {
    margin-top: 1px;
  }
}

.invisible {
  opacity: 0;
}
</style>
