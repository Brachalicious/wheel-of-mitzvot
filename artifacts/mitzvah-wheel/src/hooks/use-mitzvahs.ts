import { useState, useEffect } from 'react';

// The 613 Mitzvot — 248 Positive + 365 Negative (based on Rambam's Sefer HaMitzvot)
export const DEFAULT_MITZVAHS: string[] = [
  // ── POSITIVE MITZVOT (248) ──────────────────────────────────────────────
  "Believe in God's existence",
  "Accept God's complete unity",
  "Love God with all your heart",
  "Fear and revere God",
  "Sanctify God's name publicly",
  "Study Torah day and night",
  "Teach Torah to others",
  "Honor Torah scholars",
  "Recite the Shema morning and evening",
  "Wear tefillin on the head",
  "Wear tefillin on the arm",
  "Affix a mezuzah to every doorpost",
  "Every person shall write a Torah scroll",
  "The king shall write a special Torah scroll",
  "Wear tzitzit",
  "Recite Birkat Hamazon after eating bread",
  "Build the Holy Temple",
  "Revere the Holy Temple",
  "Guard the Temple",
  "The Levites shall serve in the Temple",
  "The Kohanim shall serve in the Temple",
  "The Kohen shall wash hands and feet before service",
  "Light the Menorah in the Temple daily",
  "The Kohanim shall bless the people (duchening)",
  "Set showbread on the Table every Shabbat",
  "Burn incense on the golden altar twice daily",
  "Keep the altar fire burning perpetually",
  "Remove the ashes from the altar daily",
  "The Kohen Gadol shall bring a daily meal offering",
  "Bring the daily tamid sacrifice twice a day",
  "The Kohen Gadol shall perform the Yom Kippur service",
  "Add salt to all sacrifices",
  "Bring a sin offering for the Sanhedrin's error",
  "Bring a sin offering for an unintentional sin",
  "Bring a sliding-scale offering for certain sins",
  "Bring a guilt offering for specific sins",
  "Bring a guilt offering after robbing and falsely denying",
  "A Kohen who rules incorrectly shall bring an offering",
  "A leader shall bring a sin offering for unintentional sin",
  "Bring a peace offering (shelamim)",
  "A nazirite shall shave his head when his term ends",
  "Observe all laws of the nazirite vow",
  "The court shall hang a blasphemer's body briefly",
  "Bury an executed person on the day of death",
  "The blood redeemer shall execute the murderer",
  "The court shall exile an accidental killer to a city of refuge",
  "Establish six cities of refuge",
  "Give the Levites cities to dwell in",
  "Build a fence/guardrail around a roof",
  "Destroy idolatry wherever found",
  "Burn a city that adopted idol worship",
  "Destroy idols and all their accessories",
  "Appoint judges and officers in every city",
  "Follow the majority in legal disputes",
  "Appoint a Supreme Court (Sanhedrin)",
  "Appoint a king",
  "Obey the Great Sanhedrin",
  "Observe accurate weights and measures",
  "Keep the laws of commerce and business",
  "Lend money to Jews without charging interest",
  "Lend money to the poor",
  "Give charity generously",
  "Pay the hired laborer on time",
  "Return a lost object to its owner",
  "Help unload a collapsed animal",
  "Rebuke a sinner",
  "Love your neighbor as yourself",
  "Love the convert",
  "Keep honest weights and measures",
  "Honor the Shabbat through speech (Kiddush)",
  "Rest on the Shabbat",
  "Sanctify the Shabbat through Kiddush",
  "Kindle Shabbat lights before sunset Friday",
  "Fast and afflict yourself on Yom Kippur",
  "Rest on Yom Kippur",
  "Celebrate on the three pilgrimage festivals",
  "Rest on the first day of Passover",
  "Rest on the seventh day of Passover",
  "Eat matzah on the first night of Passover",
  "Tell the Exodus story on Passover night (Seder)",
  "Remove all chametz before Passover",
  "Search for chametz on the night before Passover",
  "Count the Omer — 49 days from Passover to Shavuot",
  "Rest on Shavuot",
  "Rest on Rosh Hashanah",
  "Blow the shofar on Rosh Hashanah",
  "Rest on the first day of Sukkot",
  "Dwell in the sukkah during Sukkot",
  "Take the four species on Sukkot",
  "Rest on Shemini Atzeret",
  "Appear at the Temple on the three festivals",
  "Celebrate and rejoice on the festivals",
  "Bring the Passover offering (korban Pesach)",
  "Bring the second Passover offering if you missed the first",
  "Eat the Passover offering with matzah and bitter herbs",
  "Burn the leftover Passover offering",
  "Sanctify the firstborn son",
  "Redeem the firstborn son from the Kohen",
  "Redeem the firstborn donkey from the Kohen",
  "Break the neck of an unredeemed firstborn donkey",
  "Every firstborn kosher animal is consecrated to God",
  "Tithe cattle and sheep each year",
  "Observe the laws of the firstborn animal",
  "Bring the first fruits (bikkurim) to the Temple",
  "Recite the declaration when bringing first fruits",
  "The Kohen shall receive his portions of the sacrifices",
  "Separate terumah (portion for the Kohen)",
  "Separate the first tithe for the Levite",
  "Separate the second tithe",
  "The Levite shall separate a tithe from his tithe",
  "Separate the poor person's tithe in the third and sixth year",
  "Recite the tithe declaration and confession",
  "Separate challah from dough for the Kohen",
  "Observe the sabbatical year (sh'mittah)",
  "Observe the jubilee year (yovel)",
  "Blow the shofar on Yom Kippur of the yovel year",
  "Sanctify the jubilee year",
  "Return land to its original owner in yovel",
  "Return the Hebrew slave to freedom in yovel",
  "Observe the laws of the dedicated (cherem) field",
  "Observe the laws of redemption of consecrated items",
  "Honor the elderly and the wise",
  "Learn and teach the laws of purity and impurity",
  "The woman shall immerse in the mikveh after impurity",
  "Purify oneself through immersion in the mikveh",
  "Observe the laws of a male with a discharge (zav)",
  "Observe the laws of tzaraat (leprosy)",
  "The metzora shall shave during purification",
  "The Kohen shall declare the metzora pure",
  "The metzora shall bring offerings after purification",
  "Observe the laws of house tzaraat",
  "Observe the laws of a woman after childbirth",
  "Observe the laws of a menstruant (niddah)",
  "Observe the laws of a female with discharge (zavah)",
  "Bury the dead",
  "The Kohen shall not become impure except for close relatives",
  "The Kohen Gadol and nazirite shall not become impure",
  "Observe the red heifer (parah adumah) purification process",
  "Examine the signs of a kosher animal",
  "Examine the signs of a kosher fish",
  "Examine the signs of a kosher bird",
  "Examine the signs of a kosher locust",
  "Slaughter an animal before eating its meat",
  "Cover the blood after slaughtering a bird or wild animal",
  "Give the Kohen the shoulder, jaw, and stomach portions",
  "Give the first shearing of sheep to the Kohen",
  "Observe the laws of a sanctified animal (kodshim)",
  "Observe the laws of a substituted animal",
  "Return a borrowed item",
  "Observe the laws of oaths",
  "Keep your oaths and vows",
  "Swear by God's name truthfully when required",
  "Observe the laws of vows (nedarim)",
  "The husband may annul his wife's vows",
  "Observe the laws of buying and selling",
  "Follow the laws of inheritance",
  "The court shall judge monetary disputes",
  "The court shall judge cases of theft",
  "The court shall judge cases of physical injury",
  "The court shall judge cases of damage by animals",
  "The court shall judge cases of damage by a pit",
  "The court shall judge cases of damage by fire",
  "The court shall judge cases of an unpaid watchman",
  "The court shall judge cases of a paid watchman",
  "The court shall judge cases of borrowing",
  "The court shall judge cases of renting",
  "Observe the laws of the Hebrew slave",
  "Observe the laws of the Hebrew maidservant",
  "Observe the marital rights of the Jewish maidservant",
  "The court shall judge cases of murder",
  "The court shall judge cases of bodily injury",
  "The court shall judge cases of a goring ox",
  "Exile an accidental killer to a city of refuge",
  "Observe laws regarding the inadvertent killer",
  "The court shall not accept ransom for a murderer",
  "Flog those liable to lashes",
  "The court shall administer oaths in disputes",
  "Examine and cross-examine witnesses carefully",
  "Execute a false witness with the punishment they sought",
  "Observe the laws of the rebellious elder",
  "Execute the inciter to idol worship",
  "Observe the laws of the suspected adulteress (sotah)",
  "The court shall follow the sotah procedure",
  "Keep the laws of a slandered maiden",
  "Practice levirate marriage (yibbum) for a childless widow",
  "Release from yibbum through chalitzah if refused",
  "Observe the laws of rape",
  "Observe the laws of seduction",
  "Observe the laws of the captive woman",
  "Observe the laws of a despised wife",
  "The firstborn son shall receive a double inheritance",
  "Observe the laws of the stubborn and rebellious son",
  "Honor your father and mother",
  "The Kohen Gadol shall marry only a virgin",
  "The Kohen shall marry only a permitted woman",
  "Observe the laws of conversion to Judaism",
  "Write a get (divorce document) when divorcing",
  "Marry in accordance with Jewish law (kiddushin and chuppah)",
  "A man shall rejoice with his new wife for one year",
  "Circumcise all males on the eighth day",
  "Observe the laws of levirate marriage",
  "Love the stranger who dwells among you",
  "Observe the laws of a Hebrew slave who chooses to stay",
  "The Kohen Gadol shall wear his special garments in service",
  "The Kohen shall wear his special garments during service",
  "The Levites shall carry the Ark on their shoulders",
  "Consecrate the Kohen Gadol by anointing with oil",
  "The Levite shall sanctify himself before performing service",
  "Observe the counting of the Levites",
  "Sanctify the Kohen through anointing",
  "Observe the laws of tzaraat on garments",
  "Observe the laws of tzaraat on the skin",
  "The Kohen shall examine tzaraat",
  "The metzora shall undergo complete bodily shaving",
  "The metzora shall observe the isolation procedures",
  "Observe the laws of vessels that contract impurity",
  "Observe the laws of food that contracts impurity",
  "Observe that the mikveh waters purify",
  "Observe the laws of corpse impurity",
  "Purify those with corpse impurity through the red heifer",
  "Observe the covenant of circumcision",
  "Observe the laws of leprosy in clothing",
  "The Kohen shall examine house tzaraat",
  "Observe the laws of zav impurity and purification",
  "Separate the niddah from the pure",
  "Keep the special laws of the Kohen Gadol",
  "Observe the Jubilee's agricultural provisions",
  "Rest the land during the sh'mittah year",
  "Leave sh'mittah produce for all to eat",
  "Release all debts in the seventh year",
  "Read the Torah publicly in the Hakhel gathering",
  "Observe all afflictions of Yom Kippur",
  "Offer the mussaf sacrifice on Shabbat",
  "Offer the mussaf sacrifice on Rosh Chodesh",
  "Offer the mussaf sacrifice on Passover",
  "Offer the mussaf sacrifice on Shavuot",
  "Offer the mussaf sacrifice on Rosh Hashanah",
  "Offer the mussaf sacrifice on Yom Kippur",
  "Offer the mussaf sacrifice on Sukkot",
  "Celebrate Purim annually",
  "Remember the Exodus from Egypt daily",
  "Sanctify the new month (Rosh Chodesh)",
  "Say Sefiras HaOmer each night",

  // ── NEGATIVE MITZVOT (365) ──────────────────────────────────────────────
  "Do not believe in any god besides God",
  "Do not make an idol for yourself",
  "Do not make an idol for others to worship",
  "Do not bow down to an idol",
  "Do not worship an idol in any manner",
  "Do not pass children through fire to Molech",
  "Do not consult a medium (ov)",
  "Do not consult a psychic (yidoni)",
  "Do not turn to idolatry in your thoughts",
  "Do not make a sculptured idol",
  "Do not make a stone pillar for worship",
  "Do not plant an Asherah tree for worship",
  "Do not bow down on a flat stone",
  "Do not swear in the name of an idol",
  "Do not lead others to idol worship",
  "Do not entice another person to worship idols",
  "Do not love an inciter to idol worship",
  "Do not stop hating an inciter to idol worship",
  "Do not save an inciter to idol worship",
  "Do not speak in defense of an inciter to idol worship",
  "Do not refrain from prosecuting an inciter to idol worship",
  "Do not prophesy in the name of an idol",
  "Do not listen to a prophet who incites idol worship",
  "Do not fear a false prophet",
  "Do not erase God's name",
  "Do not destroy items sanctified to God",
  "Do not enter the Temple while ritually impure",
  "A ritually impure Kohen shall not perform Temple service",
  "A Kohen with a permanent blemish shall not perform service",
  "A Kohen with a temporary blemish shall not serve",
  "Levites shall not perform the Kohanim's service",
  "Do not serve in the Temple while intoxicated",
  "Do not bring blemished animals as sacrifices",
  "Do not slaughter a blemished animal as a sacrifice",
  "Do not consecrate a blemished animal",
  "Do not slaughter a mother and its offspring on the same day",
  "Do not offer leavened bread on the altar",
  "Do not offer honey on the altar",
  "Do not offer sacrifices without salt",
  "Do not offer foreign incense on the inner altar",
  "Do not replicate the anointing oil",
  "Do not use the anointing oil for non-sacred purposes",
  "Do not replicate the Temple incense compound",
  "Do not use the sacred incense for personal pleasure",
  "Do not remove the carrying poles from the Ark",
  "Do not tear the breastplate from the ephod",
  "Do not enter the Holy of Holies except on Yom Kippur",
  "The Kohen Gadol shall not enter without proper preparation",
  "Do not bring a blemished animal donated by a non-Jew",
  "Do not slaughter the Passover offering while owning chametz",
  "Do not leave the fat of the Passover offering overnight",
  "Do not break a bone of the Passover lamb",
  "Do not take the Passover offering outside the house",
  "Do not let an uncircumcised person eat the Passover offering",
  "Do not let a hired worker eat the Passover offering",
  "Do not eat the Passover offering raw or water-boiled",
  "Do not leave the second Passover offering until morning",
  "Do not leave the thanksgiving offering until morning",
  "Do not break a bone of the second Passover offering",
  "Do not eat most holy sacrifices outside the Temple court",
  "Do not eat the second tithe while ritually impure",
  "Do not eat the first fruits while ritually impure",
  "Do not eat terumah while ritually impure",
  "Do not alter the prescribed order of the sacrificial service",
  "Do not leave parts of the sin offering overnight",
  "Do not eat the flesh of the burnt offering",
  "Do not eat the first fruits outside Jerusalem",
  "Do not eat the second tithe of grain outside Jerusalem",
  "Do not eat the second tithe of wine outside Jerusalem",
  "Do not eat the second tithe of oil outside Jerusalem",
  "Do not eat firstborn animals outside Jerusalem",
  "Do not eat the Passover offering outside Jerusalem",
  "Do not eat the sin offering outside the Temple courtyard",
  "Do not eat leftover sacrificial meat (notar)",
  "Do not eat ritually impure sacrificial meat",
  "Do not eat from a sacrifice with improper intent (piggul)",
  "A blemished Kohen shall not eat the most holy sacrifices",
  "An uncircumcised Kohen shall not eat terumah",
  "Do not eat terumah while ritually impure",
  "A non-Kohen shall not eat the most holy sacrifices",
  "A guest of a Kohen shall not eat terumah",
  "An uncircumcised person shall not eat the Passover offering",
  "A female slave not yet immersed shall not eat terumah",
  "A woman divorced from a Kohen shall not eat terumah",
  "Do not eat the flesh of a stoned ox",
  "Do not eat food with chametz mixed in on Passover",
  "Do not eat chametz on Passover",
  "Do not eat chametz after midday on Passover eve",
  "Do not have chametz visible in your possession on Passover",
  "Do not have chametz in your possession on Passover at all",
  "Do not eat chametz during all seven days of Passover",
  "Do not work on the first day of Passover",
  "Do not work on the seventh day of Passover",
  "Do not work on Shavuot",
  "Do not work on Rosh Hashanah",
  "Do not work on Yom Kippur",
  "Do not eat on Yom Kippur",
  "Do not work on the first day of Sukkot",
  "Do not work on Shemini Atzeret",
  "Do not work on the Shabbat",
  "Do not walk outside the Shabbat boundaries",
  "Do not punish someone who violated Shabbat without warning",
  "Do not take God's name in vain",
  "Do not swear falsely",
  "Do not swear unnecessarily",
  "Do not delay fulfilling a vow to God",
  "Do not break a vow",
  "Do not violate an oath",
  "Do not rebel against the Great Sanhedrin",
  "Do not deviate from the Torah's rulings",
  "Do not add to the Torah's commandments",
  "Do not subtract from the Torah's commandments",
  "Do not curse God",
  "Do not curse a king of Israel",
  "Do not curse a judge",
  "Do not curse any fellow Jew",
  "Do not curse your father",
  "Do not curse your mother",
  "Do not strike your father",
  "Do not strike your mother",
  "Do not follow idolatrous practices",
  "Do not engage in divination",
  "Do not engage in astrology",
  "Do not practice witchcraft",
  "Do not charm animals",
  "Do not consult the dead",
  "Do not practice sorcery",
  "Do not practice soothsaying",
  "Do not act as a medium",
  "Men shall not wear women's clothing",
  "Women shall not wear men's clothing",
  "Do not tattoo yourself",
  "Do not cut your skin in mourning",
  "Do not make yourself bald in mourning for the dead",
  "Do not hate your fellow Jew in your heart",
  "Do not embarrass anyone publicly",
  "Do not harm others with hurtful words",
  "Do not harm a convert with words",
  "Do not take revenge",
  "Do not bear a grudge",
  "Do not covet your neighbor's wife",
  "Do not desire your neighbor's property",
  "Do not follow the ways of the Egyptians",
  "Do not follow the ways of the Canaanites",
  "Do not intermarry with the seven Canaanite nations",
  "Do not give your daughter in marriage to a non-Jew",
  "Do not take a non-Jewish wife for your son",
  "Do not make a covenant with idol worshippers",
  "Do not make a covenant of peace with Canaan",
  "Do not show mercy to idol worshippers who refuse to convert",
  "Do not allow an Ammonite or Moabite male to convert",
  "Do not reject an Edomite within three generations",
  "Do not reject an Egyptian within three generations",
  "Do not make peace with Ammon and Moab in battle",
  "Do not destroy fruit trees during a siege",
  "Do not leave a body hanging overnight",
  "Do not return a runaway slave to his master",
  "Do not harm a runaway slave",
  "Do not exploit a prostitute by enslaving her",
  "Do not take a millstone as security for a loan",
  "Do not sell a Jewish person as a slave",
  "Do not kidnap a fellow Jew",
  "Do not be cruel to a hired worker",
  "Do not fail to return a pledge to the poor person at night",
  "Do not charge interest to a Jew",
  "Do not borrow money with interest from a Jew",
  "Do not arrange a loan with interest",
  "Do not be a witness to an interest agreement",
  "Do not guarantee a loan with interest",
  "Do not write a document for an interest loan",
  "Do not delay paying a worker's wages",
  "Do not take a widow's garment as a pledge",
  "Do not seize a pledge by force",
  "Do not keep a pledge needed by the poor person",
  "Do not wrong the convert in business",
  "Do not oppress the convert verbally",
  "Do not wrong the widow and orphan",
  "Do not return to Egypt to live permanently",
  "Do not increase the number of wives",
  "Do not accumulate excessive horses for the army",
  "Do not accumulate excessive silver and gold",
  "Do not appoint a foreigner as king",
  "Do not steal",
  "Do not rob",
  "Do not move a boundary marker",
  "Do not cheat in business",
  "Do not deny a monetary claim",
  "Do not make a false oath about money",
  "Do not oppress others financially",
  "Do not leave a fellow's lost object unattended",
  "Do not stand by while a fellow is in danger",
  "Do not give harmful advice",
  "Do not use false weights",
  "Do not use false measures",
  "Do not keep false weights even when not using them",
  "Do not keep false measures even when not using them",
  "Do not pervert justice",
  "Do not favor the poor in judgment",
  "Do not favor the rich in judgment",
  "Do not fear the powerful when rendering judgment",
  "Do not accept bribes",
  "Do not judge someone unfairly",
  "Do not act as a judge in a case of personal interest",
  "Do not testify when you are disqualified",
  "Do not accept testimony from a wicked person",
  "Do not accept testimony from a relative",
  "Do not testify falsely",
  "Do not convict on the testimony of a single witness",
  "Do not execute without proper testimony",
  "Do not execute without a proper warning",
  "Do not accept a bribe even to acquit the guilty",
  "Do not follow the majority to do evil",
  "Do not decide capital cases by a majority of one",
  "Do not judge one side in the other party's absence",
  "Do not appoint unjust judges",
  "Do not use hearsay evidence",
  "Do not crossbreed different species of animals",
  "Do not plant different species in a vineyard (kil'ayim)",
  "Do not wear mixed wool and linen (shatnez)",
  "Do not round the corners of your head",
  "Do not shave the corners of your beard",
  "Do not approach a woman during her menstrual period",
  "Do not have relations with another man's wife",
  "Do not have relations with your father's wife",
  "Do not have relations with your sister",
  "Do not have relations with your father's wife's daughter",
  "Do not have relations with your son's daughter",
  "Do not have relations with your daughter",
  "Do not have relations with your daughter's daughter",
  "Do not have relations with your father's sister",
  "Do not have relations with your mother's sister",
  "Do not have relations with your father's brother's wife",
  "Do not have relations with your son's wife",
  "Do not have relations with your brother's wife (unless yibbum)",
  "Do not have relations with a woman and her daughter together",
  "Do not have relations with a woman and her son's daughter",
  "Do not have relations with a woman and her daughter's daughter",
  "Do not have relations with your wife's sister in her lifetime",
  "Do not have homosexual relations",
  "A man shall not have relations with an animal",
  "A woman shall not have relations with an animal",
  "Do not have relations with a Canaanite maidservant",
  "Do not remarry a woman you divorced after she remarried",
  "Do not have relations with a woman forbidden to a Kohen",
  "The Kohen Gadol shall not marry a widow",
  "The Kohen Gadol shall not marry a divorced woman",
  "Do not allow a mamzer to marry into the congregation",
  "Do not allow a castrated man to marry into the congregation",
  "Do not allow an Ammonite male to marry into the congregation",
  "Do not allow a Moabite male to marry into the congregation",
  "Do not make peace with the seven Canaanite nations",
  "Do not allow Canaanites to dwell in the land",
  "Do not violate a captive woman",
  "Do not sell a captive woman",
  "Do not enslave a captive woman after being intimate",
  "Do not divorce a woman slandered as non-virgin",
  "Do not divorce a woman whom you violated",
  "Do not violate your wife's marital rights",
  "Do not remarry a woman you divorced who remarried",
  "Do not castrate any male creature",
  "Do not offer blemished animals on the altar",
  "Do not eat blood",
  "Do not eat the fat of domesticated animals",
  "Do not eat the sinew of the thigh vein (gid hanasheh)",
  "Do not eat an animal that died naturally (neveilah)",
  "Do not eat a mortally wounded animal (treifah)",
  "Do not eat swarming creatures of the water",
  "Do not eat abominable winged creatures",
  "Do not eat swarming creatures of the land",
  "Do not eat worms found in fruit",
  "Do not eat reptiles",
  "Do not eat insects that swarm the earth",
  "Do not eat chametz on Passover",
  "Do not eat bread from new grain before the Omer is brought",
  "Do not eat roasted grain before the Omer is brought",
  "Do not eat fresh grain before the Omer is brought",
  "Do not eat the fruit of a tree in its first three years (orla)",
  "Do not eat first produce before separating tithes",
  "Do not eat the second tithe outside Jerusalem",
  "Do not eat untithed produce (tevel)",
  "Do not eat the first fruits outside Jerusalem",
  "Do not eat from sacrificial meat that became impure",
  "Do not eat from a sacrifice intended for the wrong time",
  "Do not let non-Kohanim eat the most sacred sacrifices",
  "Do not let a blemished Kohen eat the most sacred sacrifices",
  "Do not eat chametz all seven days of Passover",
  "Do not eat anything mixed with chametz on Passover",
  "Do not forget what Amalek did to Israel",
  "Do not neglect to wipe out the memory of Amalek",
  "Do not be afraid when going out to war",
  "Do not return to Egypt to dwell there permanently",
  "Do not turn back in battle",
  "Do not test God",
  "Do not follow your heart's desires away from God",
  "Do not follow your eyes' temptations into sin",
  "Do not worship through practices foreign to Torah",
  "Do not adopt the customs and ways of non-Jews",
  "Do not neglect the words of Torah",
  "Do not add to the Torah's commandments",
  "Do not subtract from the Torah's commandments",
  "Do not forget God's Torah",
  "Do not delay fulfilling vows made to God",
  "Do not violate your vows",
  "Do not swear falsely in God's name",
  "Do not take God's name in vain",
  "Do not desecrate God's name publicly (chillul Hashem)",
  "Do not profane that which is holy",
  "Do not curse God",
  "Do not behave arrogantly before God",
  "Do not turn away from following God",
  "Do not mix the sacred and the profane",
  "Do not be ungrateful for the goodness God has shown",
  "Do not be haughty or arrogant",
  "Do not harden your heart toward those in need",
  "Do not withhold help from one who is in need",
  "Do not ignore the poor",
  "Do not send away the poor empty-handed",
  "Do not be callous to a fellow's suffering",
  "Do not stand idly by your fellow's blood",
  "Do not spread false reports or slander",
  "Do not pervert the law of the convert",
  "Do not oppress the stranger among you",
  "Do not afflict the widow and orphan",
  "Do not take usury from any Jew",
  "Do not delay payment of a worker's wage",
  "Do not hold back the pledge of the poor",
  "Do not ignore a lost object",
  "Do not ignore a fallen animal",
  "Do not go after your heart's and eyes' desires",
  "Do not covet your neighbor's house",
  "Do not covet your neighbor's wife",
  "Do not steal",
  "Do not murder",
  "Do not commit adultery",
  "Do not bear false witness against your neighbor",
  "Do not be envious of another's possessions",
  "Do not hate your brother in your heart",
  "Do not take revenge or bear a grudge against your people",

  // ── ADDITIONAL MITZVOT to complete the 613 ──────────────────────────────
  "Recite Hallel on designated festival days",
  "Observe neta revai — sanctify fourth-year fruit",
  "Do not eat meat and milk cooked together",
  "Do not cook meat in milk",
  "Do not benefit from meat and milk mixed together",
  "Do not eat a limb torn from a living animal (ever min hachai)",
  "Do not eat from an ox condemned by the court (shor haniskal)",
  "Do not work on Chol HaMoed (intermediate festival days)",
  "Do not plant different species in the same field (kil'ayim)",
  "Do not graft different species of trees together",
  "Do not eat kil'ayim produce from a vineyard",
  "Do not mix fish and meat on the same plate",
  "Observe the laws of the Urim and Thummim",
  "Burn the red heifer outside the city limits",
  "Observe the laws of the kohen's service garments at all times",
  "Do not eat tevel — untithed produce — before separating",
  "Appoint a Kohen Gadol to serve in the Temple",
  "Do not shave the head of the metzora during quarantine",
  "Do not eat neta revai fruit outside Jerusalem",
  "Observe the court's obligation to pay four categories of damages",
  "Do not ignore a fellow's burden — help unload it",
  "Do not cause pain to any living creature (tza'ar ba'alei chayyim)",
  "Do not eat the Passover offering while leavened bread is in the home",
  "Do not break a bone of the Passover offering (second opportunity)",
  "Observe the laws of a city besieged in war",
  "Do not destroy any object of the Temple unnecessarily",
  "Observe the laws of beauty products and grooming for purity",
  "Do not plant grain between the vines of a vineyard",
  "Keep sacred objects with reverence — do not treat them casually",
  "Do not remove the Levites' carrying poles during transport",
  "Observe the laws of pidyon haben — redeeming the firstborn",
  "Do not eat on Yom Kippur — fast for the full 25 hours",
];

export const MITZVAH_EXAMPLES: Record<string, string> = {
  "Destroy idolatry wherever found":
    "Today this mitzvah applies inwardly: identify the 'idols' competing for your ultimate loyalty — status, money, approval, screens, comfort — and actively dethrone them. The Rambam writes that the heart of this mitzvah is refusing to let anything other than God occupy the throne of your life. Practically: choose one habit or distraction that has taken on outsized importance and consciously subordinate it to a Torah value today. Study Devarim 12:2 on Sefaria to read the source in Hebrew and English side by side.",
  "Burn a city that adopted idol worship":
    "While the literal law applied only through a Sanhedrin in Temple times, the inner message is urgent today: communities have a responsibility to uproot practices and influences that lead people away from God. In your sphere — your family, shul, or school — speak up when something corrosive has taken hold. A single honest word can begin dismantling an 'idol' that has quietly captured a community.",
  "Destroy idols and all their accessories":
    "The Rambam counts this as a separate mitzvah from destroying idolatry generally — it targets the supporting infrastructure of foreign worship. Today: remove from your environment whatever enables your personal 'idols' (e.g. delete an addictive app, unsubscribe from a channel that pulls you toward materialism or cynicism). Devarim 12:3 is the source — open it on Sefaria to see the full context.",
  "Believe in God's existence":
    "Start the day by saying the Modeh Ani — gratitude is the first expression of belief. Take a moment to acknowledge the miracle of waking up.",
  "Love God with all your heart":
    "Notice one moment today when your heart is moved — by beauty, by kindness, by connection — and direct that feeling toward the Divine.",
  "Study Torah day and night":
    "Open a parsha, a page of Talmud, or a halacha for at least 15 minutes. Apps like Sefaria or Chabad.org make Torah accessible anywhere.",
  "Recite the Shema morning and evening":
    "Say the Shema when you wake and before sleep. These 25 words are among the most profound in Jewish tradition — slow down and mean them.",
  "Wear tefillin on the arm":
    "Put on tefillin today during morning prayers. The physical act of wrapping connects body and soul to the covenant.",
  "Wear tefillin on the head":
    "Lay tefillin on your head during Shacharit. The placement above the mind is a reminder: our thoughts must be directed toward God.",
  "Affix a mezuzah to every doorpost":
    "Check that your mezuzot are properly affixed and not damaged. Touching and kissing it when you pass reminds you that God is present in your home.",
  "Recite Birkat Hamazon after eating bread":
    "After your next bread meal, take three minutes to recite Birkat Hamazon. Gratitude after eating is as important as gratitude before.",
  "Honor the Shabbat through speech (Kiddush)":
    "Make Kiddush tonight or on Friday over wine or grape juice. Gather your family around the table — let the words sanctify the moment.",
  "Rest on the Shabbat":
    "Choose one thing to truly put down this Shabbat — your phone, your work, your worries. Let the day be genuinely restful.",
  "Sanctify the Shabbat through Kiddush":
    "Recite Kiddush on Friday night. If you don't have wine, grape juice works. Even alone, the words have power.",
  "Kindle Shabbat lights before sunset Friday":
    "Light candles 18 minutes before sunset on Friday. Cover your eyes, recite the bracha, and let this moment of light sanctify the transition.",
  "Fast and afflict yourself on Yom Kippur":
    "Use the fast of Yom Kippur not as mere hunger, but as a full clearing — no food, no drink, no distractions. Be present with yourself and God.",
  "Count the Omer — 49 days from Passover to Shavuot":
    "Count the Omer tonight after nightfall with the blessing. Reflect on one middah (character trait) to improve this week during this 49-day journey.",
  "Say Sefiras HaOmer each night":
    "Count the Omer after nightfall with the blessing. This 49-day journey from Pesach to Shavuot is a time for personal refinement.",
  "Give charity generously":
    "Set aside a small amount today in a tzedakah box. Giving consistently, in any amount, builds a habit of generosity that shapes character.",
  "Love your neighbor as yourself":
    "Before reacting to someone today, pause and ask: how would I want to be treated in their place? Let that answer guide your response.",
  "Love the convert":
    "The Torah commands this mitzvah 36 times — more than any other. Even if you never meet a convert, you fulfill it by: (1) Never letting a newcomer at synagogue stand alone — always introduce yourself. (2) Speaking up when someone makes dismissive comments about Jews-by-choice. (3) Studying the laws of welcoming converts (Rambam, Hilchot De'ot 6:3) so you are prepared. (4) Donating to organizations that support people converting. (5) Remembering daily that your own ancestors were 'strangers in Egypt' — the shared memory of outsider status is meant to build empathy for anyone finding their place.",
  "Honor your father and mother":
    "Call or text a parent today just to say you're thinking of them. Ask how they're doing and truly listen.",
  "Rebuke a sinner":
    "If someone you care about is making a harmful choice, find a gentle, private moment to share your concern — with love, not judgment.",
  "Return a lost object to its owner":
    "If you find something someone has misplaced — a wallet, keys, or phone — take the extra step to return it rather than walking past.",
  "Help unload a collapsed animal":
    "In the spirit of this mitzvah: if you see someone struggling — a heavy load, a flat tire, a difficult task — stop and help.",
  "Pay the hired laborer on time":
    "If you have employees or contractors, ensure they are paid promptly and fully. Express genuine appreciation for their work.",
  "Lend money to the poor":
    "If someone you know is in financial need, offer to help directly rather than waiting to be asked. Dignity in giving matters.",
  "Bury the dead":
    "Honor the dignity of the deceased. If you know someone who has recently lost a loved one, ask how you can help with arrangements or simply be present.",
  "Honor the elderly and the wise":
    "When you encounter an elderly or learned person, offer your seat, stand when they enter the room, and listen attentively to their words.",
  "Blow the shofar on Rosh Hashanah":
    "On Rosh Hashanah, listen to every required blast of the shofar attentively. Each sound is meant to awaken the soul.",
  "Dwell in the sukkah during Sukkot":
    "Eat your meals in the sukkah during Sukkot. Spend time there — not just eating but sitting, talking, being present.",
  "Take the four species on Sukkot":
    "Hold the lulav and etrog with intention. The four species represent different types of people — we are all held together.",
  "Tell the Exodus story on Passover night (Seder)":
    "At the Seder, don't just read the Haggadah — discuss it. Ask questions. Make the Exodus feel personal and present.",
  "Eat matzah on the first night of Passover":
    "Eat a k'zayit of matzah at the Seder with kavanah (intention). You are fulfilling the same mitzvah Jews have observed for millennia.",
  "Do not steal":
    "Be scrupulously honest in all financial dealings today — no shortcuts, no cutting corners, no taking what isn't yours.",
  "Do not murder":
    "In the spirit of this mitzvah: protect life actively. Check in on someone who may be struggling.",
  "Do not bear false witness against your neighbor":
    "Before repeating information about anyone, ask: do I know this to be true? Are my words fair to the person who isn't present?",
  "Do not covet your neighbor's wife":
    "Practice gratitude for what you have. Coveting begins in the mind — redirect envious thoughts toward appreciation.",
  "Do not covet your neighbor's house":
    "When you notice envy rising, stop and name one thing about your own life that is genuinely good. Gratitude is the antidote to coveting.",
  "Do not hate your brother in your heart":
    "If something someone did is bothering you, address it directly and gently rather than letting silent resentment build.",
  "Do not take revenge or bear a grudge against your people":
    "Choose one person you've been holding resentment toward and take a mental step toward releasing it. Letting go is a gift to yourself.",
  "Do not oppress the stranger among you":
    "Be especially patient and welcoming toward anyone new or unfamiliar today — in your community, your workplace, or on the street.",
  "Do not add to the Torah's commandments":
    "Trust the wisdom of the tradition as it is. Innovation has its place, but reverence for established practice keeps us rooted.",
  "Do not subtract from the Torah's commandments":
    "Observe the mitzvot in their fullness, even the difficult or inconvenient ones. Each one has depth worth discovering.",
  "Do not swear falsely":
    "Let your word be your bond. If you said you'd do something, do it — without needing an oath to enforce it.",
  "Do not take God's name in vain":
    "Be mindful of how you speak about and invoke the Divine. When you say God's name, mean it.",
  "Do not spread false reports or slander":
    "Before repeating anything negative about someone, ask: is it true, is it necessary, is it kind? All three must be yes.",
  "Do not stand idly by your fellow's blood":
    "If someone near you is in danger — physical, emotional, or otherwise — don't look away. Act, call for help, or speak up.",

  // Convert-related mitzvot — practical daily fulfillment
  "Do not oppress the convert verbally":
    "Even without meeting a convert, this mitzvah is alive daily. Its core principle: never make anyone feel like an outsider because of their background. Today — (1) Stop yourself before any comment that implies someone 'isn't really Jewish.' (2) If you hear such a comment from others, gently push back. (3) Learn what makes language hurtful to people on the margins. (4) In any community setting, introduce yourself to someone new before they have to introduce themselves. Deuteronomy 10:19 reminds us: 'You were strangers in Egypt' — the experience of exclusion is meant to make us protectors of the included.",

  "Do not wrong the convert in business":
    "You don't need to meet a convert to live this. The principle is: never give someone worse treatment because of where they came from. Today — (1) Check your own assumptions about who deserves fair treatment. (2) If you're in a leadership role, ensure your hiring, pricing, or service decisions don't disadvantage outsiders. (3) Read the halachic sources on ona'at ger (oppressing the stranger) — the prohibition appears 36 times in the Torah, which the Sages say is because converts are especially vulnerable to mistreatment.",

  "Do not harm a convert with words":
    "The most common way to violate this is by saying things like 'your mother wasn't Jewish' or implying a Jew-by-choice is less authentic. Even if you never meet one, build the right habits now: (1) When discussing Jewish identity, be careful never to rank 'types' of Jews. (2) Speak up when you hear convert-shaming, even casually. (3) Study the halachic status of a ger tzedek — after conversion they are a full Jew in every sense. (4) If you lead any Jewish learning, make it clear that everyone's path to Torah is honored.",

  "Love the stranger who dwells among you":
    "Deuteronomy 10:18–19 says God 'loves the stranger, giving him food and clothing' — and commands us to do the same. Today: (1) Check whether your synagogue or community actively welcomes visitors or makes them feel invisible. (2) If you notice someone sitting alone at services, go sit near them. (3) Support a local organization that serves immigrants, refugees, or the homeless — all are 'strangers.' (4) Practice the daily intention of noticing people on the margins before you notice people at the center.",

  "Treat the convert with love":
    "Rambam writes that a convert must be treated with extra kindness precisely because they chose this path with no family obligation behind them. Without a convert in your life, you can still: (1) Learn the laws of ger tzedek (Hilchot Issurei Biah ch. 14) so you're prepared to treat them right. (2) Donate to organizations like the Jewish Conversion Support Network. (3) Make your home an explicitly welcoming space — anyone who is newly Jewish should feel at home at your Shabbat table. (4) Reflect on your own 'stranger' experiences and let them soften you toward others.",

  "Do not cause pain to any living creature (tza'ar ba'alei chayyim)":
    "The Torah's concern for animals is real and detailed. Today: (1) Be mindful of how your consumer choices affect animal welfare — buy humanely raised products when possible. (2) If you see an animal in distress, don't walk past. (3) Feed an animal before feeding yourself (Berachot 40a). (4) Thank God for the complexity of living creatures — recite a bracha when you see an unusual animal for the first time.",
};

// Structured Torah source data — Parsha, Book, Chapter, Verse
export interface MitzvahSource {
  parsha: string;
  book: string;
  chapter: number;
  verse: number;
}

export const MITZVAH_SOURCES: Record<string, MitzvahSource> = {
  // Genesis (Bereishit)
  "Do not eat a limb torn from a living animal (ever min hachai)": { parsha: "Noach", book: "Genesis", chapter: 9, verse: 4 },
  "Circumcise all males on the eighth day": { parsha: "Lech Lecha", book: "Genesis", chapter: 17, verse: 12 },
  "Do not eat the sinew of the thigh vein (gid hanasheh)": { parsha: "Vayishlach", book: "Genesis", chapter: 32, verse: 33 },

  // Exodus — Bo
  "Sanctify the new month (Rosh Chodesh)": { parsha: "Bo", book: "Exodus", chapter: 12, verse: 2 },
  "Eat matzah on the first night of Passover": { parsha: "Bo", book: "Exodus", chapter: 12, verse: 18 },
  "Remove all chametz before Passover": { parsha: "Bo", book: "Exodus", chapter: 12, verse: 15 },
  "Do not eat chametz on Passover": { parsha: "Bo", book: "Exodus", chapter: 12, verse: 20 },
  "Tell the Exodus story on Passover night (Seder)": { parsha: "Bo", book: "Exodus", chapter: 13, verse: 8 },
  "Do not have chametz in your possession on Passover at all": { parsha: "Bo", book: "Exodus", chapter: 13, verse: 7 },
  "Wear tefillin on the arm": { parsha: "Bo", book: "Exodus", chapter: 13, verse: 9 },
  "Wear tefillin on the head": { parsha: "Bo", book: "Exodus", chapter: 13, verse: 16 },
  "Sanctify the firstborn son": { parsha: "Bo", book: "Exodus", chapter: 13, verse: 2 },

  // Exodus — Yitro (Ten Commandments)
  "Believe in God's existence": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 2 },
  "Do not believe in any god besides God": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 3 },
  "Do not make an idol for yourself": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 4 },
  "Do not take God's name in vain": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 7 },
  "Honor the Shabbat through speech (Kiddush)": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 8 },
  "Sanctify the Shabbat through Kiddush": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 8 },
  "Rest on the Shabbat": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 10 },
  "Do not work on the Shabbat": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 10 },
  "Honor your father and mother": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 12 },
  "Do not murder": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 13 },
  "Do not commit adultery": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 13 },
  "Do not steal": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 13 },
  "Do not bear false witness against your neighbor": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 13 },
  "Do not covet your neighbor's house": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 14 },
  "Do not covet your neighbor's wife": { parsha: "Yitro", book: "Exodus", chapter: 20, verse: 14 },

  // Exodus — Mishpatim
  "Help unload a collapsed animal": { parsha: "Mishpatim", book: "Exodus", chapter: 23, verse: 5 },
  "Do not follow the majority to do evil": { parsha: "Mishpatim", book: "Exodus", chapter: 23, verse: 2 },
  "Do not oppress the stranger among you": { parsha: "Mishpatim", book: "Exodus", chapter: 22, verse: 20 },
  "Do not oppress the convert verbally": { parsha: "Mishpatim", book: "Exodus", chapter: 22, verse: 20 },
  "Do not wrong the convert in business": { parsha: "Mishpatim", book: "Exodus", chapter: 22, verse: 20 },
  "Do not afflict the widow and orphan": { parsha: "Mishpatim", book: "Exodus", chapter: 22, verse: 21 },
  "Do not wrong the widow and orphan": { parsha: "Mishpatim", book: "Exodus", chapter: 22, verse: 21 },
  "Do not accept bribes": { parsha: "Mishpatim", book: "Exodus", chapter: 23, verse: 8 },

  // Exodus — Terumah
  "Build the Holy Temple": { parsha: "Terumah", book: "Exodus", chapter: 25, verse: 8 },
  "Separate terumah (portion for the Kohen)": { parsha: "Terumah", book: "Exodus", chapter: 25, verse: 2 },
  "Revere the Holy Temple": { parsha: "Terumah", book: "Exodus", chapter: 25, verse: 8 },
  "Guard the Temple": { parsha: "Terumah", book: "Exodus", chapter: 25, verse: 8 },

  // Exodus — Tetzaveh
  "Light the Menorah in the Temple daily": { parsha: "Tetzaveh", book: "Exodus", chapter: 27, verse: 20 },
  "The Kohen Gadol shall wear his special garments in service": { parsha: "Tetzaveh", book: "Exodus", chapter: 28, verse: 4 },
  "The Kohen shall wear his special garments during service": { parsha: "Tetzaveh", book: "Exodus", chapter: 28, verse: 40 },
  "Burn incense on the golden altar twice daily": { parsha: "Tetzaveh", book: "Exodus", chapter: 30, verse: 7 },

  // Exodus — Ki Tisa
  "The Kohen shall wash hands and feet before service": { parsha: "Ki Tisa", book: "Exodus", chapter: 30, verse: 19 },
  "Consecrate the Kohen Gadol by anointing with oil": { parsha: "Ki Tisa", book: "Exodus", chapter: 30, verse: 30 },
  "Do not replicate the anointing oil": { parsha: "Ki Tisa", book: "Exodus", chapter: 30, verse: 32 },
  "Do not use the anointing oil for non-sacred purposes": { parsha: "Ki Tisa", book: "Exodus", chapter: 30, verse: 32 },
  "Do not replicate the Temple incense compound": { parsha: "Ki Tisa", book: "Exodus", chapter: 30, verse: 37 },
  "Do not use the sacred incense for personal pleasure": { parsha: "Ki Tisa", book: "Exodus", chapter: 30, verse: 37 },

  // Exodus — Vayakhel
  "Kindle Shabbat lights before sunset Friday": { parsha: "Vayakhel", book: "Exodus", chapter: 35, verse: 3 },

  // Leviticus — Vayikra
  "Do not swear unnecessarily": { parsha: "Vayikra", book: "Leviticus", chapter: 5, verse: 4 },

  // Leviticus — Tzav
  "Keep the altar fire burning perpetually": { parsha: "Tzav", book: "Leviticus", chapter: 6, verse: 6 },
  "Remove the ashes from the altar daily": { parsha: "Tzav", book: "Leviticus", chapter: 6, verse: 3 },
  "The Kohen Gadol shall bring a daily meal offering": { parsha: "Tzav", book: "Leviticus", chapter: 6, verse: 13 },
  "Sanctify the Kohen through anointing": { parsha: "Tzav", book: "Leviticus", chapter: 8, verse: 12 },
  "Bring a peace offering (shelamim)": { parsha: "Tzav", book: "Leviticus", chapter: 7, verse: 11 },

  // Leviticus — Shemini
  "Examine the signs of a kosher animal": { parsha: "Shemini", book: "Leviticus", chapter: 11, verse: 2 },
  "Examine the signs of a kosher fish": { parsha: "Shemini", book: "Leviticus", chapter: 11, verse: 9 },
  "Examine the signs of a kosher bird": { parsha: "Shemini", book: "Leviticus", chapter: 11, verse: 13 },
  "Examine the signs of a kosher locust": { parsha: "Shemini", book: "Leviticus", chapter: 11, verse: 21 },
  "The Kohanim shall serve in the Temple": { parsha: "Shemini", book: "Leviticus", chapter: 9, verse: 7 },

  // Leviticus — Tazria
  "Observe the laws of a woman after childbirth": { parsha: "Tazria", book: "Leviticus", chapter: 12, verse: 2 },
  "Observe the laws of tzaraat (leprosy)": { parsha: "Tazria", book: "Leviticus", chapter: 13, verse: 2 },
  "The Kohen shall examine tzaraat": { parsha: "Tazria", book: "Leviticus", chapter: 13, verse: 3 },
  "Observe the laws of tzaraat on garments": { parsha: "Tazria", book: "Leviticus", chapter: 13, verse: 47 },
  "Observe the laws of tzaraat on the skin": { parsha: "Tazria", book: "Leviticus", chapter: 13, verse: 2 },
  "The metzora shall observe the isolation procedures": { parsha: "Tazria", book: "Leviticus", chapter: 13, verse: 46 },

  // Leviticus — Metzora
  "The metzora shall shave during purification": { parsha: "Metzora", book: "Leviticus", chapter: 14, verse: 9 },
  "The Kohen shall declare the metzora pure": { parsha: "Metzora", book: "Leviticus", chapter: 14, verse: 11 },
  "The metzora shall bring offerings after purification": { parsha: "Metzora", book: "Leviticus", chapter: 14, verse: 12 },
  "Observe the laws of house tzaraat": { parsha: "Metzora", book: "Leviticus", chapter: 14, verse: 34 },
  "The Kohen shall examine house tzaraat": { parsha: "Metzora", book: "Leviticus", chapter: 14, verse: 38 },
  "The metzora shall undergo complete bodily shaving": { parsha: "Metzora", book: "Leviticus", chapter: 14, verse: 9 },
  "Observe the laws of a male with a discharge (zav)": { parsha: "Metzora", book: "Leviticus", chapter: 15, verse: 2 },
  "Observe the laws of zav impurity and purification": { parsha: "Metzora", book: "Leviticus", chapter: 15, verse: 13 },

  // Leviticus — Acharei Mot
  "The Kohen Gadol shall perform the Yom Kippur service": { parsha: "Acharei Mot", book: "Leviticus", chapter: 16, verse: 2 },
  "Do not eat blood": { parsha: "Acharei Mot", book: "Leviticus", chapter: 17, verse: 14 },

  // Leviticus — Kedoshim
  "Love your neighbor as yourself": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 18 },
  "Treat the convert with love": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 34 },
  "Honor the elderly and the wise": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 32 },
  "Rebuke a sinner": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 17 },
  "Do not hate your brother in your heart": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 17 },
  "Do not embarrass anyone publicly": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 17 },
  "Do not take revenge": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 18 },
  "Do not bear a grudge": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 18 },
  "Do not take revenge or bear a grudge against your people": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 18 },
  "Do not spread false reports or slander": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 16 },
  "Do not stand idly by your fellow's blood": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 16 },
  "Do not pervert justice": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 15 },
  "Do not favor the poor in judgment": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 15 },
  "Do not favor the rich in judgment": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 15 },
  "Do not swear falsely": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 12 },
  "Do not tattoo yourself": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 28 },
  "Do not cut your skin in mourning": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 28 },
  "Do not round the corners of your head": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 27 },
  "Do not shave the corners of your beard": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 27 },
  "Do not crossbreed different species of animals": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 19 },
  "Do not plant different species in a vineyard (kil'ayim)": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 19 },
  "Do not wear mixed wool and linen (shatnez)": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 19 },
  "Do not harm a convert with words": { parsha: "Kedoshim", book: "Leviticus", chapter: 19, verse: 33 },

  // Leviticus — Emor
  "Sanctify God's name publicly": { parsha: "Emor", book: "Leviticus", chapter: 22, verse: 32 },
  "Count the Omer — 49 days from Passover to Shavuot": { parsha: "Emor", book: "Leviticus", chapter: 23, verse: 15 },
  "Say Sefiras HaOmer each night": { parsha: "Emor", book: "Leviticus", chapter: 23, verse: 15 },
  "Fast and afflict yourself on Yom Kippur": { parsha: "Emor", book: "Leviticus", chapter: 23, verse: 27 },
  "Dwell in the sukkah during Sukkot": { parsha: "Emor", book: "Leviticus", chapter: 23, verse: 42 },
  "Take the four species on Sukkot": { parsha: "Emor", book: "Leviticus", chapter: 23, verse: 40 },
  "Do not work on the first day of Passover": { parsha: "Emor", book: "Leviticus", chapter: 23, verse: 8 },
  "Do not work on Shavuot": { parsha: "Emor", book: "Leviticus", chapter: 23, verse: 21 },
  "Do not work on Rosh Hashanah": { parsha: "Emor", book: "Leviticus", chapter: 23, verse: 25 },
  "Do not work on Yom Kippur": { parsha: "Emor", book: "Leviticus", chapter: 23, verse: 31 },
  "Do not work on the first day of Sukkot": { parsha: "Emor", book: "Leviticus", chapter: 23, verse: 35 },
  "Do not work on Shemini Atzeret": { parsha: "Emor", book: "Leviticus", chapter: 23, verse: 36 },

  // Leviticus — Behar
  "Observe the sabbatical year (sh'mittah)": { parsha: "Behar", book: "Leviticus", chapter: 25, verse: 4 },
  "Do not charge interest to a Jew": { parsha: "Behar", book: "Leviticus", chapter: 25, verse: 37 },
  "Observe the jubilee year (yovel)": { parsha: "Behar", book: "Leviticus", chapter: 25, verse: 10 },
  "Return land to its original owner in yovel": { parsha: "Behar", book: "Leviticus", chapter: 25, verse: 28 },
  "Return the Hebrew slave to freedom in yovel": { parsha: "Behar", book: "Leviticus", chapter: 25, verse: 41 },
  "Rest the land during the sh'mittah year": { parsha: "Behar", book: "Leviticus", chapter: 25, verse: 4 },
  "Leave sh'mittah produce for all to eat": { parsha: "Behar", book: "Leviticus", chapter: 25, verse: 6 },

  // Leviticus — Bechukotai
  "Tithe cattle and sheep each year": { parsha: "Bechukotai", book: "Leviticus", chapter: 27, verse: 32 },
  "Observe the laws of redemption of consecrated items": { parsha: "Bechukotai", book: "Leviticus", chapter: 27, verse: 15 },
  "Observe the laws of the dedicated (cherem) field": { parsha: "Bechukotai", book: "Leviticus", chapter: 27, verse: 21 },
  "Observe the laws of a sanctified animal (kodshim)": { parsha: "Bechukotai", book: "Leviticus", chapter: 27, verse: 9 },
  "Observe the laws of a substituted animal": { parsha: "Bechukotai", book: "Leviticus", chapter: 27, verse: 10 },

  // Numbers — Bamidbar
  "Observe the counting of the Levites": { parsha: "Bamidbar", book: "Numbers", chapter: 1, verse: 49 },
  "The Levites shall carry the Ark on their shoulders": { parsha: "Bamidbar", book: "Numbers", chapter: 4, verse: 15 },
  "The Levites shall serve in the Temple": { parsha: "Bamidbar", book: "Numbers", chapter: 1, verse: 50 },

  // Numbers — Nasso
  "The Kohanim shall bless the people (duchening)": { parsha: "Nasso", book: "Numbers", chapter: 6, verse: 23 },
  "Observe all laws of the nazirite vow": { parsha: "Nasso", book: "Numbers", chapter: 6, verse: 2 },
  "A nazirite shall shave his head when his term ends": { parsha: "Nasso", book: "Numbers", chapter: 6, verse: 18 },
  "The Kohen Gadol and nazirite shall not become impure": { parsha: "Nasso", book: "Numbers", chapter: 6, verse: 6 },
  "Observe the laws of the suspected adulteress (sotah)": { parsha: "Nasso", book: "Numbers", chapter: 5, verse: 12 },
  "The court shall follow the sotah procedure": { parsha: "Nasso", book: "Numbers", chapter: 5, verse: 15 },

  // Numbers — Beha'alotcha
  "Bring the second Passover offering if you missed the first": { parsha: "Beha'alotcha", book: "Numbers", chapter: 9, verse: 11 },

  // Numbers — Shelach
  "Wear tzitzit": { parsha: "Shelach", book: "Numbers", chapter: 15, verse: 38 },

  // Numbers — Korach
  "Levites shall not perform the Kohanim's service": { parsha: "Korach", book: "Numbers", chapter: 18, verse: 3 },
  "Separate the first tithe for the Levite": { parsha: "Korach", book: "Numbers", chapter: 18, verse: 24 },
  "The Levite shall separate a tithe from his tithe": { parsha: "Korach", book: "Numbers", chapter: 18, verse: 28 },

  // Numbers — Chukat
  "Observe the red heifer (parah adumah) purification process": { parsha: "Chukat", book: "Numbers", chapter: 19, verse: 2 },
  "Purify those with corpse impurity through the red heifer": { parsha: "Chukat", book: "Numbers", chapter: 19, verse: 9 },
  "Burn the red heifer outside the city limits": { parsha: "Chukat", book: "Numbers", chapter: 19, verse: 3 },
  "Observe the laws of corpse impurity": { parsha: "Chukat", book: "Numbers", chapter: 19, verse: 14 },

  // Numbers — Pinchas
  "Blow the shofar on Rosh Hashanah": { parsha: "Pinchas", book: "Numbers", chapter: 29, verse: 1 },

  // Numbers — Matot
  "Keep your oaths and vows": { parsha: "Matot", book: "Numbers", chapter: 30, verse: 3 },
  "Observe the laws of vows (nedarim)": { parsha: "Matot", book: "Numbers", chapter: 30, verse: 2 },
  "The husband may annul his wife's vows": { parsha: "Matot", book: "Numbers", chapter: 30, verse: 9 },
  "Observe the laws of oaths": { parsha: "Matot", book: "Numbers", chapter: 30, verse: 3 },

  // Numbers — Masei
  "Establish six cities of refuge": { parsha: "Masei", book: "Numbers", chapter: 35, verse: 11 },
  "The court shall exile an accidental killer to a city of refuge": { parsha: "Masei", book: "Numbers", chapter: 35, verse: 25 },
  "Give the Levites cities to dwell in": { parsha: "Masei", book: "Numbers", chapter: 35, verse: 2 },
  "Exile an accidental killer to a city of refuge": { parsha: "Masei", book: "Numbers", chapter: 35, verse: 12 },

  // Deuteronomy — Re'eh
  "Destroy idolatry wherever found": { parsha: "Re'eh", book: "Deuteronomy", chapter: 12, verse: 2 },
  "Burn a city that adopted idol worship": { parsha: "Re'eh", book: "Deuteronomy", chapter: 13, verse: 17 },
  "Destroy idols and all their accessories": { parsha: "Re'eh", book: "Deuteronomy", chapter: 12, verse: 3 },

  // Deuteronomy — Vaetchanan
  "Accept God's complete unity": { parsha: "Vaetchanan", book: "Deuteronomy", chapter: 6, verse: 4 },
  "Recite the Shema morning and evening": { parsha: "Vaetchanan", book: "Deuteronomy", chapter: 6, verse: 4 },
  "Love God with all your heart": { parsha: "Vaetchanan", book: "Deuteronomy", chapter: 6, verse: 5 },
  "Study Torah day and night": { parsha: "Vaetchanan", book: "Deuteronomy", chapter: 6, verse: 7 },
  "Teach Torah to others": { parsha: "Vaetchanan", book: "Deuteronomy", chapter: 6, verse: 7 },
  "Affix a mezuzah to every doorpost": { parsha: "Vaetchanan", book: "Deuteronomy", chapter: 6, verse: 9 },

  // Deuteronomy — Eikev
  "Fear and revere God": { parsha: "Eikev", book: "Deuteronomy", chapter: 10, verse: 20 },
  "Love the convert": { parsha: "Eikev", book: "Deuteronomy", chapter: 10, verse: 19 },
  "Love the stranger who dwells among you": { parsha: "Eikev", book: "Deuteronomy", chapter: 10, verse: 19 },
  "Recite Birkat Hamazon after eating bread": { parsha: "Eikev", book: "Deuteronomy", chapter: 8, verse: 10 },

  // Deuteronomy — Re'eh
  "Give charity generously": { parsha: "Re'eh", book: "Deuteronomy", chapter: 15, verse: 8 },
  "Lend money to the poor": { parsha: "Re'eh", book: "Deuteronomy", chapter: 15, verse: 8 },
  "Remember the Exodus from Egypt daily": { parsha: "Re'eh", book: "Deuteronomy", chapter: 16, verse: 3 },
  "Do not add to the Torah's commandments": { parsha: "Re'eh", book: "Deuteronomy", chapter: 13, verse: 1 },
  "Do not subtract from the Torah's commandments": { parsha: "Re'eh", book: "Deuteronomy", chapter: 13, verse: 1 },
  "Do not erase God's name": { parsha: "Re'eh", book: "Deuteronomy", chapter: 12, verse: 4 },

  // Deuteronomy — Shoftim
  "Do not move a boundary marker": { parsha: "Shoftim", book: "Deuteronomy", chapter: 19, verse: 14 },
  "Do not return to Egypt to live permanently": { parsha: "Shoftim", book: "Deuteronomy", chapter: 17, verse: 16 },
  "Do not destroy fruit trees during a siege": { parsha: "Shoftim", book: "Deuteronomy", chapter: 20, verse: 19 },

  // Deuteronomy — Ki Tetzei
  "Pay the hired laborer on time": { parsha: "Ki Tetzei", book: "Deuteronomy", chapter: 24, verse: 15 },
  "Return a lost object to its owner": { parsha: "Ki Tetzei", book: "Deuteronomy", chapter: 22, verse: 1 },
  "Bury the dead": { parsha: "Ki Tetzei", book: "Deuteronomy", chapter: 21, verse: 23 },
  "Do not delay fulfilling a vow to God": { parsha: "Ki Tetzei", book: "Deuteronomy", chapter: 23, verse: 22 },

  // Deuteronomy — Ki Tavo
  "Bring the first fruits (bikkurim) to the Temple": { parsha: "Ki Tavo", book: "Deuteronomy", chapter: 26, verse: 2 },
  "Recite the declaration when bringing first fruits": { parsha: "Ki Tavo", book: "Deuteronomy", chapter: 26, verse: 3 },
  "Recite the tithe declaration and confession": { parsha: "Ki Tavo", book: "Deuteronomy", chapter: 26, verse: 13 },

  // Deuteronomy — Vayelech
  "Every person shall write a Torah scroll": { parsha: "Vayelech", book: "Deuteronomy", chapter: 31, verse: 19 },
  "Read the Torah publicly in the Hakhel gathering": { parsha: "Vayelech", book: "Deuteronomy", chapter: 31, verse: 12 },

  // Psalms (Hallel)
  "Recite Hallel on designated festival days": { parsha: "Tehillim / Hallel", book: "Psalms", chapter: 113, verse: 1 },
};

export function getMitzvahSource(mitzvah: string): MitzvahSource | null {
  return MITZVAH_SOURCES[mitzvah] ?? null;
}

// ── Applicability ─────────────────────────────────────────────────────────────
// Returns true if this mitzvah is practically actionable for an ordinary Jew today.
// Returns false for Temple-era, Kohanim-service, Sanhedrin, king-specific, or
// other mitzvot that require conditions no longer present.

const NON_APPLICABLE_PATTERNS: RegExp[] = [
  /\bTemple\b/i,
  /\baltar\b/i,
  /\bsacrifice\b/i,
  /\boffering\b/i,
  /\bincense\b/i,
  /showbread/i,
  /ashes from the/i,
  /\btamid\b/i,
  /\bnazirite\b/i,
  /\bSanhedrin\b/i,
  /\bking shall\b/i,
  /\bcourt shall\b/i,
  /blood redeemer/i,
  /Kohen Gadol/i,
  /Levites shall serve/i,
  /Menorah in the/i,
  /\bYovel\b/i,
  /\bJubilee\b/i,
  /hang.*body/i,
  /execute the/i,
  /exile.*killer/i,
  /cities of refuge/i,
  /hang a blasphemer/i,
  /bury an executed/i,
  /Kohanim shall serve in the/i,
  /Kohen shall wash hands.*before service/i,
  /Levites.*carrying poles/i,
  /slaughter.*firstborn/i,
  /bring.*sin offering/i,
  /bring.*guilt offering/i,
  /bring.*peace offering/i,
  /bring.*meal offering/i,
  /bring.*burnt offering/i,
  /bring.*sliding.scale/i,
  /shall bring an offering/i,
  /firstborn.*Kohein.*Meat/i,
  /\bshechitah\b/i,
  /\bshechit\b/i,
  /covering the blood/i,
  /mother bird/i,
];

// Mitzvot that match patterns above but ARE actionable today
const APPLICABLE_OVERRIDE = new Set<string>([
  "Revere the Holy Temple",          // applies to shul as mikdash me'at
  "The Kohanim shall bless the people (duchening)",
  "Honor Kohanim",
  "Observe the laws of the dedication of a house",
  "Observe the laws of pidyon haben — redeeming the firstborn",
  "Covering the Blood after Shechitah",
  "Sending Away the Mother Bird — Shiluach HaKen",
]);

export function isApplicableToday(mitzvah: string): boolean {
  if (APPLICABLE_OVERRIDE.has(mitzvah)) return true;
  return !NON_APPLICABLE_PATTERNS.some((p) => p.test(mitzvah));
}

export function getSefariaUrl(mitzvah: string): string {
  const s = MITZVAH_SOURCES[mitzvah];
  if (!s) {
    // Strip common filler words so the search hits the actual concept
    const clean = mitzvah
      .replace(/^(Do not |Not to |To |The |Observe |Follow |Keep )/i, "")
      .trim();
    return `https://www.sefaria.org/search?q=${encodeURIComponent(clean)}&tab=text`;
  }
  // Sefaria canonical ref: "Leviticus.5.1" → displays bilingual by default
  return `https://www.sefaria.org/${encodeURIComponent(s.book)}.${s.chapter}.${s.verse}?lang=bi`;
}

export function formatVerseRef(s: MitzvahSource): string {
  const abbrev: Record<string, string> = {
    Genesis: "Gen", Exodus: "Ex", Leviticus: "Lev", Numbers: "Num",
    Deuteronomy: "Deut", Psalms: "Ps",
  };
  const short = abbrev[s.book] ?? s.book;
  return `${short} ${s.chapter}:${s.verse}`;
}

// Completed mitzvahs hook — persisted in localStorage
const COMPLETED_KEY = "mitzvah-wheel-completed";

export function useCompletedMitzvahs() {
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(COMPLETED_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const toggleCompleted = (mitzvah: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(mitzvah)) {
        next.delete(mitzvah);
      } else {
        next.add(mitzvah);
      }
      localStorage.setItem(COMPLETED_KEY, JSON.stringify([...next]));
      return next;
    });
  };

  const clearCompleted = () => {
    setCompleted(new Set());
    localStorage.removeItem(COMPLETED_KEY);
  };

  return { completed, toggleCompleted, clearCompleted };
}

const STORAGE_KEY = "mitzvah-wheel-list";
const STORAGE_VERSION_KEY = "mitzvah-wheel-version";
const CURRENT_VERSION = "5";

export function useMitzvahs() {
  const [mitzvahs, setMitzvahs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && storedVersion === CURRENT_VERSION) {
      try {
        setMitzvahs(JSON.parse(stored));
      } catch (e) {
        setMitzvahs(DEFAULT_MITZVAHS);
      }
    } else {
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
      setMitzvahs(DEFAULT_MITZVAHS);
    }
    setIsLoaded(true);
  }, []);

  const save = (newList: string[]) => {
    setMitzvahs(newList);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
  };

  const addMitzvah = (mitzvah: string) => {
    if (!mitzvah.trim()) return;
    save([...mitzvahs, mitzvah.trim()]);
  };

  const removeMitzvah = (index: number) => {
    const newList = [...mitzvahs];
    newList.splice(index, 1);
    if (newList.length === 0) newList.push("Do a good deed");
    save(newList);
  };

  const resetToDefaults = () => {
    save(DEFAULT_MITZVAHS);
  };

  return { mitzvahs, isLoaded, addMitzvah, removeMitzvah, resetToDefaults };
}
