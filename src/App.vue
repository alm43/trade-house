<template>
    <div class="geo">
        <div>
            Гео
        </div>
        <CustomSelect
            :options="countries"
            option-key="name"
            :value-id="idCountry"
            label="Страна"
            @input="changeCountry($event)"
        />

        <CustomSelect
            :options="computedRegions"
            option-key="name"
            :value-id="idRegion"
            label="Регион"
            @input="changeRegion($event)"
        />

        <CustomSelect
            :options="computedCities"
            option-key="name"
            :value-id="idCity"
            label="Город"
            @input="changeCity($event)"
        />
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import CustomSelect from "./components/CustomSelect.vue"
import {countries, regions, cities} from "./data";
import {ICity, ICountry, IRegion} from "./types/geo";

const idCountry = ref(0)
const idRegion = ref(0)
const idCity = ref(0)

const computedRegions = computed(() => {
    return regions.filter((region) => region.idCountry === idCountry.value)
})

const computedCities = computed(() => {
    return cities.filter((city) => {
        if (idRegion.value) {
            return city.idRegion === idRegion.value
        }

        return city.idCountry === idCountry.value
    })
})

const changeCountry = (item: ICountry) => {
    if (idCountry.value === item?.id) {
        return;
    }
    idCountry.value = item?.id || 0;
    idRegion.value = 0;
    idCity.value = 0;
}

const changeRegion = (item: IRegion) => {
    if (idRegion.value === item?.id) {
        return;
    }
    idRegion.value = item?.id || 0;
    idCity.value = 0;
}

const changeCity = (item: ICity) => {
    if (!idRegion.value) {
        idRegion.value = item.idRegion;
    }
    idCity.value = item?.id || 0;
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
