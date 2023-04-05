<template>
    <div class="custom-select">
        <div
            :class="['search', {'search--active': isOpenSelect}]"
            @click="selectOpen"
        >
            <input
                disabled
                :value="findItem"
                type="text"
                class="search__input"
                :placeholder="label"
            >
            <span
                v-if="findItem"
                class="search__delete"
                @click.stop="changeSelect(null)"
            >×</span>
            <span
                v-if="items.length"
                :class="['search__arrow', { 'search__arrow--active': isOpenSelect }]"
            />
        </div>

        <transition name="custom-select__transition">
            <div
                v-if="isOpenSelect"
                class="custom-select__wrapper"
            >
                <div
                    :class="['custom-select__item', {'custom-select__item--active': item[valueSelect] === findItem}]"
                    v-for="(item, index) in items"
                    :key="index"
                    @click="changeSelect(item)"
                >
                    {{ item[valueSelect] }}
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";

interface Props {
    items: any[],
    valueSelect: string,
    valueId: number,
    label: string
}
const props = defineProps<Props>()

const emit = defineEmits<{
    (event: 'input', item: string): void;
}>();

const isOpenSelect = ref(false);

const findItem = computed(() => {
    if (!props.items.length || !props.valueId) {
        return '';
    }

    return props.items.find(item => item.id === props.valueId)[props.valueSelect];
})

const changeSelect = (item: any) => {
    selectClose();
    emit('input', item);
}

const selectOpen = () => {
    if (!props.items.length) {
        return;
    }
    isOpenSelect.value = true;
}
const selectClose = () => {
    isOpenSelect.value = false;
}
</script>

<style lang="scss">
$color-gray: #707070;
$color-gray-light: #dedede;
$transition-params: 300ms ease;
$br: 16px;

.custom-select {
    position: relative;
    color: #333333;
    font-family: sans-serif;
    font-size: 16px;

    .search {
        position: relative;
        border: 1px solid $color-gray;
        padding: 6px 49px 6px 12px;
        border-radius: $br;
        transition: border-radius $transition-params;
        cursor: pointer;

        &__delete {
            position: absolute;
            top: calc(50% - 11px);
            right: 30px;
            color: $color-gray;
            transition: color $transition-params;

            &:hover {
                color: red;
            }
        }

        &--active {
            border-radius: $br $br 0 0;
        }

        &__input {
            background: inherit;
            cursor: unset;
            width: 100%;
            font-size: inherit;
            border: unset;
            margin: unset;
            padding: unset;
            outline: unset;
        }

        &__arrow {
            position: absolute;
            display: block;
            content: '';
            right: 10px;
            top: calc(50% - 5px);
            padding: 3px;
            border-left: 1.6px solid $color-gray;
            border-top: 1.6px solid $color-gray;
            transform: rotate(-135deg);
            transition: all $transition-params;

            &--active {
                transform: rotate(45deg);
                top: calc(50% - 3px);
            }
        }
    }

    &__wrapper {
        max-height: 200px;
        overflow: auto;
        border-radius: 0 0 $br $br;
        border-left: 1px solid $color-gray;
        border-bottom: 1px solid $color-gray;
        border-right: 1px solid $color-gray;
        position: absolute;
        z-index: 1;
        width: calc(100% - 2px);
        background: white;

        &::-webkit-scrollbar {
            width: 0;
        }
    }

    &__item {
        transition: background 150ms ease;
        cursor: pointer;
        padding: 6px 12px;

        &:hover, &--active {
            background: $color-gray-light;
        }
    }

    &__transition {
        &-enter-active,
        &-leave-active {
            transition: opacity $transition-params;
        }

        &-enter-from,
        &-leave-to {
            opacity: 0;
        }
    }
}
</style>