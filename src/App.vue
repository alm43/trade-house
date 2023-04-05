<template>
    <div class="geo">
        <div>
            Гео
        </div>
        <CustomSelect
            :items="countries"
            :value-id="idCountry"
            value-select="name"
            label="Страна"
            @input="changeCountry($event)"
        />

        <CustomSelect
            :items="computedRegions"
            :value-id="idRegion"
            value-select="name"
            label="Регион"
            @input="changeRegion($event)"
        />

        <CustomSelect
            :items="computedCities"
            :value-id="idCity"
            value-select="name"
            label="Город"
            @input="changeCity($event)"
        />
    </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import CustomSelect from "./components/CustomSelect.vue"
import {countries, regions, cities} from "./data";

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

const changeCountry = (item: any) => {
    if (idCountry.value === item?.id) {
        return;
    }
    idCountry.value = item?.id || 0;
    idRegion.value = 0;
    idCity.value = 0;
}

const changeRegion = (item: any) => {
    if (idRegion.value === item?.id) {
        return;
    }
    idRegion.value = item?.id || 0;
    idCity.value = 0;
}

const changeCity = (item: any) => {
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
