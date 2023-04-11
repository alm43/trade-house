<template>
    <div
        ref="customSelect"
        class="custom-select"
    >
        <div
            :class="['search', {'search--active': isOpenSelect}]"
            @click="selectOpen"
        >
            <input
                :disabled="!isNeedSearch || !options.length"
                :value="selected"
                type="text"
                class="search__input"
                :placeholder="label"
                @input="inputSearch"
            >
            <span
                v-if="selected"
                class="search__delete"
                @click.stop="changeSelect(null)"
            >×</span>
            <span
                v-if="options.length"
                :class="['search__arrow', { 'search__arrow--active': isOpenSelect }]"
            />
        </div>

        <transition name="custom-select__transition">
            <div
                v-if="isOpenSelect"
                class="custom-select__wrapper"
            >
                <div
                    v-for="option in filteredOptions"
                    :class="['custom-select__item', {'custom-select__item--active': option[optionUid] === selectedUid}]"
                    :key="option[optionUid]"
                    @click="changeSelect(option)"
                >
                    {{ option[optionKey] }}
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";

type option = any;
interface Props {
    options: option[],
    /** ключ - какое значение выводить в опции и фильтровать. options[optionKey] */
    optionKey: keyof option,
    /** ключ - указывает UID объекта. options[optionUid] */
    optionUid: keyof option,
    /** выбранная опция */
    optionSelected: option,
    label: string,
    /** обычный поиск по вхождению строки */
    isNeedSearch?: boolean
    /** реализация своего поиска, через event: 'inputSearch' */
    isCustomSearch?: boolean
}
const props = withDefaults(defineProps<Props>(),{
    isNeedSearch: false,
    isCustomSearch: false
})

const emit = defineEmits<{
    (event: 'input', selectOption: any): void;
    (event: 'inputSearch', filterSearch: string): void;
}>();

const isOpenSelect = ref(false);
/** outside click */
const customSelect = ref<HTMLDivElement | null>(null);
const filterSearch = ref('');

const selected = computed(() => {
    if (!props.optionSelected) {
        return;
    }
    return props.optionSelected[props.optionKey];
})

const selectedUid = computed(() => {
    if (!props.optionSelected) {
        return;
    }
    return props.optionSelected[props.optionUid];
})

const filteredOptions = computed(() => {
    if (props.isCustomSearch || !filterSearch.value.length) {
        return props.options;
    }

    return props.options.filter((option) => {
        return option[props.optionKey].toLowerCase().includes(filterSearch.value.toLowerCase());
    })
})

const inputSearch = (event: Event) => {
    filterSearch.value = (event.target as HTMLInputElement).value
    if (props.isCustomSearch) {
        emit('inputSearch', filterSearch.value);
    }
}

const changeSelect = (selectOption: any) => {
    selectClose();
    emit('input', selectOption);
}

const selectOpen = () => {
    if (!props.options.length || isOpenSelect.value) {
        return;
    }

    document.addEventListener('click', selectClose);
    isOpenSelect.value = true;
}

const selectClose = (event?: MouseEvent) => {
    if (event && customSelect.value?.contains(event.target as Node)) {
        return;
    }

    filterSearch.value = '';
    emit('inputSearch', filterSearch.value);
    document.removeEventListener('click', selectClose);
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
        background: white;
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
