(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[11,24],{nx8y:function(e,t){e.exports='<div><h3>Hey 4</h3><h3>ooo</h3><file-agent v-bind="fileAgentProps"></file-agent></div>'},w2hk:function(e,t,r){"use strict";r.r(t);var i=r("oCYn"),n=r("30CX"),o=r("1OyB"),s=r("vuIU"),c=new(function(){function e(){Object(o.a)(this,e)}return Object(s.a)(e,[{key:"createWatcher",value:function(e){var t={},r=function(r){e.hasOwnProperty(r)&&(t[r]=function(e){null===this||void 0===this||this.propUpdated(r,e)})};for(var i in e)r(i);return t}},{key:"bindThis",value:function(e,t){for(var r in e)e.hasOwnProperty(r)&&e[r].bind(t)}}]),e}()),d=c.createWatcher(n.fileIconProps),h=(i.a.extend({props:n.fileIconProps,render:function(e){return e("span")},created:function(){c.bindThis(d,this),this.renderCore()},mounted:function(){this.renderCore()},methods:{renderCore:function(){if(this.coreFileIcon)return this.coreFileIcon.$props=this.$props,void this.coreFileIcon.update();this.$el&&(this.coreFileIcon=new n.FileIcon(this.$props),this.coreFileIcon.render(this.$el))},propUpdated:function(e,t){console.log("FileIcon propUpdated",e,t),this.renderCore()}},watch:d}),c.createWatcher(n.filePreviewProps)),p=(i.a.extend({props:n.filePreviewProps,render:function(e){return e("div")},created:function(){c.bindThis(h,this),this.renderCore()},mounted:function(){this.renderCore()},methods:{renderCore:function(){if(this.coreFilePreview)return this.coreFilePreview.$props=this.$props,void this.coreFilePreview.update();this.$el&&(this.coreFilePreview=new n.FilePreview(this.$props),this.coreFilePreview.render(this.$el))},propUpdated:function(e,t){console.log("FilePreview propUpdated",e,t),this.renderCore()}},watch:h}),c.createWatcher(n.fileAgentProps)),l=i.a.extend({props:n.fileAgentProps,render:function(e){return e("div")},created:function(){c.bindThis(p,this),this.renderCore()},mounted:function(){this.renderCore()},methods:{renderCore:function(e){this.coreFileAgent?this.coreFileAgent.setProps(this.$props,e):this.coreFileAgent=new n.FileAgent(this.$props),this.coreFileAgentRendered||this.$el&&this.coreFileAgent.render(this.$el)},propUpdated:function(e,t){console.log("FileAgent propUpdated",e,t),this.renderCore()}},watch:p}),a=r("nx8y"),u=r.n(a),f=r("86uN");t.default=i.a.extend({components:{FileAgent:l},data:function(){var e=this;return{fileAgentProps:{fileRecords:[],deletable:!0,sortable:!0,editable:!0,onDelete:function(e){},onChange:function(t){e.updateFileRecords(t)}}}},methods:{updateFileRecords:function(e){this.fileAgentProps.fileRecords=e}},created:function(){var e=this;Object(f.fetchInitialFileRecords)().then((function(t){e.fileAgentProps.fileRecords=t}))},template:u.a})}}]);