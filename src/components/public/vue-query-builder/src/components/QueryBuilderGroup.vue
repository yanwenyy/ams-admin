<template>
  <div></div>
</template>

<script>
/* eslint-disable vue/require-default-prop */
import deepClone from "../utilities.js";
import QueryBuilderChildren from "./QueryBuilderChildren.vue";

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    QueryBuilderChildren,
  },

  props: {
    ruleTypes: Object,
    type: {
      type: String,
      default: "query-builder-group",
    },
    query: Object,
    rules: Array,
    index: Number,
    maxDepth: Number,
    depth: Number,
    labels: Object,
  },

  data() {
    return {
      selectedRule: this.rules[0],
    };
  },

  methods: {
    ruleById(ruleId) {
      var rule = null;

      this.rules.forEach(function (value) {
        if (value.id === ruleId) {
          rule = value;
          return false;
        }
      });

      return rule;
    },

    addRule() {
      let updated_query = deepClone(this.query);

      let child = {
        type: "query-builder-rule",
        query: {
          rule: this.selectedRule.id,
          operator: this.selectedRule.operators[0],
          operand:
            typeof this.selectedRule.operands === "undefined"
              ? this.selectedRule.label
              : this.selectedRule.operands[0],
          value: null,
        },
      };
      // A bit hacky, but `v-model` on `select` requires an array.
      if (this.ruleById(child.query.rule).type === "multi-select") {
        child.query.value = [];
      }
      if (updated_query.children.length > 0) {
        let arr = updated_query.children;
        let index = 0;
        for (var i = 0; i < arr.length; i++) {
          let item = arr[i];
          if (item.type == "query-builder-group") {
            // updated_query.children.splice(index, 0, child);
            index = i;
            break;
          }
        }
        if ((index === 0)) {
          updated_query.children.push(child);
        } else {
          updated_query.children.splice(index, 0, child);
        }
      } else {
        updated_query.children.push(child);
      }
      // updated_query.children.push(child);
      this.$emit("update:query", updated_query);
    },

    addGroup() {
      let updated_query = deepClone(this.query);
      if (this.depth < this.maxDepth) {
        updated_query.children.push({
          type: "query-builder-group",
          query: {
            logicalOperator: this.labels.matchTypes[0].id,
            children: [],
          },
        });
        this.$emit("update:query", updated_query);
      }
    },

    remove() {
      this.$emit("child-deletion-requested", this.index);
    },

    removeChild(index) {
      let updated_query = deepClone(this.query);
      updated_query.children.splice(index, 1);
      this.$emit("update:query", updated_query);
    },
  },
};
</script>
