Vue.config.devtools = true
var app;
app = new Vue({
  el: '#app',
  data: {
    attributePoints: {primary: 8, secondary: 6, tertiary: 4}, // TODO: convert this to exalt specfic
    attributes: {
      physical: {
        strength: 1,
        dexterity: 0,
        stamina: 0
      },
      mental: {
        intelligence: 0,
        perception: 0,
        wits: 0
      },
      social: {
        charisma: 0,
        manipulation: 0,
        appearance: 0
      }
    }
  },
  methods: {
    log: function() {
      console.log("log:")
      console.log(this.attributes.mental)
    }
  },
  computed: {
    attributeRankings: function() { // TODO: Move this to a method?

      for ( each in this.attributes ) {
        let dotSum = 0
        for ( attribute in this.attributes[each] ) {
          dotSum += this.attributes[each][attribute]
        }
        console.log(dotSum)
      }

      return  [ [this.attributes.physical, this.attributePoints.primary],
                [this.attributes.mental, this.attributePoints.secondary],
                [this.attributes.social, this.attributePoints.tertiary] ]
    },
    attributeAllocation: function() {
      let results = []

      for ( [ attributes , dots ] of this.attributeRankings ) {
        let dotSum = 0
        for (each in attributes ) {
          dotSum += attributes[each]
        }

        if ( dotSum > dots ) {
          results.push( { bonusPointsSpent: this.bonusSpent( dotSum - dots ) } )
        } else {
          results.push( { pointsLeft: dots - dotSum } )
        }
      }

      return { primary: results[0], secondary: results[1], tertiary: results[2] }
    }
  }
})