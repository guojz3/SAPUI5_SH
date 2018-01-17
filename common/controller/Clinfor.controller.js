/*global location*/
sap.ui.define([
	"sh/bz/common/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"sh/bz/common/controller/Formatter",
	"sh/bz/common/controller/Util",
	"sap/ui/core/BusyIndicator",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function(
	BaseController,
	JSONModel,
	History,
	Formatter,
	Util,
	BusyIndicator,
	MessageToast,
	MessageBox
) {
	"use strict";
	var objsDT = [];
	var clxx_num = 0;
	var reg_NO = /^\d+$/; //正整数
	var reg_JE = /^\d+(.\d{2})?$/; //金额
	var reg_PHONE = /^1[35678]\d{9}$|^((0\d{2}-)?\d{8}(-\d{1,4})?)$|^(0\d{3}-\d{7,8}(-\d{1,4})?)$/;
	var we = this;
	var me;
	return BaseController.extend("sh.bz.common.controller.Clinfor", {

		formatter: Formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			we = this;
			this._dynamicctr = [];
			var currentDate = new Date(),
				ddrq = this.byId("IP_Ddrq"),
				cfrq = this.byId("IP_Cfrq");
			ddrq.setMaxDate(currentDate); //设置最大日期不超过今天
			cfrq.setMaxDate(currentDate); //设置最大日期不超过今天
			this.getView().addStyleClass(this.getContentDensityClass());
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("Clinfor").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
			var oViewModel = this.getModel("objectView");
			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/busy", false);

		},
		//出发到达日期设置范围
		setDate: function(oControlEvent) {
			var param = oControlEvent.getParameters(),
				val = param.value.split("."),
				y = Number(val[0]),
				m = Number(val[1]),
				d = Number(val[2]),
				mDate = new Date(y, m - 1, d);
			if (param.id.search("IP_Cfrq") > -1) { //如果是出发日期
				var ddrq = this.byId("IP_Ddrq");
				ddrq.setMinDate(mDate);
			} else { //如果是到达日期
				var cfrq = this.byId("IP_Cfrq");
				cfrq.setMaxDate(mDate);
				if (cfrq._lastValue.length < 1) {
					cfrq.setValue(y + "/" + (m - 1) + "/" + d);
				}
			}
		},
		//小数点
		onTwoAmountsum: function(oEvent) {
			var value = oEvent.getSource().getValue();
			var sum = Formatter.FloatFormat(value);
			oEvent.getSource().setValue(sum);
		},

		//费用金额
		ChangeWrbtr: function(oEvent) {
			this.onTwoAmountsumAndNotNull(oEvent);
			var total = this.getView().getBindingContext().getProperty();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zfpje = String(total.Wrbtr);
			this.getView().getModel().setProperty(path + "Zfpje", Formatter.FloatFormat(Zfpje), true);

		},

		//小数点并且不能为空
		onTwoAmountsumAndNotNull: function(oEvent) {
			this.onTwoAmountsum(oEvent);
			var value = oEvent.getSource().getValue();
			if (parseFloat(value) <= 0) {
				Util.showError("不得为0或负数");
				oEvent.getSource().setValue(null);
			} else {
				var netpr = this.getView().byId("IP_Netpr"), //不含税金额
					netprVal = Number(netpr.getValue()),
					wmwst = this.getView().byId("IP_Wmwst"); //税额
				if (netprVal >= value) {
					netpr.setValue();
					wmwst.setValue();
					return;
				}
				if (netprVal > 0) {
					wmwst.setValue((value - netprVal).toFixed(2));
				}
			}

		},

		//发票金额
		changeZfpje: function(oEvent) {
			this.onTwoAmountsum(oEvent);
			
			//校验发票金额和费用金额的关系
			var value = oEvent.getSource().getValue();
			var Wrbtr = this.getView().byId("IP_Wrbtr");
			if (!Wrbtr) {
				oEvent.getSource().setValue(null);
				Util.showError("请先填写费用金额项");
				return;
			}
			var Netprvalue = Wrbtr.getValue();
			if (Netprvalue) {
				if (Number(value) < Number(Netprvalue)) {
					oEvent.getSource().setValue(null);
					Util.showError("发票金额不得低于费用金额");
					return;
				}
			}

		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("objectView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		/**
		 * Event handler  for navigating back.
		 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function() {
			this.destroy();
			if (this._oldoObject !== undefined) {
				if (JSON.stringify(this._oldoObject) !== "{}") {
					var otable = sap.ui.getCore().CLBX_HOMEVIEW.byId('CLBX_CLXX_table');
					for (var key in this._oldoObject) {
						otable.getModel().setProperty(key, this._oldoObject[key], this.getView().getBindingContext(), true);
					}
					// otable.getModel().setProperty("Einm", this._oldoObject.Einm, this.getView().getBindingContext(), true);
					// otable.getModel().setProperty("Pjzs", this._oldoObject.Pjzs, this.getView().getBindingContext(), true);
				}
			}
			this.clearErrorSateAll(this);
			var sPreviousHash = History.getInstance().getPreviousHash();
			var isInitialNavigation = false;
			if (sap.ushell !== undefined) {
				if (sap.ushell.Container) {
					var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
					isInitialNavigation = oCrossAppNavigator.isInitialNavigation();
				}
			}

			if (sPreviousHash !== undefined || !isInitialNavigation) {
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			this.setscreen(this.getOwnerComponent()._status);
			//add by sunfeng start
			if (this.getView().getModel("CLMODEL") !== undefined) {
				this.getView().setModel(this.getView().getModel("CLMODEL"));
				this.getView().getModel().setRefreshAfterChange();
			}
			if (!sap.ui.getCore().AppContext) {
				this.getRouter().navTo("worklist", {}, true);
				return;
			}
			// if (sap.ui.getCore().AppContext.Bukrs === '9200') {
			// 	this.getView().byId("IP_Aufnr_label").setRequired(true);
			// } else {
			// 	this.getView().byId("IP_Aufnr_label").setRequired(false);
			// }
			// if (sap.ui.getCore().AppContext.Bukrs === '8100') {
			// 	this.getView().byId("IP_Dqlb_label").setRequired(true);
			// } else {
			// 	this.getView().byId("IP_Dqlb_label").setRequired(false);
			// }
			// if (sap.ui.getCore().AppContext.Bukrs === '6102') {
			// 	this.getView().byId("IP_Zzfzhs01_label").setRequired(true);
			// } else {
			// 	this.getView().byId("IP_Zzfzhs01_label").setRequired(false);
			// }
			//add by sunfeng end

			this._entitysaved = undefined;

			var sentityid = oEvent.getParameter("arguments").entityid;
			this.getModel().metadataLoaded().then(function() {
				if (!sentityid) {
					this._entityid = undefined;
					//create
					var posnr = clxx_num += 1;
					var posnr_t = posnr.toString();
					var newData = {
						Posnr: posnr_t
					};
					var oEntry = this.getView().getModel().createEntry("Clbx_itemSet", {
						properties: newData,
						success: function() {},
						error: function() {}
					});
					this.getView().unbindContext();
					this.getView().setBindingContext(oEntry);

					var path = this.getView().getBindingContext().getPath() + "/";
					this.getView().getModel().setProperty(path + "Sfzp", "X", true);
					this.getView().byId("IP_Netpr").setEditable(true);
					this.getView().byId("IP_Wmwst").setEditable(true);
					this.getView().byId("IP_Mwskz").setEditable(true);
					var path = sap.ui.getCore().CLBX_HOMEVIEW.getBindingContext();
					var kostl = sap.ui.getCore().CLBX_HOMEVIEW.getModel().getProperty(path + "/Kostl");
					var ktext = sap.ui.getCore().CLBX_HOMEVIEW.getModel().getProperty(path + "/Ktext");
					var paths = this.getView().getBindingContext().getPath() + "/";
					this.getView().getModel().setProperty(paths + "Kostl", kostl, true);
					this.getView().getModel().setProperty(paths + "Ktext", ktext, true);
				} else {
					// change
					this._entityid = sentityid;
					var spath = "/" + sentityid;
					this.getView().setBindingContext(new sap.ui.model.Context(this.getView().getModel(), spath));
					var Fieldt = this.getView().getBindingContext().getProperty().Zdynamicfield;
					var data = this.getView().getBindingContext().getProperty();
					this._Filedtcl(Fieldt, data);
					// this.getView().bindElement({
					// 	change: this._onBindingChange.bind(this),
					// 	path: spath,
					// 	events: {
					// 		dataRequested: function() {

					// 		},
					// 		dataReceived: function() {}
					// 	}
					// });

					//clone
					this._onBindingChange();
				};

				// var sObjectPath = this.getModel().createKey("Clbx_headerSet", {
				// 	Recode :  sObjectId
				// });
				// this._bindView("/" + sObjectPath);
			}.bind(this));

			//pic
			var oFrame = this.getView().byId("idFrame");
			// var sURI = "http://od2qxv61y.bkt.clouddn.com/zborg.png";
			// oFrame.setContent("<iframe src=" + sURI + " height='700' width='1000' ></iframe>");  
			//oFrame.setContent("<iframe src=" + sURI + "></iframe>");
			//oFrame.setContent("<iframe src=" + sURI + " width:100%;height:100%' ></iframe>");  
		},
		//add by ymz s
		//add for search all s

		//add for search all e
		setscreen: function(status) {
			var that = this;
			// if(status !== undefined){
			// 	var Fieldt = this.getView().getBindingContext().getProperty().Zdynamicfield;
			// }
			// 	editable_IP_ETNAME;
			if (this.getOwnerComponent().getModel("CONTROL") && this.getOwnerComponent().getModel("CONTROL").getProperty("/control") === 'AL') {
				status = 'C';
			};
			if (status === "A" || status === "" || status === "D" || status === "R") {
				//起草
				var sViewinfor = [];
				this.addfiledcontrol(sViewinfor, 'IP_Einm', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_RBGselect', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_Pjzs', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_Mwskz', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_Wrbtr', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_Netpr', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_Note', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_Wmwst', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_Vektp', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_Sps', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_Ctkd', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_ICcts', null, null, true);

				this.addfiledcontrol(sViewinfor, 'IP_Cfrq', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_Ctkd1', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_Ddrq', null, null, true);
				this.addfiledcontrol(sViewinfor, 'IP_Ctkd2', null, null, true);

				this.addfiledcontrol(sViewinfor, 'bt_homesave', true, true, null);
				this.addfiledcontrol(sViewinfor, 'bt_homebackl', true, true, null);

				for (var i = 0; i < sViewinfor.length; i++) {
					if (sViewinfor[i].visible !== null) {
						this.getView().byId(sViewinfor[i].element).setVisible(sViewinfor[i].visible);
					}
					if (sViewinfor[i].enable !== null) {
						this.getView().byId(sViewinfor[i].element).setEnabled(sViewinfor[i].enable);
					}
					if (sViewinfor[i].editable !== null) {
						this.getView().byId(sViewinfor[i].element).setEditable(sViewinfor[i].editable);
					}
				};
			} else if (status === "C" || status === "E") {
				// this.getView().byId("fileUploader").setVisible(false);
				var elements = that.getView().findElements(true);
				for (var i = 0; i < elements.length; i++) {
					if (elements[i].getMetadata().getName() === "sap.m.MultiInput" || elements[i].getMetadata().getName() === "sap.m.Input" ||
						elements[i].getMetadata().getName() === "sap.m.DatePicker" || elements[i].getMetadata().getName() === "sap.m.RadioButtonGroup") {
						elements[i].setEditable(false);
					}
					if (elements[i].getMetadata().getName() === "sap.m.Button") {
						elements[i].setVisible(false);
					}
				}
				// var Fieldt = this.getView().getBindingContext().getProperty().Zdynamicfield;
			}
			this.getView().byId("bt_homebackl").setVisible(true);
		},
		addfiledcontrol: function(sViewinfor, selement, svisible, senable, seditable) {
			var wa = {
				element: selement,
				visible: svisible,
				enable: senable,
				editable: seditable,
			};
			sViewinfor.splice(0, 0, wa);
			return sViewinfor;
		},
		//add by ymz e

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();
			// No data for the binding
			// if (!oElementBinding.getBoundContext()) {
			// 	this.getRouter().getTargets().display("objectNotFound");
			// 	return;
			// }

			this._oldoObject = oView.getBindingContext().getProperty();

		},
		savePressed: function(oEvent) {
			//保存时候的录入数据校验2
			var objs = [];
			if (this.getView().byId("IP_Einm")) {
				objs.push({
					idStr: "IP_Einm", //费用项目
					validNull: true
				});
			}
			if (this.getView().byId("IP_Pjzs")) {
				objs.push({
					idStr: "IP_Pjzs", //票据张数
					validNull: true,
					reg: reg_NO,
					msg: "需输入有效数字"
				});
				objs.push({
					idStr: "IP_Pjzs", //票据张数
					validNull: true,
					reg: /^(0|([1-9]\d{0,2}))$/, //验证数字0-999
					msg: "需输入有效数字，最多999张附件"
				});
			}
			if (this.getView().byId("IP_Wrbtr")) {
				objs.push({
					idStr: "IP_Wrbtr", //金额
					validNull: true,
					reg: reg_JE,
					msg: "需输入有效金额"
				});
			}
			// if (this.getView().byId("IP_Note")) {
			// 	objs.push({
			// 		idStr: "IP_Note", //说明
			// 		validNull: true,
			// 		reg: /^[\w\u4e00-\u9fa5]{0,50}$/, // 限制字数
			// 		msg: "字数限制在50个自符内"
			// 	});
			// }
			if (this.getView().byId("IP_KOSTL")) {
				objs.push({
					idStr: "IP_KOSTL", //成本中心
					validNull: true
				});
			}
			if (this.getView().byId("IP_Zfpje")) {
				objs.push({
					idStr: "IP_Zfpje", //发票金额
					validNull: true
				});
			}
			if (this.getView().byId("IP_RBGselect").getSelectedIndex() === 0) {
				if (this.getView().byId("IP_Mwskz")) {
					objs.push({
						idStr: "IP_Mwskz", //税码
						validNull: true
					});
				}
				if (this.getView().byId("IP_Netpr")) {
					objs.push({
						idStr: "IP_Netpr", //不含税金额
						validNull: true,
						reg: reg_JE,
						msg: "需输入有效金额"
					});
				}
				if (this.getView().byId("IP_Wmwst")) {
					objs.push({
						idStr: "IP_Wmwst", //税额
						validNull: true,
						reg: reg_JE,
						msg: "需输入有效金额"
					});
				}
			}
			if (objsDT.length > 0) {
				for (var i = 0; i < objsDT.length; i++) {
					objs.push(objsDT[i]);
				}
			}

			if (this.validForm(oEvent, this, objs)) {
				return;
			}
			//校验不含税金额”与“税额”总和需等于“金额”项
			if (this.getView().byId("IP_RBGselect").getSelectedIndex() === 0) {
				var a = this.getView().byId("IP_Wrbtr").getValue();
				var b = this.getView().byId("IP_Netpr").getValue();
				var c = this.getView().byId("IP_Wmwst").getValue();
				if (parseFloat(a) !== parseFloat(b) + parseFloat(c)) {
					Util.showError("“不含税金额”与“税额”总和需等于“金额”项");
					this.getView().byId("IP_Netpr").setValueState("Error");
					this.getView().byId("IP_Wmwst").setValueState("Error");
					return;
				}
			}
			//校验“金额”项不能为零
			if (this.getView().byId("IP_Wrbtr").getValue() === 0) {
				Util.showError("请填写有效金额");
				return;
			}

			//if create ,need add a row to table
			if (!this._entityid && !this._entitysaved) {
				var allpages = this.getView().getParent().getPages();
				// for (var i = 0; i < allpages.length; i++) {
				// 	if (allpages[i].sViewName == "sh.bz.clbx.view.Home") {
				// 		var oHomeView = allpages[i];
				// 		var otable = oHomeView.byId("table");
				// 		var otable_item_clone = oHomeView.byId("table_item").clone();
				// 		otable_item_clone.setBindingContext(this.getView().getBindingContext());
				// 		otable.addItem(otable_item_clone);
				// 	}
				// }
				var otable = sap.ui.getCore().CLBX_HOMEVIEW.byId('CLBX_CLXX_table');
				var oHomeView = sap.ui.getCore().CLBX_HOMEVIEW;
				// when clone,if create,
				var otable_item_clone = oHomeView.byId("clbx_clxx_table_item").clone();
				otable_item_clone.setBindingContext(this.getView().getBindingContext());
				otable.addItem(otable_item_clone);

				this._entitysaved = this.getView().getBindingContext().getProperty();
				//this.showMessageall('S','保存成功',"保存并创建记录成功");
				Util.showInfo("保存并创建记录成功");
				this._oldoObject = {};
				// this.destroy();
			} else {
				//this.showMessageall('S','保存成功',"保存成功");
				Util.showInfo("保存成功");
				this._oldoObject = {};
				// this.destroy();
			};
			//if changed ,save auto 

			//this.onNavBack();
		},
		cancelPressed: function() {
			//create or change 
			//create need to deploy entity 
			if (!this._entityid) {
				this.getView().getModel().deleteCreatedEntry(this.getView().getBindingContext());
			} else {
				//var sinfor = this.getDomref(this, 'sh.bz.clbx.view.Home', 'CLBX_CLXX_table');
				var otable = sap.ui.getCore().CLBX_HOMEVIEW.byId('CLBX_CLXX_table');
				var oHomeView = sap.ui.getCore().CLBX_HOMEVIEW;
				otable.getModel().setProperty("Einm", this._oldoObject.Einm, this.getView().getBindingContext(), true);
				//to do 
				// other field need to reset
				// otable.getModel().setProperty("Einm",this._oldoObject.Einm,this.getView().getBindingContext(),true); 
				// otable.getModel().setProperty("Einm",this._oldoObject.Einm,this.getView().getBindingContext(),true); 
				// otable.getModel().setProperty("Einm",this._oldoObject.Einm,this.getView().getBindingContext(),true); 
				// otable.getModel().setProperty("Einm",this._oldoObject.Einm,this.getView().getBindingContext(),true); 
				// otable.getModel().setProperty("Einm",this._oldoObject.Einm,this.getView().getBindingContext(),true); 
				// otable.getModel().setProperty("Einm",this._oldoObject.Einm,this.getView().getBindingContext(),true); 
				// otable.getModel().setProperty("Einm",this._oldoObject.Einm,this.getView().getBindingContext(),true); 

			};

			//change need to reset change
			this.onNavBack();
		},

		ChangeNetpr: function(oEvent) {
			//检查是否填写过金额项
			if (!this.getView().byId("IP_Zfpje").getValue()) {
				Util.showError("请先填写费用金额项");
				oEvent.getSource().setValue(null);
				return;
			}
			// 
			if (parseFloat(oEvent.getSource().getValue()) <= 0) {
				Util.showError("不得为0或负数");
				oEvent.getSource().setValue(null);
				return;
			}
			if (parseFloat(oEvent.getSource().getValue()) > parseFloat(this.getView().byId("IP_Zfpje").getValue())) {
				Util.showError("不得超过金额项");
				oEvent.getSource().setValue(null);
				return;
			}
			if (parseFloat(oEvent.getSource().getValue()) === parseFloat(this.getView().byId("IP_Zfpje").getValue())) {
				Util.showError("税额项不得为0");
				oEvent.getSource().setValue(null);
				return;
			}
			var total = this.getView().getBindingContext().getProperty();
			var path = this.getView().getBindingContext().getPath() + "/";
			if (total.Zfpje === undefined) {
				return;
			} else {
				if (!oEvent.getSource().getValue()) {
					var Netpr = String(total.Zfpje - total.Wmwst);
					this.getView().getModel().setProperty(path + "Netpr", Formatter.FloatFormat(Netpr), true);
				} else {
					var Wmwst = String(total.Zfpje - total.Netpr);
					this.getView().getModel().setProperty(path + "Wmwst", Formatter.FloatFormat(Wmwst), true);
				}
			}
			this.onTwoAmountsum(oEvent);

		},

		changeWmwst: function(oEvent) {
			//检查是否填写过金额项
			if (!this.getView().byId("IP_Zfpje").getValue()) {
				Util.showError("请先填写费用金额项");
				oEvent.getSource().setValue(null);
				// this.onTwoAmountsum(oEvent);
				return;
			}
			// 
			if (parseFloat(oEvent.getSource().getValue()) <= 0) {
				Util.showError("不得为0或负数");
				oEvent.getSource().setValue(null);
				return;
			}
			if (parseFloat(oEvent.getSource().getValue()) > parseFloat(this.getView().byId("IP_Zfpje").getValue())) {
				Util.showError("不得超过金额项");
				oEvent.getSource().setValue(null);
				return;
			}
			if (parseFloat(oEvent.getSource().getValue()) === parseFloat(this.getView().byId("IP_Zfpje").getValue())) {
				Util.showError("不含税金额项不得为0");
				oEvent.getSource().setValue(null);
				return;
			}
			var total = this.getView().getBindingContext().getProperty();
			var path = this.getView().getBindingContext().getPath() + "/";
			if (total.Zfpje === undefined) {
				return;
			} else {
				if (!oEvent.getSource().getValue()) {
					var Wmwst = String(total.Zfpje - total.Netpr);
					this.getView().getModel().setProperty(path + "Wmwst", Formatter.FloatFormat(Wmwst), true);
				} else {
					var Netpr = String(total.Zfpje - total.Wmwst);
					this.getView().getModel().setProperty(path + "Netpr", Formatter.FloatFormat(Netpr), true);
				}
			}
			this.onTwoAmountsum(oEvent);
		},

		changeselect: function(oEvent) {
			var path = this.getView().getBindingContext().getPath() + "/";
			this.getView().byId("IP_Netpr").setValueState("None");
			this.getView().byId("IP_Wmwst").setValueState("None");
			this.getView().byId("IP_Mwskz").setValueState("None");

			if (oEvent.getParameters().selectedIndex === 1) {
				this.getView().byId("IP_Netpr").setEditable(false);
				this.getView().byId("IP_Wmwst").setEditable(false);
				this.getView().byId("IP_Mwskz").setEditable(false);
				this.getView().getModel().setProperty(path + "Netpr", "", true);
				this.getView().getModel().setProperty(path + "Wmwst", "", true);
				this.getView().getModel().setProperty(path + "Mwskz", "", true);
				this.getView().getModel().setProperty(path + "Sfzp", "", true);
				this.getView().getModel().setProperty(path + "Mwskz_Text1", "", true);

				this.getView().byId("IP_Mwskz_label").setRequired(false);
				this.getView().byId("IP_Netpr_label").setRequired(false);
				this.getView().byId("IP_Wmwst_label").setRequired(false);
			} else {
				this.getView().byId("IP_Netpr").setEditable(true);
				this.getView().byId("IP_Wmwst").setEditable(true);
				this.getView().byId("IP_Mwskz").setEditable(true);
				this.getView().getModel().setProperty(path + "Sfzp", "X", true);

				this.getView().byId("IP_Mwskz_label").setRequired(true);
				this.getView().byId("IP_Netpr_label").setRequired(true);
				this.getView().byId("IP_Wmwst_label").setRequired(true);
			}
		},
		//=======================成本中心--------
		onShowKostlHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogCostCenteredHelp) {
				that.oDialogCostCenteredHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogCostCenteredHelp", that);
				that.getView().addDependent(that.oDialogCostCenteredHelp);
			}
			that.oDialogCostCenteredHelp.open();
			that.onSearchPROPOSER_KOSTLed(oEvent);
			// that.onSearchEinm(oEvent);
		},
		onSearchPROPOSER_KOSTLed: function(oEvent) {
			Util.onSearchPROPOSER_KOSTLed(oEvent, this);
		},
		rowSelectedPROPOSER_KOSTLed: function(oEvent) {
			var that = this;
			var sPath = oEvent.getSource().getBindingContext("model_PROPOSER_KOSTLed").getPath();
			this.getView().getModel("model_PROPOSER_KOSTLed").setProperty("/sPath", sPath);
			var path = this.getView().getBindingContext().getPath() + "/";
			var Kostl = this.getView().getModel("model_PROPOSER_KOSTLed").getProperty(sPath + "/" + "Kostl");
			var Ktext = this.getView().getModel("model_PROPOSER_KOSTLed").getProperty(sPath + "/" + "Ktext");
			this.getView().getModel().setProperty(path + "Kostl", Kostl);
			this.getView().getModel().setProperty(path + "Ktext", Ktext);
			var value = Kostl + "|" + Ktext;
			sap.ui.getCore().byId("IP_Kostl").setValue(value);
			var data = {};
			var model = [];
			this.getView().setModel(new sap.ui.model.json.JSONModel(model), "model_PROPOSER");
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_search");
			that.oDialogCostCenteredHelp.close();
		},
		onCancelPartSelected: function(oEvent, that) {
			me.oDialogCostCenteredHelp.close();
		},
		// =================费用项目====================
		// 3.选择一行odata数据
		rowSelectedEinm: function(oEvent, that) {
			// infor.me = this;
			var sPath = oEvent.getSource().getBindingContext("model_Einm").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Einm = this.getView().getModel("model_Einm").getProperty(sPath + "/" + "Einm");
			var Eikd = this.getView().getModel("model_Einm").getProperty(sPath + "/" + "Eikd");
			var Hkont = this.getView().getModel("model_Einm").getProperty(sPath + "/" + "Hkont");
			var url = this.getView().getModel("model_Einm").getProperty(sPath + "/" + "Estpic");
			var Zdynamicfield = this.getView().getModel("model_Einm").getProperty(sPath + "/" + "Fieldt");
			this.getView().getModel().setProperty(path + "Hkont", Hkont);
			this.getView().getModel().setProperty(path + "Einm", Einm);
			this.getView().getModel().setProperty(path + "Eikd", Eikd);
			this.getView().getModel().setProperty(path + "Sfzp", "X");
			this.getView().getModel().setProperty(path + "Zdynamicfield", Zdynamicfield);
			var data = {
				url: url
			};
			if (this.isSupportiFrame()) {

			} else {
				data.width = "100px";
			}
			this.getView().setModel(new sap.ui.model.json.JSONModel(data), "model_show");
			var Fieldt = this.getView().getModel("model_Einm").getProperty(sPath + "/" + "Fieldt");
			me = this;
			//this.getView().byId("Fuzhuhsxx").removeAllContent();
			var that = this;
			//add start
			that.destroy();
			that._Filedtcl(Fieldt);
			//add end
			this.oDialogEinmHelp.close();
		},

		destroy: function() {
			for (var i = 0; i < this._dynamicctr.length; i++) {
				//this.getView().byId("Fuzhuhsxx").removeContent(this._dynamicctr[i].ctr.sId);
				this._dynamicctr[i].ctr.destroy();
				// console.log("11",this.getView().byId("Fuzhuhsxx").getContent());
			}
		},

		_Filedtcl: function(Fieldt, data) {
			objsDT = [];
			var fieldt = JSON.parse(Fieldt);
			var that = this;
			that._dynamicctr = [];
			var wa;
			if (fieldt.length === 1) {
				var code = fieldt[0].code.slice(0, 1) + fieldt[0].code.slice(1).toLocaleLowerCase();
				var core = new sap.ui.core.Title("IP_" + fieldt[0].code + "_title", {
					text: ""
				});
				wa = {
					ctr: core
				};
				this._dynamicctr.splice(0, 0, wa);
				this.getView().byId("Fuzhuhsxx").addContent(core);
				var label = new sap.m.Label("IP_" + code + "_label", {
					text: fieldt[0].laber,
					required: true
				});
				wa = {
					ctr: label
				};
				this._dynamicctr.splice(0, 0, wa);
				this.getView().byId("Fuzhuhsxx").addContent(label);
				var obj = this.getView().byId("Fuzhuhsxx").getBindingContext().getProperty();
				if (obj.Kostl !== undefined) {
					var kostled = obj.Kostl + "|" + obj.Ktext;
				}
				var muti = new sap.m.MultiInput("IP_" + code, {
					//valueHelpRequest: that["onShow"+ code +"Help"],
					valueHelpRequest: function(oEvent) {
						var dynamiccode = oEvent.getSource();
						var method = "onShow" + dynamiccode.sId.substr(3) + "Help";
						that[method].apply(that, Array.prototype.slice.call(arguments, 1));
					},
					valueHelpOnly: true,
					value: kostled
				});
				wa = {
					ctr: muti
				};
				this._dynamicctr.splice(0, 0, wa);
				this.getView().byId("Fuzhuhsxx").addContent(muti);
				var core = new sap.ui.core.Title({
					text: ""
				});
				wa = {
					ctr: core
				};
				this._dynamicctr.splice(0, 0, wa);
				this.getView().byId("Fuzhuhsxx").addContent(core);
			} else {
				for (var i = 0; i < fieldt.length; i++) {
					var code = fieldt[i].code.slice(0, 1) + fieldt[i].code.slice(1).toLocaleLowerCase();
					if (fieldt[i].ktext !== "") {
						if (fieldt[i].ktext.split("_").length === 1) {
							var ktext = fieldt[i].ktext.split("_")[0].slice(0, 1) + fieldt[i].ktext.split("_")[0].slice(1).toLocaleLowerCase();
						} else {
							var ktext = fieldt[i].ktext.split("_")[0].slice(0, 1) + fieldt[i].ktext.split("_")[0].slice(1).toLocaleLowerCase() + "_" +
								fieldt[i].ktext.split("_")[1].slice(0, 1) + fieldt[i].ktext.split("_")[1].slice(1).toLocaleLowerCase();
						}
					}
					if (fieldt[i].key === "A") {
						objsDT.push({
							idStr: "IP_" + code,
							validNull: true
						});
						if (code === "Posid") {
							var core = new sap.ui.core.Title("IP_" + fieldt[i].code + "_title", {
								text: ""
							});
							wa = {
								ctr: core
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(core);
							var label = new sap.m.Label("IP_" + fieldt[i].code + "_label", {
								text: fieldt[i].laber,
								required: true
							});
							wa = {
								ctr: label
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(label);
							var muti = new sap.m.Input("IP_" + fieldt[i].code, {
								value: "{Posid}"
							});
							wa = {
								ctr: muti
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(muti);
						} else if (code === "Kostl") {
							var core = new sap.ui.core.Title("IP_" + fieldt[i].code + "_title", {
								text: ""
							});
							wa = {
								ctr: core
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(core);
							var label = new sap.m.Label("IP_" + code + "_label", {
								text: fieldt[i].laber,
								required: true
							});
							wa = {
								ctr: label
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(label);
							var obj = this.getView().byId("Fuzhuhsxx").getBindingContext().getProperty();
							if (obj.Kostl !== undefined) {
								var kostled = obj.Kostl + "|" + obj.Ktext;
							}
							var muti = new sap.m.MultiInput("IP_" + code, {
								//valueHelpRequest: that["onShow"+ code +"Help"],
								valueHelpRequest: function(oEvent) {
									var dynamiccode = oEvent.getSource();
									var method = "onShow" + dynamiccode.sId.substr(3) + "Help";
									that[method].apply(that, Array.prototype.slice.call(arguments, 1));
								},
								valueHelpOnly: true,
								value: kostled
							});
							wa = {
								ctr: muti
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(muti);
						} else {
							var core = new sap.ui.core.Title("IP_" + fieldt[i].code + "_title", {
								text: ""
							});
							wa = {
								ctr: core
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(core);
							var label = new sap.m.Label("IP_" + code + "_label", {
								text: fieldt[i].laber,
								required: true
							});
							wa = {
								ctr: label
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(label);
							// var obj = this.getView().byId("Fuzhuhsxx").getBindingContext().getProperty();
							var valued = "{code}";
							if (data === undefined) {
								var valued = "";
							} else {
								var valued = data[code] + "|" + data[ktext];
							}
							var muti = new sap.m.MultiInput("IP_" + code, {
								//valueHelpRequest: that["onShow"+ code +"Help"],
								valueHelpRequest: function(oEvent) {
									var dynamiccode = oEvent.getSource();
									var method = "onShow" + dynamiccode.sId.substr(3) + "Help";
									that[method].apply(that, Array.prototype.slice.call(arguments, 1));
								},
								valueHelpOnly: true,
								value: valued
							});
							wa = {
								ctr: muti
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(muti);
						}
					} else if (fieldt[i].key === "C") {
						if (fieldt[i].code === "Posid") {
							var core = new sap.ui.core.Title("IP_" + fieldt[i].code + "_title", {
								text: ""
							});
							wa = {
								ctr: core
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(core);
							var label = new sap.m.Label("IP_" + fieldt[i].code + "_label", {
								text: fieldt[i].laber
							});
							wa = {
								ctr: label
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(label);
							var muti = new sap.m.Input("IP_" + fieldt[i].code, {
								value: "{Posid}"
							});
							wa = {
								ctr: muti
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(muti);
						} else {
							var core = new sap.ui.core.Title("IP_" + fieldt[i].code + "_title", {
								text: ""
							});
							wa = {
								ctr: core
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(core);
							var label = new sap.m.Label("IP_" + fieldt[i].code + "_label", {
								text: fieldt[i].laber
							});
							wa = {
								ctr: label
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(label);
							if (status === undefined || status === "") {
								var valued = "";
							} else {
								var ms = code + "_" + code + "ms";
								var valued = data[code] + "|" + data[ms];
							}
							var muti = new sap.m.MultiInput("IP_" + code, {
								//valueHelpRequest: that["onShow"+ code +"Help"],
								valueHelpRequest: function(oEvent) {
									var dynamiccode = oEvent.getSource();
									var method = "onShow" + dynamiccode.sId.substr(3) + "Help";
									that[method].apply(that, Array.prototype.slice.call(arguments, 1));
								},
								valueHelpOnly: true,
								value: valued
							});
							wa = {
								ctr: muti
							};
							this._dynamicctr.splice(0, 0, wa);
							this.getView().byId("Fuzhuhsxx").addContent(muti);
						}
					}
				}
			}
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
			var that = this;
			if (oEvent === undefined) {
				var value = "";
			} else {
				var value = oEvent.getParameter("query");
			}
			// var value = oEvent.getParameter("query");
			var sPath = "/TaxcodeSet";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Mwskz");
					//按条件搜索
					var obj = {
						id: "Mwskzlist",
						params: ["Mwskz", "Text1"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get TaxcodeSet error!");
					Util.setBusy(false);
				}
			});
		},
		// 3.选择一行odata数据
		rowSelectedMwskz: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Mwskz").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Mwskz = this.getView().getModel("model_Mwskz").getProperty(sPath + "/" + "Mwskz");
			var Mwskz_Text1 = this.getView().getModel("model_Mwskz").getProperty(sPath + "/" + "Text1");
			this.getView().getModel().setProperty(path + "Mwskz", Mwskz);
			this.getView().getModel().setProperty(path + "Mwskz_Text1", Mwskz_Text1);
			this.oDialogMwskzHelp.close();
		},
		// 4.关闭窗口
		onCancelMwskzSelect: function(oEvent) {
			this.oDialogMwskzHelp.close();
		},

		// =================订单====================
		// 1.显示odata帮助 
		onShowAufnrHelp: function(oEvent) {
			var that = this;
			if (!that.oDialogAufnrHelp) {
				that.oDialogAufnrHelp = sap.ui.xmlfragment("sh.bz.common.fragment.DialogAufnrHelp", that);
				that.getView().addDependent(that.oDialogAufnrHelp);
			}
			that.oDialogAufnrHelp.open();
			that.onSearchAufnr(oEvent);
		},
		// 2.搜索odata帮助
		onSearchAufnr: function(oEvent) {
			var that = this;
			if (oEvent === undefined) {
				var value = "";
			} else {
				var value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/AufkSet?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Aufnr");
					//按条件搜索
					var obj = {
						id: "Aufnrlist",
						params: ["Aufnr", "Ktext"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get AufkSet error!");
					Util.setBusy(false);
				}
			});
		},
		// 3.选择一行odata数据
		rowSelectedAufnr: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Aufnr").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Aufnr = this.getView().getModel("model_Aufnr").getProperty(sPath + "/" + "Aufnr");
			var Aufnr_Ktext = this.getView().getModel("model_Aufnr").getProperty(sPath + "/" + "Ktext");
			this.getView().getModel().setProperty(path + "Aufnr", Aufnr);
			this.getView().getModel().setProperty(path + "Aufnr_Ktext", Aufnr_Ktext);
			var value = Aufnr + "|" + Aufnr_Ktext;
			sap.ui.getCore().byId("IP_Aufnr").setValue(value);
			this.oDialogAufnrHelp.close();
		},
		// 4.关闭窗口
		onCancelAufnrSelect: function(oEvent) {
			this.oDialogAufnrHelp.close();
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
			var that = this;
			if (oEvent === undefined) {
				var value = "";
			} else {
				var value = oEvent.getParameter("query");
			}
			var sPath = "/VekSet";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Vektp");
					//按条件搜索
					var obj = {
						id: "Vektplist",
						params: ["Vektp", "Veknm"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get VekSet error!");
					Util.setBusy(false);
				}
			});
		},
		// 3.选择一行odata数据
		rowSelectedVektp: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Vektp").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Vektp = this.getView().getModel("model_Vektp").getProperty(sPath + "/" + "Vektp");
			var Vektp_Veknm = this.getView().getModel("model_Vektp").getProperty(sPath + "/" + "Veknm");
			this.getView().getModel().setProperty(path + "Sps", null);
			this.getView().getModel().setProperty(path + "Sps_Spsdsc", null);
			this.getView().getModel().setProperty(path + "Vektp", Vektp);
			this.getView().getModel().setProperty(path + "Vektp_Veknm", Vektp_Veknm);
			this.oDialogVektpHelp.close();
		},
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
			that.onSearchSps(oEvent);
		},
		// 2.搜索odata帮助
		onSearchSps: function(oEvent) {
			var that = this;
			if (oEvent === undefined) {
				var value = "";
			} else {
				var value = oEvent.getParameter("query");
			}
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
			var sPath = "/VeksSet?$filter=Vektp eq '" + Vektp + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Sps");
					//按条件搜索
					var obj = {
						id: "Spslist",
						params: ["Sps", "Spsdsc"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get VekSet error!");
					Util.setBusy(false);
				}
			});
		},
		// 3.选择一行odata数据
		rowSelectedSps: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Sps").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Sps = this.getView().getModel("model_Sps").getProperty(sPath + "/" + "Sps");
			var Sps_Spsdsc = this.getView().getModel("model_Sps").getProperty(sPath + "/" + "Spsdsc");
			this.getView().getModel().setProperty(path + "Sps", Sps);
			this.getView().getModel().setProperty(path + "Sps_Spsdsc", Sps_Spsdsc);
			this.oDialogSpsHelp.close();
		},
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
			var that = this;
			if (oEvent === undefined) {
				var value = "";
			} else {
				var value = oEvent.getParameter("query");
			}
			var Bukrs = sap.ui.getCore().AppContext.Bukrs;
			var sPath = "/BctSet?$filter=Bukrs eq '" + Bukrs + "'";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Ctkd");
					//按条件搜索
					var obj = {
						id: "Ctkdlist",
						params: ["Ctkd", "Ctnm"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get BctSet error!");
					Util.setBusy(false);
				}
			});
		},
		// 3.选择一行odata数据
		rowSelectedCtkd: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Ctkd").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Ctkd = this.getView().getModel("model_Ctkd").getProperty(sPath + "/" + "Ctkd");
			var Ctkd_Ctnm = this.getView().getModel("model_Ctkd").getProperty(sPath + "/" + "Ctnm");
			this.getView().getModel().setProperty(path + "Ctkd", Ctkd);
			this.getView().getModel().setProperty(path + "Ctkd_Ctnm", Ctkd_Ctnm);
			this.oDialogCtkdHelp.close();
		},
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
			var that = this;
			if (oEvent === undefined) {
				var value = "";
			} else {
				var value = oEvent.getParameter("query");
			}
			var sPath = "/DqlbSet?$filter=substringof('" + (value ? value : '') + "',Zzdqlbms)";
			var oDataModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZFYBX_CLBX_SRV", true);
			Util.setBusy(true);
			oDataModel.read(sPath, {
				success: function(oData, response) {
					var model = new sap.ui.model.json.JSONModel(oData);
					that.getView().setModel(model, "model_Dqlb");
					//按条件搜索
					var obj = {
						id: "Dqlblist",
						params: ["Zzdqlb", "Zzdqlbms"],
						value: value
					};
					that.onFilterSearchBase(that, obj);
					//关闭Busy等待
					Util.setBusy(false);
				},
				error: function(oError) {
					MessageToast.show("get BctSet error!");
					Util.setBusy(false);
				}
			});
		},
		// 3.选择一行odata数据
		rowSelectedDqlb: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Dqlb").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzdqlb = this.getView().getModel("model_Dqlb").getProperty(sPath + "/" + "Zzdqlb");
			var Zzdqlbms = this.getView().getModel("model_Dqlb").getProperty(sPath + "/" + "Zzdqlbms");
			this.getView().getModel().setProperty(path + "Dqlb", Zzdqlb);
			this.getView().getModel().setProperty(path + "Zzdqlbms", Zzdqlbms);
			var value = Zzdqlb + "|" + Zzdqlbms;
			sap.ui.getCore().byId("IP_Zzdqlb").setValue(value);
			this.oDialogDqlbHelp.close();
		},
		// 4.关闭窗口
		onCancelDqlbSelect: function(oEvent) {
			this.oDialogDqlbHelp.close();
		},
		// =================功能范围====================
		// 3.选择一行odata数据
		rowSelectedFkber: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Fkber").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Fkber = this.getView().getModel("model_Fkber").getProperty(sPath + "/" + "Fkber");
			var Fkber_Fkbtx = this.getView().getModel("model_Fkber").getProperty(sPath + "/" + "Fkbtx");
			this.getView().getModel().setProperty(path + "Fkber", Fkber);
			this.getView().getModel().setProperty(path + "Fkber_Fkbtx", Fkber_Fkbtx);
			var value = Fkber + "|" + Fkber_Fkbtx;
			sap.ui.getCore().byId("IP_Fkber").setValue(value);
			this.oDialogFkberHelp.close();
		},
		// =================车型====================
		// 3.选择一行odata数据
		rowSelectedZzcx: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzcx").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzcx = this.getView().getModel("model_Zzcx").getProperty(sPath + "/" + "Zzcx");
			var Zzcx_Zzcxms = this.getView().getModel("model_Zzcx").getProperty(sPath + "/" + "Zzcxms");
			this.getView().getModel().setProperty(path + "Zzcx", Zzcx);
			this.getView().getModel().setProperty(path + "Zzcx_Zzcxms", Zzcx_Zzcxms);
			this.getView().getModel().setProperty(path + "Zzch", null);
			this.getView().getModel().setProperty(path + "Zzch_Zzchms", null);
			var value = Zzcx + "|" + Zzcx_Zzcxms;
			sap.ui.getCore().byId("IP_Zzcx").setValue(value);
			this.oDialogZzcxHelp.close();
		},
		// =================车号====================
		// 3.选择一行odata数据
		rowSelectedZzch: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzch").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzch = this.getView().getModel("model_Zzch").getProperty(sPath + "/" + "Zzch");
			var Zzch_Zzchms = this.getView().getModel("model_Zzch").getProperty(sPath + "/" + "Zzchms");
			this.getView().getModel().setProperty(path + "Zzch", Zzch);
			this.getView().getModel().setProperty(path + "Zzch_Zzchms", Zzch_Zzchms);
			var value = Zzch + "|" + Zzch_Zzchms;
			sap.ui.getCore().byId("IP_Zzch").setValue(value);
			this.oDialogZzchHelp.close();
		},
		// =================分线核算====================
		// 3.选择一行odata数据
		rowSelectedZzfxcb: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzfxcb").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzfxcb = this.getView().getModel("model_Zzfxcb").getProperty(sPath + "/" + "Zzfxcb");
			var Zzfxcb_Zzfxcbms = this.getView().getModel("model_Zzfxcb").getProperty(sPath + "/" + "Zzfxcbms");
			this.getView().getModel().setProperty(path + "Zzfxcb", Zzfxcb);
			this.getView().getModel().setProperty(path + "Zzfxcb_Zzfxcbms", Zzfxcb_Zzfxcbms);
			var value = Zzfxcb + "|" + Zzfxcb_Zzfxcbms;
			sap.ui.getCore().byId("IP_Zzfxcb").setValue(value);
			this.oDialogZzfxcbHelp.close();
		},
		// =================辅助核算01====================
		// 3.选择一行odata数据
		rowSelectedZzfzhs01: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzfzhs01").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzfzhs01 = this.getView().getModel("model_Zzfzhs01").getProperty(sPath + "/" + "Zzfzhs01");
			var Zzfzhs01_Zzfzhs01ms = this.getView().getModel("model_Zzfzhs01").getProperty(sPath + "/" + "Zzfzhs01ms");
			this.getView().getModel().setProperty(path + "Zzfzhs01", Zzfzhs01);
			this.getView().getModel().setProperty(path + "Zzfzhs01_Zzfzhs01ms", Zzfzhs01_Zzfzhs01ms);
			var value = Zzfzhs01 + "|" + Zzfzhs01_Zzfzhs01ms;
			sap.ui.getCore().byId("IP_Zzfzhs01").setValue(value);
			this.oDialogZzfzhs01Help.close();
		},
		// =================辅助核算02====================
		// 3.选择一行odata数据
		rowSelectedZzfzhs02: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzfzhs02").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzfzhs02 = this.getView().getModel("model_Zzfzhs02").getProperty(sPath + "/" + "Zzfzhs02");
			var Zzfzhs02_Zzfzhs02ms = this.getView().getModel("model_Zzfzhs02").getProperty(sPath + "/" + "Zzfzhs02ms");
			this.getView().getModel().setProperty(path + "Zzfzhs02", Zzfzhs02);
			this.getView().getModel().setProperty(path + "Zzfzhs02_Zzfzhs02ms", Zzfzhs02_Zzfzhs02ms);
			var value = Zzfzhs02 + "|" + Zzfzhs02_Zzfzhs02ms;
			sap.ui.getCore().byId("IP_Zzfzhs02").setValue(value);
			this.oDialogZzfzhs02Help.close();
		},
		// =================辅助核算03====================
		// 3.选择一行odata数据
		rowSelectedZzfzhs03: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzfzhs03").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzfzhs03 = this.getView().getModel("model_Zzfzhs03").getProperty(sPath + "/" + "Zzfzhs03");
			var Zzfzhs03_Zzfzhs03ms = this.getView().getModel("model_Zzfzhs03").getProperty(sPath + "/" + "Zzfzhs03ms");
			this.getView().getModel().setProperty(path + "Zzfzhs03", Zzfzhs03);
			this.getView().getModel().setProperty(path + "Zzfzhs03_Zzfzhs03ms", Zzfzhs03_Zzfzhs03ms);
			var value = Zzfzhs03 + "|" + Zzfzhs03_Zzfzhs03ms;
			sap.ui.getCore().byId("IP_Zzfzhs03").setValue(value);
			this.oDialogZzfzhs03Help.close();
		},
		// =================辅助核算04====================
		// 3.选择一行odata数据
		rowSelectedZzfzhs04: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzfzhs04").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzfzhs04 = this.getView().getModel("model_Zzfzhs04").getProperty(sPath + "/" + "Zzfzhs04");
			var Zzfzhs04_Zzfzhs04ms = this.getView().getModel("model_Zzfzhs04").getProperty(sPath + "/" + "Zzfzhs04ms");
			this.getView().getModel().setProperty(path + "Zzfzhs04", Zzfzhs04);
			this.getView().getModel().setProperty(path + "Zzfzhs04_Zzfzhs04ms", Zzfzhs04_Zzfzhs04ms);
			var value = Zzfzhs04 + "|" + Zzfzhs04_Zzfzhs04ms;
			sap.ui.getCore().byId("IP_Zzfzhs04").setValue(value);
			this.oDialogZzfzhs04Help.close();
		},
		// =================辅助核算05====================
		// 3.选择一行odata数据
		rowSelectedZzfzhs05: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzfzhs05").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzfzhs05 = this.getView().getModel("model_Zzfzhs05").getProperty(sPath + "/" + "Zzfzhs05");
			var Zzfzhs05_Zzfzhs05ms = this.getView().getModel("model_Zzfzhs05").getProperty(sPath + "/" + "Zzfzhs05ms");
			this.getView().getModel().setProperty(path + "Zzfzhs05", Zzfzhs05);
			this.getView().getModel().setProperty(path + "Zzfzhs05_Zzfzhs05ms", Zzfzhs05_Zzfzhs05ms);
			var value = Zzfzhs05 + "|" + Zzfzhs05_Zzfzhs05ms;
			sap.ui.getCore().byId("IP_Zzfzhs05").setValue(value);
			this.oDialogZzfzhs05Help.close();
		},
		// =================辅助核算类别====================
		// 3.选择一行odata数据
		rowSelectedZzfzhslb: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzfzhslb").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzfzhslb = this.getView().getModel("model_Zzfzhslb").getProperty(sPath + "/" + "Zzfzhslb");
			var Zzfzhslb_Zzfzhslbms = this.getView().getModel("model_Zzfzhslb").getProperty(sPath + "/" + "Zzfzhslbms");
			this.getView().getModel().setProperty(path + "Zzfzhslb", Zzfzhslb);
			this.getView().getModel().setProperty(path + "Zzfzhslb_Zzfzhslbms", Zzfzhslb_Zzfzhslbms);
			var value = Zzfzhslb + "|" + Zzfzhslb_Zzfzhslbms;
			sap.ui.getCore().byId("IP_Zzfzhslb").setValue(value);
			this.oDialogZzfzhslbHelp.close();
		},
		// =================辅助核算内容====================
		// 3.选择一行odata数据
		rowSelectedZzfzhsnr: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzfzhsnr").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzfzhsnr = this.getView().getModel("model_Zzfzhsnr").getProperty(sPath + "/" + "Zzfzhsnr");
			var Zzfzhsnr_Zzfzhsnrms = this.getView().getModel("model_Zzfzhsnr").getProperty(sPath + "/" + "Zzfzhsnrms");
			this.getView().getModel().setProperty(path + "Zzfzhsnr", Zzfzhsnr);
			this.getView().getModel().setProperty(path + "Zzfzhsnr_Zzfzhsnrms", Zzfzhsnr_Zzfzhsnrms);
			var value = Zzfzhsnr + "|" + Zzfzhsnr_Zzfzhsnrms;
			sap.ui.getCore().byId("IP_Zzfzhsnr").setValue(value);
			this.oDialogZzfzhsnrHelp.close();
		},
		// =================业务类型====================
		// 3.选择一行odata数据
		rowSelectedZzghjh: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzghjh").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzghjh = this.getView().getModel("model_Zzghjh").getProperty(sPath + "/" + "Zzghjh");
			var Zzghjh_Zzghjhms = this.getView().getModel("model_Zzghjh").getProperty(sPath + "/" + "Zzghjhms");
			this.getView().getModel().setProperty(path + "Zzghjh", Zzghjh);
			this.getView().getModel().setProperty(path + "Zzghjh_Zzghjhms", Zzghjh_Zzghjhms);
			var value = Zzghjh + "|" + Zzghjh_Zzghjhms;
			sap.ui.getCore().byId("IP_Zzghjh").setValue(value);
			this.oDialogZzghjhHelp.close();
		},
		// // =================合同编号====================
		// 3.选择一行odata数据
		rowSelectedZzhtbh: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzhtbh").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzhth = this.getView().getModel("model_Zzhtbh").getProperty(sPath + "/" + "Zzhth");
			var Zzhtbh_Zzhtbhms = this.getView().getModel("model_Zzhtbh").getProperty(sPath + "/" + "Zzhthms");
			this.getView().getModel().setProperty(path + "Zzhth", Zzhth);
			this.getView().getModel().setProperty(path + "Zzhtbh_Zzhtbhms", Zzhtbh_Zzhtbhms);
			var value = Zzhth + "|" + Zzhtbh_Zzhtbhms;
			sap.ui.getCore().byId("IP_Zzhth").setValue(value);
			this.oDialogZzhtbhHelp.close();
		},
		// =================往来业务性质====================
		// 3.选择一行odata数据
		rowSelectedZzjshkdw: function(oEvent) {
			var sPath = oEvent.getSource().getBindingContext("model_Zzjshkdw").getPath();
			var path = this.getView().getBindingContext().getPath() + "/";
			var Zzjshkdw = this.getView().getModel("model_Zzjshkdw").getProperty(sPath + "/" + "Zzjshkdw");
			var Zzjshkdw_Zzjshkdwms = this.getView().getModel("model_Zzjshkdw").getProperty(sPath + "/" + "Zzjshkdwms");
			this.getView().getModel().setProperty(path + "Zzjshkdw", Zzjshkdw);
			this.getView().getModel().setProperty(path + "Zzjshkdw_Zzjshkdwms", Zzjshkdw_Zzjshkdwms);
			var value = Zzjshkdw + "|" + Zzjshkdw_Zzjshkdwms;
			sap.ui.getCore().byId("IP_Zzjshkdw").setValue(value);
			this.oDialogZzjshkdwHelp.close();
		},
	});

});