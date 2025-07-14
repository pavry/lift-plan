<template>
  <div class="zuluht-program">
    <h2>Standart Cluster (1RM)</h2>

    <div class="input-section">
      <div class="main-lifts">
        <div v-for="(lift, key) in lifts" :key="key" class="lift-row">
          <div>
            <span 
              v-if="!lift.editingName" 
              @click="editName(key)" 
              class="editable-name"
            >
              {{ lift.name }}
            </span>
            <input 
              v-else
              v-model="lift.name" 
              @blur="stopEditName(key)" 
              @keyup.enter="stopEditName(key)" 
              type="text" 
              class="name-input"
            />
          </div>
          <input 
            v-model.number="lift.value" 
            type="number" 
            min="1" 
            class="value-input"
          />
        </div>
      </div>

      <div class="cluster-section">
        <h3>Assistance A</h3>
        <div v-for="(ex, index) in assistanceA" :key="'assistA' + index" class="lift-row">
          <div>
            <span 
              v-if="!ex.editingName" 
              @click="editAssistName('A', index)" 
              class="editable-name"
            >
              {{ ex.name }}
            </span>
            <input
              v-else
              v-model="ex.name"
              @blur="stopEditAssistName('A', index)"
              @keyup.enter="stopEditAssistName('A', index)"
              type="text"
              class="name-input"
            />
          </div>
          <input
            v-model.number="ex.value"
            type="number"
            min="1"
            class="value-input"
          />
          <button 
            class="remove-btn" 
            @click="removeAssistance('A', index)" 
            title="Remove exercise"
          >×</button>
        </div>

        <h3>Assistance B</h3>
        <div v-for="(ex, index) in assistanceB" :key="'assistB' + index" class="lift-row">
          <div>
            <span 
              v-if="!ex.editingName" 
              @click="editAssistName('B', index)" 
              class="editable-name"
            >
              {{ ex.name }}
            </span>
            <input
              v-else
              v-model="ex.name"
              @blur="stopEditAssistName('B', index)"
              @keyup.enter="stopEditAssistName('B', index)"
              type="text"
              class="name-input"
            />
          </div>
          <input
            v-model.number="ex.value"
            type="number"
            min="1"
            class="value-input"
          />
          <button 
            class="remove-btn" 
            @click="removeAssistance('B', index)" 
            title="Remove exercise"
          >×</button>
        </div>
      </div>

      <button @click="generateProgram">Generate Program</button>
      <button @click="resetToDefault">Reset to default</button>
    </div>

    <pre class="output" v-if="output">{{ output }}</pre>
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
      lifts: {
        OH: { name: 'Overhead Press:', value: 80, editingName: false },
        SQ: { name: 'Squat:', value: 150, editingName: false },
        BP: { name: 'Bench Press:', value: 125, editingName: false },
        DL: { name: 'Deadlift:', value: 180, editingName: false }
      },
      assistanceA: [
        { name: 'Front Squat:', value: 100, editingName: false },
        { name: 'Romanian Deadlift:', value: 150, editingName: false },
        { name: 'Arnold Press:', value: 32, editingName: false }
      ],
      assistanceB: [
        { name: 'Incline Bench Press:', value: 100, editingName: false },
        { name: 'Barbell Row:', value: 40, editingName: false },
        { name: 'Chin-ups:', value: 15, editingName: false }
      ],
      output: ''
    };
  },
  mounted() {
    this.$emit('set-title', 'Zulu/HT Program (3 weeks)');

    const savedLifts = localStorage.getItem('zuluht-lifts');
    const savedAssistA = localStorage.getItem('zuluht-assistA');
    const savedAssistB = localStorage.getItem('zuluht-assistB');

    if (savedLifts) this.lifts = JSON.parse(savedLifts);
    if (savedAssistA) this.assistanceA = JSON.parse(savedAssistA);
    if (savedAssistB) this.assistanceB = JSON.parse(savedAssistB);
  },
  watch: {
    lifts: {
      handler(val) {
        localStorage.setItem('zuluht-lifts', JSON.stringify(val));
      },
      deep: true
    },
    assistanceA: {
      handler(val) {
        localStorage.setItem('zuluht-assistA', JSON.stringify(val));
      },
      deep: true
    },
    assistanceB: {
      handler(val) {
        localStorage.setItem('zuluht-assistB', JSON.stringify(val));
      },
      deep: true
    }
  },
  methods: {
    round(value) {
      return Math.round(value / this.roundStep) * this.roundStep;
    },
    editName(key) {
      this.lifts[key].editingName = true;
      this.$nextTick(() => {
        const inputs = this.$el.querySelectorAll('.name-input');
        if (inputs.length) {
          inputs[inputs.length - 1].focus();
          inputs[inputs.length - 1].select();
        }
      });
    },
    stopEditName(key) {
      this.lifts[key].editingName = false;
    },
    editAssistName(cluster, index) {
      if (cluster === 'A') this.assistanceA[index].editingName = true;
      else if (cluster === 'B') this.assistanceB[index].editingName = true;
      this.$nextTick(() => {
        const inputs = this.$el.querySelectorAll('.name-input');
        if (inputs.length) {
          inputs[inputs.length - 1].focus();
          inputs[inputs.length - 1].select();
        }
      });
    },
    stopEditAssistName(cluster, index) {
      if (cluster === 'A') this.assistanceA[index].editingName = false;
      else if (cluster === 'B') this.assistanceB[index].editingName = false;
    },
    removeAssistance(cluster, index) {
      if (cluster === 'A') this.assistanceA.splice(index, 1);
      else if (cluster === 'B') this.assistanceB.splice(index, 1);
    },
    resetToDefault() {
      localStorage.removeItem('zuluht-lifts');
      localStorage.removeItem('zuluht-assistA');
      localStorage.removeItem('zuluht-assistB');
      location.reload();
    },
    formatDay(lifts) {
      return lifts.map(lift => {
        const cleanName = lift.name.replace(/:$/, '').trim().toLowerCase();
        const weight = this.round((lift.percent / 100) * lift.estimate);
        return lift.estimate > 0
          ? `  - ${cleanName}: ${weight}/${lift.sets}x${lift.reps}`
          : `  - ${cleanName}: ${lift.sets}x${lift.reps}`;
      }).join('\n');
    },
    generateProgram() {
      const oneRM = {};
      for (const key in this.lifts) {
        oneRM[key] = this.lifts[key].value;
      }
    const weeks = [
        [
          [
            { name: this.lifts.OH.name, sets: 4, reps: 5, percent: 75, estimate: oneRM.OH },
            { name: this.lifts.SQ.name, sets: 4, reps: 10, percent: 65, estimate: oneRM.SQ },
            ...this.assistanceA.map(e => ({ name: e.name, sets: 3, reps: 12, percent: 60, estimate: e.value }))
          ],
          [
            { name: this.lifts.DL.name, sets: 4, reps: 5, percent: 75, estimate: oneRM.DL },
            { name: this.lifts.BP.name, sets: 4, reps: 10, percent: 65, estimate: oneRM.BP },
            ...this.assistanceB.map(e => ({ name: e.name, sets: 3, reps: 12, percent: 60, estimate: e.value }))
          ],
          [
            { name: this.lifts.SQ.name, sets: 4, reps: 5, percent: 75, estimate: oneRM.SQ },
            { name: this.lifts.OH.name, sets: 4, reps: 10, percent: 65, estimate: oneRM.OH },
            ...this.assistanceA.map(e => ({ name: e.name, sets: 3, reps: 12, percent: 60, estimate: e.value }))
          ],
          [
            { name: this.lifts.BP.name, sets: 4, reps: 5, percent: 75, estimate: oneRM.BP },
            { name: this.lifts.DL.name, sets: 4, reps: 10, percent: 65, estimate: oneRM.DL },
            ...this.assistanceB.map(e => ({ name: e.name, sets: 3, reps: 12, percent: 60, estimate: e.value }))
          ]
        ],
        [
          [
            { name: this.lifts.OH.name, sets: 4, reps: 4, percent: 80, estimate: oneRM.OH },
            { name: this.lifts.SQ.name, sets: 4, reps: 8, percent: 70, estimate: oneRM.SQ },
            ...this.assistanceA.map(e => ({ name: e.name, sets: 3, reps: 10, percent: 65, estimate: e.value }))
          ],
          [
            { name: this.lifts.DL.name, sets: 4, reps: 4, percent: 80, estimate: oneRM.DL },
            { name: this.lifts.BP.name, sets: 4, reps: 8, percent: 70, estimate: oneRM.BP },
            ...this.assistanceB.map(e => ({ name: e.name, sets: 3, reps: 10, percent: 65, estimate: e.value }))
          ],
          [
            { name: this.lifts.SQ.name, sets: 4, reps: 4, percent: 80, estimate: oneRM.SQ },
            { name: this.lifts.OH.name, sets: 4, reps: 8, percent: 70, estimate: oneRM.OH },
            ...this.assistanceA.map(e => ({ name: e.name, sets: 3, reps: 10, percent: 65, estimate: e.value }))
          ],
          [
            { name: this.lifts.BP.name, sets: 4, reps: 4, percent: 80, estimate: oneRM.BP },
            { name: this.lifts.DL.name, sets: 4, reps: 8, percent: 70, estimate: oneRM.DL },
            ...this.assistanceB.map(e => ({ name: e.name, sets: 3, reps: 10, percent: 65, estimate: e.value }))
          ]
        ],
        [
          [
            { name: this.lifts.OH.name, sets: 4, reps: 3, percent: 85, estimate: oneRM.OH },
            { name: this.lifts.SQ.name, sets: 4, reps: 6, percent: 75, estimate: oneRM.SQ },
            ...this.assistanceA.map(e => ({ name: e.name, sets: 3, reps: 8, percent: 70, estimate: e.value }))
          ],
          [
            { name: this.lifts.DL.name, sets: 4, reps: 3, percent: 85, estimate: oneRM.DL },
            { name: this.lifts.BP.name, sets: 4, reps: 6, percent: 75, estimate: oneRM.BP },
            ...this.assistanceB.map(e => ({ name: e.name, sets: 3, reps: 8, percent: 70, estimate: e.value }))
          ],
          [
            { name: this.lifts.SQ.name, sets: 4, reps: 3, percent: 85, estimate: oneRM.SQ },
            { name: this.lifts.OH.name, sets: 4, reps: 6, percent: 75, estimate: oneRM.OH },
            ...this.assistanceA.map(e => ({ name: e.name, sets: 3, reps: 8, percent: 70, estimate: e.value }))
          ],
          [
            { name: this.lifts.BP.name, sets: 4, reps: 3, percent: 85, estimate: oneRM.BP },
            { name: this.lifts.DL.name, sets: 4, reps: 6, percent: 75, estimate: oneRM.DL },
            ...this.assistanceB.map(e => ({ name: e.name, sets: 3, reps: 8, percent: 70, estimate: e.value }))
          ]
        ]
      ];

      let output = '';
      weeks.forEach((weekDays, i) => {
        output += `Week ${i + 1}\n--------------------------\n`;
        const days = ['Mon', 'Tue', 'Thu', 'Fri'];
        weekDays.forEach((day, idx) => {
          output += `${days[idx]}:\n${this.formatDay(day)}\n\n`;
        });
      });

      this.output = output.trim();
    }
  }
};
</script>


<style scoped>
.zuluht-program {
  max-width: 700px;
  margin: auto;
}
.input-section {
  margin-bottom: 2rem;
}
.main-lifts, .cluster-section {
  margin-bottom: 1.5rem;
}
.lift-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.editable-name {
  cursor: pointer;
  user-select: none;
  border-bottom: 1px dashed #000;
  min-width: 180px;
  display: inline-block;
}
.name-input {
  min-width: 180px;
  font-size: 1rem;
  padding: 2px 5px;
}
.value-input {
  width: 70px;
  font-size: 1rem;
  padding: 2px 5px;
}
.remove-btn {
  background: transparent;
  border: none;
  color: #c00;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  padding: 0 6px;
  user-select: none;
  transition: color 0.2s ease-in-out;
  box-shadow: none;
  margin-left: -8px;
  vertical-align: middle;
  width: auto;
  height: auto;
}
.remove-btn:hover {
  color: #f33;
  text-decoration: underline;
}
label {
  display: block;
  margin-top: 0.5rem;
}
input {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
}
pre.output {
  background-color: #f0f0f0;
  padding: 1rem;
  white-space: pre-wrap;
  border-radius: 5px;
}
button {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.4rem 0.8rem;
}
</style>
