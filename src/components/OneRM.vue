<template>
  <div>
    <label>Lifted Weight (kg)</label>
    <input v-model.number="weight" type="number" min="1" />

    <label>Repetitions</label>
    <input v-model.number="reps" type="number" min="1" max="12" />

    <button @click="calculate">Calculate</button>

    <div class="output" v-if="output">{{ output }}</div>
  </div>
</template>

<script>
export default {
  emits: ['set-title'],
  data() {
    return {
      weight: 100,
      reps: 5,
      output: ''
    }
  },
  mounted() {
    this.$emit('set-title', '1RM Calculator')
  },
  methods: {
    calculate() {
      if (this.reps < 1 || this.reps > 12 || this.weight <= 0) {
        alert('Please enter valid inputs')
        return
      }

      const formulas = [
        { name: "Epley", calc: (w, r) => w * (1 + r / 30) },
        { name: "Brzycki", calc: (w, r) => w * (36 / (37 - r)) },
        { name: "Lombardi", calc: (w, r) => w * Math.pow(r, 0.10) },
        { name: "O'Conner", calc: (w, r) => w * (1 + 0.025 * r) },
        { name: "Wathan", calc: (w, r) => (w * 100) / (48.8 + 53.8 * Math.exp(-0.075 * r)) }
      ]

      const results = formulas.map(f => ({ name: f.name, value: f.calc(this.weight, this.reps) }))
      const avg = results.reduce((acc, cur) => acc + cur.value, 0) / results.length
      const rounded = Math.round(avg / 5) * 5

      this.output = `1RM for ${this.weight} kg x ${this.reps} reps:\n\n`
      results.forEach(r => {
        this.output += `${r.name}: ${r.value.toFixed(1)} kg\n`
      })
      this.output += `\nAverage: ${avg.toFixed(1)} → ${rounded} kg`
    }
  }
}
</script>
