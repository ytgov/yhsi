<template>
    <v-container fluid>
        <v-breadcrumbs :items="[
            { text: 'Home', to: '/', exact: true },
            { text: 'Burials', to: '/burials', exact: true },
            { text: 'New Burial', disabled: true }
        ]" divider=">" class="px-0"></v-breadcrumbs>
        <h3>Create Burial</h3>
        <BurialCreateForm />
    </v-container>
</template>

<script>
import BurialCreateForm from "@/components/Burials/BurialCreateForm.vue";

export default {
    name: "BurialsNewPage",
    components: {
        BurialCreateForm
    }
}
</script>
