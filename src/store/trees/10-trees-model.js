// Backbone Model for Trees

// Much thanks to
// http://todomvc.com/architecture-examples/backbone/

// Also helpful
// http://adrianmejia.com/blog/2012/09/11/backbone-dot-js-for-absolute-beginners-getting-started/

// For commentary!
// http://www.reddit.com/r/javascript/comments/1npiet/backbonejs_is_opinionated_or_why_is_using_nested/

// For relational links
// http://backbonerelational.org/
// (not used)

// And for nested Backbone models! (in use!)
// https://github.com/afeld/backbone-nested

/*global Backbone */
window.app = window.app || {};

;(function() {

	// Tree Model
	// ----------

	app.Tree = function (attrs) {
		this.attributes = attrs;
	};

	app.Tree.prototype = {
		get(attr) {
			return this.attributes[attr]
		},

		toJSON(options) {
			return _.clone(this.attributes)
		},

		// Default attributes for the todo
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			id: 0,
			floipSyncedAt: '',
			details: {
				title: '',
				description: '',
				enabledLanguages: [],
        syncedLanguage: '',
				startingBlockKey: '',
        exitBlockKey: '',
				hasVoice: 0,
				hasSms: 0,
				hasUssd: 0,
				hasSocial: 0,
				hasClipboard: 0,
				floipPushUrl: '',
				floipPushApiKey: '',
			},
			blocks: [],
			connections: []
		},

		_defaultReviewedState: {},

    upgrade: function () {
      // todo: port this to use something like `lodash.defaultsDeep()`
      console.debug('Tree upgrade: started');
      console.time('Tree upgrade');

      // Temporary fix for blocks that have [] arrays instead of {} objects
      // Likely caused by browser quirks (possibly old versions of IE)
      // Added 2016-08-08 (Sean)
      this.fixArrayBlocks()

      this.defaultEnabledLanguages();
      this.defaultSyncedLanguage();
      // auto-inflate reviewed dictionaries based upon enabled languages
      this.inflateDefaultReviewedStateOnAll();
      this.inflateDefaultTagsOnAll();
      this.inflateDefaultLabelOnAll();
      this.upgradeLanguageSelectorBlocks();
      this.inflateDefaultSocialContentOnAll();
      this.inflateDefaultClipboardContentOnAll();
      this.upgradeSubscriberPropertyFieldSelections();
      this.upgradeMsmcqBranchingToFalse();
      this.upgradeSubscriberPropertyBlocks();
      this.upgradeSubscriberBranchBlocks();

      console.timeEnd('Tree upgrade');
    },

		cacheDefaultReviewedState: function () {
			var enabledLanguages = this.getEnabledLanguages();
			this._defaultReviewedState = _.zipObject(
					enabledLanguages,
					_.fill(new Array(enabledLanguages.length), false));
		},

    defaultEnabledLanguages: function () {
      var details = this.get('details')
      details.enabledLanguages = details.enabledLanguages || []
    },

    defaultSyncedLanguage: function () {
      var details = this.get('details')
      details.syncedLanguage = details.syncedLanguage || ''
    },

		inflateDefaultReviewedStateOnAll: function () {
			this.cacheDefaultReviewedState();
			this.get('blocks').forEach(this.inflateDefaultReviewedStateOnto.bind(this));
		},

		inflateDefaultReviewedStateOnto: function (block) {
			block.customData.reviewed = block.customData.reviewed || block.customData.approved || {};
			delete block.customData.approved; // todo: remove these two references to `approved` once deployed
			_.defaults(block.customData.reviewed, this._defaultReviewedState);
		},

		inflateDefaultTagsOnAll: function () {
			this.get('blocks').forEach(function (block) {
				!block.customData.tags && (block.customData.tags = []);
			});
		},

		inflateDefaultLabelOnAll: function () {
			this.get('blocks').forEach(function (block) {
				!block.customData.label && (block.customData.label = '');
			});
		},

		upgradeLanguageSelectorBlocks: function () {
			this.get('blocks')
					.filter(function (block) {
						return block.type === "LanguageSelectorBlock";
					})
					.forEach(function (languageSelectorBlock) {
						if (!languageSelectorBlock.customData.addExitForNoResponse) {
							languageSelectorBlock.customData.addExitForNoResponse = 0
						}
					})
		},

		inflateDefaultSocialContentOnAll: function () {
			this.get('blocks').forEach(function (block) {
				!block.socialContent && (block.socialContent = {})
			})
		},

		inflateDefaultClipboardContentOnAll: function () {
			this.get('blocks').forEach(function (block) {
				!block.clipboardContent && (block.clipboardContent = {})
			})
		},

		upgradeSubscriberPropertyFieldSelections: function () {
			this.get('blocks').forEach(function (block) {
				if (!block.customData.propertyFieldId) {
					var property = app.ui.findSubscriberPropertyField({display_label: block.customData.customDataCategory})
					block.customData.propertyFieldId = _.get(property, 'id', null)
				}
			})
		},

    upgradeMsmcqBranchingToFalse: function () {
      this.get('blocks')
          .filter(function (block) {return block.type === "MultipleSelectMultipleChoiceQuestionBlock"})
          .filter(function (block) {return block.customData.branching === 1})
          .forEach(function (block) {
            var customData = block.customData;
            var uiData = block.uiData;

            customData.branching = false
            customData.numChoices = 1
            uiData.numChoices = 1
            uiData.numConnections = 1
            uiData.outputNames = [1]
            if (customData.addExitForNoResponse) {
              uiData.outputNames.push('trees.output-exit')
            }
          })
    },

		/**
		 * For existing blocks that have their action set to startDate, set the action to customData instead,
		 * preserving all settings that calculate the date, and attempting to pre-select the "start_date" property for the
		 * user.
		 *
		 * This is because we are removing the startDate action and rather switching to using subscriber properties
		 */
		upgradeSubscriberPropertyBlocks: function () {
			this.get('blocks')
				.filter(function (block) {return block.type === "SubscriberPropertyBlock"})
				.filter(function (block) {return block.customData.action === 'startDate'})
				.forEach(function (block) {
					var customData = block.customData
					customData.action = 'customData'
					customData.propertyDateMethod = customData.startDateMethod
					customData.propertyDateAbsoluteDate = customData.startDateAbsoluteDate
					customData.propertyDateRelativeNumber = customData.startDateRelativeNumber
					customData.propertyDateTimespanType = customData.startDateTimespanType
					customData.propertyDateNumericBlockKey = customData.startDateNumericBlockKey
					var propertyField = app.ui.findSubscriberPropertyField({name: 'start_date'})
					if (propertyField) {
						customData.propertyFieldId = propertyField.id
					} else {
						customData.propertyFieldId = null
					}
					customData.upgradedFromStartDate = true
				})
		},

		/**
		 * For existing blocks that have their criteria set to startDate, set the criteria to customData instead,
		 * preserving all settings, and attempting to pre-select the "start_date" property for the
		 * user.
		 *
		 * This is because we are removing the startDate action and rather switching to using subscriber properties
		 */
		upgradeSubscriberBranchBlocks: function () {
			this.get('blocks')
					.filter(function (block) {return block.type === 'SubscriberBranchBlock'})
					.filter(function (block) {return  block.customData.action === 'startDate'})
					.forEach(function (block) {
						builder.$set(block.customData, 'action', 'customData')
						builder.$set(block.customData, 'customDataMethod', block.customData.startDateMethod)
						builder.$set(block.customData, 'customDataValue', block.customData.startDateReference)

						var propertyField = app.ui.findSubscriberPropertyField({name: 'start_date'})

						// $set won't work on something that is already a property
						// make sure it does not exist on the object before $set-ing it
						delete block.customData.propertyFieldId

						if (propertyField) {
							builder.$set(block.customData, 'propertyFieldId', propertyField.id)
						} else {
							builder.$set(block.customData, 'propertyFieldId', null)
						}

						builder.$set(block.customData, 'upgradedFromStartDate', true)
					})
		},

    // This function loops through all of the blocks in a tree, and checks for blocks that have empty subkeys (eg. customData) that are in [] array format rather than {} object format.
    // The array issue causes other crashes later, when trying to retrieve or update data. So far, the issue comes up sporadically which seems to indicate that it's a browser quirk (possibly with older versions of IE).
    // This issue fixes the empty arrays (by replacing them with empty objects) when the function is called, and we've added it to trees-views' initializeAll() function to call it on initial page load.
    // For trees without the issue, it marginally increases the load on the browser when the tree is first loaded, but otherwise causes no other changes.
		/** @moved from 12-trees-helpers.js */
    fixArrayBlocks: function () {
      var neededFixing = 0;
      var fixedCount = 0;

      _.each(this.get('blocks'), function (block, index) {
        var arrayKeys = [
          'customData',
          'uiData',
          'audioFiles',
          'smsContent',
          'ussdContent',
          'socialContent',
          'clipboardContent',];

        _.each(arrayKeys, function (key) {
          if (_.isArray(block[key])) {
            neededFixing = 1;
            fixedCount++;

            // Repair the array by changing it to object syntax:
            block[key] = {};

            console.log('Fixing ' + block.type + '[' + index + '] ' + key);
          }
        });
      });

      if (neededFixing == 1) {
        console.log('Fixed ' + fixedCount + ' blocks.');
        app.ui.change('Array issue blocks fixed.');
      }
      // else {
      // 	console.log('All blocks loaded without array issues.');
      // }
    },

		// Block-related functions
		doesBlockLabelExist: function (label, comparatorKey) {
			if (!label) {return}

			return !!_(this.get('blocks')).chain()
					.find(function (block) {
						return block.jsKey !== comparatorKey && block.customData.label === label
					})
					.value()
		},

		addBlock: function(blockData) {
			// This doesn't seem to persist across deletes
			// Will make new, non-unique IDs.
			// blockData.jsKey = _.uniqueId('block_');
			blockData.jsKey = this.makeUniqueId('block_');

			this.inflateDefaultReviewedStateOnto(blockData);

			this.get('blocks').push(blockData);

			if (this.get('blocks').length == 1) {
				// Only one block, eg. the first one,
				// so set the tree's Starting Block ID to this
				this.setStartingBlock(blockData.jsKey);
			}

			// Return the new key
			return this.get('blocks').length - 1;
		},

		getBlockByNumericIndex: function(blockKey) {
			var blocks = this.get('blocks');
			if (blocks[blockKey]) {
				return blocks[blockKey];
			}
			else {
				return false;
			}

		},

		// app.tree.editBlock(0, {type:'newType'})
		editBlockByNumericIndex: function(blockNumericIndex, blockData, arrayKey) {
			var blocks = this.get('blocks');
			var blockArrayKey;
			// Update that particular block in the array with new data.
			if (blocks[blockNumericIndex]) {

				// Can provide an array key value (eg. smsContent) to just update that array
				if (typeof arrayKey !== 'undefined') {
					blocks[blockNumericIndex][arrayKey] = blockData;
				}

				else {
					// Persist existing data (eg. jsKey and other unchanged arrays)
					blockData = _.extend(blocks[blockNumericIndex], blockData);
					blocks[blockNumericIndex] = blockData;
				}



				this.set('blocks', blocks);

				// Return that block data just for fun
				return blocks[blockNumericIndex];
			}
			else {
				return false;
			}
		},

		getBlock: function(blockKey) {
			// Passes back the block *by reference* which allows for direct editing.
			return _.findWhere(this.get('blocks'), {jsKey: blockKey});
		},

		editBlock: function(blockKey, blockData, arrayKey) {

			var thisBlock = this.getBlock(blockKey);
			// thisBlock is returned by reference, so can be edited directly (i think)

			if (thisBlock) {

				// Can provide an array key value (eg. smsContent) to just update that array
				if (typeof arrayKey !== 'undefined') {
					thisBlock[arrayKey] = blockData;
				}

				else {
					// Persist existing data (eg. jsKey and other unchanged arrays)
					thisBlock = _.extend(thisBlock, blockData);
					// blocks[blockNumericIndex] = blockData;
				}

				return true;

			}
			else {
				return false;
			}

		},

		setBlockPosition: function(blockKey, positionData) {
			var thisBlock = this.getBlock(blockKey);

			if (thisBlock) {

				thisBlock['uiData']['xPosition'] = positionData[0];
				thisBlock['uiData']['yPosition'] = positionData[1];

				return true;

			}
			else {
				return false;
			}
		},

		getBlockPosition: function(blockKey) {
			var thisBlock = this.getBlock(blockKey);

			var positionData = [];

			if (thisBlock) {

				positionData[0] = thisBlock['uiData']['xPosition'];
				positionData[1] = thisBlock['uiData']['yPosition'];

				return positionData;

			}
			else {
				return false;
			}
		},

		getBlockNumConnections: function(blockKey) {
			var thisBlock = this.getBlock(blockKey);

			return thisBlock['uiData']['numConnections'];
		},

		filterBlockConnectionsAboveMax: function(blockKey) {

			var thisBlock = this.getBlock(blockKey);
			var connections = this.get('connections');

			var maxConnections = thisBlock['uiData']['numConnections'];

			_.each(_.where(connections, {startBlockKey: blockKey}), function(e) {

				var nodeNumber = e.outputKey.slice(-1);

				if (nodeNumber > maxConnections) {
					app.tree.removeConnection(blockKey, e.outputKey);
				}

			});


		},

		setBlockAudioFile: function(blockKey, languageId, audioData) {
			var thisBlock = this.getBlock(blockKey);

			// audioData = {
			// 	id: 75,
			// 	filename: '536105d15bbd94.30453403',
			// 	description: 'Uploaded file: survey-c.wav',
			// 	duration_seconds: 2.12,
			// 	created_at: '2013-04-12 16:32'
			// };

			// console.log('blockKey', blockKey);
			// console.log('languageId', languageId);
			// console.log('audioData', audioData);

			if (thisBlock) {

				// Special handling for any mystery cases
				// where the audioFiles object becomes an array
				// which could lead to really giant amounts of null values
				if (_.isPlainObject(thisBlock['audioFiles']) === false) {
					console.log('Alert - special handling for audioFiles as array taking place');
					thisBlock['audioFiles'] = {};
				}

				thisBlock['audioFiles'][languageId] = audioData;

				return true;

			}
			else {
				return false;
			}
		},

		removeBlockAudioFile: function(blockKey, languageId) {

			var thisBlock = this.getBlock(blockKey);

			// Works by reference.
			delete thisBlock['audioFiles'][languageId];

		},

		// Existing block keys
		getBlockKeys: function() {
			return _.keys(app.tree.get('blocks'));

		},

		// Get next index
		// This isn't really useful since we aren't tracking by array key anymore.
		getNextBlockKey: function() {
			var lastKey = parseInt(_.last(app.tree.getBlockKeys()), 10);
			return lastKey + 1;

		},


		deleteBlock: function(blockKey) {

			var blocks;
			blocks = this.get('blocks');
			blocks = _.without(blocks, _.findWhere(blocks, {jsKey: blockKey}));

			this.set('blocks', blocks);

			// If the indicated block was also the tree's starting block,
			// Set it to blank.
			this.clearStartingBlockIfIs(blockKey);
      this.clearExitBlockIfIs(blockKey);

			return true;

		},

		handleDeleteNumericQuestionBlockAssociations: function(selectedBlockKey) {
				this.set({
					blocks: this.get('blocks').map(function(block) {
						var newBlock = block;
						if(block['type'] == 'NumericBranchBlock') {
							newBlock = Object.assign({}, block, {customData: this._getAmendmentsForNumericBranchBlock(block['customData'], selectedBlockKey)});
						} else if(block['type'] == 'IdValidationBlock') {
							newBlock = Object.assign({}, block, {customData: this._getAmendmentsForIdValidationBlock(block['customData'], selectedBlockKey)});
						}
						return newBlock;
					}.bind(this)
				)});
		},
		//works but must save twice to trigger validation and disable send
		_getAmendmentsForNumericBranchBlock: function(customData, selectedBlockKey) {
			return Object.assign({}, customData, {
				outputs: _.reduce(customData['outputs'], function(newOutputs, output) {
					var newConditions = _.reduce(output['conditions'], function(newConditions, condition) {
						var newCondition = Object.assign({}, condition);
						if(condition['jsKey'] == selectedBlockKey) {
							newCondition['jsKey'] = '';
						}
						newConditions.push(newCondition);
						return newConditions;
					}.bind(this), []);

					//I think this will never be the case but just to be sure
					if(newConditions) {
						newOutputs.push(Object.assign({}, output, {conditions: newConditions}));
					}

					return newOutputs;
				}.bind(this),
				[])
			});
		},
		_getAmendmentsForIdValidationBlock: function(customData, selectedBlockKey) {

			if(customData['numericQuestionBlockJsKey'] == selectedBlockKey) {
				customData = Object.assign({}, customData, {
					'numericQuestionBlockJsKey': ''
				})
			}
			return customData;
		},

		makeUniqueId: function(prefix) {
			return prefix + _.now() + '_' + _.random(10, 99);

		},

		getMcqChoiceName: function(blockKey, choiceId) {

			var block = this.getBlock(blockKey);
			if (block && block.customData && block.customData.choices) {
				return block.customData.choices[choiceId - 1];
			}

		},

		getBlockTitle: function(blockKey) {

			var block = this.getBlock(blockKey);
			if (block && block.customData && block.customData.title) {
				return block.customData.title;
			}

		},

		generateBlockTitle: function(customData, type, limit) {

			var output = '';
			if (_.isNumber(limit) == false) {
				limit = 0;
			}

			if (type === 'RunTreeBlock') {
				if (_.get(customData, 'destinationTreeId')) {
					output = _.get(app.ui.treeTitles, customData.destinationTreeId);
				}
				else if (_.get(customData, 'destinationTreeSetId')) {
					output = Lang.trans('trees.most-recent-version-of') + ' ' + _.get(app.ui.treeSetTitles, customData.destinationTreeSetId);
				}

			}
			else if (type === 'GroupBranchBlock') {
				if (_.get(customData, 'groupId')) {
					if (_.parseInt(_.get(customData, 'in')) == 0) {
						output = Lang.trans('trees.if-not-in') +' "';
					}
					else {
						output = Lang.trans('trees.if-in')+' "';
					}
					output += _.get(app.ui.groupNames, customData.groupId) + '"';
				}
			}
			else if (type === 'GroupSizeBranchBlock') {
				if (_.get(customData, 'groupId')) {
					output = Lang.trans('trees.if')+' "' + _.get(app.ui.groupNames, customData.groupId) + '" '+ Lang.trans('trees.exceeds') + ' ' + _.get(customData, 'quotaThreshold', 100);
				}
			}
			else if (type === 'SubscriberBranchBlock') {
					if (_.get(customData, 'action') == 'customData') {
					  var property = app.ui.findSubscriberPropertyField({id: _.get(customData, 'propertyFieldId')})
						var displayLabel = _.get(property, 'display_label', '')
						var comparator = _.get(customData, 'customDataMethod', 'Equal')

						var comparatorString = ''
						if (comparator === 'NotEqual') {
							comparatorString = Lang.trans('trees.not')
						} else if (comparator === 'LessThan') {
							comparatorString = '<'
						} else if (comparator === 'GreaterThan') {
							comparatorString = '>'
						}

						output = Lang.trans('trees.if-subscriber-custom-data') + ' "' + displayLabel + '" ' + Lang.trans('trees.is') + ' ' + comparatorString + ' "' + _.get(customData, 'customDataValue', '') + '"';
					}
					else if (_.get(customData, 'action') == 'language') {
						if (_.get(customData, 'languageValue') == '') {
							output = Lang.trans('trees.if-subscriber-language-is-unknown')
						} else {
							output = Lang.trans('trees.if-subscriber-language-is')+ ' "' + _.get(app.ui.languageNames, customData.languageValue) + '"';
					        }
					}
			}

			else {
				output = _.get(customData, 'title');
			}

			if (output && output.length > 0 && limit > 0) {
				output = S(output).truncate(limit).s;
			}
			return output;
		},


		// Connection-related functions

		addConnection: function(startBlockKey, outputKey, endBlockKey) {

			var connections;

			// Need to remove any existing connections with the same startBlockKey and outputKey - since one output key on a block can only go to one other endBlock.
			this.removeConnection(startBlockKey, outputKey);

			// Need to load this *after* the appropriate entries are removed first.
			connections = this.get('connections');

			// If this works, it'll be so weird.
			var connection = {
				startBlockKey: startBlockKey,
				outputKey: outputKey,
				endBlockKey: endBlockKey
			};

			connections.push(connection);

			this.set('connections', connections);

			return true;

		},

		removeConnection: function(startBlockKey, outputKey) {
			// outputKey is optional
			var connections = this.get('connections');

			if (startBlockKey && typeof outputKey !== 'undefined') {

				// Massive thanks to
				// http://stackoverflow.com/a/16994286
				connections = _.without(connections, _.findWhere(connections, {startBlockKey: startBlockKey, outputKey: outputKey}));

			}
			else if (startBlockKey) {

				// Filter literally everything with that starting block key
				connections = _.difference(connections, _.where(connections, {startBlockKey: startBlockKey}));

			}



			this.set('connections', connections);

			return true;

		},

		addEnabledLanguage: function(languageKey) {

			var enabledLanguages = app.tree.get('details')['enabledLanguages'];

			var newEnabledLanguages = [];

			enabledLanguages.push(languageKey.toString());

			// Order according to the original app.ui.languages order
			newEnabledLanguages = _.intersection(_.pluck(app.ui.languages, 'id'), app.tree.get('details')['enabledLanguages']);

			app.tree.get('details').enabledLanguages = newEnabledLanguages;

			this.inflateDefaultReviewedStateOnAll();
		},

		removeEnabledLanguage: function(languageKey) {

			var enabledLanguages = app.tree.get('details')['enabledLanguages'];

			languageKey = languageKey.toString();

			// This loses the pass-by-reference, so need to save it back to the model after.
			enabledLanguages = _.without(enabledLanguages, languageKey);

      app.tree.get('details').enabledLanguages = enabledLanguages;

			this.cacheDefaultReviewedState();
		},

		getEnabledLanguages: function() {
			return app.tree.get('details')['enabledLanguages'];
		},

		setStartingBlock: function(startingBlockKey) {
      app.tree.get('details').startingBlockKey = startingBlockKey;
		},

		clearStartingBlockIfIs: function(blockKey) {
			if (app.tree.get('details').startingBlockKey == blockKey) {
        app.tree.get('details').startingBlockKey = '';
			}

		},

    clearExitBlockIfIs: function(blockKey) {
      if (app.tree.get('details').exitBlockKey == blockKey) {
        app.tree.get('details').exitBlockKey = '';
      }
    },



		enableVoice: function() {
			app.tree.get('details').hasVoice = 1;
		},
		disableVoice: function() {
      app.tree.get('details').hasVoice = 0;
		},
		enableSms: function() {
      app.tree.get('details').hasSms = 1;
		},
		disableSms: function() {
      app.tree.get('details').hasSms = 0;
		},
		enableUssd: function() {
      app.tree.get('details').hasUssd = 1;
		},
		disableUssd: function() {
      app.tree.get('details').hasUssd = 0;
		},
		enableSocial: function() {
			app.tree.get('details').hasSocial = 1;
		},
		disableSocial: function() {
			app.tree.get('details').hasSocial = 0;
		},
		enableClipboard: function() {
			app.tree.get('details').hasClipboard = 1;
		},
		disableClipboard: function() {
			app.tree.get('details').hasClipboard = 0;
		},

		validateLanguageAndContentTypes: function(tree, blocks) {

			var missingLanguageIdsAudioFiles = [],
					missingLanguageIdsSmsContent = [],
					missingLanguageIdsUssdContent = [],
					missingLanguageIdsSocialContent = [],
					missingLanguageIdsClipboardContent = [],
					jsKey = {};

			_.forEach(blocks, function(block) {

				missingLanguageIdsAudioFiles = [];
				missingLanguageIdsSmsContent = [];
				missingLanguageIdsUssdContent = [];
				missingLanguageIdsSocialContent = [];
				missingLanguageIdsClipboardContent = [];

				if(app.ui.blockClasses[block.type].hasContent == 1){

					if(app.tree.get('details').hasVoice && _.keys(block.audioFiles).length < tree.enabledLanguages.length) {
					missingLanguageIdsAudioFiles = _.difference(tree.enabledLanguages, _.keys(block.audioFiles));

					}

					if(app.tree.get('details').hasSms && _.keys(block.smsContent).length < tree.enabledLanguages.length) {
						if (block.type !== "RandomOrderMultipleChoiceQuestionBlock")
						missingLanguageIdsSmsContent = _.difference(tree.enabledLanguages, _.keys(block.smsContent));

					}

					if(app.tree.get('details').hasUssd && _.keys(block.ussdContent).length < tree.enabledLanguages.length) {
						if (block.type !== "RandomOrderMultipleChoiceQuestionBlock")
						missingLanguageIdsUssdContent = _.difference(tree.enabledLanguages, _.keys(block.ussdContent));

					}

					if(app.tree.get('details').hasSocial && _.keys(block.socialContent).length < tree.enabledLanguages.length) {
						if (block.type !== "RandomOrderMultipleChoiceQuestionBlock")
							missingLanguageIdsSocialContent = _.difference(tree.enabledLanguages, _.keys(block.socialContent));
					}

					if(app.tree.get('details').hasClipboard && _.keys(block.clipboardContent).length < tree.enabledLanguages.length) {
						if (block.type !== "RandomOrderMultipleChoiceQuestionBlock")
							missingLanguageIdsClipboardContent = _.difference(tree.enabledLanguages, _.keys(block.clipboardContent));
					}

					if(missingLanguageIdsAudioFiles.length || missingLanguageIdsSmsContent.length || missingLanguageIdsUssdContent.length || missingLanguageIdsSocialContent.length || missingLanguageIdsClipboardContent.length) {
						jsKey[block.jsKey] = {
								'sms': missingLanguageIdsSmsContent,
								'voice': missingLanguageIdsAudioFiles,
								'ussd' : missingLanguageIdsUssdContent,
								'social' : missingLanguageIdsSocialContent,
								'clipboard' : missingLanguageIdsClipboardContent,
						}
					}

				}

				/*
				//if block is a multiple choice question, check if user has set multiple digit options
				if (block.type === "MultipleChoiceQuestionBlock"){
					var choiceKeyPresses = block.customData.choiceKeypresses;
					//check if there are any duplicate in the choices

					if ((new Set(_.values(choiceKeyPresses))).size !== (_.values(choiceKeyPresses).length)){
						var uniqN = [];
						var duplicates = [];
						$.each(choiceKeyPresses, function(i, el){
							if (uniqN.lastIndexOf(el) === -1) {
								uniqN.push(el);
							}else{
								duplicates.push(el);
							}
						});

						jsKey[block.jsKey]['duplicateChoicePresses'] = duplicates;
					}else{
						jsKey[block.jsKey]['duplicateChoicePresses'] = [];
					}

				}

				if (block.type === "GroupBranchBlock"){
					//check if this block has a group set
					if (!block.customData.hasOwnProperty('groupId') || (block.customData.groupId === "")) {
						jsKey[block.jsKey] = {'noGroup' : "NoGroupSelected"};
					}
				}

				if (block.type === "RunTreeBlock"){

					if (!block.customData.hasOwnProperty('destinationTreeSetId') || (block.customData.destinationTreeSetId === "")) {
						jsKey[block.jsKey] = {'noRunTree':'NoTreeSelected'};
					}
				}

				if (block.type === "GroupSizeBranchBlock") {

					if (!block.customData.hasOwnProperty('groupId') || (block.customData.groupId === "")){
						jsKey[block.jsKey] = {
												'noGroup':"NoGroupSelected"
											 };
					}

				}

				if (block.type === "LanguageSelectorBlock"){
					if (!block.customData.hasOwnProperty('languageSelectorId') || (block.customData.languageSelectorId === "")){
						jsKey[block.jsKey] = {
											'noLanguageSelector' : 'NoLanguageSelectorSelected'
										};
					}

				}

				*/


			});

			return jsKey;

		},

		validateContent: function() {

			var tree = this.get('details'), blocks = this.get('blocks');

			return this.validateLanguageAndContentTypes(tree, blocks);
		},

		updateFloipAlert: function() {
			if (app.tree.floipSyncedAt) {
				$('.push-flow-package-alert-message').html('<div class="alert alert-success">' + Lang.trans('trees.floip-sync-success') + '</div>');
			} else if ($('.floip-push-url-input').val()) {
				$('.push-flow-package-alert-message').html('<div class="alert alert-warning">' + Lang.trans('trees.floip-sync-warning') + '</div>');
			}
		},

    getEndBlockPosition: function(topOrBottom, returnBlockKey, offset) {
      var tallestYPosition = 0;
      var tallestBlockKey = '';

      if (topOrBottom != 'bottom') {
        // TODO:
        if (app.tree.get('blocks')[0]) {
          tallestYPosition = app.tree.get('blocks')[0]['uiData']['yPosition'];
          tallestBlockKey = app.tree.get('blocks')[0]['jsKey'];
          // Seed this initially, otherwise the "0" value will stay shortest.
        }
      }

      _.each(app.tree.get('blocks'), function(block) {
        var thisYPosition = block['uiData']['yPosition'];

        if (topOrBottom == 'bottom') {
          if (thisYPosition > tallestYPosition) {
            tallestYPosition = thisYPosition;
            tallestBlockKey = block['jsKey'];
          }
        }
        else {
          if (thisYPosition < tallestYPosition) {
            tallestYPosition = thisYPosition;
            tallestBlockKey = block['jsKey'];
          }
        }

      }, this);

      if (typeof offset !== 'undefined') {
        if (topOrBottom == 'bottom') {
          tallestYPosition += offset;
        }
        else {
          tallestYPosition -= offset;
        }

      }

      if (returnBlockKey == 1) {
        return tallestBlockKey;
      }
      else {
        return tallestYPosition;
      }

    },

    getTallestBlockPosition: function(offset) {
      return this.getEndBlockPosition('bottom', 0, offset);
    },
    getShortestBlockPosition: function(offset) {
      return this.getEndBlockPosition('top', 0, offset);
    },
    getTallestBlockKey: function() {
      return this.getEndBlockPosition('bottom', 1);
    },
    getShortestBlockKey: function() {
      return this.getEndBlockPosition('top', 1);
    },

  };

  app.Tree._blockIdPrefixMatcher = /^(block_\d+_\d+).*/; // eg. "block_1492643090294_28_node_3"
  app.Tree._validateNonExistentBlockReferences = function (blocks, connections) {
		// todo: also validate .blocks.items.properties.customData.outputs.conditions.jsKey === "block_1450273012962_38"
		// todo: also validate .details.startingBlockKey === "block_1450273012962_38"

    var keysToVerifiedMap = {},
        keysToExistsMap = {},
        keys = _.pluck(blocks, 'jsKey'),
        validateKey = function (key) {
          keysToVerifiedMap[key] = true
          keysToExistsMap[key] = _.contains(keys, key)
        };

    _.forEach(connections, function (conn, i) {
      validateKey(conn.endBlockKey);
      validateKey(conn.startBlockKey);

      var extractedKey = _.get(this._blockIdPrefixMatcher.exec(conn.outputKey), 1);
      extractedKey && validateKey(extractedKey);
    }, this);

    return _.contains(_.values(keysToExistsMap), 0);
  }

	app.Tree._mergeAndSanitizeImportedInto = function (treeJson, importJson) {
		if (!importJson) {
			return; // validator handles `null`ed json in a particular way
		}

		//1- Remove contents - based on selected channels
		_.forEach(_.get(importJson, 'blocks'), function (block, i) {
			if (!_.get(treeJson, 'details.hasVoice', false)){
				block.audioFiles = {};
			}
			if (!_.get(treeJson, 'details.hasSms', false)){
				block.smsContent = {};
				block.smsAutogenLangs = [];
			}
			if (!_.get(treeJson, 'details.hasUssd', false)){
				block.ussdContent = {};
				block.ussdAutogenLangs = [];
			}
			if (!_.get(treeJson, 'details.hasSocial', false)){
				block.socialContent = {};
				block.socialAutogenLangs = [];
			}
			if (!_.get(treeJson, 'details.hasClipboard', false)){
				block.clipboardContent = {};
				block.clipboardAutogenLangs = [];
			}
		});

		//2- Remove contents - based on selected languages
		var importedEnabledLanguages = _.get(importJson, 'details.enabledLanguages', []);
		var validLanguages = _.get(treeJson, 'details.enabledLanguages', []);
		var invalidLanguages = _.difference(importedEnabledLanguages, validLanguages);

		if (invalidLanguages.length > 0){
			var blockContentsToReview = [
				'customData.reviewed',
				'audioFiles',
				'smsContent',
				'ussdContent',
				'socialContent',
				'clipboardContent',
				'smsAutogenLangs',
				'ussdAutogenLangs',
				'socialAutogenLangs',
				'clipboardAutogenLangs'
			];

			_.forEach(_.get(importJson, 'blocks'), function (block, i) {
				_.forEach(blockContentsToReview, function (contentPath, i) {
					var content = _.get(block, contentPath, {});
					var sanitizedContent = [];
					if (_.isArray(content)) {//AutogenLangs
						sanitizedContent = _.difference(content, invalidLanguages);//remove by value
					}else{//Contents & others
						sanitizedContent = _.omit(content, invalidLanguages);//remove by prop
					}
					_.set(block, contentPath, sanitizedContent);
				})
			});
		}

		// 3- Fix non object contents & Strip out customData from some block types
		// Block Type KeyValues to strip out
		var orgContentBlockTypeKeys = {
		  "SubscriberBranchBlock": ['customDataCategory', 'customDataValue', 'propertyFieldId'],
		  "GroupBranchBlock": ['groupId'],
		  "GroupSizeBranchBlock": ['groupId'],
		  "SubscriberPropertyBlock": ['customDataCategory', 'customDataValue', 'newLanguage', 'propertyFieldId'],
		  "GroupPropertyBlock": ['groupId'],
		  "BillSubscriberBlock": ['apiUrlDestination', 'apiUsername', 'apiPassword', 'apiProductCode', 'apiStockCode', 'apiDeductionAmount', 'apiOperationId', 'apiOperationType' ],
		  "TriggerOutgoingCallBlock": ['recipientType', 'scheduleType', 'messageVersionSetId', 'messageId', 'surveyVersionSetId', 'surveyId', 'treeVersionSetId', 'treeId', 'languageSelectorId', 'subscribers'],
		  "LanguageSelectorBlock": ['languageSelectorId'],
		  "CallHistoryBranchBlock": ['mode', 'rangeDays', 'rangeStartDate', 'rangeEndDate'],
			"DirectorySelectionBlock": ['setSubscriberPropertyConfiguration'],
			"OpenQuestionBlock": ['setSubscriberPropertyConfiguration'],
			"RandomOrderMultipleChoiceQuestionBlock": ['setSubscriberPropertyConfiguration'],
			"MultipleChoiceQuestionBlock": ['setSubscriberPropertyConfiguration'],
			"NumericQuestionBlock": ['setSubscriberPropertyConfiguration'],
			"CollaborativeFilteringRatingBlock": ['candidateBlocks'],
			"CollaborativeFilteringRatioBranchBlock": ['candidateBlock'],
		}

		_.forEach(_.get(importJson, 'blocks'), function (block, i) {
			block.audioFiles = Array.isArray(block.audioFiles) ? {} : block.audioFiles;
			block.smsContent = Array.isArray(block.smsContent) ? {} : block.smsContent;
			block.ussdContent = Array.isArray(block.ussdContent) ? {} : block.ussdContent;
			block.socialContent = Array.isArray(block.socialContent) ? {} : block.socialContent;
			block.clipboardContent = Array.isArray(block.clipboardContent) ? {} : block.clipboardContent;
			block.customData = Array.isArray(block.customData) ? {} : block.customData;

			if(_.has(orgContentBlockTypeKeys, block.type)) {
				// For each key within the Block Type
				_.forEach(orgContentBlockTypeKeys[block.type], function (key, i) {
					delete block.customData[key];
				})
			}

		});

		return _.extend({}, treeJson, {
			details: _.assign({}, _.get(importJson, 'details'), treeJson.details),
			blocks: _.get(importJson, 'blocks', []),
			connections: _.get(importJson, 'connections', [])
		});
	}

  app.Tree.validateTreeData = function (json, schema) {
    // Usage:
    // schema = app.Tree.createJsonSchemaFor(
    //    _.pluck(app.ui.languages, 'id'),
    //    _.keys(app.ui.blockClasses))
    // app.tree = app.Tree.validateAndCreateFrom(json, schema)

    if (!json) { // json was invalid at some point along the way
        throw _.extend(new Ajv.ValidationError([]), {message: 'Tree validation failed!'});
    }

    var validate = new Ajv({coerceTypes: true}).compile(schema);

    if (!validate(json)) {
      // validate.errors are a list like:
      // [{"keyword":"type","dataPath":".details.title","schemaPath":"#/properties/details/properties/title/type","params":{"type":"string"},"message":"should be string"}]
      throw _.extend(
          new Ajv.ValidationError(validate.errors),
          {message: 'Tree validation failed!'});
    }

    if (this._validateNonExistentBlockReferences(json.blocks, json.connections)) {
      throw _.extend(new Ajv.ValidationError([{
        keyword: 'reference',
        dataPath: '.connections.items.properties',
        message: "should reference existing jsKey properties"
      }]), {message: 'Tree validation failed!'});
    }
  }

  app.Tree.createJsonSchemaFor = function (languages, blockTypes) {
    // todo: fix enum for language
    // todo: fix enum for block classes
    // todo: add enum for `connection.startBlockKey` and `connection.endBlockKey`
    // todo: add enum for `connection.endBlockKey`
    // todo: add enum for `details.startingBlockKey`

    // Reference: http://epoberezkin.github.io/ajv/keywords.html
    return {
      "properties": {
        "id": {"type": "integer"},
        "details": {
          "type": "object",
          "properties": {
            "title": {"type": "string"},
            "description": {"type": "string"},
            "hasVoice": {"type": "boolean"},
            "enabledLanguages": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": languages
              }
            },
            "hasSms": {"type": "boolean"},
            "hasUssd": {"type": "boolean"},
            "hasSocial": {"type": "boolean"},
            "startingBlockKey": {"type": "string"}
          }
        },
        "blocks": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string",
                "enum": blockTypes
              },
              "customData": {
                "type": "object",
                "properties": {
                  "title": {"type": "string"},
                  "repeatKey": {"type": "integer"},
                  "repeatMax": {"type": "integer"},
                  "repeatDelay": {"type": "integer"},
                  "repeat": {"type": "boolean"}
                }
              },
              "uiData": {
                "type": "object",
                "properties": {
                  "xPosition": {"type": "integer"},
                  "yPosition": {"type": "integer"},
                  "numConnections": {"type": "integer"},
                }
              },
              "audioFiles": {"type": "object"},
              "smsContent": {"type": "object"},
              "ussdContent": {"type": "object"},
              "socialContent": {"type": "object"},
              "clipboardContent": {"type": "object"},
              "smsAutogenLangs": {"type": "array"},
              "ussdAutogenLangs": {"type": "array"},
              "socialAutogenLangs": {"type": "array"},
              "clipboardAutogenLangs": {"type": "array"},
              "jsKey": {"type": "string"}
            }
          }
        },
        "connections": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "startBlockKey": {"type": "string"},
              "outputKey": {"type": "string"},
              "endBlockKey": {"type": "string"}
            }
          }
        }
      }
    }
  }


})();