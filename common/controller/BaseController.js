sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"sh/bz/common/controller/Util",
	"sap/ui/core/BusyIndicator",
	"sh/bz/common/controller/Base64",
	"sh/bz/common/controller/Formatter",
	"sap/ui/unified/FileUploaderParameter",
	"sap/ui/Device"
], function(Controller, History, MessageToast, Util, BusyIndicator, Base64, Formatter, FileUploaderParameter, Device) {
	"use strict";
	return Controller.extend("sh.bz.common.controller.BaseController", {
		//翻页相关参数
		rowsOfOnePage: 10,
		rowsCount: 0,
		pageCount: 1,
		pageNumber: 1,
		pageinfo: null,

		formatter: Formatter,

		onInit: function() {
			jQuery.sap.require("sap.m.MessageToast");
		},

		toFirstPage: function(data_all) {
			//var data_all = this.getView().getModel("model_data_all").oData;
			var rowsOfOnePage = this.rowsOfOnePage; //获取每页展示数量
			var model_data_all_temp = [];
			//需要展示的data
			for (var i = 0;
				(i < rowsOfOnePage) && (i < data_all.results.length); i++) {
				data_all.results[i].NO = i + 1;
				model_data_all_temp.push(data_all.results[i]);
			}
			//获取需要展示的data
			var data = {
				results: model_data_all_temp
			};
			var Count = Math.ceil(data_all.results.length / rowsOfOnePage);
			//获取分页数量
			var pageinfo = {
				pageCount: Count,
				pageNumber: 1,
				limitCount: rowsOfOnePage,
				allpage: data_all.results.length
			};
			this.getView().setModel(new sap.ui.model.json.JSONModel(pageinfo), "pageinfo");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_data");
		},

		//向上
		prePage: function() {
			//后台获取的总数据
			var all_data = this.getView().getModel("model_data_all").oData;
			//获取点击业当前的数据
			var currentcount = this.getView().getModel("pageinfo").oData;
			if (currentcount.pageNumber > 1) {
				var future_pageNumber = currentcount.pageNumber - 1; //未来的值
				var pageinfo = {
					pageCount: currentcount.pageCount,
					pageNumber: future_pageNumber,
					limitCount: currentcount.limitCount,
					allpage: currentcount.allpage
				};
				//改变的pageinfo
				this.getView().setModel(new sap.ui.model.json.JSONModel(pageinfo), "pageinfo");
				var allselectlength = future_pageNumber * currentcount.limitCount; //需要截取的length
				var allselect = all_data.results.slice(0, allselectlength);
				var deletelength = (future_pageNumber - 1) * currentcount.limitCount; //需要删除的length
				allselect.splice(0, deletelength);
				var num = (pageinfo.pageNumber - 1)*pageinfo.limitCount;
				var data_temp = [];
				for (var i = 0; i < allselect.length; i++) {
					allselect[i].NO = num + 1;
					var num = allselect[i].NO;
					data_temp.push(allselect[i]);
				}
				var data = {
					results: data_temp
				};
				this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_data");
			}
		},

		//向下翻页相关  11.15
		nextPage: function() {
			var currentcount = this.getView().getModel("pageinfo").oData;
			var all_data = this.getView().getModel("model_data_all").oData;
			if (currentcount.pageNumber < currentcount.pageCount) {
				var future_pageNumber = currentcount.pageNumber + 1; //当前页数  1->2
				var pageinfo = {
					pageCount: currentcount.pageCount, //3
					pageNumber: future_pageNumber, //2
					limitCount: currentcount.limitCount, //2
					allpage: currentcount.allpage
				};
				this.getView().setModel(new sap.ui.model.json.JSONModel(pageinfo), "pageinfo");
				var allselectlength = future_pageNumber * currentcount.limitCount; //需要截取的length
				var allselect = all_data.results.slice(0, allselectlength);
				var deletelength = (future_pageNumber - 1) * currentcount.limitCount; //需要删除的length
				allselect.splice(0, deletelength);
				var num = (pageinfo.pageNumber - 1)*pageinfo.limitCount;
				//加入序号
				var data_temp = [];
				for (var i = 0; i < allselect.length; i++) {
					allselect[i].NO = num + 1;
					var num = allselect[i].NO;
					data_temp.push(allselect[i]);
				}
				var data = {
					results: data_temp
				};
				this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_data");

			}
		},

		//分页处理公用
		pagedcomputing: function() {

		},

		onClearValueState: function(oEvent) {
			Util.onClearValueState(oEvent);
		},

		goHome: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("home", {}, false);

		},

		goHomeTodoList: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("hometodolist", {}, false); //false have history

		},

		goHomeDJCX: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("homedjcx", {}, false); //false have history	
		},

		goHomeFYSQ: function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("homefysq", {}, false); //false have history	
		},

		goBack: function() {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

				oRouter.navTo("home", {}, false /*have history*/ );
			}
		},
		//申请人打开
		onShowPROPOSERHelp: function(oEvent) {
			Util.onShowPROPOSERHelp(oEvent, this);
		},
		//申请人搜索
		onSearchPROPOSE: function(oEvent) {
			Util.onSearchPROPOSE(oEvent, this);
		},
		//申请人关闭
		onCancelNameSelect: function(oEvent) {
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_PROPOSER");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			this.oDialogCostCenterHelpName.close();
		},
		//部门打开
		onShowCostPartHelp: function(oEvent) {
			Util.onShowCostPartHelp(oEvent, this);
			this.onSearchPROPOSER_KOSTL(oEvent,this);
		},
		//部门搜索
		onSearchPROPOSER_KOSTL: function(oEvent) {
			Util.onSearchPROPOSER_KOSTL(oEvent, this);
		},

		//部门关闭
		onCancelPartSelect: function(oEvent) {
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_PROPOSER_KOSTL");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			this.oDialogCostPartHelp.close();
		},
		// //费用类型打开
		// onShowEtdscHelp: function(oEvent) {
		// 	Util.onShowEtdscHelp(oEvent, this);
		// },

		//close 费用类型
		onCancelEtdscSelect: function(oEvent) {
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_Etdsc");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			this.oDialogEtdscHelp.close();
		},

		//利润中心打开
		onShowCostCenterHelp: function(oEvent) {
			Util.onShowCostCenterHelp(oEvent, this);
		},
		//利润中心搜索
		onSearchPROPOSER_PRCTR: function(oEvent) {
			Util.onSearchPROPOSER_PRCTR(oEvent, this);
		},
		//利润中心搜索关闭
		onCancelCenterSelect: function(oEvent) {
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_PROPOSER_PRCTR");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			this.oDialogCostCenterHelp.close();
		},

		//订单打开
		onShowAufnrHelp: function(oEvent) {
			Util.onShowAufnrHelp(oEvent, this);
		},

		//订单搜索
		onSearchAufnr: function(oEvent) {
			Util.onSearchAufnr(oEvent, this);
		},

		//订单关闭
		onCancelAufnrSelect: function() {
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_Aufnr");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			this.oDialogAufnrHelp.close();
		},

		//付款方式1 打开
		onShowZlschTHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogZlschHelp) {
				that.oDialogZlschHelp = sap.ui.xmlfragment(that.getView().getId(), "sh.bz.common.fragment.DialogZlschHelp", that.getView().getController());
				that.getView().addDependent(that.oDialogZlschHelp);
				var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROJKD_SRV/", true);

				var spath = "/T042ZTSet";
				that.oDialogZlschHelp.setModel(oDataModel);
				that.oDialogZlschHelp.bindElement({
					//change: this._onBindingChange.bind(this),
					path: spath,
					events: {
						dataRequested: function() {
							Util.debug("dataRequested");
						},
						dataReceived: function() {
							Util.debug("dataReceived");
						}
					}
				});
				//that.oDialogZlschHelp.setModel(that.getView().getModel());
			} else {
				this.getView().byId("zlschlist").getBinding("items").filter([]);
			}

			that.oDialogZlschHelp.open();
		},

		//付款方式2 窗口 中点击 搜索按钮
		onSearchZlsch: function(oEvent) {
			var that = this;
			var value = oEvent.getParameter("query");
			if (!/^[\u4e00-\u9fa5]/.test(value)) {
				var oFilter1 = new sap.ui.model.Filter("Zlsch", sap.ui.model.FilterOperator.Contains, value);
				this.getView().byId("zlschlist").getBinding("items").filter([oFilter1]);
			} else {
				var oFilter2 = new sap.ui.model.Filter("Text2", sap.ui.model.FilterOperator.Contains, value);
				this.getView().byId("zlschlist").getBinding("items").filter([oFilter2]);
			}
		},

		//付款方式4 关闭 窗口
		onCancelZlschSelect: function(oEvent) {
			this.oDialogZlschHelp.close();
		},

		//货币1 打开
		onShowWaersHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogWaersHelp) {
				that.oDialogWaersHelp = sap.ui.xmlfragment(that.getView().getId(), "sh.bz.common.fragment.DialogWaersHelp", that.getView().getController());
				that.getView().addDependent(that.oDialogWaersHelp);
				var spath = "/WAERSSet";
				that.oDialogWaersHelp.bindElement({
					//change: this._onBindingChange.bind(this),
					path: spath,
					events: {
						dataRequested: function() {
							Util.debug("dataRequested");
						},
						dataReceived: function() {
							Util.debug("dataReceived");
						}
					}
				});
				that.oDialogWaersHelp.setModel(that.getView().getModel());
			} else {
				that.getView().byId("waerslist").getBinding("items").filter([]);
			}

			that.oDialogWaersHelp.open();
		},

		//货币2 搜索
		onSearchWaers: function(oEvent) {
			var sQuery = oEvent.getParameter("query");
			var of1 = new sap.ui.model.Filter("Waers", sap.ui.model.FilterOperator.Contains, sQuery);
			var of2 = new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sQuery);
			if (sQuery) {
				var ofilter = new sap.ui.model.Filter({
					"filters": [of1, of2],
					"or": true //and 
				});
			} else {
				ofilter = [];
			};
			//this._applyFilterSearch();
			var oView = this.getView();
			var oList = oView.byId("waerslist");
			oList.getBinding("items").filter(ofilter);
		},

		//货币4 关闭
		onCancelWaersSelect: function(oEvent) {
			this.oDialogWaersHelp.close();
		},

		//设置BUSY
		// setBusy: function(busy) {
		// 	jQuery.sap.require("sap.ui.core.BusyIndicator");
		// 	busy ? BusyIndicator.show(0) : BusyIndicator.hide();
		// }

		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function() {
			var oViewModel = (this.getModel("objectView") || this.getModel("worklistView"));
			sap.m.URLHelper.triggerEmail(
				null,
				// oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},

		//以下为定制方法
		getDomid: function(that, viewid, controlid) {
			var ownerId = that.getView()._sOwnerId,
				rootId = that.getOwnerComponent().getManifestEntry("sap.ui5").rootView.id,
				realId = ownerId + "---" + viewid + "---" + controlid;
			return realId;
		},
		getDomref: function(that, viewid, controlid) {
			var allpages = that.getView().getParent().getPages();
			for (var i = 0; i < allpages.length; i++) {
				if (allpages[i].sViewName == viewid) {
					var oHomeView = allpages[i];
					var otable = oHomeView.byId(controlid);
					return {
						"control": otable,
						"view": oHomeView
					};
				}
			}
		},
		setBusy: function(busy) {
			jQuery.sap.require("sap.ui.core.BusyIndicator");
			busy ? BusyIndicator.show(0) : BusyIndicator.hide();
		},

		showMessageall: function(type, title, text) {},

		// 清除校验错误提示 all
		clearErrorSateAll: function(that) {
			Util.debug("clearErrorSateAll.....");
			var elements = that.getView().findElements(true);
			for (var i = 0; i < elements.length; i++) {
				if ((elements[i].getMetadata().getName() == "sap.m.Input") || (elements[i].getMetadata().getName() == "sap.m.MultiInput")) {
					elements[i].setValueState("None");;
					elements[i].setValueStateText("");;
				}
			}
		},

		// 校验数据 是否为空
		inputCheck: function(inputs) {

			var canContinue = true;

			jQuery.each(inputs, function(i, input) {

				var value = input.getValue().replace(/^\s+|\s+$/g, "");
				if ((!value) || (value === "|")) {
					input.setValueState("Error");
				} else {
					//input.setValueState("Success");
					input.setValueState("None");
				}
			});

			jQuery.each(inputs, function(i, input) {
				if ("Error" === input.getValueState()) {
					canContinue = false;
					return false;
				}
			});

			return canContinue;
		},

		/*
		 * 验证表单 参数oEvent, that, objs
		 * obj = [{ 
		 *      idStr: "idStr", // input绑定id
		 *      reg: /^$/, // input验证正则
		 *      msg: "msg", // 报错提示内容
		 *  	validNull: boolean  //是否验证必填
		 *   }]
		 */
		validForm: function(oEvent, that, objs) {
			var canContinue = false;
			var view = that.getView();
			jQuery.each(objs, function(i, obj) {
				var t = view.byId(obj.idStr);
				if(!t){
					t = sap.ui.getCore().byId(obj.idStr);
				}
				var s = t.getValue().replace(new RegExp(" ", "gm"), "");
				if (obj.validNull && !s) {
					Util.showError("需输入必填字段");
					t.setValueState("Error");
					return true;
				}
				if (obj.reg && s.match(obj.reg) === null) {
					Util.showError(obj.msg);
					t.setValueState("Error");
				} else {
					t.setValueState("None");
				}
			});
			jQuery.each(objs, function(i, obj) {
				var t = view.byId(obj.idStr);
				if(!t){
					t = sap.ui.getCore().byId(obj.idStr);
				}
				if ("Error" === t.getValueState()) {
					canContinue = true;
					return false;
				}
			});
			return canContinue;
		},
		// 通用查询过滤 参数需要传 that=this,obj={'id':"",'params':[],'value':""}
		onFilterSearchBase: function(that, obj) {
			var oFilter = [];
			if (obj.value && obj.params.length > 0) {
				var oFilters = [];
				for (var i = 0; i < obj.params.length; i++) {
					oFilters.push(new sap.ui.model.Filter(obj.params[i], sap.ui.model.FilterOperator.Contains, obj.value));
				}
				oFilter = new sap.ui.model.Filter({
					"filters": oFilters,
					"or": true //and 
				});
			}
			if (that.getView().byId(obj.id)) {
				that.getView().byId(obj.id).getBinding("items").filter(oFilter);
			} else {
				sap.ui.getCore().byId(obj.id).getBinding("items").filter(oFilter);
			}
		},
		//文件上传 1 完成，修改文件列表
		handleUploadComplete: function(oEvent) {
			Util.debug("handleUploadComplete begin");
			if (this.getView().getModel("model_file") === undefined)
				var data = {
					Item: []
				};
			else
				var data = this.getView().getModel("model_file").getData();
			//https://blogs.sap.com/2014/07/28/upload-image-to-sap-gateway-and-display-image-in-ui5-using-new-fileuploader-with-sap-gateway/
			//for (var i = 0; i < oEvent.getSource().FUEl.files.length; i++) {
			//var Filename = oEvent.getSource().FUEl.files[i].name;
			var location = oEvent.getParameters().headers.Location;
			if (location === undefined) {
				location = oEvent.getParameters().headers.location;
			};

			var URLsplit = location.split('/');
			var host = URLsplit[0] + "//" + URLsplit[2] + "";
			location = location.replace(host, '');

			var file = {
				"Filename": oEvent.getParameters().fileName,
				"Location": location + "/$value",
			};
			data.Item.push(file);

			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_file");
			Util.debug("handleUploadComplete end");
			//oEvent.oSource.oFilePath.mProperties.value
		},

		//文件上传 2
		handleTypeMissmatch: function(oEvent) {
			//TODO
			Util.showError("handleTypeMissmatch");

		},

		//文件上传 3
		fileChange: function(oEvent) {
			Util.debug("fileChange begin");
			if (oEvent.getParameter("files").length === 0) {
				Util.debug("no file selected for upload");
				Util.debug("fileChange end");
				return;
			}

			//
			var header = this.getView().getBindingContext().getProperty();
			if (header.Recode === "" || header.Recode === undefined || header.Recode === "保存后生成") {
				// error
				Util.showError("请先保存单据");
				return;
			};

			var fileUploader = oEvent.getSource(),
				fileName = oEvent.getParameter("files")[0].name,
				type = oEvent.getParameter("files")[0].type;
			Util.debug("fileName " + fileName);
			//urlencode
			//fileName = encodeURIComponent(fileName);
			//Util.debug("url encoded fileName " + fileName);
			//base64 encode
			Util.debug("fileName before encode " + fileName);
			fileName = Base64.encode(fileName);
			Util.debug("fileName after encode " + fileName);
			//fileName before encode 中文文件111.PNG
			//base64 encoded fileName 5Lit5paH5paH5Lu2MTExLlBORw==

			var oHeaderType = new FileUploaderParameter({
				name: "Content-Type",
				value: type
			});

			var oHeaderSlug = new FileUploaderParameter({
				name: "slug",
				value: fileName
			});

			var that = this;
			this.getView().getModel().refreshSecurityToken(
				function() {
					that.token = that.getView().getModel().getSecurityToken();
				}
			);

			var oHeaderToken = new FileUploaderParameter({
				name: "X-CSRF-Token",
				value: this.token
			});

			var oZmy = new FileUploaderParameter({
				name: "ID",
				value: header.Recode
			});

			var oDkkd = new FileUploaderParameter({
				name: "DKKD",
				value: header.Dkkd
			});
			Util.debug("header " + header);
			var oZmy2 = new FileUploaderParameter({
				name: "BUKRS",
				value: header.Bukrs
			});

			var oZmy3 = new FileUploaderParameter({
				name: "ORDERTYPE",
				value: header.Aufnr
			});
			fileUploader.destroyHeaderParameters();
			fileUploader.addHeaderParameter(oHeaderSlug);
			fileUploader.addHeaderParameter(oHeaderToken);
			fileUploader.addHeaderParameter(oDkkd);
			fileUploader.addHeaderParameter(oZmy);
			fileUploader.addHeaderParameter(oZmy2);
			fileUploader.addHeaderParameter(oZmy3);
			fileUploader.setSendXHR(true);

			var fileUploader = this.getView().byId("fileUploader");
			if (!fileUploader.getValue()) {
				return;
			}
			Util.debug("fileChange begin upload");
			fileUploader.upload();
			Util.debug("fileChange end upload");
			Util.debug("fileChange end");
		},

		//文件上传 4
		getToken: function() {
			var self = this;
			this.oModel.refreshSecurityToken(function() {
				self.token = self.oModel.getSecurityToken();
			});
		},

		//文件上传 5
		//no use anymore
		onDownload: function() {
			var guid = "0050569C46631ED7B69B8DC9F6DD9123";
			var encodeUrl = encodeURI("/sap/opu/odata/SAP/ZPROJKD_SRV/FjSet(Djfjid='" + guid + "')/$value");
			sap.m.URLHelper.redirect(encodeUrl, true);
		},

		//文件上传 6
		onDeleteFile: function(oEvent) {
			var mFile = this.getView().getModel("model_file");
			if (mFile === undefined || mFile.oData.Item.length == 0) {
				Util.showInfo("没有上传文件");
				return;
			}

			//读取选中的行的下标（数组）
			var contexts = this.getView().byId("JKD_IP_table_file").getSelectedContexts();
			if(contexts.length == 0){
				Util.showInfo("请选择需要删除的附件信息！");
				return;		
			}
			//读取选中的行的内容（数组）
			var items = contexts.map(function(c) {
				return c.getObject();
			});
			var items_Length = items.length;
			Util.debug(JSON.stringify(items));

			//从后台删除选中的数据 TODO
			var bSuccess = true;
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZFYBX_ATTACHMENT_SRV/", true);
			for (var i = 0; i < items_Length; i++) {
				var URLsplit = items[i].Location.split('/');
				var sPath = "/" + URLsplit[URLsplit.length - 2]; //last one is $value
				oDataModel.remove(sPath, {
					success: function(oData, oResponse) {
						Util.debug(items[i].Filename + "删除成功");
					},
					error: function(error) {
						Util.debug(items[i].Filename + "删除失败");
						bSuccess = false;
					},
					async: false //同步访问！
				});
				//Util.showInfo("文件 " + items[i].Filename + " removed");
			}

			if (!bSuccess) {
				Util.showError("删除失败");
				return;
			}

			//从原始的数组 删除 选中的数组
			var data = this.getView().getModel("model_file").getData().Item;
			for (var i = 0; i < items.length; i++) {
				for (var j = 0; j < data.length; j++) {
					if (data[j] == items[i]) {
						data.splice(j, 1);
						j = j - 1;
					}
				}
			};

			//更新显示
			var model = {
				Item: data
			};
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_file");
			Util.showInfo("删除成功");
		},

		//付款信息合同号搜索	
		onShowZzhthHelp: function(oEvent) {
			var that = this;
			if (that.oDialogZzhthHelp) {
				that.oDialogZzhthHelp.destroy();
			}
			that.oDialogZzhthHelp = sap.ui.xmlfragment(that.getView().getId(), "sh.bz.common.fragment.DialogZzhthHelp", that.getView().getController());
			that.getView().addDependent(that.oDialogZzhthHelp);
			var Bukrs = this.getView().byId('Todo_IP_Bukrs').getValue();
			var sPath = "/HTHSet?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROCWSP_SRV", true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzhth");
					Util.debug(model);
				},
				error: function(oError) {
					MessageToast.show("get ZzhthSet error!");
				}
			});

			this.oDialogZzhthHelp.open();
		},
		// 2.搜索odata帮助
		onSearchZzhth: function(oEvent) {
			var value = oEvent.getParameter("query");
			var oFilter1 = new sap.ui.model.Filter("Zzhth", sap.ui.model.FilterOperator.Contains, value);
			var oFilter2 = new sap.ui.model.Filter("Zzhthms", sap.ui.model.FilterOperator.Contains, value);
			if (value) {
				var ofilter = new sap.ui.model.Filter({
					"filters": [oFilter1, oFilter2],
					"or": true
				});
			} else {
				ofilter = [];
			}
			var oView = this.getView();
			var oList = oView.byId("Zzhthlist");
			oList.getBinding("items").filter(ofilter);

		},

		// 4.关闭窗口
		onCancelZzhthSelect: function(oEvent) {
			this.oDialogZzhthHelp.close();
			this.getView().getModel("model_Zzhth").setData(null);
		},

		//原因代码搜索	
		onShowRstgrHelp: function(oEvent) {
			var that = this;
			if (that.oDialogRstgrHelp) {
				that.oDialogRstgrHelp.destroy();
			}
			that.oDialogRstgrHelp = sap.ui.xmlfragment(that.getView().getId(), "sh.bz.common.fragment.DialogRstgrHelp", that.getView().getController());
			that.getView().addDependent(that.oDialogRstgrHelp);
			var Bukrs = this.getView().byId('Todo_IP_Bukrs').getValue();
			var sPath = "/T053SSet?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROCWSP_SRV", true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Rstgr");
					Util.debug(model);
				},
				error: function(oError) {
					MessageToast.show("get RstgrSet error!");
				}
			});

			this.oDialogRstgrHelp.open();
		},
		// 2.搜索odata帮助
		onSearchRstgr: function(oEvent) {
			var value = oEvent.getParameter("query");
			var oFilter1 = new sap.ui.model.Filter("Rstgr", sap.ui.model.FilterOperator.Contains, value);
			var oFilter2 = new sap.ui.model.Filter("Txt20", sap.ui.model.FilterOperator.Contains, value);
			if (value) {
				var ofilter = new sap.ui.model.Filter({
					"filters": [oFilter1, oFilter2],
					"or": true
				});
			} else {
				ofilter = [];
			}
			var oView = this.getView();
			var oList = oView.byId("Rstgrlist");
			oList.getBinding("items").filter(ofilter);

		},

		// 4.关闭窗口
		onCancelRstgrSelect: function(oEvent) {
			this.oDialogRstgrHelp.close();
			this.getView().getModel("model_Rstgr").setData(null);
		},

		//付款银行名称 	
		onShowHbkidHelp: function(oEvent) {
			var that = this;
			if (that.oDialogHbkidHelp) {
				that.oDialogHbkidHelp.destroy();
			}
			that.oDialogHbkidHelp = sap.ui.xmlfragment(that.getView().getId(), "sh.bz.common.fragment.DialogHbkidHelp", that.getView().getController());
			that.getView().addDependent(that.oDialogHbkidHelp);
			var Bukrs = this.getView().byId('Todo_IP_Bukrs').getValue();
			var sPath = "/T012KSet?$filter=Bukrs eq '" + Bukrs + "' ";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROCWSP_SRV", true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Hbkid");
					Util.debug(model);
				},
				error: function(oError) {
					MessageToast.show("get HbkidSet error!");
				}
			});
			that.oDialogHbkidHelp.open();
		},

		// 2.搜索odata帮助
		onSearchHbkid: function(oEvent) {
			var value = oEvent.getParameter("query");
			var oFilter1 = new sap.ui.model.Filter("Hbkid", sap.ui.model.FilterOperator.Contains, value);
			var oFilter2 = new sap.ui.model.Filter("Text1", sap.ui.model.FilterOperator.Contains, value);
			if (value) {
				var ofilter = new sap.ui.model.Filter({
					"filters": [oFilter1, oFilter2],
					"or": true
				});
			} else {
				ofilter = [];
			}
			var oView = this.getView();
			var oList = oView.byId("Hbkidlist");
			oList.getBinding("items").filter(ofilter);
		},

		// 4.关闭窗口
		onCancelHbkidSelect: function(oEvent) {
			this.oDialogHbkidHelp.close();
		},
		//付款银行账号 	
		onShowBanknHelp: function(oEvent) {
			var that = this;
			if (that.oDialogBanknHelp) {
				that.oDialogBanknHelp.destroy();
			}
			that.oDialogBanknHelp = sap.ui.xmlfragment(that.getView().getId(), "sh.bz.common.fragment.DialogBanknHelp", that.getView().getController());
			that.getView().addDependent(that.oDialogBanknHelp);
			var Bukrs = this.getView().byId('Todo_IP_Bukrs').getValue();
			var Hbkidstr = that.getView().byId('Todo_IP_Hbkid').getValue();
			var arr4 = Hbkidstr.split("|");
			var Hbkid = arr4[0];
			var sPath = "/T012KSet?$filter=Bukrs eq '" + Bukrs + "' and  Hbkid eq '" + Hbkid + "'  ";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROCWSP_SRV", true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Bankn");
					Util.debug(model);
				},
				error: function(oError) {
					MessageToast.show("get BanknSet error!");
				}
			});

			that.oDialogBanknHelp.open();
		},

		// 2.搜索
		onSearchBankn: function(oEvent) {
			var value = oEvent.getParameter("query");
			var oFilter1 = new sap.ui.model.Filter("Bankn", sap.ui.model.FilterOperator.Contains, value);
			var oFilter2 = new sap.ui.model.Filter("Text1", sap.ui.model.FilterOperator.Contains, value);
			if (value) {
				var ofilter = new sap.ui.model.Filter({
					"filters": [oFilter1, oFilter2],
					"or": true
				});
			} else {
				ofilter = [];
			}
			var oView = this.getView();
			var oList = oView.byId("Banknlist");
			oList.getBinding("items").filter(ofilter);
		},

		// 4.关闭窗口
		onCancelBanknSelect: function(oEvent) {
			this.oDialogBanknHelp.close();
			this.getView().getModel("model_Bankn").setData(null);
		},

		//资金计划项  	
		onShowZzzjjhHelp: function(oEvent) {
			var that = this;
			if (that.oDialogZzzjjhHelp) {
				that.oDialogZzzjjhHelp.destroy();
			}
			that.oDialogZzzjjhHelp = sap.ui.xmlfragment(that.getView().getId(), "sh.bz.common.fragment.DialogZzzjjhHelp", that.getView().getController());
			that.getView().addDependent(that.oDialogZzzjjhHelp);
			var sPath = "/ZJJHXMSet";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROCWSP_SRV", true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Zzzjjh");
					Util.debug(model);
				},
				error: function(oError) {
					MessageToast.show("get ZzzjjhSet error!");
				}
			});
			this.oDialogZzzjjhHelp.open();
		},
		// 2.搜索odata帮助
		onSearchZzzjjh: function(oEvent) {
			var value = oEvent.getParameter("query");
			var oFilter1 = new sap.ui.model.Filter("Zzzjjh", sap.ui.model.FilterOperator.Contains, value);
			var oFilter2 = new sap.ui.model.Filter("Zzzjjhms", sap.ui.model.FilterOperator.Contains, value);
			if (value) {
				var ofilter = new sap.ui.model.Filter({
					"filters": [oFilter1, oFilter2],
					"or": true
				});
			} else {
				ofilter = [];
			}
			var oView = this.getView();
			var oList = oView.byId("Zzzjjhlist");
			oList.getBinding("items").filter(ofilter);
		},
		// 4.关闭窗口
		onCancelZzzjjhSelect: function(oEvent) {
			this.oDialogZzzjjhHelp.close();
			this.getView().getModel("model_Zzzjjh").setData(null);
		},

		//付款信息利润中心 	
		onShowCostBukrsHelp: function(oEvent) {
			var that = this;
			if (that.oDialogCostCenterHelp) {
				that.oDialogCostCenterHelp.destroy();
			}
			that.oDialogCostCenterHelp = sap.ui.xmlfragment(that.getView().getId(), "sh.bz.common.fragment.DialogCostCenterBukrsHelp", that.getView()
				.getController());
			that.getView().addDependent(that.oDialogCostCenterHelp);
			var Bukrs = this.getView().byId('Todo_IP_Bukrs').getValue();
			var sPath = "/CEPCSet?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZPROCWSP_SRV", true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_CostCenter");
					Util.debug(model);
				},
				error: function(oError) {
					MessageToast.show("get CostCenterSet error!");
				}
			});
			this.oDialogCostCenterHelp.open();
		},
		// 2.搜索odata帮助
		onSearchCostCenterBukrs: function(oEvent) {
			var value = oEvent.getParameter("query");
			var oFilter1 = new sap.ui.model.Filter("Prctr", sap.ui.model.FilterOperator.Contains, value);
			var oFilter2 = new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, value);
			if (value) {
				var ofilter = new sap.ui.model.Filter({
					"filters": [oFilter1, oFilter2],
					"or": true
				});
			} else {
				ofilter = [];
			}
			var oView = this.getView();
			var oList = oView.byId("CostCenterlist");
			oList.getBinding("items").filter(ofilter);
		},

		// 4.关闭窗口
		onCancelCostCenterSelect: function(oEvent) {
			this.oDialogCostCenterHelp.close();
			this.getView().getModel("model_CostCenter").setData(null);
		},

		//文件上传 7 read files
		getFiles: function(that, Recode) {
			var data = {
				Item: []
			};
			var model = new sap.ui.model.json.JSONModel(data);
			that.getView().setModel(model, "model_file");

			//TODO Recode is ?
			var sPath = "/FjSet?$filter=Djbm eq '" + Recode + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/SAP/ZFYBX_ATTACHMENT_SRV/", true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					if (oData.results.length >= 1) {
						Util.debug("file number is " + oData.results.length);
						var data = {
							Item: []
						};
						for (var i = 0; i < oData.results.length; i++) {
							var item = {};
							Util.debug("filename is " + oData.results[i].Fjnm);
							item.Filename = oData.results[i].Fjnm; //TODO base64 decode
							//item.Filename = oData.results[i].Fjnm;	//TODO base64 decode
							item.Location = "/sap/opu/odata/SAP/ZPROJKD_SRV/FjSet('" + oData.results[i].Djfjid + "')/$value";
							data.Item.push(item);
						}
						var model = new sap.ui.model.json.JSONModel(data);
						that.getView().setModel(model, "model_file");
					} else {

					}

				},
				error: function(oError) {

				},
				async: false
			});
		},

		getContentDensityClass: function() {
			Util.debug("getContentDensityClass.....");
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class;
				// do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if
					// touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m
					// controls, but needed for desktop-first controls like
					// sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},
		
		changeContentDensityClassOfTables: function(that) {
			var elements = that.getView().findElements(true);
			for (var i = 0; i < elements.length; i++) {
				if (elements[i].getMetadata().getName() == "sap.m.Table") {
					elements[i].addStyleClass(that.getContentDensityClass());
				}
			}
		},

		
		isSupportiFrame: function() {
			if (navigator.platform.indexOf("Win") !== -1 || navigator.platform.indexOf("Mac") !== -1) 
				return true;
			else
				return false;
		},

		checkScreenSize: function(that) {
			/*
			Util.debug("checkScreenSize.....");
			var elements = that.getView().findElements(true);
			for (var i = 0; i < elements.length; i++) {
				if (elements[i].getMetadata().getName() == "sap.m.Table") {
					var tab = elements[i];
					if (document.body.clientWidth < 1024) {
						//显示头4列和最后一列
						for (var k = 4; k < tab.getColumns().length-2; k++) {
							tab.getColumns()[k].setVisible(false);
						}
					}
				}
			}
			*/
		},
		
		// =================费用项目====================
		// 1.显示odata帮助 
		onShowEinmHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogEinmHelp) {
				that.oDialogEinmHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogEinm", that);
				that.getView().addDependent(that.oDialogEinmHelp);
			}
			that.oDialogEinmHelp.open();
			that.onSearchEinm(oEvent);
		},
		// 2.搜索odata帮助
		onSearchEinm: function(oEvent) {
			Util.onSearchEinm(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelEinmSelect: function(oEvent) {
			this.oDialogEinmHelp.close();
		},
		// =================税码====================
		// 1.显示odata帮助 
		onShowMwskzHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogMwskzHelp) {
				that.oDialogMwskzHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogMwskzHelp", that);
				that.getView().addDependent(that.oDialogMwskzHelp);
			}
			that.oDialogMwskzHelp.open();
			that.onSearchMwskz(oEvent);
		},

		// 2.搜索odata帮助
		onSearchMwskz: function(oEvent) {
			Util.onSearchMwskz(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelMwskzSelect: function(oEvent) {
			this.oDialogMwskzHelp.close();
		},
		// =================订单====================
		// 1.显示odata帮助 
		onShowAufnrClbxHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogAufnrClbxHelp) {
				that.oDialogAufnrClbxHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogAufnrClbxHelp", that);
				that.getView().addDependent(that.oDialogAufnrClbxHelp);
			}
			that.oDialogAufnrClbxHelp.open();
			that.onSearchAufnrClbx(oEvent);
		},
		// 2.搜索odata帮助
		onSearchAufnrClbx: function(oEvent) {
			Util.onSearchAufnrClbx(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelAufnrClbxSelect: function(oEvent) {
			this.oDialogAufnrClbxHelp.close();
		},
		// =================交通工具====================
		// 1.显示odata帮助 
		onShowVektpHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogVektpHelp) {
				that.oDialogVektpHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogVektpHelp", that);
				that.getView().addDependent(that.oDialogVektpHelp);
			}
			that.oDialogVektpHelp.open();
			that.onSearchVektp(oEvent);
		},
		// 2.搜索odata帮助
		onSearchVektp: function(oEvent) {
			Util.onSearchVektp(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelVektpSelect: function(oEvent) {
			this.oDialogVektpHelp.close();
		},
		// =================舱位席别====================
		// 1.显示odata帮助 
		onShowSpsHelp: function(oEvent) {
			var path = this.getView().getBindingContext().getPath() + "/";
			var Vektp = this.getView().getModel().getProperty(path).Vektp;
			if (!Vektp) {
				sap.m.MessageBox.information("请先选择交通工具", {
					title: "警告",
					onClose: null,
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
				return;
			}
			var that = this;
			if (!that.oDialogSpsHelp) {
				that.oDialogSpsHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogSpsHelp", that);
				that.getView().addDependent(that.oDialogSpsHelp);
			}
			that.oDialogSpsHelp.open();
			Util.onSearchSps(oEvent, that);
		},
		// 2.搜索odata帮助
		onSearchSps: function(oEvent) {
			Util.onSearchSps(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelSpsSelect: function(oEvent) {
			this.oDialogSpsHelp.close();
		},
		// =================城市====================
		// 1.显示odata帮助 
		onShowCtkdHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogCtkdHelp) {
				that.oDialogCtkdHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogCtkdHelp", that);
				that.getView().addDependent(that.oDialogCtkdHelp);
			}
			that.oDialogCtkdHelp.open();
			that.onSearchCtkd(oEvent);
		},
		// 2.搜索odata帮助
		onSearchCtkd: function(oEvent) {
			Util.onSearchCtkd(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelCtkdSelect: function(oEvent) {
			this.oDialogCtkdHelp.close();
		},
		// =================地区类别====================
		// 1.显示odata帮助 
		onShowZzdqlbHelp: function(oEvent) {
			var path = this.getView().getBindingContext().getPath() + "/";
			var that = this;
			if (!that.oDialogDqlbHelp) {
				that.oDialogDqlbHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogDqlbHelp", that);
				that.getView().addDependent(that.oDialogDqlbHelp);
			}
			that.oDialogDqlbHelp.open();
			that.onSearchDqlb(oEvent);
		},
		// 2.搜索odata帮助
		onSearchDqlb: function(oEvent) {
			Util.onSearchDqlb(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelDqlbSelect: function(oEvent) {
			this.oDialogDqlbHelp.close();
		},
		// =================功能范围====================
		// 1.显示odata帮助 
		onShowFkberHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogFkberHelp) {
				that.oDialogFkberHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogFkberHelp", that);
				that.getView().addDependent(that.oDialogFkberHelp);
			}
			that.oDialogFkberHelp.open();
			that.onSearchFkber(oEvent);
		},
		// 2.搜索odata帮助
		onSearchFkber: function(oEvent) {
			Util.onSearchFkber(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelFkberSelect: function(oEvent) {
			this.oDialogFkberHelp.close();
		},
		// =================车型====================
		// 1.显示odata帮助 
		onShowZzcxHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogZzcxHelp) {
				that.oDialogZzcxHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogZzcxHelp", that);
				that.getView().addDependent(that.oDialogZzcxHelp);
			}
			that.oDialogZzcxHelp.open();
			that.onSearchZzcx(oEvent);
		},
		// 2.搜索odata帮助
		onSearchZzcx: function(oEvent) {
			Util.onSearchZzcx(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelZzcxSelect: function(oEvent) {
			this.oDialogZzcxHelp.close();
		},
		// =================车号====================
		// 1.显示odata帮助 
		onShowZzchHelp: function(oEvent) {
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzcx = this.getView().getModel().getProperty(path).Zzcx;
			// var Zzcx = this.getView().getModel("model_Zzcx");
			if (!Zzcx) {
				sap.m.MessageBox.information("请先选择车型", {
					title: "警告",
					onClose: null,
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
				return;
			}
			var that = this;
			if (!that.oDialogZzchHelp) {
				that.oDialogZzchHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogZzchHelp", that);
				that.getView().addDependent(that.oDialogZzchHelp);
			}
			that.oDialogZzchHelp.open();
			that.onSearchZzch(oEvent);
		},
		// 2.搜索odata帮助
		onSearchZzch: function(oEvent) {
			Util.onSearchZzch(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelZzchSelect: function(oEvent) {
			this.oDialogZzchHelp.close();
		},
		// =================分线核算====================
		// 1.显示odata帮助 
		onShowZzfxcbHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogZzfxcbHelp) {
				that.oDialogZzfxcbHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogZzfxcbHelp", that);
				that.getView().addDependent(that.oDialogZzfxcbHelp);
			}
			that.oDialogZzfxcbHelp.open();
			that.onSearchZzfxcb(oEvent);
		},
		// 2.搜索odata帮助
		onSearchZzfxcb: function(oEvent) {
			Util.onSearchZzfxcb(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelZzfxcbSelect: function(oEvent) {
			this.oDialogZzfxcbHelp.close();
		},
		// =================辅助核算01====================
		// 1.显示odata帮助 
		onShowZzfzhs01Help: function(oEvent) {
			var that = this;
			if (!that.oDialogZzfzhs01Help) {
				that.oDialogZzfzhs01Help = sap.ui.xmlfragment("sh.bz.common.fragment.DialogZzfzhs01Help", that);
				that.getView().addDependent(that.oDialogZzfzhs01Help);
			}
			that.oDialogZzfzhs01Help.open();
			that.onSearchZzfzhs01(oEvent);
		},
		// 2.搜索odata帮助
		onSearchZzfzhs01: function(oEvent) {
			Util.onSearchZzfzhs01(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelZzfzhs01Select: function(oEvent) {
			this.oDialogZzfzhs01Help.close();
		},
		// =================辅助核算02====================
		// 1.显示odata帮助 
		onShowZzfzhs02Help: function(oEvent) {
			var that = this;
			if (!that.oDialogZzfzhs02Help) {
				that.oDialogZzfzhs02Help = sap.ui.xmlfragment("sh.bz.common.fragment.DialogZzfzhs02Help", that);
				that.getView().addDependent(that.oDialogZzfzhs02Help);
			}
			that.oDialogZzfzhs02Help.open();
			that.onSearchZzfzhs02(oEvent);
		},
		// 2.搜索odata帮助
		onSearchZzfzhs02: function(oEvent) {
			Util.onSearchZzfzhs02(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelZzfzhs02Select: function(oEvent) {
			this.oDialogZzfzhs02Help.close();
		},
		// =================辅助核算03====================
		// 1.显示odata帮助 
		onShowZzfzhs03Help: function(oEvent) {
			var that = this;
			if (!that.oDialogZzfzhs03Help) {
				that.oDialogZzfzhs03Help = sap.ui.xmlfragment("sh.bz.common.fragment.DialogZzfzhs03Help", that);
				that.getView().addDependent(that.oDialogZzfzhs03Help);
			}
			that.oDialogZzfzhs03Help.open();
			that.onSearchZzfzhs03(oEvent);
		},
		// 2.搜索odata帮助
		onSearchZzfzhs03: function(oEvent) {
			Util.onSearchZzfzhs03(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelZzfzhs03Select: function(oEvent) {
			this.oDialogZzfzhs03Help.close();
		},
		// =================辅助核算04====================
		// 1.显示odata帮助 
		onShowZzfzhs04Help: function(oEvent) {
			var that = this;
			if (!that.oDialogZzfzhs04Help) {
				that.oDialogZzfzhs04Help = sap.ui.xmlfragment("sh.bz.common.fragment.DialogZzfzhs04Help", that);
				that.getView().addDependent(that.oDialogZzfzhs04Help);
			}
			that.oDialogZzfzhs04Help.open();
			that.onSearchZzfzhs04(oEvent);
		},
		// 2.搜索odata帮助
		onSearchZzfzhs04: function(oEvent) {
			Util.onSearchZzfzhs04(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelZzfzhs04Select: function(oEvent) {
			this.oDialogZzfzhs04Help.close();
		},
		// =================辅助核算05====================
		// 1.显示odata帮助 
		onShowZzfzhs05Help: function(oEvent) {
			var that = this;
			if (!that.oDialogZzfzhs05Help) {
				that.oDialogZzfzhs05Help = sap.ui.xmlfragment("sh.bz.common.fragment.DialogZzfzhs05Help", that);
				that.getView().addDependent(that.oDialogZzfzhs05Help);
			}
			that.oDialogZzfzhs05Help.open();
			that.onSearchZzfzhs05(oEvent);
		},
		// 2.搜索odata帮助
		onSearchZzfzhs05: function(oEvent) {
			Util.onSearchZzfzhs05(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelZzfzhs05Select: function(oEvent) {
			this.oDialogZzfzhs05Help.close();
		},
		// =================辅助核算类别====================
		// 1.显示odata帮助 
		onShowZzfzhslbHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogZzfzhslbHelp) {
				that.oDialogZzfzhslbHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogZzfzhslbHelp", that);
				that.getView().addDependent(that.oDialogZzfzhslbHelp);
			}
			that.oDialogZzfzhslbHelp.open();
			that.onSearchZzfzhslb(oEvent);
		},
		// 2.搜索odata帮助
		onSearchZzfzhslb: function(oEvent) {
			Util.onSearchZzfzhslb(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelZzfzhslbSelect: function(oEvent) {
			this.oDialogZzfzhslbHelp.close();
		},
		// =================辅助核算内容====================
		// 1.显示odata帮助 
		onShowZzfzhsnrHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogZzfzhsnrHelp) {
				that.oDialogZzfzhsnrHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogZzfzhsnrHelp", that);
				that.getView().addDependent(that.oDialogZzfzhsnrHelp);
			}
			that.oDialogZzfzhsnrHelp.open();
			that.onSearchZzfzhsnr(oEvent);
		},
		// 2.搜索odata帮助
		onSearchZzfzhsnr: function(oEvent) {
			Util.onSearchZzfzhsnr(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelZzfzhsnrSelect: function(oEvent) {
			this.oDialogZzfzhsnrHelp.close();
		},
		// =================业务类型====================
		// 1.显示odata帮助 
		onShowZzghjhHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogZzghjhHelp) {
				that.oDialogZzghjhHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogZzghjhHelp", that);
				that.getView().addDependent(that.oDialogZzghjhHelp);
			}
			that.oDialogZzghjhHelp.open();
			that.onSearchZzghjh(oEvent);
		},
		// 2.搜索odata帮助
		onSearchZzghjh: function(oEvent) {
			Util.onSearchZzghjh(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelZzghjhSelect: function(oEvent) {
			this.oDialogZzghjhHelp.close();
		},
		// // =================合同编号====================
		// 1.显示odata帮助 
		onShowZzhtbhHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogZzhtbhHelp) {
				that.oDialogZzhtbhHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogZzhtbhHelp", that);
				that.getView().addDependent(that.oDialogZzhtbhHelp);
			}
			that.oDialogZzhtbhHelp.open();
			that.onSearchZzhtbh(oEvent);
		},
		// 2.搜索odata帮助
		onSearchZzhtbh: function(oEvent) {
			Util.onSearchZzhtbh(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelZzhtbhSelect: function(oEvent) {
			this.oDialogZzhtbhHelp.close();
		},
		// =================往来业务性质====================
		// 1.显示odata帮助 
		onShowZzjshkdwHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogZzjshkdwHelp) {
				that.oDialogZzjshkdwHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogZzjshkdwHelp", that);
				that.getView().addDependent(that.oDialogZzjshkdwHelp);
			}
			that.oDialogZzjshkdwHelp.open();
			that.onSearchZzjshkdw(oEvent);
		},
		// 2.搜索odata帮助
		onSearchZzjshkdw: function(oEvent) {
			Util.onSearchZzjshkdw(oEvent, this);
		},
		// 3.选择一行odata数据
		// 4.关闭窗口
		onCancelZzjshkdwSelect: function(oEvent) {
			this.oDialogZzjshkdwHelp.close();
		},
		// ===---------------------------------------------------==
		//approve view xml 
		selectFirstTab: function(that) {
			var items = that.getView().byId("idIconTabBarMulti").getItems();
			for (var i = 0; i < items.length; i++) {
				if (items[i].getVisible()) {
					this.getView().byId("idIconTabBarMulti").setSelectedKey(items[i].getKey());
					return;
				}
			}
		},
		//公司
		onShowBUKRSHelp: function(oEvent){
			// DialogCostConHelp
			var that = this;
			if (!that.oDialogBukrsHelp) {
				that.oDialogBukrsHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogBukrsHelp", that);
				that.getView().addDependent(that.oDialogBukrsHelp);
			}
			that.oDialogBukrsHelp.open();
			that.onSearchBUKRS(oEvent);
		},
		
		onSearchBUKRS: function(oEvent) {
			Util.onSearchBUKRS(oEvent, this);
		},
		
		onCancelBukrsSelect:function(){
			this.oDialogBukrsHelp.close();
		}
	});
});