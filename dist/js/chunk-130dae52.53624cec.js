(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-130dae52"],{"192b":function(t,e,a){"use strict";var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"starting-block-button"},[t.isEditable?[a("h4",[t._v(t._s(t._f("trans")("flow-builder.options")))]),a("div",{staticClass:"form-group"},[a("button",{staticClass:"btn btn-secondary btn-sm",attrs:{type:"button",disabled:t.isStartBlock},on:{click:function(e){return t.setStartBlock(e)}}},[t.isStartBlock?[t._v(" "+t._s(t._f("trans")("flow-builder.currently-set-as-starting-block"))+" ")]:[t._v(" "+t._s(t._f("trans")("flow-builder.set-as-starting-block"))+" ")]],2)])]:t._e()],2)},l=[],c=a("d4ec"),n=a("bee2"),r=a("262e"),i=a("2caf"),s=a("9ab4"),b=a("60a3"),u=a("4a51"),d=a("4bb5"),f=a("2fe1"),k=Object(d["e"])("flow"),_=function(t){Object(r["a"])(a,t);var e=Object(i["a"])(a);function a(){return Object(c["a"])(this,a),e.apply(this,arguments)}return Object(n["a"])(a,[{key:"setStartBlock",value:function(t){var e=this.flow.uuid,a=this.blockId;this.flow_setFirstBlockId({flowId:e,blockId:a})}},{key:"isStartBlock",get:function(){return this.blockId===this.flow.first_block_id}}]),a}(Object(f["c"])(u["a"]));Object(s["__decorate"])([Object(b["b"])({default:!0})],_.prototype,"isEditable",void 0),Object(s["__decorate"])([Object(b["b"])()],_.prototype,"blockId",void 0),Object(s["__decorate"])([Object(b["b"])()],_.prototype,"flow",void 0),Object(s["__decorate"])([k.Mutation],_.prototype,"flow_setFirstBlockId",void 0),_=Object(s["__decorate"])([Object(b["a"])({})],_);var p=_,m=p,v=a("2877"),w=Object(v["a"])(m,o,l,!1,null,null,null);e["a"]=w.exports},"1b4e":function(t,e,a){"use strict";var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("validation-message",{attrs:{"message-key":"block/"+t.block.uuid+"/semantic_label"},scopedSlots:t._u([{key:"input-control",fn:function(e){var o=e.isValid;return[a("div",{staticClass:"block-semantic-label",attrs:{id:t.block.uuid+".semanticLabel"}},[a("text-editor",{attrs:{label:t._f("trans")("flow-builder.block-semantic-label"),placeholder:t._f("trans")("flow-builder.enter-block-semantic-label"),validState:o},model:{value:t.semanticLabel,callback:function(e){t.semanticLabel=e},expression:"semanticLabel"}})],1)]}}])})},l=[],c=a("5530"),n=a("2f62"),r=a("d883"),i=a("4a51"),s=a("21e9"),b={components:{TextEditor:r["a"],ValidationMessage:s["a"]},props:{block:{type:Object,required:!0}},mixins:[i["b"]],computed:{semanticLabel:{get:function(){return this.block.semantic_label||""},set:function(t){this.block_setSemanticLabel({blockId:this.block.uuid,value:t})}}},methods:Object(c["a"])({},Object(n["d"])("flow",["block_setSemanticLabel"]))},u=b,d=a("2877"),f=Object(d["a"])(u,o,l,!1,null,null,null);e["a"]=f.exports},3411:function(t,e,a){"use strict";var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("validation-message",{attrs:{"message-key":"block/"+t.block.uuid+"/label"},scopedSlots:t._u([{key:"input-control",fn:function(e){var o=e.isValid;return[a("div",{staticClass:"block-label",attrs:{id:t.block.uuid+".label"}},[a("text-editor",{attrs:{label:t._f("trans")("flow-builder.block-label"),placeholder:t._f("trans")("flow-builder.enter-block-label"),validState:o},model:{value:t.label,callback:function(e){t.label=e},expression:"label"}})],1)]}}])})},l=[],c=a("d4ec"),n=a("bee2"),r=a("262e"),i=a("2caf"),s=a("9ab4"),b=a("d883"),u=a("4a51"),d=a("60a3"),f=a("4bb5"),k=a("2fe1"),_=a("21e9"),p=Object(f["e"])("flow"),m=function(t){Object(r["a"])(a,t);var e=Object(i["a"])(a);function a(){return Object(c["a"])(this,a),e.apply(this,arguments)}return Object(n["a"])(a,[{key:"label",get:function(){return this.block.label},set:function(t){this.block_setLabel({blockId:this.block.uuid,value:t})}}]),a}(Object(k["c"])(u["a"]));Object(s["__decorate"])([Object(d["b"])()],m.prototype,"block",void 0),Object(s["__decorate"])([p.Mutation],m.prototype,"block_setLabel",void 0),m=Object(s["__decorate"])([Object(d["a"])({components:{TextEditor:b["a"],ValidationMessage:_["a"]}})],m);var v=m,w=v,j=a("2877"),O=Object(j["a"])(w,o,l,!1,null,null,null);e["a"]=O.exports},"792f":function(t,e,a){"use strict";var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"block-id text-right"},[a("small",{staticClass:"text-muted"},[t._v(t._s(t._f("trans")("flow-builder.block-id"))+": "),a("em",[t._v(t._s(t.blockId))])])])},l=[],c=a("d4ec"),n=a("bee2"),r=a("262e"),i=a("2caf"),s=a("9ab4"),b=a("60a3"),u=a("4a51"),d=a("2fe1"),f=function(t){Object(r["a"])(a,t);var e=Object(i["a"])(a);function a(){return Object(c["a"])(this,a),e.apply(this,arguments)}return Object(n["a"])(a,[{key:"blockId",get:function(){return this.block.uuid||""}}]),a}(Object(d["c"])(u["a"]));Object(s["__decorate"])([Object(b["b"])()],f.prototype,"block",void 0),f=Object(s["__decorate"])([Object(b["a"])({})],f);var k=f,_=k,p=a("2877"),m=Object(p["a"])(_,o,l,!1,null,null,null);e["a"]=m.exports},cab88:function(t,e,a){"use strict";a.r(e),a.d(e,"install",(function(){return D}));var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"core-run-flow-block"},[a("h3",{staticClass:"no-room-above"},[t._v(" "+t._s(t._f("trans")("flow-builder.edit-block-type",{block_type:t.trans("flow-builder."+t.block.type)}))+" ")]),a("fieldset",{attrs:{disabled:!t.isEditable}},[a("block-name-editor",{attrs:{block:t.block}}),a("block-label-editor",{attrs:{block:t.block}}),a("block-semantic-label-editor",{attrs:{block:t.block}}),a("validation-message",{attrs:{"message-key":"block/"+t.block.uuid+"/config/flow_id"},scopedSlots:t._u([{key:"input-control",fn:function(e){var o=e.isValid;return[a("div",{staticClass:"form-group"},[a("label",[t._v(t._s(t._f("trans")("flow-builder.destination-flow")))]),a("select",{directives:[{name:"model",rawName:"v-model",value:t.destinationFlowId,expression:"destinationFlowId"}],staticClass:"form-control",class:{"is-invalid":!1===o},on:{change:function(e){var a=Array.prototype.filter.call(e.target.options,(function(t){return t.selected})).map((function(t){var e="_value"in t?t._value:t.value;return e}));t.destinationFlowId=e.target.multiple?a:a[0]}}},[a("option",{attrs:{value:""}},[t._v(" "+t._s(t._f("trans")("flow-builder.none-selected"))+" ")]),t._l(t.otherFlows,(function(e,o){return a("option",{domProps:{value:e.uuid}},[t._v(" "+t._s(e.name)+" ")])}))],2)])]}}])}),t._t("extras"),a("first-block-editor-button",{attrs:{flow:t.flow,"block-id":t.block.uuid}})],2),a("block-id",{attrs:{block:t.block}})],1)},l=[],c=a("d4ec"),n=a("bee2"),r=a("262e"),i=a("2caf"),s=a("9ab4"),b=a("4bb5"),u=a("60a3"),d=(a("4de4"),a("96cf"),a("1da1")),f=a("31aa"),k=a("2ef0"),_="Core.RunFlow",p={otherFlows:function(t,e,a,o){return a.flow.flows.filter((function(t){return t.uuid!==o["flow/activeFlow"].uuid}))}},m={},v={setDestinationFlowId:function(t,e){return Object(d["a"])(regeneratorRuntime.mark((function a(){var o,l,c;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return o=t.commit,l=e.blockId,c=e.newDestinationFlowId,o("flow/block_updateConfig",{blockId:l,newConfig:{flow_id:c}},{root:!0}),a.abrupt("return",c);case 4:case"end":return a.stop()}}),a)})))()},createWith:function(t,e){return Object(d["a"])(regeneratorRuntime.mark((function a(){var o,l,c;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return o=t.dispatch,l=e.props,a.t0=o,a.next=5,(new f["IdGeneratorUuidV4"]).generate();case 5:return a.t1=a.sent,a.t2={uuid:a.t1,tag:"Default",label:"Default"},a.t3={props:a.t2},a.t4={root:!0},a.next=11,(0,a.t0)("flow/block_createBlockDefaultExitWith",a.t3,a.t4);case 11:return a.t5=a.sent,a.t6=o,a.next=15,(new f["IdGeneratorUuidV4"]).generate();case 15:return a.t7=a.sent,a.t8={uuid:a.t7,tag:"Error",label:"Error"},a.t9={props:a.t8},a.t10={root:!0},a.next=21,(0,a.t6)("flow/block_createBlockExitWith",a.t9,a.t10);case 21:return a.t11=a.sent,c=[a.t5,a.t11],a.abrupt("return",Object(k["defaultsDeep"])(l,{type:_,name:"",label:"",semantic_label:"",config:{flow_id:""},exits:c}));case 24:case"end":return a.stop()}}),a)})))()}},w={namespaced:!0,getters:p,mutations:m,actions:v},j=a("4a51"),O=a("af98"),h=a("f04e"),y=a("3411"),g=a("1b4e"),x=a("192b"),I=a("792f"),E=a("2fe1"),F=a("21e9"),C=Object(b["e"])("flow/".concat(_)),B=Object(b["e"])("builder"),S=function(t){Object(r["a"])(a,t);var e=Object(i["a"])(a);function a(){return Object(c["a"])(this,a),e.apply(this,arguments)}return Object(n["a"])(a,[{key:"destinationFlowId",get:function(){return this.block.config.flow_id},set:function(t){this.setDestinationFlowId({blockId:this.block.uuid,newDestinationFlowId:t})}}]),a}(Object(E["c"])(j["a"]));Object(s["__decorate"])([Object(u["b"])()],S.prototype,"block",void 0),Object(s["__decorate"])([Object(u["b"])()],S.prototype,"flow",void 0),Object(s["__decorate"])([C.Action],S.prototype,"setDestinationFlowId",void 0),Object(s["__decorate"])([C.Getter],S.prototype,"otherFlows",void 0),Object(s["__decorate"])([B.Getter],S.prototype,"isEditable",void 0),S=Object(s["__decorate"])([Object(u["a"])({components:{BlockNameEditor:h["a"],BlockLabelEditor:y["a"],BlockSemanticLabelEditor:g["a"],FirstBlockEditorButton:x["a"],BlockId:I["a"],ValidationMessage:F["a"]}})],S);var L=S,D=Object(O["c"])(_,w),V=L,M=a("2877"),N=Object(M["a"])(V,o,l,!1,null,null,null);e["default"]=N.exports},f04e:function(t,e,a){"use strict";var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("validation-message",{attrs:{"message-key":"block/"+t.block.uuid+"/name"},scopedSlots:t._u([{key:"input-control",fn:function(e){var o=e.isValid;return[a("div",{staticClass:"block-name",attrs:{id:t.block.uuid+".name"}},[a("text-editor",{attrs:{label:t._f("trans")("flow-builder.block-name"),placeholder:t._f("trans")("flow-builder.enter-block-name"),validState:o},on:{keydown:t.filterName},model:{value:t.name,callback:function(e){t.name=e},expression:"name"}},[a("small",{staticClass:"text-muted"},[t._v(" "+t._s(t._f("trans")("flow-builder.only-accepts-word-characters"))+" ")])])],1)]}}])})},l=[],c=(a("b0c0"),a("ac1f"),a("466d"),a("5530")),n=a("2f62"),r=a("d883"),i=a("4a51"),s=a("21e9"),b={components:{TextEditor:r["a"],ValidationMessage:s["a"]},mixins:[i["b"]],props:{block:{type:Object,required:!0}},computed:{name:{get:function(){return this.block.name},set:function(t){this.block_setName({blockId:this.block.uuid,value:t})}}},methods:Object(c["a"])(Object(c["a"])({},Object(n["d"])("flow",["block_setName"])),{},{filterName:function(t){t.key.match(/\W+|Enter/g)&&t.preventDefault()}})},u=b,d=a("2877"),f=Object(d["a"])(u,o,l,!1,null,null,null);e["a"]=f.exports}}]);
//# sourceMappingURL=chunk-130dae52.53624cec.js.map