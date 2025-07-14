<template>
  <div>
    <label>Exercise</label>
    <select v-model="exercise" @change="oneRM = 100">
      <option>Bench Press</option>
      <option>Squat</option>
    </select>

    <label>1RM for Selected Exercise ({{ unit }})</label>
    <input v-model.number="oneRM" type="number" min="1" />

    <button @click="calculate">Calculate</button>

    <div class="output" v-if="output">
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['set-title'],
  props: {
    roundStep: {
      type: Number,
      default: 2.5
    },
    unit: {
      type: String,
      default: 'kg'
    }
  },
  data() {
    return {
      exercise: "Bench Press",
      oneRM: 100,
      output: ''
    }
  },
  mounted() {
    this.$emit('set-title', 'Hirvis Program (8 weeks)')
  },
  methods: {
    roundToStep(value) {
      const step = this.roundStep || 2.5
      return Math.round(value / step) * step
    },
    calculate() {
      const data = {
        "Bench Press": [
          { week: 1, day1: { sets: 8, reps: 8, percent: 0.7 }, day2: { sets: 8, reps: 1, percent: 0.9 } },
          { week: 2, day1: { sets: 7, reps: 7, percent: 0.75 }, day2: { sets: 8, reps: 1, percent: 0.9 } },
          { week: 3, day1: { sets: 6, reps: 6, percent: 0.8 }, day2: { sets: 8, reps: 1, percent: 0.9 } },
          { week: 4, day1: { sets: 5, reps: 5, percent: 0.85 }, day2: { sets: 8, reps: 1, percent: 0.9 } },
          { week: 5, day1: { sets: 4, reps: 4, percent: 0.9 }, day2: { sets: 8, reps: 1, percent: 0.9 } },
          { week: 6, day1: { sets: 3, reps: 3, percent: 0.95 }, day2: { sets: 8, reps: 1, percent: 0.9 } },
          { week: 7, day1: { sets: 2, reps: 2, percent: 1.0 }, day2: { sets: 8, reps: 1, percent: 0.9 } },
          { week: 8, day1: { sets: 1, reps: 1, percent: 1.05 }, day2: { sets: 8, reps: 1, percent: 0.9 } }
        ],
        "Squat": [
          { week: 1, day1: { sets: 5, reps: 5, percent: 0.75 }, day2: { sets: 3, reps: 3, percent: 0.85 } },
          { week: 2, day1: { sets: 5, reps: 5, percent: 0.8 }, day2: { sets: 3, reps: 3, percent: 0.87 } },
          { week: 3, day1: { sets: 4, reps: 4, percent: 0.85 }, day2: { sets: 3, reps: 3, percent: 0.9 } },
          { week: 4, day1: { sets: 4, reps: 4, percent: 0.9 }, day2: { sets: 3, reps: 3, percent: 0.92 } },
          { week: 5, day1: { sets: 3, reps: 3, percent: 0.92 }, day2: { sets: 3, reps: 3, percent: 0.94 } },
          { week: 6, day1: { sets: 3, reps: 3, percent: 0.95 }, day2: { sets: 3, reps: 3, percent: 0.96 } },
          { week: 7, day1: { sets: 2, reps: 2, percent: 1.0 }, day2: { sets: 3, reps: 3, percent: 0.98 } },
          { week: 8, day1: { sets: 1, reps: 1, percent: 1.05 }, day2: { sets: 3, reps: 3, percent: 1.0 } }
        ]
      }

      const weeks = data[this.exercise]
      let result = `Hirvis Program for ${this.exercise} (8 weeks)\n\n`

      weeks.forEach(({ week, day1, day2 }) => {
        const w1 = this.roundToStep(this.oneRM * day1.percent)
        const w2 = this.roundToStep(this.oneRM * day2.percent)

        result += `Week ${week}:\n`
        result += `  Day 1: ${day1.sets} x ${day1.reps} @ ${day1.percent * 100}% = ${w1} ${this.unit}\n`
        result += `  Day 2: ${day2.sets} x ${day2.reps} @ ${day2.percent * 100}% = ${w2} ${this.unit}\n\n`
      })

      result += "Note:\n- Day 1 are main sets\n- Day 2 are explosive sets"
      this.output = result
    }
  }
}
</script>
