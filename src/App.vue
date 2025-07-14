<template>
  <div class="container">
    <h1 id="programTitle">{{ currentProgramTitle }}</h1>

    <label for="program">Select Program</label>
    <select id="program" v-model="selectedProgram">
      <option value="1rm">1RM Calculator</option>
      <option value="hirvis">Hirvis Program</option>
      <option value="zuluht">Zulu/HT Program</option>
    </select>

    <label for="unit">Unit</label>
    <select id="unit" v-model="unit">
      <option value="kg">kg</option>
      <option value="lb">lb</option>
    </select>

    <label for="roundStep" v-if="selectedProgram !== '1rm'">Smallest Plate</label>
    <select id="roundStep" v-model.number="roundStep" v-if="selectedProgram !== '1rm'">
      <option :value="2.5">2.5 {{ unit }}</option>
      <option :value="5">5 {{ unit }}</option>
    </select>

    <component
      :is="currentComponent"
      v-bind="{ unit, ...(selectedProgram !== '1rm' ? { roundStep } : {}) }"
      @set-title="updateTitle"
    />

    <footer class="footer">
      <p>
        View source on
        <a
          href="https://github.com/pavry/lift-plan"
          target="_blank"
          rel="noopener noreferrer"
        >GitHub</a>
      </p>
    </footer>
  </div>
</template>


<script>
import OneRM from './components/OneRM.vue'
import Hirvis from './components/Hirvis.vue'
import ZuluHT from './components/ZuluHT.vue'

export default {
  components: { OneRM, Hirvis, ZuluHT },
  data() {
    return {
      selectedProgram: '1rm',
      currentProgramTitle: '1RM Calculator',
      roundStep: 2.5,
      unit: 'kg'
    }
  },
  computed: {
    currentComponent() {
      switch (this.selectedProgram) {
        case '1rm': return 'OneRM'
        case 'hirvis': return 'Hirvis'
        case 'zuluht': return 'ZuluHT'
      }
    }
  },
  watch: {
    selectedProgram(newVal) {
      localStorage.setItem('selectedProgram', newVal)
    },
    unit(newVal) {
      localStorage.setItem('unit', newVal)
    },
    roundStep(newVal) {
      localStorage.setItem('roundStep', newVal)
    }
  },
  methods: {
    updateTitle(newTitle) {
      this.currentProgramTitle = newTitle
    }
  },
  created() {
    const savedProgram = localStorage.getItem('selectedProgram')
    const savedUnit = localStorage.getItem('unit')
    const savedRoundStep = localStorage.getItem('roundStep')

    if (savedProgram) this.selectedProgram = savedProgram
    if (savedUnit) this.unit = savedUnit
    if (savedRoundStep) this.roundStep = parseFloat(savedRoundStep)
  }
}
</script>



