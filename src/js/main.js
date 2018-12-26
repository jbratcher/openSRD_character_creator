////////////////////////////////////////
// Imports
////////////////////////////////////////
import * as func from './functions.js';
import * as ele from './domElements.js';
import { Abilities, Alignments, ClassList, Classes, Levels, Languages, Races, RaceList, Skills } from './characterInfo.js';
// Initialize  global variables
var modifier; // integer value that increases or decreases key values
var totalMod; // integer value to combine modifier values before adding to key value
var abilityScore; // character ability score
var abilityScoreMod; // character ability score modifier
var proficiencyBonus;
var singleWord = /(\w+)/; // capture a single word (i.e. 'strength')
// Setters for ability scores (string for textContent display)
var strength = "0";
var dexerity = "0";
var constitution = "0";
var intelligence = "0";
var wisdom = "0";
var charisma = "0";
////////////////////////////////////////////////////////////
// Get character info input elements, populate with data
// and add dynamic updating
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
// General Info / User Input
////////////////////////////////////////////////////////////
// User input in chronological order
// Class Select
// Add available classes to select and set value of class
func.addOptionsToSelect(ele.cls, ClassList);
var selectedClass = ele.cls.options[ele.cls.selectedIndex];
var charClass = selectedClass.textContent.toLowerCase();
// Set value of character property to current selected item
// const setCharacterProperty = (property: string, selectElement: HTMLSelectElement) => {
//   let selectedPropertyIndex = <HTMLOptionElement>selectElement.options[selectElement.selectedIndex];
//   property = selectedPropertyIndex.textContent.toLowerCase().replace(/-/g,"");
// }
// Set value of class variable to current selected item
var setClass = function () {
    selectedClass = ele.cls.options[ele.cls.selectedIndex];
    charClass = selectedClass.textContent.toLowerCase().replace(/-/g, "");
};
// Set class description text and change on class selection change
func.setText(ele.classHelp, Classes[charClass].info);
// Race Select
func.addOptionsToSelect(ele.race, RaceList);
var selectedRace = ele.race.options[ele.race.selectedIndex];
var charRace = selectedRace.textContent.toLowerCase().replace(/-/g, ""); // "i.e. human, halfelf, halforc"
var setRace = function () {
    charRace = ele.race.options[ele.race.selectedIndex].textContent.toLowerCase().replace(/-/g, "");
};
func.setText(ele.raceHelp, Races[charRace].info);
// Subrace Select (Optional, if subrace exists)
var charSubrace = ele.subrace.textContent.toLowerCase().replace(/-|\s/g, "");
// Subrace select
var showOptionalSubraceSelect = function () {
    setRace();
    // Reset any subrace from previous selection
    ele.subrace.innerHTML = "";
    ele.subraceHelp.textContent = "";
    charSubrace = null;
    // if race has a subrace, show and populate subrace select element
    Races[charRace].subrace
        ? (func.addOptionsToSelect(ele.subrace, ["-"]), // Make first option "null"
            func.addOptionsToSelect(ele.subrace, Races[charRace].subrace.name),
            ele.subraceSelectSection.classList.remove('d-none'))
        : ele.subraceSelectSection.classList.add('d-none');
};
var setSubrace = function () {
    // if subrace exists for selected race, subrace element is shown, otherwise it stays hidden
    if (!ele.subrace.parentElement.classList.contains("d-none")) {
        charSubrace = ele.subrace.options[ele.subrace.selectedIndex].textContent.toLowerCase().replace(/-|\s/g, ""); // normalize subrace text to all lowercase joined letters
    }
    else {
        return null;
    }
};
// Alignment
func.addOptionsToSelect(ele.alignment, Alignments);
var selectedAlignment = ele.alignment.options[ele.alignment.selectedIndex];
var charAlignment = selectedAlignment.textContent; // "Lawful Good, Chaotic Evil, True Neutral"
var setAlignment = function () {
    var charAlignment = selectedAlignment.textContent;
};
// limits alignment options to race recommendations
var availableAlignments = function () {
    ele.alignment.innerHTML = ""; // reset alignment select options
    setRace();
    func.addOptionsToSelect(ele.alignment, Races[charRace].alignments);
};
// Name
// see domElements.ts
// Gender
var charGender = ele.gender.value.toLowerCase();
// Age
// Displays race specific age help text on race selection
var ageHelpText = function () {
    setRace();
    func.setText(ele.ageHelp, func.capitialize(charRace) + " age ranges between " + Races[charRace].age.min + " and  " + Races[charRace].age.max);
};
// Iniialize help text on page load
ageHelpText();
// Dragonborn: Draconic Ancestry / Dragonborn "subrace"
var showDraconicAncestrySelect = function () {
    setRace();
    // if ancestry exists, populate and show ancestry select element 
    Races[charRace].special.draconicAncestry
        ? (func.addOptionsToSelect(ele.draconicAncestry, Races[charRace].special.draconicAncestry.types),
            ele.draconicAncestryHelp.textContent = 'Choose a dragon lineage.',
            ele.draconicAncestrySection.classList.remove('d-none'))
        : (ele.draconicAncestrySection.classList.add('d-none'),
            ele.draconicAncestryHelp.textContent = '');
};
// Initialize on page load
showDraconicAncestrySelect();
// Extra Language Selection: Human and Half-elf
// Display extra language select element if race selection is Human, Half-Elf, or High Elf and populate with language options
func.addOptionsToSelect(ele.extraLanguage, Languages.standard);
var showExtraLanguageInput = function () {
    setRace();
    setSubrace();
    charRace === 'human'
        ? (ele.extraLanguageField.classList.remove('d-none'),
            func.setText(ele.extraLanguageHelp, "Humans get to choose 1 extra language"))
        : charRace === 'halfelf'
            ? (ele.extraLanguageField.classList.remove('d-none'),
                func.setText(ele.extraLanguageHelp, "Half-Elves get to choose 1 extra language"))
            : charSubrace === 'highelf'
                ? (ele.extraLanguageField.classList.remove('d-none'),
                    func.setText(ele.extraLanguageHelp, "High Elves get to choose 1 extra language"))
                : (ele.extraLanguageField.classList.add('d-none'),
                    ele.extraLanguageHelp.textContent = '');
};
// Skill select
func.addOptionsToSelect(ele.skill1, Skills);
var skillList1 = ele.skill1.children;
func.addOptionsToSelect(ele.skill2, Skills);
var skillList2 = ele.skill2.children;
func.addOptionsToSelect(ele.skill3, Skills);
var skillList3 = ele.skill3.children;
var availableSkills = Classes[charClass].availableSkills;
var selectedSkill1 = ele.skill1.options[ele.skill1.selectedIndex];
var selectedSkill2 = ele.skill2.options[ele.skill2.selectedIndex];
var selectedSkill3 = ele.skill3.options[ele.skill3.selectedIndex];
// Skill functions
var highlightAvailableSkills = function () {
    setClass();
    availableSkills = Classes[charClass].availableSkills;
    func.addOptionsToSelect(ele.skill1, availableSkills);
    func.addOptionsToSelect(ele.skill2, availableSkills);
    func.addOptionsToSelect(ele.skill3, availableSkills);
};
// Initialize state for selected class on document load
highlightAvailableSkills();
////////////////////////////////////////////////////////////
// General Preview information
////////////////////////////////////////////////////////////
// General functions
var charImageSet = function () {
    var characterAttributes = func.getCharacterAttributes(charClass, charRace, charGender);
    ele.characterImg.src = func.getCharacterImage(characterAttributes);
};
var charLevelUp = function () {
    ele.currentLevel.textContent = String(Number(ele.currentLevel.textContent) + 1);
    ele.experienceNextLevel.textContent = String(Levels[Number(ele.currentLevel.textContent) - 1].experience);
    updateProficiencyBonus();
};
var updateProficiencyBonus = function () {
    proficiencyBonus = Levels[ele.currentLevel.textContent].bonus;
    ele.proficiencyBonusPreview.textContent = String(Levels[ele.currentLevel.textContent].bonus);
    func.appendSigntoValue(proficiencyBonus, ele.proficiencyBonusPreview);
};
var addExp = function () {
    var currentExpNum = Number(ele.currentExperience.textContent);
    var newExpNum = Number(ele.addNewExperienceInput.value);
    ele.currentExperience.textContent = String(currentExpNum + newExpNum);
};
var setAbilityScorePreview = function () {
    // loop through abilities lowercased
    Abilities.map(function (ability) {
        // get ability score from rolled score node
        var rolledScoreNode = eval("rolled" + ability);
        // get preview element 
        var previewElement = eval(ability.toLowerCase() + "Preview");
        // set preview element text to ability score
        previewElement.textContent = rolledScoreNode.textContent;
    });
};
var resetAbilityScores = function () {
    Abilities.map(function (ability) {
        return ability = null;
    });
};
var generalInfo = function () {
    // initialize values at character creation
    resetAbilityScores();
    // Get current state of info required to create character
    setClass();
    setRace();
    setSubrace();
    // Post info from character creation to preview area
    setAbilityScorePreview();
    selectedAlignment = ele.alignment.options[ele.alignment.selectedIndex];
    charGender = ele.gender.value.toLowerCase();
    // convert languages array into line-separated list items (use innerHTML instead of textCotent)
    var knownLanguages = Races[charRace].languages.toString().split().join("\r\n") + ("" + String(ele.extraLanguage.value));
    func.showElementWithProps(ele.languagesPreview, "Known Languages", knownLanguages);
    ele.currentLevel.textContent = String(Levels[0].level);
    ele.experienceNextLevel.textContent = String(Levels[0].experience);
    ele.namePreview.textContent = ele.name.value;
    ele.racePreview.textContent = func.capitialize(charRace);
    ele.genderPreview.textContent = ele.gender.value;
    ele.agePreview.textContent = ele.age.value;
    ele.clsPreview.textContent = func.capitialize(charClass);
    ele.alignmentPreview.textContent = selectedAlignment.textContent;
};
////////////////////////////////////////////////////////////
// Ability Scores
////////////////////////////////////////////////////////////
// Ability score variables
var abilityScoreListItems = ele.abilityScoreList.children;
var dwarvenToughnessMod = 0;
// Ability Score functions
var lookupAbilityScore = function (ability) {
    // if ability matches abilityScore in list return number value of abilityScore
    for (var i = 0; i < abilityScoreListItems.length; i++) {
        // gets ability score name from preview li > b element(Strength, Dexerity, etc.)
        var string = singleWord.exec(abilityScoreListItems[i].childNodes[1].textContent)[0];
        // if preview ability score name matches passed ability score, get ability score from li > span element
        if (string.toLowerCase() === ability) {
            abilityScore = Number(abilityScoreListItems[i].childNodes[3].textContent);
            return abilityScore;
        }
    }
};
var subraceAbilityModifier = function () {
    setRace();
    if (Races[charRace].subrace) {
        // get subrace bonus ability and modifier value
        var subraceAbility = Races[charRace].subrace.ability;
        var subraceAbilityMod = Races[charRace].subrace.modifier;
        // if ability score text matches li text, add bonus modifier to value
        for (var i = 0; i < abilityScoreListItems.length; i++) {
            var abilityText = singleWord.exec(abilityScoreListItems[i].childNodes[1].textContent)[0];
            var abilityScorePreview = abilityScoreListItems[i].childNodes[3];
            var abilityScore_1 = Number(abilityScoreListItems[i].childNodes[3].textContent);
            if (abilityText.toLowerCase() === subraceAbility) {
                abilityScorePreview.textContent = String(abilityScore_1 + subraceAbilityMod);
            }
        }
    }
};
var racialAbilityModifier = function () {
    setRace();
    var racialAbility = Races[charRace].abilityModifier.ability;
    var racialAbilityMod = Races[charRace].abilityModifier.modifier;
    // if ability matches abilityPreview node text, add modifier to score
    for (var i = 0; i < abilityScoreListItems.length; i++) {
        var abilityText = singleWord.exec(abilityScoreListItems[i].childNodes[1].textContent)[0];
        var abilityScorePreview = abilityScoreListItems[i].childNodes[3];
        var abilityScore_2 = Number(abilityScoreListItems[i].childNodes[3].textContent);
        if (abilityText.toLowerCase() === racialAbility) {
            abilityScorePreview.textContent = String(abilityScore_2 + racialAbilityMod);
        }
    }
    // if race has extra ability to modify
    if (Races[charRace].abilityModifier.extraAbility) {
        for (var i = 0; i < abilityScoreListItems.length; i++) {
            var abilityText = singleWord.exec(abilityScoreListItems[i].childNodes[1].textContent)[0];
            var abilityScorePreview = abilityScoreListItems[i].childNodes[3].textContent;
            if (abilityText.toLowerCase() === Races[charRace].abilityModifier.extraAbility) {
                var abilityScore_3 = Number(abilityScorePreview);
                abilityScorePreview = String(abilityScore_3 + Races[charRace].abilityModifier.extraModifier);
            }
        }
    }
};
// Display extra ability modifier field if race is Half-Elf
func.addOptionsToSelect(ele.extraAbilityModifier1, Abilities);
var showExtraModifiersInput = function () {
    setRace();
    // Add ability options to extra ability select element
    charRace === 'halfelf'
        ? ele.extraAbilityModifier.classList.remove('d-none')
        : ele.extraAbilityModifier.classList.add('d-none');
    charRace === 'halfelf'
        ? ele.extraAbilityModifierHelp.textContent = 'Half-Elves get to choose 2 extra ability scores to add +1'
        : ele.extraAbilityModifierHelp.textContent = '';
};
// Hide ability selected in either select element from the other select element
var hideModSelection = function (extraAbilityModifier, otherAbilityModifier) {
    var firstSelection = extraAbilityModifier.options[extraAbilityModifier.selectedIndex].textContent;
    otherAbilityModifier.innerHTML = "";
    Abilities.map(function (ability) {
        if (ability !== firstSelection) {
            var abilityElement2 = document.createElement("option");
            abilityElement2.textContent = ability;
            otherAbilityModifier.appendChild(abilityElement2);
        }
    });
};
hideModSelection(ele.extraAbilityModifier1, ele.extraAbilityModifier2);
// if extra ability score is selected add +1 to ability score preview
var addHalfElfAbilityMofifiers = function () {
    if (charRace === 'halfelf') {
        // get selected abilities text
        var mod1 = ele.extraAbilityModifier1.options[ele.extraAbilityModifier1.selectedIndex].textContent;
        var mod2 = ele.extraAbilityModifier2.options[ele.extraAbilityModifier2.selectedIndex].textContent;
        // get selected abilities preview element text
        for (var i = 0; i < abilityScoreListItems.length; i++) {
            var abilityScorePreview = abilityScoreListItems[i].childNodes[3].textContent;
            var string = singleWord.exec(abilityScoreListItems[i].childNodes[1].textContent)[0];
            // if either selected ability text matches abiltiy preview element text, update ability score
            if (string === mod1 || string === mod2) {
                var abilityScore_4 = Number(abilityScorePreview);
                abilityScore_4 += 1;
                abilityScorePreview = String(abilityScore_4);
            }
        }
    }
};
////////////////////////////////////////////////////////////
// Skills Preview
////////////////////////////////////////////////////////////
// Racial skills functions
// Dragonborn
var dragonbornDraconicAncestry = function () {
    var selectedDraconicAncestry = ele.draconicAncestry.options[ele.draconicAncestry.selectedIndex];
    var charDraconicAncestry = selectedDraconicAncestry.textContent.toLowerCase();
    return Races[charRace].special.draconicAncestry
        ? (func.showParentElement(ele.draconicAncestryPreview),
            ele.draconicAncestryPreview.setAttribute('title', Races.dragonborn.special.draconicAncestry.info),
            ele.dragonType.textContent = String(Races.dragonborn.special.draconicAncestry[charDraconicAncestry].color),
            ele.damageType.textContent = String(Races.dragonborn.special.draconicAncestry[charDraconicAncestry].type),
            ele.breathWeapon.textContent = String(Races.dragonborn.special.draconicAncestry[charDraconicAncestry].breath),
            func.showParentElement(ele.damageResistancePreview),
            ele.damageResistanceType.textContent = Races.dragonborn.special.draconicAncestry[charDraconicAncestry].type)
        : (func.hideParentElement(ele.draconicAncestryPreview),
            func.resetProps(ele.draconicAncestryPreview),
            func.resetProps(ele.dragonType),
            func.resetProps(ele.damageType),
            func.resetProps(ele.breathWeapon),
            func.hideParentElement(ele.damageResistancePreview),
            func.resetProps(ele.damageResistanceType),
            func.resetProps(ele.draconicAncestryHelp));
};
// Dwarf 
// Dwarf Stonecunning
var dwarfStonecunning = function () {
    return Races[charRace].special.stonecunning
        ? (func.showElementWithProps(ele.stonecunningPreview, Races[charRace].special.stonecunning.info, "Stonework (Int, Hist)"))
        : func.hideParentElement(ele.stonecunningPreview);
};
// Dwarf tool proficiency
var dwarfToolProficiency = function () {
    return Races[charRace].special.toolProficiency
        ? (func.showElementWithProps(ele.toolProficiencyPreview, Races[charRace].special.stonecunning.info, "Pick one: Smith\u2019s tools, Mason\u2019s tools, or Brewer\u2019s supplies)"))
        : func.hideParentElement(ele.toolProficiencyPreview);
};
// Elf Keen Senses Perception Bonus Skill
var elfKeenSenses = function () {
    return Races[charRace].special.keenSenses
        ? highightSkill('perception')
        : null;
};
// Elf Trance sleep skill
var elfTrance = function () {
    return Races[charRace].special.trance
        ? func.showElementWithProps(ele.tranceInfo, Races[charRace].special.trance.info, "Details")
        : null;
};
// Halfling lightfoot stealth skill
var lightfootNaturallyStealthy = function () {
    return charSubrace === "lightfoot"
        ? func.showElementWithProps(ele.stealthInfo, Races[charRace].subrace.naturallyStealthy.info, "Details")
        : null;
};
// Half-orc special abilities
var halforcMenacing = function () {
    return Races[charRace].special.menacing
        ? func.showElementWithProps(ele.menacingInfo, Races[charRace].special.menacing.info, "Details")
        : null;
};
var halforcRelentlessEndurance = function () {
    return Races[charRace].special.relentlessEndurance
        ? func.showElementWithProps(ele.relentlessEnduranceInfo, Races[charRace].special.relentlessEndurance.info, "Details")
        : null;
};
var halforcSavageAttacks = function () {
    return Races[charRace].special.savageAttacks
        ? func.showElementWithProps(ele.savageAttacksInfo, Races[charRace].special.savageAttacks.info, "Details")
        : null;
};
// Rock gnome special abilities
var rockgnomeSpecials = function () {
    return charSubrace === "rockgnome"
        ? (func.showElementWithProps(ele.artificersLoreInfo, Races[charRace].subrace.artificersLore.info, "Details"),
            func.showElementWithProps(ele.tinkerPreview, Races[charRace].subrace.tinker.info, "Tinker"),
            func.showElementWithProps(ele.tinkerInfo, Races[charRace].subrace.tinker.details, "Details"))
        : null;
};
// Tiefling special abilities\
var tieflingHellishResistance = function () {
    return Races[charRace].special.hellishResistance
        ? func.showElementWithProps(ele.hellishResistanceInfo, Races[charRace].special.hellishResistance.info, "Details")
        : null;
};
var tieflingInfernalLegacy = function () {
    return Races[charRace].special.infernalLegacy
        ? func.showElementWithProps(ele.infernalLegacyInfo, Races[charRace].special.infernalLegacy.info, "Details")
        : null;
};
// Skill functions
// const showSkillSlots = (characterClass) => {
//   // get number of skills for class
//   const numberOfSkills: number = Classes[charClass].skills
//   //loop through and display skill selects
// }
var getSelectedSkills = function () {
    selectedSkill1 = ele.skill1.options[ele.skill1.selectedIndex];
    selectedSkill2 = ele.skill2.options[ele.skill2.selectedIndex];
    selectedSkill3 = ele.skill3.options[ele.skill3.selectedIndex];
};
// Get any modifiers to the proficiency bonus for a skill
var getSkillModifier = function (skillText) {
    var skillAbility = String(singleWord.exec(skillText));
    var skillAbilityScore = lookupAbilityScore(skillAbility[0].toLowerCase());
    abilityScoreMod = func.getAbilityScoreModifier(skillAbilityScore);
    return totalMod = abilityScoreMod + proficiencyBonus;
};
// highlight a single skill
var highightSkill = function (skillText) {
    for (var i = 0; i < ele.skillsPreviewListItems.length; i++) {
        var skill = ele.skillsPreviewListItems[i];
        var skillName = ele.skillsPreviewListItems[i].childNodes[1];
        var skillText_1 = String(ele.skillsPreviewListItems[i].childNodes[1].textContent).toLowerCase();
        skillText_1 === skillText_1
            ? (skill.style.color = 'green',
                getSkillModifier(ele.skillsPreviewListItems[i].childNodes[3].textContent),
                func.appendSigntoValue(totalMod, ele.skillsPreviewListItems[i].childNodes[5]))
            : null;
    }
};
// highlight choosen skills on character creation
var highlightSkills = function () {
    // Get current values of required info
    getSelectedSkills();
    updateProficiencyBonus();
    // if selected skills match text of selected skill in preview section, highlight in green and append modifier, otherwise dim and remove modifier if present
    for (var i = 0; i < ele.skillsPreviewListItems.length; i++) {
        var skill = ele.skillsPreviewListItems[i];
        var skillName = ele.skillsPreviewListItems[i].childNodes[1];
        var skillText = ele.skillsPreviewListItems[i].childNodes[1].textContent;
        // reset modifier node to '-'
        ele.skillsPreviewListItems[i].childNodes[5].textContent = "-";
        if (skillText === selectedSkill1.textContent.trim()
            || skillText === selectedSkill2.textContent.trim()
            || skillText === selectedSkill3.textContent.trim()) {
            skill.style.color = 'green';
            getSkillModifier(ele.skillsPreviewListItems[i].childNodes[3].textContent);
            func.appendSigntoValue(totalMod, ele.skillsPreviewListItems[i].childNodes[5]);
        }
        else {
            // if no match dim selection
            skill.style.color = '#ccc';
        }
    }
};
// Set value of Dwarven Toughtness hit point modifier based on race selection
var addDwarvenToughness = function () {
    setRace();
    charRace === "dwarf"
        ? dwarvenToughnessMod = 1
        : dwarvenToughnessMod = 0;
    return dwarvenToughnessMod;
};
var racialBonuses = function () {
    addDwarvenToughness();
    addHalfElfAbilityMofifiers(); // Half-Elf racial ability score bonus (Any 2 plus Charisma)
};
var highlightRacialSKills = function () {
    setRace();
    setSubrace();
    // Dwarf
    dwarfStonecunning();
    dwarfToolProficiency();
    addDwarvenToughness();
    // Dragonborn
    dragonbornDraconicAncestry();
    // Elf
    elfKeenSenses();
    elfTrance();
    // Half-Elf
    addHalfElfAbilityMofifiers(); // Half-Elf racial ability score bonus (Any 2 plus Charisma)
    // Half-orc
    halforcMenacing();
    halforcRelentlessEndurance();
    halforcSavageAttacks();
    // Tiefling 
    tieflingHellishResistance();
    tieflingInfernalLegacy();
    // Subrace skills
    // Halfling Lightfoots
    lightfootNaturallyStealthy();
    // Rock gnome special abilities
    rockgnomeSpecials();
};
// Skills combined function call
var skillCreation = function () {
    updateProficiencyBonus();
    // Highlight selected skills and append skill modifier
    highlightSkills();
    // Preview racial abilities
    highlightRacialSKills();
};
// Function to combine related functions (TODO: can be combined with other racial)
var clearRacialSkils = function () {
    // set text content and attr to 'null', hide elements in preview
    // Combat tab
    func.resetProps(ele.weaponProficiencesPreview);
    func.resetProps(ele.poisonResistance);
    func.resetProps(ele.charmResistance);
    func.resetProps(ele.fearResistance);
    // Skills tab - Additional Skills
    func.resetProps(ele.languagesPreview);
    func.hideParentElement(ele.toolProficiencyPreview);
    func.resetProps(ele.toolProficiencyPreview);
    // Dwarf
    func.hideParentElement(ele.stonecunningPreview);
    func.resetProps(ele.stonecunningPreview);
    // Dragonborn
    func.hideParentElement(ele.draconicAncestryPreview);
    func.resetProps(ele.draconicAncestryPreview);
    func.hideParentElement(ele.damageResistancePreview);
    func.resetProps(ele.damageResistanceType);
    ele.dragonType.textContent = "";
    ele.damageType.textContent = "";
    ele.breathWeapon.textContent = "";
    // Elf
    func.hideParentElement(ele.trancePreview);
    func.resetProps(ele.tranceInfo);
    // Halfling - Lightfoot
    func.hideParentElement(ele.stealthPreview);
    func.resetProps(ele.stealthInfo);
    // Gnome - Rock Gnome
    func.hideParentElement(ele.artificersLorePreview);
    func.resetProps(ele.artificersLoreInfo);
    func.hideParentElement(ele.tinkerPreview);
    func.resetProps(ele.tinkerInfo);
    // Half-orc
    func.hideParentElement(ele.menacingPreview);
    func.resetProps(ele.menacingInfo);
    func.hideParentElement(ele.relentlessEndurancePreview);
    func.resetProps(ele.relentlessEnduranceInfo);
    func.hideParentElement(ele.savageAttacksPreview);
    func.resetProps(ele.savageAttacksInfo);
    // Tiefling
    func.hideParentElement(ele.hellishResistancePreview);
    func.resetProps(ele.hellishResistanceInfo);
    func.hideParentElement(ele.infernalLegacyPreview);
    func.resetProps(ele.infernalLegacyInfo);
};
////////////////////////////////////////////////////////////
// Combat
////////////////////////////////////////////////////////////
// Combat functions
var initialHitPoints = function () {
    // 1st level is max hit points + constiution modifier + racial modifier
    var modifier = func.getAbilityScoreModifier(constitution) + dwarvenToughnessMod;
    var hitpoints = (Classes[charClass].hitdie + modifier);
    ele.hitPointPreview.textContent = String(hitpoints);
};
var addHitPoints = function () {
    var currentHitPoints = Number(ele.hitPointPreview.textContent);
    var rolledHitPoints = func.randomIntFromRange(1, Classes[charClass].hitdie);
    modifier = func.getAbilityScoreModifier(constitution) + dwarvenToughnessMod;
    var hitPointsToAdd = (rolledHitPoints + modifier);
    // Prevent negative or zero hit points on level up
    if (rolledHitPoints + modifier <= 0) {
        hitPointsToAdd = 1;
    }
    ele.hitPointPreview.textContent = String(currentHitPoints + hitPointsToAdd);
};
var armorClass = function () {
    var base = 10;
    var dexMod = func.getAbilityScoreModifier(Number(dexerity));
    var armorMod = 0;
    var ac = String(base + dexMod + armorMod);
    ele.armorClassPreview.textContent = ac;
};
var initiativeMod = function () {
    var dexMod = func.getAbilityScoreModifier(Number(dexerity));
    ele.initiativeModPreview.textContent = String(dexMod);
};
var baseSpeed = function () { return ele.speedPreview.textContent = Races[charRace].speed; };
var passivePerception = function () { return ele.passivePerceptionPreview.textContent = String(10 + func.getAbilityScoreModifier(wisdom)); };
var darkvision = function () {
    setRace();
    if (Races[charRace].darkvision) {
        ele.passivePerceptionPreview.textContent = '60 ft.';
    }
    else {
        ele.passivePerceptionPreview.textContent = 'None';
    }
};
var setCharacterSize = function () { return ele.sizePreview.textContent = Races[charRace].size; };
var calculateWeaponProficiencies = function () {
    setRace();
    setSubrace();
    charRace === 'dwarf'
        ? Races[charRace].weaponProficiences.map(function (weapon) {
            ele.weaponProficiencesPreview.textContent += weapon + ", ";
        })
        : null;
    charSubrace === 'highelf'
        ? Races[charRace].subrace.weaponProficiences.map(function (weapon) {
            ele.weaponProficiencesPreview.textContent += weapon + ", ";
        })
        : null;
};
// Saving throws
// See domElements.ts
// saving throw mod is class ability score modifier and class proficiency bonus on listed types of saving throws (i.e. wizard, intelligence)
var calculateSavingThrowMods = function () {
    setClass();
    var abilities = Classes[charClass].savingThrows;
    abilities.map(function (ability) {
        // match modifer to saving throw item (i.e. strength mod to strenth saving throw)
        for (var i = 0; i < ele.savingThrowListItems.length; i++) {
            var string = (singleWord.exec(ele.savingThrowListItems[i].childNodes[1].textContent)[0]).toLowerCase();
            if (string === ability) {
                var abilityMod = func.getAbilityScoreModifier(lookupAbilityScore(ability));
                var totalMod_1 = Number(abilityMod + proficiencyBonus);
                func.appendSigntoValue(totalMod_1, ele.savingThrowListItems[i].childNodes[3]);
            }
        }
    });
};
// Special Resistances functions
var calculateSpecialResistances = function () {
    setRace();
    if (charRace === 'dwarf') {
        ele.poisonResistance.textContent = "Advantage, Resistance";
        ele.poisonResistance.setAttribute('title', Races[charRace].special.resilience.info);
    }
    if (charRace === 'elf' || charRace === 'halfelf') {
        ele.charmResistance.textContent = 'Advantage';
        ele.charmResistance.setAttribute('title', Races[charRace].special.feyAncestry.info);
    }
    if (charRace === 'gnome') {
        var types = Races[charRace].special.gnomeCunning.type;
        types.map(function (type) {
            // match modifer to saving throw item (i.e. strength mod to strenth saving throw)
            for (var i = 0; i < ele.savingThrowListItems.length; i++) {
                var string = (singleWord.exec(ele.savingThrowListItems[i].childNodes[1].textContent)[0]).toLowerCase();
                if (string === type) {
                    ele.savingThrowListItems[i].childNodes[1].textContent += " (Advantage)";
                }
            }
        });
    }
    if (charRace === 'halfling') {
        ele.fearResistance.textContent = 'Advantage';
        ele.fearResistance.setAttribute('title', Races[charRace].special.brave.info);
    }
};
var combatCreation = function () {
    // Get character preview image based on class, race, and gender
    charImageSet();
    // Set initial hit point value for 1st level
    initialHitPoints();
    // Get dexerity and armor modifier and set armor class
    armorClass();
    // Get dexerity modifier and set initiative bonus
    initiativeMod();
    // Get base speed based on chosen race
    baseSpeed();
    // Get wisdom modifier and set passive perception
    passivePerception();
    // Get darkvision boolean and set value
    darkvision();
    // Set any racial ability modifiers to ability scores
    racialAbilityModifier();
    subraceAbilityModifier();
    // Set the character size
    setCharacterSize();
    calculateSavingThrowMods();
    calculateSpecialResistances();
    calculateWeaponProficiencies();
};
////////////////////////////////////////////////////////////
// Event Listeners
////////////////////////////////////////////////////////////
// Event listeners for rolling ability scores
ele.rollStrength.addEventListener('click', function () { return func.setScore(ele.rolledStrength); });
ele.rollDexerity.addEventListener('click', function () { return func.setScore(ele.rolledDexerity); });
ele.rollConstitution.addEventListener('click', function () { return func.setScore(ele.rolledConstitution); });
ele.rollWisdom.addEventListener('click', function () { return func.setScore(ele.rolledWisdom); });
ele.rollIntelligence.addEventListener('click', function () { return func.setScore(ele.rolledIntelligence); });
ele.rollCharisma.addEventListener('click', function () { return func.setScore(ele.rolledCharisma); });
// Handle Class selection changes
ele.cls.addEventListener('change', function () {
    setClass();
    func.setText(ele.classHelp, Classes[charClass].info);
    highlightAvailableSkills();
});
// Handle race and subrace selection changes
ele.race.addEventListener('change', function () {
    setRace();
    func.setText(ele.raceHelp, Races[charRace].info);
    showOptionalSubraceSelect();
    availableAlignments();
    ageHelpText();
    dragonbornDraconicAncestry();
    showDraconicAncestrySelect();
    showExtraLanguageInput();
    showExtraModifiersInput();
    clearRacialSkils();
});
// On subrace selection, get value of subrace and display descriptive text
ele.subrace.addEventListener('change', function () {
    setSubrace();
    func.setText(ele.subraceHelp, Races[charRace].subrace.helpText);
    showExtraLanguageInput();
    clearRacialSkils();
});
// Hide ability from extra ability modifier list
ele.extraAbilityModifier1.addEventListener('change', function () {
    hideModSelection(ele.extraAbilityModifier1, ele.extraAbilityModifier2);
});
ele.extraAbilityModifier2.addEventListener('change', function () {
    hideModSelection(ele.extraAbilityModifier2, ele.extraAbilityModifier1);
});
////////////////////////////////////////////////////////////
// Character Creation
////////////////////////////////////////////////////////////
ele.createCharacterButton.addEventListener('click', function (e) {
    e.preventDefault();
    // Character Creation functions
    generalInfo(); // General tab functions
    racialBonuses(); // Race bonus functions
    skillCreation(); // SKill tab functions
    combatCreation(); // Combat tab functions
});
////////////////////////////////////////////////////////////
// Preview Functions
////////////////////////////////////////////////////////////
// Level advancement button submit
ele.levelUpButton.addEventListener('click', function (e) {
    e.preventDefault();
    setClass();
    // Get level up variables
    constitution = ele.rolledConstitution.textContent;
    if (ele.currentLevel.textContent === "20") {
        return;
    }
    charLevelUp();
    addHitPoints();
    highlightSkills();
});
ele.addNewExperienceButton.addEventListener('click', function (e) {
    e.preventDefault();
    addExp();
    ele.addNewExperienceInput.value = null;
});
