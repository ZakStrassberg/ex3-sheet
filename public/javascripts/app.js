Vue.config.devtools = true
var app;
app = new Vue({
  el: '#app',
  data: {
    attributePoints: {primary: 8, secondary: 6, tertiary: 4}, // TODO: convert this to exalt specfic
    attributes: {
      strength: 1,
      dexterity: 0,
      stamina: 0,
      intelligence: 0,
      perception: 0,
      wits: 0,
      charisma: 0,
      manipulation: 0,
      appearance: 0
    },
    attributeRankings: {
      primary: [this.attributes.physical, this.attributePoints.primary],
      secondary: [this.attributes.social, this.attributePoints.secondary],
      tertiary: [this.attributes.mental, this.attributePoints.tertiary],
    }
  },
  methods: {},
  computed: {
    attributeAllocation: function() {
      for ( [ attributes , dots ] of this.attributeRankings ) {
        const dotSum = attributes => Object.values(attributes).reduce((a, b) => a + b) // http://stackoverflow.com/questions/16449295/how-to-sum-the-values-of-a-javascript-object
        if ( dotSum > dots ) {
          return { bonusPointsSpent: this.bonusSpent( dotSum - dots ) }
        } else {
          return { pointsLeft: dots - dotSum }
        }
      }
    }
  }
})