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
/******/ 	var hotCurrentHash = "a5a33bac4a070c3e31a6"; // eslint-disable-line no-unused-vars
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
/******/ 			var chunkId = 1;
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
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst game_1 = __webpack_require__(\"./src/classes/game.ts\");\r\nlet game = new game_1.Game();\r\nfunction startGame() {\r\n    game.start();\r\n}\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvYXBwLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC50cz8wMDg4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7R2FtZX0gZnJvbSAnLi9jbGFzc2VzL2dhbWUnO1xyXG5cclxuXHJcbmxldCBnYW1lID0gbmV3IEdhbWUoKTtcclxuXHJcbmZ1bmN0aW9uIHN0YXJ0R2FtZSgpIHtcclxuICAgIGdhbWUuc3RhcnQoKTtcclxufVxyXG5cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hcHAudHMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFHQTtBQUVBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/app.ts\n");

/***/ }),

/***/ "./src/classes/cell.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass Cell {\r\n    constructor(x, y) {\r\n        this.x = x;\r\n        this.y = y;\r\n    }\r\n}\r\nexports.Cell = Cell;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY2xhc3Nlcy9jZWxsLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NsYXNzZXMvY2VsbC50cz9kNjI1Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBDZWxsIHtcclxuICAgIFxyXG4gICAgICB4Om51bWJlcjtcclxuICAgICAgeTogbnVtYmVyO1xyXG4gICAgICBcclxuICAgICAgY29uc3RydWN0b3IoeDpudW1iZXIsIHk6bnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xhc3Nlcy9jZWxsLnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBOyIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./src/classes/cell.ts\n");

/***/ }),

/***/ "./src/classes/game.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst allConstants_1 = __webpack_require__(\"./src/constants/allConstants.ts\");\r\nconst grid_1 = __webpack_require__(\"./src/classes/grid.ts\");\r\nconst worm_1 = __webpack_require__(\"./src/classes/worm.ts\");\r\nclass Game {\r\n    constructor() {\r\n        this.score = 0;\r\n        this.running = false;\r\n        this.canvas = document.createElement('Canvas');\r\n        document.getElementById(\"play-ground\").appendChild(this.canvas);\r\n        // canvas element size in the page\r\n        this.canvas.style.width = allConstants_1.WIDTH * allConstants_1.CELLSIZE + 'px';\r\n        this.canvas.style.height = allConstants_1.HEIGHT * allConstants_1.CELLSIZE + 'px';\r\n        // image buffer size \r\n        this.canvas.width = allConstants_1.WIDTH * allConstants_1.CELLSIZE * allConstants_1.SCALE;\r\n        this.canvas.height = allConstants_1.HEIGHT * allConstants_1.CELLSIZE * allConstants_1.SCALE;\r\n        // configuration\r\n        this.configuration = {\r\n            level: 0,\r\n            speed: allConstants_1.SPEED,\r\n            width: this.canvas.width,\r\n            height: this.canvas.height,\r\n            nbCellsX: allConstants_1.WIDTH,\r\n            nbCellsY: allConstants_1.HEIGHT,\r\n            cellWidth: this.canvas.width / allConstants_1.WIDTH,\r\n            cellHeight: this.canvas.height / allConstants_1.HEIGHT,\r\n            color: allConstants_1.COLORS[0]\r\n        };\r\n        this.worm = new worm_1.Worm(this);\r\n        this.grid = new grid_1.Grid(this);\r\n        // event listeners\r\n        window.addEventListener('keydown', this.onKeyDown.bind(this), false);\r\n    }\r\n    start() {\r\n        this.nextMove = 0;\r\n        this.running = true;\r\n        requestAnimationFrame(this.loop.bind(this));\r\n    }\r\n    stop() {\r\n        this.running = false;\r\n    }\r\n    getConfiguration() {\r\n        return this.configuration;\r\n    }\r\n    loop(time) {\r\n        if (this.running) {\r\n            requestAnimationFrame(this.loop.bind(this));\r\n            if (time >= this.nextMove) {\r\n                this.nextMove = time + this.configuration.speed;\r\n                // move once\r\n                this.worm.move();\r\n                // check what happened  \r\n                switch (this.checkState()) {\r\n                    case -1:\r\n                        this.die();\r\n                        break;\r\n                    case 1:\r\n                        this.worm.grow();\r\n                        this.score += 100;\r\n                        this.grid.eat(this.worm.getHead());\r\n                        if (this.grid.isDone()) {\r\n                            this.levelUp();\r\n                        }\r\n                    default:\r\n                        // update display\r\n                        this.paint(time);\r\n                }\r\n            }\r\n        }\r\n    }\r\n    paint(time) {\r\n        // const {width, height, color, level} = this.configuration;\r\n        const context = this.canvas.getContext(\"2d\");\r\n        // background\r\n        // context.fillStyle = color;\r\n        // context.fillRect(0,0,width,height);\r\n        // // level\r\n        // context.font = height+'px Arial';\r\n        // context.textBaseline = 'middle';\r\n        // context.textAlign = 'center';\r\n        // context.fillText(level+1, width/2, height/2);\r\n        // // score\r\n        // context.font = 35 * SCALE + 'px Arial';\r\n        // context.textAlign = 'left';\r\n        // context.textBaseline = 'top';\r\n        // context.fillStyle = 'rgba(0,0,0,0.25)';\r\n        // context.fillText(this.score, 10*SCALE, 10*SCALE);\r\n        // grid\r\n        this.grid.draw(time, context);\r\n        // worm\r\n        this.worm.draw(time, context);\r\n    }\r\n    checkState() {\r\n        const cell = this.worm.getHead();\r\n        // left the play area or ate itself?? \r\n        if (this.isOutside(cell) || this.worm.isWorm(cell)) {\r\n            // dead\r\n            return -1;\r\n        }\r\n        // ate apple?\r\n        if (this.grid.isApple(cell)) {\r\n            return 1;\r\n        }\r\n        // nothing special\r\n        return 0;\r\n    }\r\n    levelUp() {\r\n        this.score += 1000;\r\n        this.configuration.level++;\r\n        if (this.configuration.level < allConstants_1.MAX_LEVEL) {\r\n            this.configuration.speed -= 7;\r\n            this.configuration.color = allConstants_1.COLORS[this.configuration.level];\r\n            this.grid.seed();\r\n        }\r\n        else {\r\n            this.win();\r\n        }\r\n    }\r\n    win() {\r\n        alert(\"Congrats you beat the game!\\r\\n\\r\\nFinal Score: \" + this.score);\r\n        this.stop();\r\n    }\r\n    die() {\r\n        alert(\"You died.\\r\\n\\r\\nFinal Score: \" + this.score);\r\n        this.stop();\r\n    }\r\n    isOutside(cell) {\r\n        const { nbCellsX, nbCellsY } = this.configuration;\r\n        return cell.x < 0 || cell.x >= nbCellsX || cell.y < 0 || cell.y >= nbCellsY;\r\n    }\r\n    onKeyDown(event) {\r\n        switch (event.key) {\r\n            case 'ArrowUp':\r\n                event.preventDefault();\r\n                this.worm.setDirection('Up');\r\n                break;\r\n            case 'ArrowDown':\r\n                event.preventDefault();\r\n                this.worm.setDirection('Down');\r\n                break;\r\n            case 'ArrowLeft':\r\n                event.preventDefault();\r\n                this.worm.setDirection('Left');\r\n                break;\r\n            case 'ArrowRight':\r\n                event.preventDefault();\r\n                this.worm.setDirection('Right');\r\n                break;\r\n        }\r\n    }\r\n}\r\nexports.Game = Game;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY2xhc3Nlcy9nYW1lLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NsYXNzZXMvZ2FtZS50cz8wZDk3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2VsbH0gZnJvbSAnLi9jZWxsJztcbmltcG9ydCB7Q0VMTFNJWkUsIFNDQUxFLCBBUFBMRVMsIFdJRFRILCBIRUlHSFQsIFNQRUVELCBNQVhfTEVWRUwsIENPTE9SU30gZnJvbSAnLi4vY29uc3RhbnRzL2FsbENvbnN0YW50cyc7XG5pbXBvcnQge0dyaWR9IGZyb20gJy4vZ3JpZCc7XG5pbXBvcnQge1dvcm19IGZyb20gJy4vd29ybSc7XG5pbXBvcnQge0NvbmZpZ3VyYXRpb259IGZyb20gJy4uL2ludGVyZmFjZXMvY29uZmlndXJhdGlvbic7XG5cblxuXG5leHBvcnQgY2xhc3MgR2FtZSB7XG5cbiAgICBwcml2YXRlIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBzY29yZTpudW1iZXIgPSAwO1xuICAgIHByaXZhdGUgcnVubmluZzogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgZ3JpZDogR3JpZDtcbiAgICBwcml2YXRlIHdvcm06IFdvcm07XG4gICAgcHJpdmF0ZSBjb25maWd1cmF0aW9uOiBDb25maWd1cmF0aW9uOyAgXG4gICAgcHJpdmF0ZSBuZXh0TW92ZTpudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0NhbnZhcycpIGFzIEhUTUxDYW52YXNFbGVtZW50OyAgICBcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwbGF5LWdyb3VuZFwiKS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XG5cbiAgICAgICAgLy8gY2FudmFzIGVsZW1lbnQgc2l6ZSBpbiB0aGUgcGFnZVxuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS53aWR0aCA9IFdJRFRIICogQ0VMTFNJWkUgKyAncHgnO1xuICAgICAgICB0aGlzLmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBIRUlHSFQgKiBDRUxMU0laRSArICdweCc7XG5cbiAgICAgICAgLy8gaW1hZ2UgYnVmZmVyIHNpemUgXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gV0lEVEggKiBDRUxMU0laRSAqIFNDQUxFO1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSBIRUlHSFQgKiBDRUxMU0laRSAqIFNDQUxFO1xuXG4gICAgICAgIC8vIGNvbmZpZ3VyYXRpb25cbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uID0ge1xuICAgICAgICAgICAgbGV2ZWw6IDAsXG4gICAgICAgICAgICBzcGVlZDogU1BFRUQsXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5jYW52YXMud2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuY2FudmFzLmhlaWdodCxcbiAgICAgICAgICAgIG5iQ2VsbHNYOiBXSURUSCxcbiAgICAgICAgICAgIG5iQ2VsbHNZOiBIRUlHSFQsXG4gICAgICAgICAgICBjZWxsV2lkdGg6IHRoaXMuY2FudmFzLndpZHRoIC8gV0lEVEgsXG4gICAgICAgICAgICBjZWxsSGVpZ2h0OiB0aGlzLmNhbnZhcy5oZWlnaHQgLyBIRUlHSFQsXG4gICAgICAgICAgICBjb2xvcjogQ09MT1JTWzBdXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy53b3JtID0gbmV3IFdvcm0odGhpcyk7XG4gICAgICAgIHRoaXMuZ3JpZCA9IG5ldyBHcmlkKHRoaXMpO1xuICAgICAgXG4gICAgICAgIC8vIGV2ZW50IGxpc3RlbmVyc1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMub25LZXlEb3duLmJpbmQodGhpcyksIGZhbHNlKTtcbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5uZXh0TW92ZSA9IDA7XG4gICAgICAgIHRoaXMucnVubmluZyA9IHRydWU7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmxvb3AuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgc3RvcCgpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgfVxuXG4gICAgZ2V0Q29uZmlndXJhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29uZmlndXJhdGlvblxuICAgIH1cblxuICAgIGxvb3AodGltZTpudW1iZXIpIHtcblxuICAgICAgICBpZih0aGlzLnJ1bm5pbmcpIHtcbiAgICAgICAgICBcbiAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5sb29wLmJpbmQodGhpcykpO1xuICAgICAgICAgIFxuICAgICAgICAgIGlmICh0aW1lID49IHRoaXMubmV4dE1vdmUpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICB0aGlzLm5leHRNb3ZlID0gdGltZSArIHRoaXMuY29uZmlndXJhdGlvbi5zcGVlZDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAvLyBtb3ZlIG9uY2VcbiAgICAgICAgICAgICAgdGhpcy53b3JtLm1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIC8vIGNoZWNrIHdoYXQgaGFwcGVuZWQgIFxuICAgICAgICAgICAgICBzd2l0Y2ggKHRoaXMuY2hlY2tTdGF0ZSgpKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlIC0xOlxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGllKCk7XG4gICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy53b3JtLmdyb3coKTtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjb3JlICs9IDEwMDtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdyaWQuZWF0KHRoaXMud29ybS5nZXRIZWFkKCkpO1xuICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuZ3JpZC5pc0RvbmUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sZXZlbFVwKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGUgZGlzcGxheVxuICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGFpbnQodGltZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYWludCh0aW1lOm51bWJlcikge1xuICAgICAgXG4gICAgICAgIC8vIGNvbnN0IHt3aWR0aCwgaGVpZ2h0LCBjb2xvciwgbGV2ZWx9ID0gdGhpcy5jb25maWd1cmF0aW9uO1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgXG4gICAgICAgIC8vIGJhY2tncm91bmRcbiAgICAgICAgLy8gY29udGV4dC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgLy8gY29udGV4dC5maWxsUmVjdCgwLDAsd2lkdGgsaGVpZ2h0KTtcbiAgICAgIFxuICAgICAgICAvLyAvLyBsZXZlbFxuICAgICAgICAvLyBjb250ZXh0LmZvbnQgPSBoZWlnaHQrJ3B4IEFyaWFsJztcbiAgICAgICAgLy8gY29udGV4dC50ZXh0QmFzZWxpbmUgPSAnbWlkZGxlJztcbiAgICAgICAgLy8gY29udGV4dC50ZXh0QWxpZ24gPSAnY2VudGVyJztcbiAgICAgICAgXG4gICAgICAgIC8vIGNvbnRleHQuZmlsbFRleHQobGV2ZWwrMSwgd2lkdGgvMiwgaGVpZ2h0LzIpO1xuICAgICAgXG4gICAgICAgIC8vIC8vIHNjb3JlXG4gICAgICAgIC8vIGNvbnRleHQuZm9udCA9IDM1ICogU0NBTEUgKyAncHggQXJpYWwnO1xuICAgICAgICAvLyBjb250ZXh0LnRleHRBbGlnbiA9ICdsZWZ0JztcbiAgICAgICAgLy8gY29udGV4dC50ZXh0QmFzZWxpbmUgPSAndG9wJztcbiAgICAgICAgLy8gY29udGV4dC5maWxsU3R5bGUgPSAncmdiYSgwLDAsMCwwLjI1KSc7XG4gICAgICAgIC8vIGNvbnRleHQuZmlsbFRleHQodGhpcy5zY29yZSwgMTAqU0NBTEUsIDEwKlNDQUxFKTtcblxuICAgICAgICAvLyBncmlkXG4gICAgICAgIHRoaXMuZ3JpZC5kcmF3KHRpbWUsIGNvbnRleHQpO1xuICAgICAgICAvLyB3b3JtXG4gICAgICAgIHRoaXMud29ybS5kcmF3KHRpbWUsIGNvbnRleHQpO1xuICAgIH1cblxuICAgIGNoZWNrU3RhdGUoKSB7XG5cbiAgICAgICAgY29uc3QgY2VsbCA9IHRoaXMud29ybS5nZXRIZWFkKCk7XG5cbiAgICAgICAgLy8gbGVmdCB0aGUgcGxheSBhcmVhIG9yIGF0ZSBpdHNlbGY/PyBcbiAgICAgICAgaWYgKHRoaXMuaXNPdXRzaWRlKGNlbGwpIHx8IHRoaXMud29ybS5pc1dvcm0oY2VsbCkpIHtcbiAgICAgICAgICAgIC8vIGRlYWRcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGF0ZSBhcHBsZT9cbiAgICAgICAgaWYgKHRoaXMuZ3JpZC5pc0FwcGxlKGNlbGwpKSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIG5vdGhpbmcgc3BlY2lhbFxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gIFxuICAgIGxldmVsVXAoKSB7XG4gICAgICB0aGlzLnNjb3JlICs9IDEwMDA7XG4gICAgICB0aGlzLmNvbmZpZ3VyYXRpb24ubGV2ZWwrKztcbiAgICAgIGlmKHRoaXMuY29uZmlndXJhdGlvbi5sZXZlbCA8IE1BWF9MRVZFTCkge1xuICAgICAgICB0aGlzLmNvbmZpZ3VyYXRpb24uc3BlZWQgLT0gNztcbiAgICAgICAgdGhpcy5jb25maWd1cmF0aW9uLmNvbG9yID0gQ09MT1JTW3RoaXMuY29uZmlndXJhdGlvbi5sZXZlbF07XG4gICAgICAgIHRoaXMuZ3JpZC5zZWVkKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLndpbigpO1xuICAgICAgfVxuICAgIH1cbiAgXG4gICAgd2luKCkge1xuICAgICAgYWxlcnQoXCJDb25ncmF0cyB5b3UgYmVhdCB0aGUgZ2FtZSFcXHJcXG5cXHJcXG5GaW5hbCBTY29yZTogXCIgKyB0aGlzLnNjb3JlKTtcbiAgICAgIHRoaXMuc3RvcCgpOyAgICAgICBcbiAgICB9XG4gIFxuICAgIGRpZSgpIHtcbiAgICAgIGFsZXJ0KFwiWW91IGRpZWQuXFxyXFxuXFxyXFxuRmluYWwgU2NvcmU6IFwiICsgdGhpcy5zY29yZSk7XG4gICAgICB0aGlzLnN0b3AoKTtcbiAgICB9XG5cbiAgICBpc091dHNpZGUoY2VsbDogQ2VsbCkge1xuICAgICAgICBjb25zdCB7IG5iQ2VsbHNYLCBuYkNlbGxzWSB9ID0gdGhpcy5jb25maWd1cmF0aW9uO1xuICAgICAgICByZXR1cm4gY2VsbC54IDwgMCB8fCBjZWxsLnggPj0gbmJDZWxsc1ggfHwgY2VsbC55IDwgMCB8fCBjZWxsLnkgPj0gbmJDZWxsc1k7XG4gICAgfVxuICBcbiAgIG9uS2V5RG93bihldmVudDpLZXlib2FyZEV2ZW50KSB7XG4gICAgICAgc3dpdGNoKGV2ZW50LmtleSkge1xuICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgIHRoaXMud29ybS5zZXREaXJlY3Rpb24oJ1VwJyk7XG4gICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgdGhpcy53b3JtLnNldERpcmVjdGlvbignRG93bicpO1xuICAgICAgICAgICBicmVhaztcbiAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgIHRoaXMud29ybS5zZXREaXJlY3Rpb24oJ0xlZnQnKTtcbiAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgdGhpcy53b3JtLnNldERpcmVjdGlvbignUmlnaHQnKTtcbiAgICAgICAgICAgYnJlYWs7XG4gICAgICAgfVxuICAgIH1cbiAgXG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xhc3Nlcy9nYW1lLnRzIl0sIm1hcHBpbmdzIjoiOztBQUNBO0FBQ0E7QUFDQTtBQUtBO0FBVUE7QUFQQTtBQUNBO0FBUUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQTFMQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/classes/game.ts\n");

/***/ }),

/***/ "./src/classes/grid.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst cell_1 = __webpack_require__(\"./src/classes/cell.ts\");\r\nconst allConstants_1 = __webpack_require__(\"./src/constants/allConstants.ts\");\r\nclass Grid {\r\n    constructor(game) {\r\n        this.game = game;\r\n        this.apples = [];\r\n        this.seed();\r\n    }\r\n    seed() {\r\n        const { nbCellsX, nbCellsY, level } = this.game.getConfiguration();\r\n        const nbApples = allConstants_1.APPLES * (level + 1);\r\n        for (let count = 0; count < nbApples; count++) {\r\n            let x = Math.floor(Math.random() * nbCellsX);\r\n            let y = Math.floor(Math.random() * nbCellsY);\r\n            this.apples.push(new cell_1.Cell(x, y));\r\n        }\r\n    }\r\n    draw(time, context) {\r\n        const { width, height, cellWidth, cellHeight } = this.game.getConfiguration();\r\n        context.fillStyle = 'black';\r\n        context.lineWidth = 1 * allConstants_1.SCALE;\r\n        for (let x = 0; x <= width; x += cellWidth) {\r\n            context.beginPath();\r\n            context.moveTo(x, 0);\r\n            context.lineTo(x, height);\r\n            context.stroke();\r\n        }\r\n        for (let y = 0; y <= height; y += cellHeight) {\r\n            context.beginPath();\r\n            context.moveTo(0, y);\r\n            context.lineTo(width, y);\r\n            context.stroke();\r\n        }\r\n        // apples\r\n        context.fillStyle = 'red';\r\n        this.apples.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));\r\n    }\r\n    isApple(cell) {\r\n        return this.apples.find(el => cell.x == el.x && cell.y == el.y);\r\n    }\r\n    eat(cell) {\r\n        this.apples = this.apples.filter(el => cell.x != el.x || cell.y != el.y);\r\n    }\r\n    isDone() {\r\n        return this.apples.length == 0;\r\n    }\r\n}\r\nexports.Grid = Grid;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY2xhc3Nlcy9ncmlkLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NsYXNzZXMvZ3JpZC50cz85ZDU1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2VsbH0gZnJvbSAnLi9jZWxsJztcclxuaW1wb3J0IHtDRUxMU0laRSwgU0NBTEUsIEFQUExFU30gZnJvbSAnLi4vY29uc3RhbnRzL2FsbENvbnN0YW50cyc7XHJcbmltcG9ydCB7R2FtZX0gZnJvbSAnLi9nYW1lJztcclxuXHJcblxyXG5cclxuZXhwb3J0IGNsYXNzIEdyaWQge1xyXG4gICAgXHJcbiAgICAgICAgcHJpdmF0ZSBnYW1lOiBHYW1lO1xyXG4gICAgICAgIHByaXZhdGUgYXBwbGVzOiBDZWxsW107XHJcbiAgICBcclxuICAgICAgICBjb25zdHJ1Y3RvcihnYW1lOiBHYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZSA9IGdhbWU7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwbGVzID0gW107ICAgICBcclxuICAgICAgICAgICAgdGhpcy5zZWVkKCk7IFxyXG4gICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgc2VlZCgpIHtcclxuICAgICAgICAgICBjb25zdCB7IG5iQ2VsbHNYICwgbmJDZWxsc1ksIGxldmVsfSA9IHRoaXMuZ2FtZS5nZXRDb25maWd1cmF0aW9uKCk7XHJcbiAgICAgICAgICAgY29uc3QgbmJBcHBsZXMgPSBBUFBMRVMgKiAobGV2ZWwgKyAxKSA7XHJcbiAgICAgICAgICAgZm9yIChsZXQgY291bnQgPSAwOyAgY291bnQgPCBuYkFwcGxlczsgY291bnQrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBuYkNlbGxzWCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG5iQ2VsbHNZKTsgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcGxlcy5wdXNoKG5ldyBDZWxsKHgsIHkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGRyYXcodGltZTpudW1iZXIsIGNvbnRleHQ6Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XHJcbiAgICBcclxuICAgICAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0LCBjZWxsV2lkdGgsIGNlbGxIZWlnaHQgfSA9IHRoaXMuZ2FtZS5nZXRDb25maWd1cmF0aW9uKCk7XHJcbiAgICBcclxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgICAgICAgICBjb250ZXh0LmxpbmVXaWR0aCA9IDEgKiBTQ0FMRTtcclxuICAgIFxyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8PSB3aWR0aDsgeCArPSBjZWxsV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbyh4LCAwKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHgsIGhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPD0gaGVpZ2h0OyB5ICs9IGNlbGxIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0Lm1vdmVUbygwLCB5KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHdpZHRoLCB5KTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgICAgICAvLyBhcHBsZXNcclxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAncmVkJztcclxuICAgICAgICAgICAgdGhpcy5hcHBsZXMuZm9yRWFjaChjZWxsID0+IGNvbnRleHQuZmlsbFJlY3QoY2VsbFdpZHRoICogY2VsbC54LCBjZWxsSGVpZ2h0ICogY2VsbC55LCBjZWxsV2lkdGgsIGNlbGxIZWlnaHQpKTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBpc0FwcGxlKGNlbGw6IENlbGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXBwbGVzLmZpbmQoZWwgPT4gY2VsbC54ID09IGVsLnggJiYgY2VsbC55ID09IGVsLnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgZWF0KGNlbGw6IENlbGwpIHtcclxuICAgICAgICAgICAgdGhpcy5hcHBsZXMgPSB0aGlzLmFwcGxlcy5maWx0ZXIoZWwgPT4gY2VsbC54ICE9IGVsLnggfHwgY2VsbC55ICE9IGVsLnkpXHJcbiAgICAgICAgfVxyXG4gICAgICBcclxuICAgICAgICBpc0RvbmUoKSB7XHJcbiAgICAgICAgICByZXR1cm4gdGhpcy5hcHBsZXMubGVuZ3RoID09IDA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jbGFzc2VzL2dyaWQudHMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUtBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQTFEQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/classes/grid.ts\n");

/***/ }),

/***/ "./src/classes/worm.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst cell_1 = __webpack_require__(\"./src/classes/cell.ts\");\r\nconst allConstants_1 = __webpack_require__(\"./src/constants/allConstants.ts\");\r\nclass Worm {\r\n    constructor(game) {\r\n        this.INITIAL_SIZE = 3;\r\n        this.INITIAL_DIRECTION = 'Right';\r\n        this.INITIAL_POSITION = { x: 1, y: 1 };\r\n        this.game = game;\r\n        this.size = this.INITIAL_SIZE;\r\n        this.directions = [this.INITIAL_DIRECTION];\r\n        // initial head\r\n        this.head = new cell_1.Cell(this.INITIAL_POSITION.x, this.INITIAL_POSITION.y);\r\n        // initial tail\r\n        this.tail = [];\r\n    }\r\n    setDirection(direction) {\r\n        const lastDirection = this.directions[this.directions.length - 1];\r\n        if (lastDirection == 'Up' && (direction == 'Down' || direction == 'Up')) {\r\n            return;\r\n        }\r\n        if (lastDirection == 'Down' && (direction == 'Up' || direction == 'Down')) {\r\n            return;\r\n        }\r\n        if (lastDirection == 'Left' && (direction == 'Right' || direction == 'Left')) {\r\n            return;\r\n        }\r\n        if (lastDirection == 'Right' && (direction == 'Left' || direction == 'Right')) {\r\n            return;\r\n        }\r\n        this.directions.push(direction);\r\n    }\r\n    move() {\r\n        // add current head to tail\r\n        this.tail.push(this.head);\r\n        // get next position\r\n        this.head = this.getNext();\r\n        // fix the worm size\r\n        if (this.tail.length > this.size) {\r\n            this.tail.splice(0, 1);\r\n        }\r\n    }\r\n    getNext() {\r\n        const direction = this.directions.length > 1 ? this.directions.splice(0, 1)[0] : this.directions[0];\r\n        switch (direction) {\r\n            case 'Up':\r\n                return new cell_1.Cell(this.head.x, this.head.y - 1);\r\n            case 'Right':\r\n                return new cell_1.Cell(this.head.x + 1, this.head.y);\r\n            case 'Down':\r\n                return new cell_1.Cell(this.head.x, this.head.y + 1);\r\n            case 'Left':\r\n                return new cell_1.Cell(this.head.x - 1, this.head.y);\r\n        }\r\n    }\r\n    draw(time, context) {\r\n        const { cellWidth, cellHeight } = this.game.getConfiguration();\r\n        // head\r\n        const size = allConstants_1.CELLSIZE * allConstants_1.SCALE / 10;\r\n        const offset = allConstants_1.CELLSIZE * allConstants_1.SCALE / 3;\r\n        const x = cellWidth * this.head.x;\r\n        const y = cellHeight * this.head.y;\r\n        context.fillStyle = \"#111111\";\r\n        context.fillRect(x, y, cellWidth, cellHeight);\r\n        // eyes\r\n        switch (this.directions[0]) {\r\n            case 'Up':\r\n                context.beginPath();\r\n                context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);\r\n                context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);\r\n                context.fillStyle = 'white';\r\n                context.fill();\r\n                break;\r\n            case 'Down':\r\n                context.beginPath();\r\n                context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);\r\n                context.arc(x + 2 * offset, y + 2 * offset, size, 0, 2 * Math.PI, false);\r\n                context.fillStyle = 'white';\r\n                context.fill();\r\n                break;\r\n            case 'Right':\r\n                context.beginPath();\r\n                context.arc(x + 2 * offset, y + offset, size, 0, 2 * Math.PI, false);\r\n                context.arc(x + 2 * offset, y + 2 * offset, size, 0, 2 * Math.PI, false);\r\n                context.fillStyle = 'white';\r\n                context.fill();\r\n                break;\r\n            case 'Left':\r\n                context.beginPath();\r\n                context.arc(x + offset, y + offset, size, 0, 2 * Math.PI, false);\r\n                context.arc(x + offset, y + 2 * offset, size, 0, 2 * Math.PI, false);\r\n                context.fillStyle = 'white';\r\n                context.fill();\r\n                break;\r\n        }\r\n        // tail\r\n        context.fillStyle = \"#333333\";\r\n        this.tail.forEach(cell => context.fillRect(cellWidth * cell.x, cellHeight * cell.y, cellWidth, cellHeight));\r\n    }\r\n    grow(qty = 3) {\r\n        this.size += qty;\r\n    }\r\n    shrink(qty = 3) {\r\n        this.size -= qty;\r\n    }\r\n    getHead() {\r\n        return this.head;\r\n    }\r\n    isWorm(cell) {\r\n        return this.tail.find(el => cell.x == el.x && cell.y == el.y);\r\n    }\r\n}\r\nexports.Worm = Worm;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY2xhc3Nlcy93b3JtLnRzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vc3JjL2NsYXNzZXMvd29ybS50cz85ZDE3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q2VsbH0gZnJvbSAnLi9jZWxsJztcclxuaW1wb3J0IHtDRUxMU0laRSwgU0NBTEV9IGZyb20gJy4uL2NvbnN0YW50cy9hbGxDb25zdGFudHMnO1xyXG5pbXBvcnQge0dhbWV9IGZyb20gJy4vZ2FtZSc7XHJcblxyXG5cclxudHlwZSBEaXJlY3Rpb24gPSAnVXAnIHwgJ1JpZ2h0JyB8ICdMZWZ0JyB8ICdEb3duJztcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JtIHtcclxuICAgIFxyXG4gICAgICAgIHJlYWRvbmx5IElOSVRJQUxfU0laRSA9IDM7XHJcbiAgICAgICAgcmVhZG9ubHkgSU5JVElBTF9ESVJFQ1RJT04gPSAnUmlnaHQnO1xyXG4gICAgICAgIHJlYWRvbmx5IElOSVRJQUxfUE9TSVRJT04gPSB7IHg6IDEsIHk6IDEgfTtcclxuICAgIFxyXG4gICAgICAgIHByaXZhdGUgaGVhZDogQ2VsbDtcclxuICAgICAgICBwcml2YXRlIHRhaWw6IENlbGxbXTtcclxuICAgICAgICBwcml2YXRlIGRpcmVjdGlvbnM6IERpcmVjdGlvbltdO1xyXG4gICAgICAgIHByaXZhdGUgc2l6ZTogbnVtYmVyO1xyXG4gICAgICAgIHByaXZhdGUgZ2FtZTogR2FtZTtcclxuICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGdhbWU6R2FtZSkge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWUgPSBnYW1lO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnNpemUgPSB0aGlzLklOSVRJQUxfU0laRTtcclxuICAgICAgICAgICAgdGhpcy5kaXJlY3Rpb25zID0gW3RoaXMuSU5JVElBTF9ESVJFQ1RJT05dO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gaW5pdGlhbCBoZWFkXHJcbiAgICAgICAgICAgIHRoaXMuaGVhZCA9IG5ldyBDZWxsKHRoaXMuSU5JVElBTF9QT1NJVElPTi54LCB0aGlzLklOSVRJQUxfUE9TSVRJT04ueSk7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gaW5pdGlhbCB0YWlsXHJcbiAgICAgICAgICAgIHRoaXMudGFpbCA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgXHJcbiAgICAgICAgc2V0RGlyZWN0aW9uKGRpcmVjdGlvbjpEaXJlY3Rpb24pIHtcclxuICAgICAgICAgICAgY29uc3QgbGFzdERpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9uc1t0aGlzLmRpcmVjdGlvbnMubGVuZ3RoLTFdO1xyXG4gICAgICAgICAgICBpZihsYXN0RGlyZWN0aW9uID09ICdVcCcgJiYgKGRpcmVjdGlvbiA9PSAnRG93bicgfHwgZGlyZWN0aW9uID09ICdVcCcpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGxhc3REaXJlY3Rpb24gPT0gJ0Rvd24nICYmIChkaXJlY3Rpb24gPT0gJ1VwJyB8fCBkaXJlY3Rpb24gPT0gJ0Rvd24nKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihsYXN0RGlyZWN0aW9uID09ICdMZWZ0JyAmJiAoZGlyZWN0aW9uID09ICdSaWdodCcgfHwgZGlyZWN0aW9uID09ICdMZWZ0JykpIHtcclxuICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYobGFzdERpcmVjdGlvbiA9PSAnUmlnaHQnICYmIChkaXJlY3Rpb24gPT0gJ0xlZnQnIHx8IGRpcmVjdGlvbiA9PSAnUmlnaHQnKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRpcmVjdGlvbnMucHVzaChkaXJlY3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIG1vdmUoKSB7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gYWRkIGN1cnJlbnQgaGVhZCB0byB0YWlsXHJcbiAgICAgICAgICAgIHRoaXMudGFpbC5wdXNoKHRoaXMuaGVhZCk7XHJcbiAgICBcclxuICAgICAgICAgICAgLy8gZ2V0IG5leHQgcG9zaXRpb25cclxuICAgICAgICAgICAgdGhpcy5oZWFkID0gdGhpcy5nZXROZXh0KCk7XHJcbiAgICBcclxuICAgICAgICAgICAgLy8gZml4IHRoZSB3b3JtIHNpemVcclxuICAgICAgICAgICAgaWYgKHRoaXMudGFpbC5sZW5ndGggPiB0aGlzLnNpemUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFpbC5zcGxpY2UoMCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBnZXROZXh0KCk6Q2VsbCB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHRoaXMuZGlyZWN0aW9ucy5sZW5ndGggPiAxID8gdGhpcy5kaXJlY3Rpb25zLnNwbGljZSgwLDEpWzBdIDogdGhpcy5kaXJlY3Rpb25zWzBdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnVXAnOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ2VsbCh0aGlzLmhlYWQueCwgdGhpcy5oZWFkLnkgLSAxKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1JpZ2h0JzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENlbGwodGhpcy5oZWFkLngrMSwgdGhpcy5oZWFkLnkpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnRG93bic6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDZWxsKHRoaXMuaGVhZC54LCB0aGlzLmhlYWQueSArIDEpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnTGVmdCc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDZWxsKHRoaXMuaGVhZC54LTEsIHRoaXMuaGVhZC55KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGRyYXcodGltZTogbnVtYmVyLCBjb250ZXh0OkNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xyXG4gICAgICAgICAgICBjb25zdCB7IGNlbGxXaWR0aCwgY2VsbEhlaWdodCB9ID0gdGhpcy5nYW1lLmdldENvbmZpZ3VyYXRpb24oKTtcclxuICAgICAgICAgICAgLy8gaGVhZFxyXG4gICAgICAgICAgICBjb25zdCBzaXplID0gQ0VMTFNJWkUqU0NBTEUvMTA7XHJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IENFTExTSVpFKlNDQUxFLzM7XHJcbiAgICAgICAgICAgIGNvbnN0IHggPSBjZWxsV2lkdGggKiB0aGlzLmhlYWQueDtcclxuICAgICAgICAgICAgY29uc3QgeSA9IGNlbGxIZWlnaHQgKiB0aGlzLmhlYWQueTtcclxuICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGU9XCIjMTExMTExXCI7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoeCwgeSwgY2VsbFdpZHRoLCBjZWxsSGVpZ2h0KSBcclxuICAgICAgICAgICAgLy8gZXllc1xyXG4gICAgICAgICAgICBzd2l0Y2godGhpcy5kaXJlY3Rpb25zWzBdKSB7XHJcbiAgICAgICAgICAgICAgY2FzZSAnVXAnOlxyXG4gICAgICAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICAgY29udGV4dC5hcmMoeCArIG9mZnNldCwgeSArIG9mZnNldCwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICBjb250ZXh0LmFyYyh4ICsgMiAqIG9mZnNldCwgeSArIG9mZnNldCwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcbiAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0Rvd24nOlxyXG4gICAgICAgICAgICAgICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgICAgICAgY29udGV4dC5hcmMoeCArIG9mZnNldCwgeSArIDIqb2Zmc2V0LCBzaXplLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgIGNvbnRleHQuYXJjKHggKyAyICogb2Zmc2V0LCB5ICsgMipvZmZzZXQsIHNpemUsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdSaWdodCc6XHJcbiAgICAgICAgICAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgICBjb250ZXh0LmFyYyh4ICsgMiAqIG9mZnNldCwgeSArIG9mZnNldCwgc2l6ZSwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICBjb250ZXh0LmFyYyh4ICsgMiAqIG9mZnNldCwgeSArIDIgKiBvZmZzZXQsIHNpemUsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdMZWZ0JzpcclxuICAgICAgICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgIGNvbnRleHQuYXJjKHggKyBvZmZzZXQsIHkgKyBvZmZzZXQsIHNpemUsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgY29udGV4dC5hcmMoeCArIG9mZnNldCwgeSArIDIgKiBvZmZzZXQsIHNpemUsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG4gICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdGFpbFxyXG4gICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZT1cIiMzMzMzMzNcIjtcclxuICAgICAgICAgICAgdGhpcy50YWlsLmZvckVhY2goY2VsbCA9PiBjb250ZXh0LmZpbGxSZWN0KGNlbGxXaWR0aCAqIGNlbGwueCwgY2VsbEhlaWdodCAqIGNlbGwueSwgY2VsbFdpZHRoLCBjZWxsSGVpZ2h0KSk7ICAgIFxyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGdyb3cocXR5Om51bWJlciA9IDMpIHtcclxuICAgICAgICAgICAgdGhpcy5zaXplICs9IHF0eTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBzaHJpbmsocXR5Om51bWJlciA9IDMpIHtcclxuICAgICAgICAgICAgdGhpcy5zaXplIC09IHF0eTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICBnZXRIZWFkKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oZWFkO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGlzV29ybShjZWxsOiBDZWxsKSB7XHJcbiAgICAgICAgICAgICByZXR1cm4gdGhpcy50YWlsLmZpbmQoZWwgPT4gY2VsbC54ID09IGVsLnggJiYgY2VsbC55ID09IGVsLnkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xhc3Nlcy93b3JtLnRzIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFNQTtBQVlBO0FBVkE7QUFDQTtBQUNBO0FBU0E7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUNBO0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQWxJQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/classes/worm.ts\n");

/***/ }),

/***/ "./src/constants/allConstants.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.WIDTH = 40; // number of squares vertical\r\nexports.HEIGHT = 40; // number of squares horizontal\r\nexports.CELLSIZE = 10; // size of one square \r\nexports.SCALE = 2.0; // draw everything twice as big and make it smaller to get clean lines even on a retina screen \r\nexports.SPEED = 100; // initial speed\r\nexports.MAX_LEVEL = 10;\r\nexports.APPLES = 5;\r\n// level background colors\r\nexports.COLORS = [\r\n    '#fafafa',\r\n    '#ffffcc',\r\n    '#ffe6ee',\r\n    '#e6f2ff',\r\n    '#e6ffe6',\r\n    '#fff0e6',\r\n    '#e6e6ff',\r\n    '#f9f2ec',\r\n    '#e6ffe6',\r\n    '#ff4d4d',\r\n];\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvY29uc3RhbnRzL2FsbENvbnN0YW50cy50cy5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy9jb25zdGFudHMvYWxsQ29uc3RhbnRzLnRzP2E4ZDAiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFdJRFRIID0gNDA7IC8vIG51bWJlciBvZiBzcXVhcmVzIHZlcnRpY2FsXHJcbmV4cG9ydCBjb25zdCBIRUlHSFQgPSA0MDsgLy8gbnVtYmVyIG9mIHNxdWFyZXMgaG9yaXpvbnRhbFxyXG5leHBvcnQgY29uc3QgQ0VMTFNJWkUgPSAxMDsgLy8gc2l6ZSBvZiBvbmUgc3F1YXJlIFxyXG5leHBvcnQgY29uc3QgU0NBTEUgPSAyLjA7IC8vIGRyYXcgZXZlcnl0aGluZyB0d2ljZSBhcyBiaWcgYW5kIG1ha2UgaXQgc21hbGxlciB0byBnZXQgY2xlYW4gbGluZXMgZXZlbiBvbiBhIHJldGluYSBzY3JlZW4gXHJcbmV4cG9ydCBjb25zdCBTUEVFRCA9IDEwMDsgLy8gaW5pdGlhbCBzcGVlZFxyXG5leHBvcnQgY29uc3QgTUFYX0xFVkVMID0gMTA7XHJcbmV4cG9ydCBjb25zdCBBUFBMRVMgPSA1O1xyXG5cclxuLy8gbGV2ZWwgYmFja2dyb3VuZCBjb2xvcnNcclxuZXhwb3J0IGNvbnN0IENPTE9SUyA9IFtcclxuICAnI2ZhZmFmYScsXHJcbiAgJyNmZmZmY2MnLFxyXG4gICcjZmZlNmVlJyxcclxuICAnI2U2ZjJmZicsXHJcbiAgJyNlNmZmZTYnLFxyXG4gICcjZmZmMGU2JyxcclxuICAnI2U2ZTZmZicsXHJcbiAgJyNmOWYyZWMnLFxyXG4gICcjZTZmZmU2JyxcclxuICAnI2ZmNGQ0ZCcsXHJcbl07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbnN0YW50cy9hbGxDb25zdGFudHMudHMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/constants/allConstants.ts\n");

/***/ })

/******/ });