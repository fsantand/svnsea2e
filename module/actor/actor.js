import { SVNSEA2E } from '../config.js'

/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class SvnSea2EActor extends Actor {
  /**
   * Augment the basic actor data with additional dynamic data.
   */
  prepareData () {
    super.prepareData()

    const actorData = this.data
    const data = actorData.data
    const flags = actorData.flags

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    if (actorData.type === 'playercharacter') this._preparePlayerCharacterData(data)
    if (actorData.type === 'hero') this._prepareHeroData(data)
    if (actorData.type === 'villain') this._prepareVillainData(data)
    if (actorData.type === 'monster') this._prepareMonsterData(data)
    if (actorData.type === 'brute') this._prepareBruteData(data)
    if (actorData.type === 'ship') this._prepareShipData(data)
  }

  _validateMinMaxData (value, min, max) {
    if (value > max) {
      return max
    } else if (value < min) {
      return min
    }
    return value
  }

  /**
   * Prepare Character type specific data
   */
  _preparePlayerCharacterData (data) {
    this._prepareWounds(data)
    this._prepareTraits(data)
    this._prepareSkills(data)
  }

  /**
   * Prepare Hero type specific data
   */
  _prepareHeroData (data) {
    this._prepareWounds(data)
    this._prepareTraits(data)
    this._prepareSkills(data)
  }

  /**
   * Prepare Villain type specific data
   */
  _prepareVillainData (data) {
    const villainy = (data.traits.strength.value + data.traits.influence.value)
    data.traits.villainy = {
      value: villainy,
      min: villainy,
      max: villainy
    }
    this._prepareTraits(data)
    this._calculateMaxWounds(data)
    this._prepareWounds(data)
  }

  /**
   * Prepare monster type specific data
   */
  _prepareMonsterData (data) {
    const villainy = (data.traits.strength.value + data.traits.influence.value)
    data.traits.villainy = {
      value: villainy,
      min: 0,
      max: villainy
    }
    this._prepareTraits(data)
    this._calculateMaxWounds(data)
    this._prepareWounds(data)
  }

  /**
   * Prepare Brute type specific data
   */
  _prepareBruteData (data) {
    data.traits.strength.value = this._validateMinMaxData(data.traits.strength.value, data.traits.strength.min, data.traits.strength.max)
    data.wounds.max = data.traits.strength.value
    data.wounds.value = this._validateMinMaxData(data.wounds.value, data.wounds.min, data.wounds.max)
    data.dwounds.value = 0
    data.dwounds.max = 0
  }

  /**
   * Prepar Ship type specific data
   */
  _prepareShipData (data) {

  }

  async removeFromCrew () {
    await this.unsetFlag('svnsea2e', 'crewMember')
  }

  async setCrewMemberRole (shipId, role) {
    return this.setFlag('svnsea2e', 'crewMember', {
      shipId: shipId,
      role: role
    })
  }

  _prepareTraits (data) {
    for (const trait of Object.values(data.traits)) {
      trait.value = this._validateMinMaxData(trait.value, trait.min, trait.max)
    }
  }

  _prepareSkills (data) {
    for (const skill of Object.values(data.skills)) {
      skill.value = this._validateMinMaxData(skill.value, skill.min, skill.max)
    }
  }

  _prepareWounds (data) {
    data.wounds.value = this._validateMinMaxData(data.wounds.value, data.wounds.min, data.wounds.max)
    data.dwounds.value = this._validateMinMaxData(data.dwounds.value, data.dwounds.min, data.dwounds.max)
  }

  _calculateMaxWounds (data) {
    data.wounds.max = data.traits.strength.value * 4
  }
}
