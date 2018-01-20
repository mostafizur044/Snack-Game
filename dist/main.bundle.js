/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "ad5996387d02a44e48ca"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire("./src/app.ts")(__webpack_require__.s = "./src/app.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes_game__ = __webpack_require__("./src/classes/game.ts");

var game = new __WEBPACK_IMPORTED_MODULE_0__classes_game__["a" /* Game */]();
var startButton = document.getElementById('start-btn');
var stop = document.getElementById('stop');
var newGame = document.getElementById('new-game');
var option = document.querySelector('input[name="option"]:checked');
console.log(option);
startButton.addEventListener("click", function () {
    game.start();
});
stop.addEventListener("click", function () {
    game.stop();
});
newGame.addEventListener("click", function () {
    location.reload();
});


/***/ }),

/***/ "./src/classes/cell.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Cell; });
var Cell = (function () {
    function Cell(x, y) {
        this.x = x;
        this.y = y;
    }
    return Cell;
}());



/***/ }),

/***/ "./src/classes/game.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Game; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__ = __webpack_require__("./src/constants/allConstants.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__grid__ = __webpack_require__("./src/classes/grid.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__worm__ = __webpack_require__("./src/classes/worm.ts");



var Game = (function () {
    function Game() {
        this.score = 0;
        this.running = false;
        this.canvas = document.createElement('Canvas');
        document.getElementById("play-ground").appendChild(this.canvas);
        // canvas element size in the page
        this.canvas.style.width = __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["h" /* WIDTH */] * __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["b" /* CELLSIZE */] + 'px';
        this.canvas.style.height = __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["d" /* HEIGHT */] * __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["b" /* CELLSIZE */] + 'px';
        // image buffer size 
        this.canvas.width = __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["h" /* WIDTH */] * __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["b" /* CELLSIZE */] * __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["f" /* SCALE */];
        this.canvas.height = __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["d" /* HEIGHT */] * __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["b" /* CELLSIZE */] * __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["f" /* SCALE */];
        // configuration
        this.configuration = {
            level: 0,
            speed: __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["g" /* SPEED */],
            width: this.canvas.width,
            height: this.canvas.height,
            nbCellsX: __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["h" /* WIDTH */],
            nbCellsY: __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["d" /* HEIGHT */],
            cellWidth: this.canvas.width / __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["h" /* WIDTH */],
            cellHeight: this.canvas.height / __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["d" /* HEIGHT */],
            color: __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["c" /* COLORS */][0]
        };
        this.worm = new __WEBPACK_IMPORTED_MODULE_2__worm__["a" /* Worm */](this);
        this.grid = new __WEBPACK_IMPORTED_MODULE_1__grid__["a" /* Grid */](this);
        // event listeners
        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
    }
    Game.prototype.start = function () {
        this.nextMove = 0;
        this.running = true;
        requestAnimationFrame(this.loop.bind(this));
    };
    Game.prototype.stop = function () {
        this.running = false;
    };
    Game.prototype.getConfiguration = function () {
        return this.configuration;
    };
    Game.prototype.loop = function (time) {
        if (this.running) {
            requestAnimationFrame(this.loop.bind(this));
            if (time >= this.nextMove) {
                this.nextMove = time + this.configuration.speed;
                // move once
                this.worm.move();
                // check what happened  
                switch (this.checkState()) {
                    case -1:
                        this.die();
                        break;
                    case 1:
                        this.worm.grow();
                        this.score += 100;
                        this.grid.eat(this.worm.getHead());
                        if (this.grid.isDone()) {
                            this.levelUp();
                        }
                    default:
                        // update display
                        this.paint(time);
                }
            }
        }
    };
    Game.prototype.paint = function (time) {
        var _a = this.configuration, width = _a.width, height = _a.height, color = _a.color, level = _a.level;
        var context = this.canvas.getContext("2d");
        // background
        context.fillStyle = color;
        context.fillRect(0, 0, width, height);
        document.getElementById('level').innerText = (1 + level).toLocaleString();
        document.getElementById('score').innerText = this.score.toLocaleString();
        // grid
        this.grid.draw(time, context, __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["c" /* COLORS */][this.configuration.level]);
        // worm
        this.worm.draw(time, context);
    };
    Game.prototype.checkState = function () {
        var cell = this.worm.getHead();
        // left the play area or ate itself?? 
        if (this.isOutside(cell) || this.worm.isWorm(cell)) {
            // dead
            return -1;
        }
        // ate apple?
        if (this.grid.isApple(cell)) {
            return 1;
        }
        // nothing special
        return 0;
    };
    Game.prototype.levelUp = function () {
        this.score += 500;
        this.configuration.level++;
        if (this.configuration.level < __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["e" /* MAX_LEVEL */]) {
            this.configuration.speed -= 8;
            this.configuration.color = __WEBPACK_IMPORTED_MODULE_0__constants_allConstants__["c" /* COLORS */][this.configuration.level];
            this.grid.seed();
        }
        else {
            this.win();
        }
    };
    Game.prototype.win = function () {
        alert("Congrats you beat the game!\r\n\r\nFinal Score: " + this.score);
        this.stop();
    };
    Game.prototype.die = function () {
        document.getElementById('start-btn').style.pointerEvents = 'none';
        alert("You died.\r\n\r\nFinal Score: " + this.score);
        this.stop();
    };
    Game.prototype.isOutside = function (cell) {
        var _a = this.configuration, nbCellsX = _a.nbCellsX, nbCellsY = _a.nbCellsY;
        return cell.x < 0 || cell.x >= nbCellsX || cell.y < 0 || cell.y >= nbCellsY;
    };
    Game.prototype.onKeyDown = function (event) {
        switch (event.key) {
            case 'ArrowUp':
                event.preventDefault();
                this.worm.setDirection('Up');
                break;
            case 'ArrowDown':
                event.preventDefault();
                this.worm.setDirection('Down');
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.worm.setDirection('Left');
                break;
            case 'ArrowRight':
                event.preventDefault();
                this.worm.setDirection('Right');
                break;
        }
    };
    return Game;
}());



/***/ }),

/***/ "./src/classes/grid.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Grid; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cell__ = __webpack_require__("./src/classes/cell.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants_allConstants__ = __webpack_require__("./src/constants/allConstants.ts");


var Grid = (function () {
    function Grid(game) {
        this.game = game;
        this.apples = [];
        this.seed();
    }
    Grid.prototype.seed = function () {
        var _a = this.game.getConfiguration(), nbCellsX = _a.nbCellsX, nbCellsY = _a.nbCellsY, level = _a.level;
        var nbApples = (__WEBPACK_IMPORTED_MODULE_1__constants_allConstants__["a" /* APPLES */] * (level + 1)) - level;
        for (var count = 0; count < nbApples; count++) {
            var x = Math.floor(Math.random() * nbCellsX);
            var y = Math.floor(Math.random() * nbCellsY);
            this.apples.push(new __WEBPACK_IMPORTED_MODULE_0__cell__["a" /* Cell */](x, y));
        }
    };
    Grid.prototype.draw = function (time, context, strokeColor) {
        var _a = this.game.getConfiguration(), width = _a.width, height = _a.height, cellWidth = _a.cellWidth, cellHeight = _a.cellHeight;
        context.fillStyle = '#fff';
        context.lineWidth = 1 * __WEBPACK_IMPORTED_MODULE_1__constants_allConstants__["f" /* SCALE */];
        for (var x = 0; x <= width; x += cellWidth) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, height);
            context.stroke();
            context.strokeStyle = strokeColor;
        }
        for (var y = 0; y <= height; y += cellHeight) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(width, y);
            context.stroke();
        }
        // apples
        context.fillStyle = 'red';
        this.apples.forEach(function (cell) { return context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight); });
    };
    Grid.prototype.isApple = function (cell) {
        return this.apples.find(function (el) { return cell.x == el.x && cell.y == el.y; });
    };
    Grid.prototype.eat = function (cell) {
        this.apples = this.apples.filter(function (el) { return cell.x != el.x || cell.y != el.y; });
    };
    Grid.prototype.isDone = function () {
        return this.apples.length == 0;
    };
    return Grid;
}());



/***/ }),

/***/ "./src/classes/worm.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Worm; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__cell__ = __webpack_require__("./src/classes/cell.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants_allConstants__ = __webpack_require__("./src/constants/allConstants.ts");


var Worm = (function () {
    function Worm(game) {
        this.INITIAL_SIZE = 2;
        this.INITIAL_DIRECTION = 'Right';
        this.INITIAL_POSITION = { x: 1, y: 1 };
        this.game = game;
        this.size = this.INITIAL_SIZE;
        this.directions = [this.INITIAL_DIRECTION];
        // initial head
        this.head = new __WEBPACK_IMPORTED_MODULE_0__cell__["a" /* Cell */](this.INITIAL_POSITION.x, this.INITIAL_POSITION.y);
        // initial tail
        this.tail = [];
    }
    Worm.prototype.setDirection = function (direction) {
        var lastDirection = this.directions[this.directions.length - 1];
        if (lastDirection == 'Up' && (direction == 'Down' || direction == 'Up')) {
            return;
        }
        if (lastDirection == 'Down' && (direction == 'Up' || direction == 'Down')) {
            return;
        }
        if (lastDirection == 'Left' && (direction == 'Right' || direction == 'Left')) {
            return;
        }
        if (lastDirection == 'Right' && (direction == 'Left' || direction == 'Right')) {
            return;
        }
        this.directions.push(direction);
    };
    Worm.prototype.move = function () {
        // add current head to tail
        this.tail.push(this.head);
        // get next position
        this.head = this.getNext();
        // fix the worm size
        if (this.tail.length > this.size) {
            this.tail.splice(0, 1);
        }
    };
    Worm.prototype.getNext = function () {
        var direction = this.directions.length > 1 ? this.directions.splice(0, 1)[0] : this.directions[0];
        switch (direction) {
            case 'Up':
                return new __WEBPACK_IMPORTED_MODULE_0__cell__["a" /* Cell */](this.head.x, this.head.y - 1);
            case 'Right':
                return new __WEBPACK_IMPORTED_MODULE_0__cell__["a" /* Cell */](this.head.x + 1, this.head.y);
            case 'Down':
                return new __WEBPACK_IMPORTED_MODULE_0__cell__["a" /* Cell */](this.head.x, this.head.y + 1);
            case 'Left':
                return new __WEBPACK_IMPORTED_MODULE_0__cell__["a" /* Cell */](this.head.x - 1, this.head.y);
        }
    };
    Worm.prototype.draw = function (time, context) {
        var _a = this.game.getConfiguration(), cellWidth = _a.cellWidth, cellHeight = _a.cellHeight;
        // head
        var size = __WEBPACK_IMPORTED_MODULE_1__constants_allConstants__["b" /* CELLSIZE */] * __WEBPACK_IMPORTED_MODULE_1__constants_allConstants__["f" /* SCALE */] / 10;
        var offset = __WEBPACK_IMPORTED_MODULE_1__constants_allConstants__["b" /* CELLSIZE */] * __WEBPACK_IMPORTED_MODULE_1__constants_allConstants__["f" /* SCALE */] / 3;
        var x = cellWidth * this.head.x;
        var y = cellHeight * this.head.y;
        context.fillStyle = "#111111";
        context.fillRect(x, y, cellWidth, cellHeight);
        // eyes
        switch (this.directions[0]) {
            case 'Up':
                context.beginPath();
                context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
                context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                break;
            case 'Down':
                context.beginPath();
                context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                context.arc(x + 2 * offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                break;
            case 'Right':
                context.beginPath();
                context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);
                context.arc(x + 2 * offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                break;
            case 'Left':
                context.beginPath();
                context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);
                context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);
                context.fillStyle = 'white';
                context.fill();
                break;
        }
        // tail
        context.fillStyle = "#333333";
        this.tail.forEach(function (cell) { return context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight); });
    };
    Worm.prototype.grow = function (qty) {
        if (qty === void 0) { qty = 3; }
        this.size += qty;
    };
    Worm.prototype.shrink = function (qty) {
        if (qty === void 0) { qty = 3; }
        this.size -= qty;
    };
    Worm.prototype.getHead = function () {
        return this.head;
    };
    Worm.prototype.isWorm = function (cell) {
        return this.tail.find(function (el) { return cell.x == el.x && cell.y == el.y; });
    };
    return Worm;
}());



/***/ }),

/***/ "./src/constants/allConstants.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return WIDTH; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return HEIGHT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CELLSIZE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return SCALE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return SPEED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return MAX_LEVEL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APPLES; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return COLORS; });
var WIDTH = 40; // number of squares vertical
// number of squares vertical
var HEIGHT = 30; // number of squares horizontal
// number of squares horizontal
var CELLSIZE = 10; // size of one square 
// size of one square 
var SCALE = 2.0; // draw everything twice as big and make it smaller to get clean lines even on a retina screen 
// draw everything twice as big and make it smaller to get clean lines even on a retina screen 
var SPEED = 130; // initial speed
// initial speed
var MAX_LEVEL = 10;
var APPLES = 3;
// level background colors
var COLORS = [
    '#fafafa',
    '#ffffcc',
    '#ffe6ee',
    '#e6f2ff',
    '#e6ffe6',
    '#fff0e6',
    '#e6e6ff',
    '#f9f2ec',
    '#e6ffe6',
    '#ff4d4d',
];


/***/ })

/******/ });
//# sourceMappingURL=main.bundle.js.map