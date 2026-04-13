<template>
    <v-form
        ref="formRef"
        @submit.prevent="validateAndCreate"
    >
        <v-row>
            <v-col
				cols="12"
				class="d-flex"
			>
                <v-spacer />
                <v-btn
					class="black--text mx-3"
                    @click="goBack"
				>
					<v-icon>mdi-close</v-icon>
					Cancel
				</v-btn>
                <v-btn type="submit" color="success" >
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Create Burial
				</v-btn>
            </v-col>
        </v-row>
        <v-expansion-panels v-model="panels" multiple>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h2>Information</h2>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-col cols="6">
                            <h4 class="mb-3">Name</h4>
                            <v-text-field
                                name="FirstName"
                                label="First Name"
                                outlined
                                dense
                                v-model="burial.FirstName"
                            />
                            <v-text-field
                                name="LastName"
                                label="Last Name"
                                outlined
                                dense
                                v-model="burial.LastName"
                            />
                        </v-col>
                        <v-col cols="6">
                            <h4 class="mb-3">Origin</h4>

                            <v-autocomplete
                                v-model="burial.OriginCountry"
                                :items="getCountries"
                                outlined
                                dense
                                item-text="label"
                                item-value="label"
                                label="Origin Country"
                            >
                                <template v-slot:selection="data">
                                    <v-img
                                        :src="`https://flagcdn.com/w20/${data.item.code.toLowerCase()}.png`"
                                        :lazy-src="`https://flagcdn.com/w20/${data.item.code.toLowerCase()}.png`"
                                        class="mr-2"
                                        max-width="20"
                                    ></v-img>
                                    {{ data.item.label }}
                                </template>
                                <template v-slot:item="data">
                                    <v-img
                                        :src="`https://flagcdn.com/w20/${data.item.code.toLowerCase()}.png`"
                                        :lazy-src="`https://flagcdn.com/w20/${data.item.code.toLowerCase()}.png`"
                                        class="mr-2"
                                        max-width="20"
                                    ></v-img>
                                    <v-list-item-content>
                                        <v-list-item-title
                                            v-html="data.item.label"
                                        ></v-list-item-title>
                                    </v-list-item-content>
                                </template>
                            </v-autocomplete>

                            <v-text-field
                                v-model="burial.OriginState"
                                name="Province"
                                outlined
                                dense
                                label="Province/State of Origin"
                            />
                            <v-text-field
                                v-model="burial.OriginCity"
                                name="City"
                                outlined
                                dense
                                label="City of Origin"
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <h4 class="mb-3">Birth / Death</h4>
                            <v-row>
                                <v-col cols="4">
                                    <v-text-field
                                        outlined
                                        dense
                                        name="Birth Day"
                                        label="Birth Day"
                                        v-model="burial.BirthDay"
                                        
                                    />
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field
                                        outlined
                                        dense
                                        name="Birth Month"
                                        label="Birth Month"
                                        v-model="burial.BirthMonth"
                                        
                                    />
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field
                                        outlined
                                        dense
                                        name="Birth Year"
                                        label="Birth Year"
                                        v-model="burial.BirthYear"
                                    />
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="4">
                                    <v-text-field
                                        outlined
                                        dense
                                        name="Death Day"
                                        label="Death Day"
                                        v-model="burial.DeathDay"
                                    />
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field
                                        outlined
                                        dense
                                        name="Death Month"
                                        label="Death Month"
                                        v-model="burial.DeathMonth"
                                    />
                                </v-col>
                                <v-col cols="4">
                                    <v-text-field
                                        outlined
                                        dense
                                        name="Death Year"
                                        label="Death Year"
                                        v-model="burial.DeathYear"
                                    />
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="6">
                            <h4 class="mb-3">Age</h4>
                            <v-text-field
                                v-model="burial.Age"
                                name="Age"
                                label="Age"
                                outlined
                                dense
                            />
                        </v-col>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h2>History</h2>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-col cols="3">
                            <h4 class="mt-5 mb-5">Religion</h4>
                            <v-select
                                v-model="burial.Religion"
                                :items="religions"
                                item-value="ReligionLUpID"
                                item-text="Religion"
                                label="Religion"
                                outlined
                                dense
                            />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="6">
                            <h4 class="my-5">Person Notes</h4>
                            <v-textarea
                                v-model="burial.PersonNotes"
                                label="Notes"
                                name="Notes"
                                outlined
                                dense
                            />
                        </v-col>
                        <v-col cols="6">
                            <h4 class="my-5">Gender</h4>
                                <v-radio-group
                                    v-model="burial.Gender"
                                    row
                                >
                                    <v-radio
                                        label="Male"
                                        value="Male"
                                    />
                                    <v-radio
                                        label="Female"
                                        value="Female"
                                    />
                                    <v-radio
                                        label="Other"
                                        value="Other"
                                    />
                                </v-radio-group>
                        </v-col>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h2>Death</h2>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-col cols="3">
                            <h4 class="my-5">Circumstance of Death</h4>
                            <v-select
                                v-model="burial.Manner"
                                :items="['Natural', 'Accidental', 'Murder', 'Unknown']"
                                label="Manner"
                                outlined
                                dense
                            />
                            <v-select
                                v-model="burial.Cause"
                                :items="causes"
                                item-text="Cause"
                                label="Cause"
                                outlined
                                dense
                                return-object
                            />
                        </v-col>
                        <v-col cols="3">
                            <h4 class="my-5">Funeral and Obituaries</h4>
                            <v-text-field
                                v-model="burial.FuneralPaidBy"
                                label="Funeral paid by"
                                name="FunneralPaidBy"
                                outlined
                                dense
                            />
                        </v-col>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    <h2>Burial</h2>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row>
                        <v-col cols="4">
                            <v-row>
                                <v-col cols="6">
                                    <h4 class="my-5">Buried in Yukon?</h4>
                                </v-col>
                                <v-col cols="6">
                                    <v-radio-group
                                        v-model="burial.BuriedInYukon"
                                        row
                                    >
                                        <v-radio
                                            label="Yes"
                                            value="y"
                                        />
                                        <v-radio
                                            label="No"
                                            value="n"
                                        />
                                    </v-radio-group>
                                </v-col>
                            </v-row>

                            <v-text-field
                                v-model="burial.DestinationShipped"
                                name="DestinationBodyShipped"
                                label="if No, Destination body shipped"
                                outlined
                                dense
                            />
                            <v-text-field
                                v-model="burial.BurialLocation"
                                name="YukonBurialLocation"
                                label="Yukon Burial Location"
                                outlined
                                dense
                            />
                            <v-text-field
                                v-model="burial.Other"
                                name="Other"
                                label="if Other, Please specify"
                                outlined
                                dense
                            />
                            <v-text-field
                                v-model="burial.PlotDescription"
                                name="PlotDescription"
                                label="Plot description"
                                outlined
                                dense
                            />
                        </v-col>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </v-form>
</template>

<script>
import catalogs from '@/controllers/catalogs';
import burials from '@/controllers/burials';
import countries from '@/misc/countries';

export default {
    name: "BurialCreateForm",
    data: () => ({
        panels: [0, 1, 2, 3],
        burial: {
            FirstName: undefined,
            LastName: undefined,
            OriginCountry: undefined,
            OriginState: undefined,
            OriginCity: undefined,
            BirthDate: undefined,
            DeathDate: undefined,
            Age: undefined,
            Religion: undefined,
            Occupations: [],
            Memberships: [],
            Gender: undefined,
            Notes: undefined,
            Manner: undefined,
            Cause: undefined,
            FuneralPaidBy: undefined,
            Sources: [],
            Kinships: [],
            BuriedInYukon: undefined,
            BodyShipped: undefined,
            BurialLocation: undefined,
            Other: undefined,
            PlotDescription: undefined,
            CemetaryID: undefined,
            Cemetary: undefined,
            SiteVisits: [],
        },
        causes: [],
        religions: []
    }),
    async mounted() {
        try {
            this.causes = await catalogs.getCauses();
            this.religions = await catalogs.getReligions();
        } catch (error) {
            console.error(error);
        }
    },
    methods: {
        async validateAndCreate(){
            const valid = this.$refs.formRef.validate();
            if(!valid) return

            try {
                // This needs a refactoring
                const { Occupations, Memberships, Sources, Kinships, SiteVisits, Cause, Cemetary, Religion, ...fields } = this.burial
                const data = {
                    burial: { ...fields },
                    Occupations, 
                    Memberships, 
                    Sources, 
                    Kinships, 
                    SiteVisits,
                    CauseID: (Cause && Cause.CauseLUpID) ? Cause.CauseLUpID : null,
                    CemetaryID: (Cemetary && Cemetary.CemetaryLUpID) ? Cemetary.CemetaryLUpID : null,
                    ReligionLUpID: (Religion && Religion.ReligionLUpID) ? Religion.ReligionLUpID : null
                }

                const result = await burials.post(data)

                if (result && result.BurialID) {
                    this.$router.push(`/burials/view/${result.BurialID}`)
                } else {
                    this.$router.push('/burials')
                }
            } catch (error) {
                console.error(error)
            }
        },
        goBack() {
            this.$router.push('/burials')
        }
    },
    computed: {
        getCountries() {
            return countries;
        }
    }
}
</script>