<template lang="pug">
  .open-file
    ul(v-for="(tabGroup, i) in tabGroups" :key="tabGroup.id")
      ul(v-if="tabGroups.length === 1")
        li(v-for="tab in tabGroup.tabs" :key="tab.id")
          span.arrow
            v-icon(color="grey lighten-1" size="12") mdi-close
          span.node
            span.icon
              v-icon(
                color="grey lighten-1"
                small
              ) {{tab.name | icon}}
            span.name {{tab.name}}
      li(v-else)
        span.arrow
          .none-arrow
        span(@click="onClick(tabGroup)") 그룹 {{i + 1}}
        ul
          li(v-for="tab in tabGroup.tabs" :key="tab.id")
            span.arrow
              v-icon(color="grey lighten-1" size="12") mdi-close
            span.node
              span.icon
                v-icon(
                  color="grey lighten-1"
                  small
                ) {{tab.name | icon}}
              span.name {{tab.name}}
</template>

<script lang="ts">
  import {View} from '@/store/view';
  import {icon, log, getData, isData} from '@/ts/util';
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({
    filters: {
      icon,
    },
  })
  export default class OpenFile extends Vue {
    @Prop({type: Array, default: () => []})
    private tabGroups!: View[];

  }
</script>

<style scoped lang="scss">
  .open-file {

    ul {
      padding-left: 0;
      position: relative;
      z-index: 200;

      li {
        padding: 1px 0 1px 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        .arrow {
          cursor: pointer;
          padding: 0 2px;

          .none-arrow {
            display: inline-block;
            width: 5px;
            height: 15px;
          }
        }

        .node {
          cursor: pointer;

          .icon {
            padding-right: 4px;
          }

          .name {
            font-size: $size-font + 2;
            overflow: hidden;
          }
        }
      }
    }
  }
</style>
