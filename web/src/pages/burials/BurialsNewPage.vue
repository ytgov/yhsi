<template>
    <v-container fluid>
        <h3>Create Burial</h3>
        <Breadcrumbs />
        <BurialCreateForm />
    </v-container>
</template>

<script>
import Breadcrumbs from "@/components/Breadcrumbs.vue";

import BurialCreateForm from "@/components/Burials/BurialCreateForm.vue";

export default {
    name: "BurialsNewPage",
    components: {
        Breadcrumbs,
        BurialCreateForm
    }
}
</script>