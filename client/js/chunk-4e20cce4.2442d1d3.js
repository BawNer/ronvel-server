(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4e20cce4"],{"5b9e":function(t,e,o){"use strict";o.r(e);var a=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-container",{attrs:{fluid:""}},[o("v-row",{staticClass:"mt-4"},[o("v-col",{attrs:{cols:"12",md:"3"}},[o("v-card",{staticClass:"pa-3"},[o("v-row",[o("v-col",{attrs:{cols:"12"}},[o("v-switch",{attrs:{label:"Проводить заказ автоматически"},on:{change:t.changeOrderWorkerState},model:{value:t.mmogaDeamon,callback:function(e){t.mmogaDeamon=e},expression:"mmogaDeamon"}})],1),o("v-col",{attrs:{cols:"12"}},[o("span",{staticClass:"text-caption"},[t._v("Фильт по категориям")]),o("v-btn",{attrs:{large:"",text:"",disabled:!t.activeCategory},on:{click:function(e){t.activeCategory=0}}},[t._v("Сбросить")])],1),o("v-col",{attrs:{cols:"10"}},[o("v-select",{attrs:{items:t.categories,"item-value":"id","item-text":"name",outlined:"",label:"Веберите категорию"},model:{value:t.activeCategory,callback:function(e){t.activeCategory=e},expression:"activeCategory"}})],1),o("v-col",{attrs:{cols:"12"}},[o("span",{staticClass:"text-caption"},[t._v("Фильт по статусу заказа")])]),o("v-col",{attrs:{cols:"12"}},[o("v-btn-toggle",{attrs:{mandatory:""},model:{value:t.activeStatus,callback:function(e){t.activeStatus=e},expression:"activeStatus"}},t._l(t.orderStatus,(function(e){return o("v-btn",{key:e.id,attrs:{color:"blue-grey darken-1",plain:""},on:{click:function(o){return t.getOrdersByStatus(e.status)}}},[o("v-icon",{attrs:{left:"",color:"green lighten-2"}},[t._v("mdi-cart-variant")]),t._v(" "+t._s(e.name)+" ")],1)})),1)],1)],1)],1)],1),0!==t.orders.length?o("v-col",{attrs:{cols:"12",md:"7"}},[o("v-row",t._l(t.orders,(function(e){return o("v-col",{key:e.id[0],attrs:{cols:"12"}},[o("order-component",{attrs:{order:e,accounts:t.accounts,orderWorker:t.mmogaDeamon}})],1)})),1)],1):o("v-col",{attrs:{cols:"12",md:"7"}},[o("span",{staticClass:"text-h4"},[t._v("Заказы не найдены")])])],1)],1)},n=[],r=(o("4de4"),o("d3b7"),o("d81d"),o("f5ef")),s=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-card",[o("v-subheader",[o("span",{staticClass:"text-caption"},[t._v("Идентификатор заказа: "+t._s(t.order.id[0])+t._s(t.order.quantity[0]))])]),o("v-list-item",[o("v-list-item-content",[o("v-list-item-title",{domProps:{textContent:t._s(t.order.game[0])}}),o("v-list-item-subtitle",[t._v("Приоритет: "),o("v-chip",{attrs:{label:"","text-color":"white",color:"high"===t.order.priority[0]?"error":"primary"}},[t._v(t._s(t.order.priority[0]))])],1),o("v-list-item-subtitle",[t._v(" Статус аккаунта: "),o("span",{staticClass:"text-caption",domProps:{textContent:t._s("1"===t.order.quantity[0]?"Gold":"Silver")}})]),t.order.categoryId?o("v-list-item-subtitle",[t._v(" id категории: "),o("span",{staticClass:"text-caption",domProps:{textContent:t._s(t.order.categoryId)}})]):o("v-list-item-subtitle",{staticClass:"red--text"},[t._v(" подходящей категории не найдено ")])],1),o("v-list-item-action",[o("v-list-item-action-text",{domProps:{textContent:t._s(t.order.date[0])}}),o("span",[o("v-icon",{attrs:{color:"success"}},[t._v("mdi-cash")]),t._v(" "+t._s(t.order.unitPriceFromXML[0]))],1)],1)],1),t.orderWorker?t._e():o("v-card-actions",[o("v-select",{attrs:{items:t.accounts,"item-value":"id","item-text":function(t){return t.info.account.login+":"+t.info.account.password+", "+t.info.account.region.index+", category: "+t.category.id},outlined:"",dense:"",label:"Выберите аккаунт"},model:{value:t.accountId,callback:function(e){t.accountId=e},expression:"accountId"}}),o("v-spacer"),o("v-btn",{attrs:{outlined:"",color:"primary",disabled:!t.accountId,loading:t.executing},on:{click:t.executeOrder}},[t._v("Провести")])],1)],1)},i=[],c=o("1da1"),d=(o("96cf"),o("99af"),{name:"orderComponent",props:["order","accounts","orderWorker"],data:function(){return{accountId:null,executing:!1}},computed:{accountValue:function(){return"id: ".concat(this.accounts.id,", name: ").concat(this.accounts.info.account.username,", login: ").concat(this.accounts.info.account.login)}},methods:{executeOrder:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return r["a"].$emit("setLoadingNotification","Проведение заказа"),t.executing=!t.executing,e.next=4,t.$store.dispatch("executeOrderById",{orderId:t.order.id[0],accountId:t.accountId});case 4:r["a"].$emit("killLoadingNotification"),t.executing=!t.executing,t.$store.dispatch("findAccounts");case 7:case"end":return e.stop()}}),e)})))()}}}),l=d,u=o("2877"),g=o("6544"),m=o.n(g),v=o("8336"),p=o("b0af"),h=o("99d9"),f=o("cc20"),b=o("132d"),x=o("da13"),C=o("1800"),_=o("5d23"),y=o("b974"),k=o("2fa4"),V=o("e0c7"),S=Object(u["a"])(l,s,i,!1,null,null,null),I=S.exports;m()(S,{VBtn:v["a"],VCard:p["a"],VCardActions:h["a"],VChip:f["a"],VIcon:b["a"],VListItem:x["a"],VListItemAction:C["a"],VListItemActionText:_["a"],VListItemContent:_["b"],VListItemSubtitle:_["c"],VListItemTitle:_["d"],VSelect:y["a"],VSpacer:k["a"],VSubheader:V["a"]});var O={name:"Orders",components:{orderComponent:I},data:function(){return{mmogaDeamon:!0,activeCategory:0,activeStatus:0,orderStatus:[{id:1,name:"В процессе",status:"progressing"},{id:2,name:"Новые",status:"new"}]}},computed:{orders:function(){var t=this;return 0!==this.activeCategory?this.$store.getters.getOrders.filter((function(e){return(null===e||void 0===e?void 0:e.categoryId)===t.categories[t.categories.map((function(t){return t.id})).indexOf(t.activeCategory)].id})):this.$store.getters.getOrders},categories:function(){return this.$store.getters.getCategories},accounts:function(){return this.$store.getters.getAccounts.filter((function(t){return"pending"==t.status}))}},methods:{getOrdersByStatus:function(t){this.$store.dispatch("findOrders",t)},changeOrderWorkerState:function(){this.$store.dispatch("changeStateDeamon",this.mmogaDeamon)}},mounted:function(){r["a"].$emit("setLoadingNotification","Получение данных с сервера"),this.$store.dispatch("findOrders").then((function(){return r["a"].$emit("killLoadingNotification")})),this.$store.dispatch("findCategories"),this.$store.dispatch("getStateDeamon"),this.$store.dispatch("findAccounts"),this.mmogaDeamon=this.$store.getters.getDeamonState}},$=O,w=o("5530"),D=(o("7e58"),o("604c")),B=D["a"].extend({name:"button-group",provide:function(){return{btnToggle:this}},computed:{classes:function(){return D["a"].options.computed.classes.call(this)}},methods:{genData:D["a"].options.methods.genData}}),L=o("a9ad"),j=o("58df"),A=Object(j["a"])(B,L["a"]).extend({name:"v-btn-toggle",props:{backgroundColor:String,borderless:Boolean,dense:Boolean,group:Boolean,rounded:Boolean,shaped:Boolean,tile:Boolean},computed:{classes:function(){return Object(w["a"])(Object(w["a"])({},B.options.computed.classes.call(this)),{},{"v-btn-toggle":!0,"v-btn-toggle--borderless":this.borderless,"v-btn-toggle--dense":this.dense,"v-btn-toggle--group":this.group,"v-btn-toggle--rounded":this.rounded,"v-btn-toggle--shaped":this.shaped,"v-btn-toggle--tile":this.tile},this.themeClasses)}},methods:{genData:function(){var t=this.setTextColor(this.color,Object(w["a"])({},B.options.methods.genData.call(this)));return this.group?t:this.setBackgroundColor(this.backgroundColor,t)}}}),P=o("62ad"),T=o("a523"),W=o("0fd9"),N=o("b73d"),R=Object(u["a"])($,a,n,!1,null,null,null);e["default"]=R.exports;m()(R,{VBtn:v["a"],VBtnToggle:A,VCard:p["a"],VCol:P["a"],VContainer:T["a"],VIcon:b["a"],VRow:W["a"],VSelect:y["a"],VSwitch:N["a"]})},"7e58":function(t,e,o){}}]);
//# sourceMappingURL=chunk-4e20cce4.2442d1d3.js.map