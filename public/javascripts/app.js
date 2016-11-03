Vue.config.devtools = true
var app;
app = new Vue({
  el: '#app',
  data: {
    character: {
      name: '',
      player: '',
      characterType: 'solar',
      caste: 'dawn',
      concept: '',
      anima: ''
    },
    characterTypes: {
      solar: {
        attributePoints: {primary: 8, secondary: 6, tertiary: 4},
        abilityPoints: 28,
        castes: {
          dawn: new Set(['archery', 'awareness', 'brawl', 'dodge', 'melee', 'resistance', 'thrown', 'war']),
          zenith: [],
          twilight: [],
          night: [],
          eclipse: []
        }
      },
      mortal: {
        attributePoints: {primary: 6, secondary: 4, tertiary: 3},
        abilityPoints: 28
      }
    },
    attributes: {
      physical: {
        strength: 1,
        dexterity: 1,
        stamina: 1
      },
      mental: {
        intelligence: 1,
        perception: 1,
        wits: 1
      },
      social: {
        charisma: 1,
        manipulation: 1,
        appearance: 1
      }
    },
    attributePriority: {
      physical: 'primary',
      mental: 'secondary',
      social: 'tertiary'
    },
    abilities: {
      archery: 0,
      athletics: 0,
      awareness: 0,
      brawl: 0,
      bureaucracy: 0,
      craft: 0,
      dodge: 0,
      integrity: 0,
      investigation: 0,
      larceny: 0,
      linguistics: 0,
      lore: 0,
      martialArts: 0,
      medicine: 0,
      melee: 0,
      occult: 0,
      performance: 0,
      presence: 0,
      resistance: 0,
      ride: 0,
      sail: 0,
      socialize: 0,
      stealth: 0,
      survival: 0,
      thrown: 0,
      war: 0
    },
    abilitiesSelected: {
      caste: [],
      favored: [],
      supernal: ''
    }
  },
  methods: {
    changeAttributePriority: function(group, priority) {
      priorities = new Set(['primary', 'secondary', 'tertiary'])
      var toChange
      for (each in this.attributePriority) {
        if ( group != each ) {
          priorities.delete(this.attributePriority[each])
          if ( this.attributePriority[each] == priority ) {
            toChange = each
          }
        } else { this.attributePriority[group] = priority }
      }
      this.attributePriority[toChange] = [...priorities][0]
    },
  },
  computed: {
    attributePointsSpent: function() {
      let results = {}
      for ( group in this.attributes ) {
        let dotSum = 0
        for ( attribute in this.attributes[group] ) {
          dotSum += this.attributes[group][attribute] - 1
        }
        let total = this.characterTypes[this.character.characterType].attributePoints[this.attributePriority[group]]
        let remaining = total - dotSum
        let bpSpent = 0
        if (remaining < 0) {
          bpSpent = this.attributePriority[group] == 'tertiary' ? Math.abs(remaining) * 3 : Math.abs(remaining) * 4
        }
        results[group] = {
          total: total,
          used: dotSum,
          remaining: remaining,
          bonusPointsSpent: bpSpent
        }
      }
      return results
    },
    abilityPointsSpent: function() {
      let total = this.characterTypes[this.character.characterType].abilityPoints
      let unfavored = [0,0]
      let casteOrFavored = [0,0]
      let remaining = total
      for (each in this.abilities) {
        if ( this.abilitiesSelected.caste.includes(each) || this.abilitiesSelected.favored.includes(each) ) {
          casteOrFavored[0] += Math.min(this.abilities[each], 3)
          casteOrFavored[1] += Math.max(this.abilities[each] - 3, 0)
        } else {
          unfavored[0] += Math.min(this.abilities[each], 3)
          unfavored[1] += Math.max(this.abilities[each] - 3, 0)
        }
      }
      let used = Math.min(unfavored[0] + casteOrFavored[0], total)

      while ( remaining > 0 ) {
        if ( unfavored[0] > 0 ) {
          unfavored[0]--
          remaining--
        } else if ( casteOrFavored[0] > 0 ) {
          casteOrFavored[0]--
          remaining--
        } else {
          break
        }
      }

      bpSpent = (unfavored[0] + unfavored[1]) * 2 + casteOrFavored.reduce( function( a, b ) { return a + b } )

      return {
        total: total,
        used: used,
        remaining: total - used,
        bonusPointsSpent: bpSpent
      }
    }
  },
  filters: {
    capitalize: function ( value ) {
      if ( !value ) return ''
      value = value.toString()
      return value.charAt( 0 ).toUpperCase() + value.slice( 1 )
    }
  }
})