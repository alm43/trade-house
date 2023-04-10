<template>
    <div class="geo">
        <div>
            Гео
        </div>
        <CustomSelect
            :options="countries"
            option-key="name"
            option-uid="id"
            :option-selected="selectedCountry"
            label="Страна"
            @input="changeCountry($event)"
        />

        <CustomSelect
            :options="computedRegions"
            option-key="name"
            option-uid="id"
            :option-selected="selectedRegion"
            label="Регион"
            @input="changeRegion($event)"
        />

        <CustomSelect
            :options="computedCities"
            option-key="name"
            option-uid="id"
            :option-selected="selectedCity"
            label="Город"
            @input="changeCity($event)"
        />
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import CustomSelect from "./components/CustomSelect.vue"
import {countries, regions, cities} from "./data";
import {ICountry, IRegion ,ICity} from "./types/geo";

const selectedCountry = ref<ICountry | null>(null)
const selectedRegion = ref<IRegion | null>(null)
const selectedCity = ref<ICity | null>(null)

const computedRegions = computed(() => {
    return regions.filter((region) => region.idCountry === selectedCountry.value?.id)
})

const computedCities = computed(() => {
    return cities.filter((city) => {
        if (selectedRegion.value) {
            return city.idRegion === selectedRegion.value.id
        }

        return city.idCountry === selectedCountry.value?.id
    })
})

const changeCountry = (selectOption: ICountry) => {
    if (selectedCountry.value === selectOption) {
        return;
    }
    selectedCountry.value = selectOption || null;
    selectedRegion.value = null;
    selectedCity.value = null;
}

const changeRegion = (selectOption: IRegion) => {
    if (selectedRegion.value === selectOption) {
        return;
    }
    selectedRegion.value = selectOption || null;
    selectedCity.value = null;
}

const changeCity = (selectOption: ICity) => {
    if (!selectedRegion.value) {
        selectedRegion.value = regions.find((region) => region.id === selectOption.idRegion) || null;
    }
    selectedCity.value = selectOption || null;
}
</script>

<style lang="scss">
.geo {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 1000px;
}
</style>
