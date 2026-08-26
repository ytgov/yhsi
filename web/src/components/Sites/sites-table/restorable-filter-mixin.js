import { isEmpty } from 'lodash';

// Lets a filter restore itself from a previously applied advanced search
// query. Components opt in by declaring a `restoreFilter` option:
//   restoreFilter: { model: 'communityIds', include: 'includingCommunityIds', exclude: 'excludingCommunityIds' }
// or, for single value filters:
//   restoreFilter: { model: 'addressTerm', key: 'addressContains' }
export default {
	props: {
		value: {
			type: Object,
			default: () => ({}),
		},
	},
	created() {
		const { model, key, include, exclude } = this.$options.restoreFilter || {};
		if (!model) return;

		if (key) {
			if (isEmpty(this.value[key])) return;

			this[model] = this.value[key];
		} else {
			const included = this.value[include];
			const excluded = this.value[exclude];

			if (!isEmpty(included)) {
				this[model] = [...included];
				this.includeFilter = true;
			} else if (!isEmpty(excluded)) {
				this[model] = [...excluded];
				this.includeFilter = false;
			} else {
				return;
			}
		}

		// Republish so the parent form starts out with the restored filter.
		this.$emit('input', this.filter);
	},
};
