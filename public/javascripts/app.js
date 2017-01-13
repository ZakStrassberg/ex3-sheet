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
        priority: 'primary',
        stats: {
          strength: 1,
          dexterity: 1,
          stamina: 1
        }
      },
      mental: {
        priority: 'secondary',
        stats: {
          intelligence: 1,
          perception: 1,
          wits: 1
        }
      },
      social: {
        priority: 'tertiary',
        stats: {
          charisma: 1,
          manipulation: 1,
          appearance: 1
        }
      }
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
    },
    merits: {
      selected: {test: 1},
      available: {
        allies: [1,3,5],
        ambidextrous: [1,2],
        artifact: [2,3,4,5],
        backing: [2,3,4,5],
        boundlessEndurance: [2],
        command: [2,3,4,5],
        contacts: [1,3,5],
        cult: [2,3,4,5],
        dangerSense: [3],
        demesne: [2,4],
        directionSense: [1],
        eideticMemory: [2],
        familiar: [1,2,3],
        fastReflexes: [3],
        fleetOfFoot: [4],
        followers: [1,2,3],
        giant: [4],
        hearthstone: [2,4],
        hideous: [0],
        influence: [1,2,3,4,5],
        ironStomach: [1],
        language: [1],
        manse: [3,5],
        mentor: [1,2,3],
        martialArtist: [4],
        mightyThew: [1,2,3],
        naturalImmunity: [2],
        painTolerance: [4],
        quickDraw: [1,4],
        retainers: [2,4],
        resources: [1,2,3,4,5],
        selectiveConception: [1],
        strongLungs: [1],
        temperedByTheElements: [2],
        toxinResistance: [3],
        chameleon: [3],
        claws: [1,4],
        enhancedSense: [3],
        exaltedHealing: [5],
        extraLimbs: [3],
        gills: [0,3],
        poisonedBody: [1,2,5],
        quills: [5],
        subtlety: [2],
        tail: [1,2],
        thaumaturgist: [5],
        unusualHide: [1,2,3,4,5],
        venomous: [3,5],
        wallWalking: [4],
        wings: [3,5],
        infernalNobility: [1],
        darkParamour: [2],
        unburntMajesty: [2],
        theBurningName: [2],
        suzerainOfEndlessFlame: [2],
        childOfMadness: [4],
        miraclesOfShadowAndChaos: [4],
        deepBreathCultivation: [5],
        flowingIntentionCultivation: [4],
        livingSpiritCultivation: [3],
        pureHeartCultivation: [2],
        vitalFocusCultivation: [3],
        astralMeditation: [1],
        eyeOfCrimsonWarning: [2]
      }
    },
    intimacies: {
      selected: [],
      new: {}
    }
  },
  methods: {
    
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
