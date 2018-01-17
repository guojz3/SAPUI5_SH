sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sh/bz/common/controller/BaseController",
	"sh/bz/common/controller/Util"
], function(Controller, BaseController, Util) {
	"use strict";

	return BaseController.extend("sh.bz.common.controller.App", {

		onInit: function() {
			Util.debug("App controller inited...");
		},

		
	});
});