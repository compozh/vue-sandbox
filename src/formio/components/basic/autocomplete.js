import SelectComponent from 'formiojs/components/select/Select';

/* eslint-disable */
class Autocomplete extends SelectComponent {
	attach(element) {
		var me = this;
		const superAttach = super.attach(element);
		var requestInvoked = false,
			lastSearchValue = '',
			items = [];

			// Make sure to clear the search when no value is provided.
		if (this.choices && this.choices.input && this.choices.input.element) {
			var inputAction = (event) => {
				lastSearchValue = event.target.value;
				if (!requestInvoked) {
					requestInvoked = true;
					setTimeout(() => {
						if (!lastSearchValue) {
							requestInvoked = false;
							return;
						}
						itemAutocomplete(me, lastSearchValue, ({ mostSuitableValue, values }) => {
							me.selectOptions = [];
							if (mostSuitableValue && mostSuitableValue.code) {
								me.choices.setChoiceByValue(mostSuitableValue.code);
							}
							if (values) {
								values.forEach(value => {
									var valueObject = {
										label: value.name,
										value: value.code
									};
									items[value.code] = valueObject;
									me.selectOptions.push(valueObject);
								});
							}

							me.component.data.values = [];
							Object.values(items).forEach(item => {
								me.component.data.values.push(item);
							});

							me.setItems(me.component.data.values, false, me.selectOptions);
							requestInvoked = false;
						});
					}, 2000);
				}
			};
			this.addEventListener(this.choices.input.element, 'input', inputAction);
		}
		return superAttach;
	}

	setItems(items, fromSearch, selectOptions) {
		// If the items is a string, then parse as JSON.
		if (typeof items == 'string') {
			try {
				items = JSON.parse(items);
			}
			catch (err) {
				console.warn(err.message);
				items = [];
			}
		}

		// Allow js processing (needed for form builder)
		if (this.component.onSetItems && typeof this.component.onSetItems === 'function') {
			const newItems = this.component.onSetItems(this, items);
			if (newItems) {
				items = newItems;
			}
		}

		if (!this.choices && this.refs.selectContainer) {
			if (this.loading) {
				// this.removeChildFrom(this.refs.input[0], this.selectContainer);
			}

			this.empty(this.refs.selectContainer);
		}

		// If they provided select values, then we need to get them instead.
		if (this.component.selectValues) {
			items = _.get(items, this.component.selectValues, items) || [];
		}

		let areItemsEqual;

		if (this.isInfiniteScrollProvided) {
			areItemsEqual = this.isSelectURL ? _.isEqual(items, this.downloadedResources) : false;

			const areItemsEnded = this.component.limit > items.length
			const areItemsDownloaded = areItemsEqual
				&& this.downloadedResources
				&& this.downloadedResources.length === items.length

			if (areItemsEnded) {
				this.disableInfiniteScroll();
			}
			else if (areItemsDownloaded) {
				this.selectOptions = []
			}
			else {
				this.serverCount = items.serverCount;
			}
		}

		if (this.isScrollLoading && items) {
			if (!areItemsEqual) {
				this.downloadedResources = this.downloadedResources
					? this.downloadedResources.concat(items)
					: items;
			}

			this.downloadedResources.serverCount = items.serverCount || this.downloadedResources.serverCount;
		}
		else {
			this.downloadedResources = items || [];
			this.selectOptions = [];
		}

		// Add the value options.
		if (!fromSearch) {
			this.addValueOptions(items);
		}

		if (this.component.widget === 'html5' && !this.component.placeholder) {
			this.addOption(null, '');
		}

		// Iterate through each of the items.
		_.each(items, (item, index) => {
			this.addOption(this.itemValue(item), this.itemTemplate(item), {}, String(index));
		});
		if (selectOptions) {
			this.selectOptions = selectOptions;
		}
		if (this.choices) {
			this.choices.setChoices(this.selectOptions, 'value', 'label', true);
		}
		else if (this.loading) {
			// Re-attach select input.
			// this.appendTo(this.refs.input[0], this.selectContainer);
		}

		// We are no longer loading.
		this.isScrollLoading = false;
		this.loading = false;

		// If a value is provided, then select it.
		if (this.dataValue) {
			this.setValue(this.dataValue, {
				noUpdateEvent: true
			});
		}
		else {
			// If a default value is provided then select it.
			const defaultValue = this.defaultValue;
			if (defaultValue) {
				this.setValue(defaultValue);
			}
		}

		// Say we are done loading the items.
		this.itemsLoadedResolve();
	}

	setValue(value, flags) {
		flags = flags || {};
		const previousValue = this.dataValue;
		const changed = this.updateValue(value, flags);
		value = this.dataValue;
		const hasPreviousValue = Array.isArray(previousValue) ? previousValue.length : previousValue;
		const hasValue = Array.isArray(value) ? value.length : value;

		// Undo typing when searching to set the value.
		if (this.component.multiple && Array.isArray(value)) {
			value = value.map(value => {
				if (typeof value === 'boolean' || typeof value === 'number') {
					return value.toString();
				}
				return value;
			});
		}
		else {
			if (typeof value === 'boolean' || typeof value === 'number') {
				value = value.toString();
			}
		}

		// Do not set the value if we are loading... that will happen after it is done.
		if (this.loading) {
			return changed;
		}

		// Determine if we need to perform an initial lazyLoad api call if searchField is provided.
		if (
			this.component.searchField &&
			this.component.lazyLoad &&
			!this.lazyLoadInit &&
			!this.active &&
			!this.selectOptions.length &&
			hasValue
		) {
			this.loading = true;
			this.lazyLoadInit = true;
			this.triggerUpdate(value, true);
			return changed;
		}

		// Add the value options.
		//this.addValueOptions();

		if (this.choices) {
			// Now set the value.
			/*if (hasValue) {
				this.choices.removeActiveItems();
				// Add the currently selected choices if they don't already exist.
				const currentChoices = Array.isArray(value) ? value : [value];
				if (!this.addCurrentChoices(currentChoices, this.selectOptions, true)) {
					this.choices.setChoices(this.selectOptions, 'value', 'label', true);
				}

				this.choices.setChoiceByValue(value);
			}
			else if (hasPreviousValue) {
				this.choices.removeActiveItems();
			}*/
		}
		else {
			if (hasValue) {
				const values = Array.isArray(value) ? value : [value];
				_.each(this.selectOptions, (selectOption) => {
					_.each(values, (val) => {
						if (_.isEqual(val, selectOption.value) && selectOption.element) {
							selectOption.element.selected = true;
							selectOption.element.setAttribute('selected', 'selected');
							return false;
						}
					});
				});
			}
			else {
				_.each(this.selectOptions, (selectOption) => {
					if (selectOption.element) {
						selectOption.element.selected = false;
						selectOption.element.removeAttribute('selected');
					}
				});
			}
		}

		return changed;
	}

	addValueOptions(items) {
		items = items || [];
		if (!this.selectOptions.length) {
			if (this.choices) {
				// Add the currently selected choices if they don't already exist.
				const currentChoices = Array.isArray(this.dataValue) ? this.dataValue : [this.dataValue];
				return this.addCurrentChoices(currentChoices, items);
			}
			else if (!this.component.multiple) {
				this.addPlaceholder();
			}
		}
		return false;
	}

	addCurrentChoices(values, items, keyValue) {
		if (!values) {
			return false;
		}
		const notFoundValuesToAdd = [];
		const added = values.reduce((defaultAdded, value) => {
			if (!value || _.isEmpty(value)) {
				return defaultAdded;
			}
			let found = false;

			// Make sure that `items` and `this.selectOptions` points
			// to the same reference. Because `this.selectOptions` is
			// internal property and all items are populated by
			// `this.addOption` method, we assume that items has
			// 'label' and 'value' properties. This assumption allows
			// us to read correct value from the item.
			const isSelectOptions = items === this.selectOptions;
			if (items && items.length) {
				_.each(items, (choice) => {
					if (choice._id && value._id && (choice._id === value._id)) {
						found = true;
						return false;
					}
					const itemValue = keyValue ? choice.value : this.itemValue(choice, isSelectOptions);
					found |= _.isEqual(itemValue, value);
					return found ? false : true;
				});
			}

			// Add the default option if no item is found.
			if (!found) {
				notFoundValuesToAdd.push({
					value: this.itemValue(value),
					label: this.itemTemplate(value)
				});
				return true;
			}
			return found || defaultAdded;
		}, false);

		if (notFoundValuesToAdd.length) {
			if (this.choices) {
				this.choices.setChoices(notFoundValuesToAdd, 'value', 'label');
			}
			else {
				notFoundValuesToAdd.map(notFoundValue => {
					this.addOption(notFoundValue.value, notFoundValue.label);
				})
			}
		}
		return added;
	}

	static get builderInfo() {
		return {
			title: 'Autocomplete',
			group: 'basic',
			icon: 'th-list',
			weight: 1000,
			schema: Autocomplete.schema()
		}
	}

	static editForm() {
		var autocompleteForm = SelectComponent.editForm();
		autocompleteForm.components.forEach(c => {
			if (c.key === 'tabs') {
				c.components.forEach(tabComponent => {
					if (tabComponent.key === 'data') {
						tabComponent.components.unshift({
							input: true,
							key: "cachingData",
							label: "Caching data",
							tooltip: "Caching data",
							type: "checkbox",
							weight: 0
						})
						tabComponent.components.unshift({
							input: true,
							key: "dataTableFieldName",
							label: "Field of name",
							placeholder: "Field of name",
							tooltip: "Table field with the name",
							type: "textfield",
							weight: 0,
							validate: { required: true }
						})
						tabComponent.components.unshift({
							input: true,
							key: "dataTableFieldCode",
							label: "Field of code",
							placeholder: "Field of code",
							tooltip: "Table field with the code",
							type: "textfield",
							weight: 0,
							validate: { required: true }
						})
						tabComponent.components.unshift({
							input: true,
							key: "dataTable",
							label: "Data table",
							placeholder: "Data table name",
							tooltip: "Data table name",
							type: "textfield",
							weight: 0,
							validate: { required: true }
						})
					}
				})
			}
		})
		return autocompleteForm
	}

	static schema(...extend) {
		return SelectComponent.schema({
			type: 'autocomplete'
		});
	}
}

Formio.registerComponent('autocomplete', Autocomplete)