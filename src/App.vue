<template>
  <div class="container">
    <h1 id="programTitle">{{ currentProgramTitle }}</h1>

    <label for="program">Select Program</label>
    <select id="program" v-model="selectedProgram">
      <option value="1rm">1RM Calculator</option>
      <option value="hirvis">Hirvis Program</option>
    </select>

    <label for="roundStep" v-if="selectedProgram !== '1rm'">Round weights to step</label>
    <select id="roundStep" v-model.number="roundStep" v-if="selectedProgram !== '1rm'">
      <option :value="2.5">2.5 kg</option>
      <option :value="5">5 kg</option>
    </select>

    <component
      :is="currentComponent"
      v-bind="selectedProgram !== '1rm' ? { roundStep } : {}"
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

export default {
  components: { OneRM, Hirvis },
  data() {
    return {
      selectedProgram: '1rm',
      currentProgramTitle: '1RM Calculator',
      roundStep: 2.5
    }
  },
  computed: {
    currentComponent() {
      switch (this.selectedProgram) {
        case '1rm': return 'OneRM'
        case 'hirvis': return 'Hirvis'
      }
    }
  },
  methods: {
    updateTitle(newTitle) {
      this.currentProgramTitle = newTitle
    }
  }
}
</script>

