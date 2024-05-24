<template>
    <fieldset id="fieldset" class="mt-3">
        <span v-if="props.label != ''" class="lable">{{ props.label }}</span>
        <lable v-else></lable>
        <slot> </slot>
    </fieldset>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
    label: string;
}>();


</script>


<style>
#fieldset {
    position: relative;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 20px 20px;
}

#fieldset .lable {
    position: absolute;
    transform: translate(20px, -30px);
    background-color: white;
    padding: 0px 10px;
}
</style>